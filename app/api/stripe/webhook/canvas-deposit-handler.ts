/**
 * Handler webhook Stripe pour le paiement de l'acompte 30% VIP (Sprint 5).
 *
 * Recoit un `checkout.session.completed` avec `metadata.type === 'vip-canvas-deposit'`.
 *
 * Actions :
 *  - Met la reservation en `partial_paid`
 *  - Renseigne depositPaidAt = now, balanceDueAt = J+14, expiresAt = balanceDueAt
 *  - stripeDepositSessionId = session.id
 *  - Met la toile en `partial_paid`
 *  - Envoie l'email "Acompte recu, solde 70% a regler" avec lien /balance
 *
 * Ne cree PAS d'Order : l'order est cree au moment du solde (paid final).
 *
 * Idempotent : si la reservation est deja en partial_paid avec le meme
 * sessionId, skip silencieux.
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
import {
  computeBalanceAmount,
  computeBalanceDueAt,
} from '@/lib/canvas-payment-helpers';
import { sendDepositConfirmedEmail } from '@/lib/resend/deposit-confirmed';

const NOTIFICATION_EMAIL = 'contact@guillaumefarre.com';

function inferSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  return envUrl || 'https://guillaumefarre.com';
}

export async function processCanvasDepositCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<void> {
  const reservationId = session.metadata?.reservationId;
  if (!reservationId) {
    console.error('[canvas-deposit] missing reservationId in session metadata');
    return;
  }

  if (session.metadata?.type !== 'vip-canvas-deposit') {
    console.error('[canvas-deposit] unexpected metadata.type:', session.metadata?.type);
    return;
  }

  const reservations = await readReservations();
  const index = reservations.findIndex((r) => r.id === reservationId);
  if (index === -1) {
    console.error(`[canvas-deposit] reservation ${reservationId} not found`);
    return;
  }

  const reservation = reservations[index];

  if (
    reservation.status === 'partial_paid' &&
    reservation.stripeDepositSessionId === session.id
  ) {
    console.log(
      `[canvas-deposit] reservation ${reservationId} already partial_paid (idempotent skip)`,
    );
    return;
  }

  if (reservation.status === 'paid') {
    console.log(`[canvas-deposit] reservation ${reservationId} already paid, idempotent skip`);
    return;
  }

  const depositPaidAt = new Date().toISOString();
  const balanceDueAt = computeBalanceDueAt(depositPaidAt);

  const depositAmountFromSession = session.amount_total
    ? session.amount_total / 100
    : reservation.depositAmount ?? 0;

  const depositAmount =
    typeof reservation.depositAmount === 'number'
      ? reservation.depositAmount
      : depositAmountFromSession;

  const toiles = await readToiles();
  const toileIndex = toiles.findIndex((t) => t.name === reservation.canvasTitle);
  const toile = toileIndex >= 0 ? toiles[toileIndex] : undefined;
  const totalPrice = toile?.price ?? depositAmount / 0.3;
  const balanceAmount = computeBalanceAmount(totalPrice, depositAmount);

  const updatedReservation: Reservation = {
    ...reservation,
    status: 'partial_paid',
    paymentMode: 'deposit_balance',
    depositAmount,
    depositPaidAt,
    balanceDueAt,
    expiresAt: balanceDueAt,
    stripeDepositSessionId: session.id,
  };
  reservations[index] = updatedReservation;

  try {
    await writeReservations(reservations);
  } catch (error) {
    console.error('[canvas-deposit] cannot write reservations:', error);
    return;
  }

  if (toileIndex >= 0) {
    toiles[toileIndex] = { ...toiles[toileIndex], status: 'partial_paid' };
    try {
      await writeToiles(toiles);
    } catch (error) {
      console.error('[canvas-deposit] cannot write toiles:', error);
    }
  }

  const siteUrl = inferSiteUrl();
  const balanceCheckoutUrl = `${siteUrl}/fr/vip/reservation/${reservation.id}/balance`;

  try {
    await sendDepositConfirmedEmail({
      to: reservation.email,
      buyerName: reservation.name,
      canvasTitle: reservation.canvasTitle,
      reservationId: reservation.id,
      depositAmount,
      balanceAmount,
      totalAmount: totalPrice,
      balanceDueAt,
      balanceCheckoutUrl,
    });
  } catch (error) {
    console.error('[canvas-deposit] cannot send buyer deposit confirmation:', error);
  }

  try {
    const { getResendClient, FROM_EMAIL } = await import('@/lib/resend/client');
    const client = getResendClient();
    if (client) {
      await client.emails.send({
        from: FROM_EMAIL,
        to: NOTIFICATION_EMAIL,
        subject: `Acompte 30% recu — ${reservation.canvasTitle}`,
        text: [
          `Acompte de ${depositAmount} EUR recu pour la toile « ${reservation.canvasTitle} ».`,
          `Acheteur : ${reservation.name} (${reservation.email}).`,
          `Reservation : ${reservation.id}.`,
          `Solde restant : ${balanceAmount} EUR.`,
          `Echeance solde : ${balanceDueAt}.`,
        ].join('\n'),
      });
    }
  } catch (error) {
    console.error('[canvas-deposit] cannot send Guillaume notification:', error);
  }
}

// Lalou
