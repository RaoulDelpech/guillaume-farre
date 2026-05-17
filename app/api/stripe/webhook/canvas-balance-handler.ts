/**
 * Handler webhook Stripe pour le paiement du solde 70% VIP (Sprint 5).
 *
 * Recoit un `checkout.session.completed` avec `metadata.type === 'vip-canvas-balance'`.
 *
 * Pre-requis : la reservation doit etre en `partial_paid` (acompte deja regle).
 *
 * Actions :
 *  - Reservation status -> `paid`, paidAt = now
 *  - stripeBalanceSessionId + stripeBalancePaymentIntentId
 *  - Toile -> `paid`
 *  - Cree l'Order final avec totalAmount = prix complet de la toile
 *  - Envoie email confirmation finale d'acquisition
 *
 * Idempotent : si reservation deja paid, skip silencieux.
 *
 * @author Lalou
 */
import Stripe from 'stripe';
import {
  readReservations,
  writeReservations,
  readToiles,
  writeToiles,
  type Reservation,
} from '@/lib/reservations-store';
import { createOrder } from '@/lib/orders';
import { sendOrderConfirmationEmail, sendTestEmail } from '@/lib/resend-client';

const SHIPPING_FALLBACK_LINE1 = "Toile retiree a l'atelier";
const NOTIFICATION_EMAIL = 'contact@guillaumefarre.com';

export async function processCanvasBalanceCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<void> {
  const reservationId = session.metadata?.reservationId;
  if (!reservationId) {
    console.error('[canvas-balance] missing reservationId in session metadata');
    return;
  }

  if (session.metadata?.type !== 'vip-canvas-balance') {
    console.error('[canvas-balance] unexpected metadata.type:', session.metadata?.type);
    return;
  }

  const reservations = await readReservations();
  const index = reservations.findIndex((r) => r.id === reservationId);
  if (index === -1) {
    console.error(`[canvas-balance] reservation ${reservationId} not found`);
    return;
  }

  const reservation = reservations[index];

  if (reservation.status === 'paid') {
    console.log(`[canvas-balance] reservation ${reservationId} already paid, idempotent skip`);
    return;
  }

  if (reservation.status !== 'partial_paid') {
    console.error(
      `[canvas-balance] reservation ${reservationId} not partial_paid (status=${reservation.status})`,
    );
    return;
  }

  const toiles = await readToiles();
  const toileIndex = toiles.findIndex((t) => t.name === reservation.canvasTitle);
  const toile = toileIndex >= 0 ? toiles[toileIndex] : undefined;
  const totalAmount = toile?.price ?? 0;

  const paidAt = new Date().toISOString();
  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id;

  const updatedReservation: Reservation = {
    ...reservation,
    status: 'paid',
    paidAt,
    stripeBalanceSessionId: session.id,
    stripeBalancePaymentIntentId: paymentIntentId,
  };
  reservations[index] = updatedReservation;

  try {
    await writeReservations(reservations);
  } catch (error) {
    console.error('[canvas-balance] cannot write reservations:', error);
    return;
  }

  if (toileIndex >= 0) {
    toiles[toileIndex] = { ...toiles[toileIndex], status: 'paid' };
    try {
      await writeToiles(toiles);
    } catch (error) {
      console.error('[canvas-balance] cannot write toiles:', error);
    }
  }

  let orderNumber: string | undefined;
  try {
    const order = await createOrder({
      stripeSessionId: session.id,
      customerEmail: reservation.email,
      customerName: reservation.name,
      type: 'canvas',
      items: [
        {
          title: reservation.canvasTitle,
          format: toile?.dimensions ?? 'N/A',
          frame: 'Toile originale',
          price: totalAmount,
        },
      ],
      totalAmount,
      status: 'paid',
      paidAt,
    });
    orderNumber = order.orderNumber;
    reservations[index] = { ...updatedReservation, orderNumber };
    await writeReservations(reservations);
  } catch (error) {
    console.error('[canvas-balance] cannot create order:', error);
  }

  try {
    await sendOrderConfirmationEmail({
      to: reservation.email,
      customerName: reservation.name,
      orderNumber: orderNumber ?? session.id,
      items: [
        {
          title: reservation.canvasTitle,
          format: toile?.dimensions ?? 'N/A',
          frame: 'Toile originale',
          price: totalAmount,
        },
      ],
      totalAmount,
      shippingAddress: {
        line1: SHIPPING_FALLBACK_LINE1,
        city: '',
        postalCode: '',
        country: 'FR',
      },
    });
  } catch (error) {
    console.error('[canvas-balance] cannot send buyer confirmation email:', error);
  }

  try {
    await sendTestEmail(NOTIFICATION_EMAIL);
  } catch (error) {
    console.error('[canvas-balance] cannot send Guillaume notification:', error);
  }
}

// Lalou
