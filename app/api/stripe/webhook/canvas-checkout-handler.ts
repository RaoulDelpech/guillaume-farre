/**
 * Handler webhook Stripe pour les paiements CB integral VIP (Sprint 4).
 *
 * Recoit un `checkout.session.completed` avec `metadata.type === 'vip-canvas-payment'`,
 * met a jour la reservation en `paid`, marque la toile en `paid`, cree une
 * commande, et envoie les emails de confirmation.
 *
 * Le handler invoice.paid (`canvas-handler.ts`) reste reserve au fallback
 * "facture par email" du Sprint 5.
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

export async function processCanvasCheckoutSession(session: Stripe.Checkout.Session): Promise<void> {
  const reservationId = session.metadata?.reservationId;
  if (!reservationId) {
    console.error('[canvas-checkout] missing reservationId in session metadata');
    return;
  }

  if (session.metadata?.type !== 'vip-canvas-payment') {
    console.error('[canvas-checkout] unexpected metadata.type:', session.metadata?.type);
    return;
  }

  const reservations = await readReservations();
  const index = reservations.findIndex((r) => r.id === reservationId);
  if (index === -1) {
    console.error(`[canvas-checkout] reservation ${reservationId} not found`);
    return;
  }

  const reservation = reservations[index];

  if (reservation.status === 'paid') {
    console.log(`[canvas-checkout] reservation ${reservationId} already paid, idempotent skip`);
    return;
  }

  const amountTotal = session.amount_total ?? 0;
  const amountInEuros = amountTotal / 100;

  const toiles = await readToiles();
  const toileIndex = toiles.findIndex((t) => t.name === reservation.canvasTitle);
  const toile = toileIndex >= 0 ? toiles[toileIndex] : undefined;

  const paidAt = new Date().toISOString();
  const updatedReservation: Reservation = {
    ...reservation,
    status: 'paid',
    paymentMode: 'integral',
    paidAt,
  };
  reservations[index] = updatedReservation;

  try {
    await writeReservations(reservations);
  } catch (error) {
    console.error('[canvas-checkout] cannot write reservations:', error);
    return;
  }

  if (toileIndex >= 0) {
    toiles[toileIndex] = { ...toiles[toileIndex], status: 'paid' };
    try {
      await writeToiles(toiles);
    } catch (error) {
      console.error('[canvas-checkout] cannot write toiles:', error);
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
          price: amountInEuros,
        },
      ],
      totalAmount: amountInEuros,
      status: 'paid',
      paidAt,
    });
    orderNumber = order.orderNumber;
    reservations[index] = { ...updatedReservation, orderNumber };
    await writeReservations(reservations);
  } catch (error) {
    console.error('[canvas-checkout] cannot create order:', error);
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
          price: amountInEuros,
        },
      ],
      totalAmount: amountInEuros,
      shippingAddress: {
        line1: SHIPPING_FALLBACK_LINE1,
        city: '',
        postalCode: '',
        country: 'FR',
      },
    });
  } catch (error) {
    console.error('[canvas-checkout] cannot send buyer confirmation email:', error);
  }

  try {
    await sendTestEmail(NOTIFICATION_EMAIL);
  } catch (error) {
    console.error('[canvas-checkout] cannot send Guillaume notification:', error);
  }
}
