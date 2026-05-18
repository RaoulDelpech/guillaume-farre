"use client";

import { Section, KV } from "./Section";
import { MODE_LABELS, Reservation, formatDate, formatEur } from "./types";

/**
 * Sections paiement + references Stripe.
 *
 * - Section "Paiement" : mode, acompte, paidAt, balanceDueAt, orderNumber, regenerated.
 * - Section "Références Stripe" : customer, deposit/balance sessions, PaymentIntent, invoice.
 *
 * Chaque section ne s'affiche que si les donnees correspondantes existent.
 *
 * @author Lalou
 */
export function DetailPaymentSection({ reservation }: { reservation: Reservation }) {
  const hasStripeRefs =
    reservation.stripeCustomerId ||
    reservation.stripeDepositSessionId ||
    reservation.stripeBalanceSessionId ||
    reservation.stripeBalancePaymentIntentId ||
    reservation.stripeInvoiceId;

  return (
    <>
      {reservation.paymentMode && (
        <Section title="Paiement">
          <KV
            k="Mode"
            v={MODE_LABELS[reservation.paymentMode] || reservation.paymentMode}
          />
          {typeof reservation.depositAmount === "number" && (
            <KV k="Acompte versé" v={formatEur(reservation.depositAmount)} />
          )}
          {reservation.depositPaidAt && (
            <KV k="Acompte payé le" v={formatDate(reservation.depositPaidAt)} />
          )}
          {reservation.balanceDueAt && (
            <KV k="Échéance solde" v={formatDate(reservation.balanceDueAt)} />
          )}
          {reservation.paidAt && <KV k="Payée le" v={formatDate(reservation.paidAt)} />}
          {reservation.orderNumber && (
            <KV k="N° commande" v={reservation.orderNumber} />
          )}
          {reservation.balanceLinkLastRegeneratedAt && (
            <KV
              k="Lien balance régénéré le"
              v={formatDate(reservation.balanceLinkLastRegeneratedAt)}
            />
          )}
        </Section>
      )}

      {hasStripeRefs && (
        <Section title="Références Stripe">
          {reservation.stripeCustomerId && (
            <KV k="Customer ID" v={reservation.stripeCustomerId} mono />
          )}
          {reservation.stripeDepositSessionId && (
            <KV k="Deposit session" v={reservation.stripeDepositSessionId} mono />
          )}
          {reservation.stripeBalanceSessionId && (
            <KV k="Balance session" v={reservation.stripeBalanceSessionId} mono />
          )}
          {reservation.stripeBalancePaymentIntentId && (
            <KV
              k="Balance payment intent"
              v={reservation.stripeBalancePaymentIntentId}
              mono
            />
          )}
          {reservation.stripeInvoiceId && (
            <KV k="Invoice ID" v={reservation.stripeInvoiceId} mono />
          )}
        </Section>
      )}
    </>
  );
}

// Lalou
