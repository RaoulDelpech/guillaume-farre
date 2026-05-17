/**
 * Helper centralise pour le libelle "Mode de paiement convenu" affiche
 * dans le contrat de vente (PDF + preview UI).
 *
 * Sprint 4 : seul `integral` (CB via Stripe) est actif. Sprint 5+ ajoutera
 * `deposit_balance` et `invoice_email` une fois les flows correspondants
 * implementes. Le fallback `undefined` ne doit JAMAIS contenir l'ancien
 * placebo "A definir (CB integral / acompte + solde / facture par email)"
 * — c'etait factuellement faux pour Sprint 4.
 *
 * @author Lalou
 */

export type PaymentMode = 'integral' | 'deposit_balance' | 'invoice_email';

export function getPaymentMethodLabel(paymentMode?: PaymentMode | null): string {
  switch (paymentMode) {
    case 'integral':
      return 'Carte bancaire integral via Stripe';
    case 'deposit_balance':
      return 'Acompte 30% + solde a la livraison';
    case 'invoice_email':
      return 'Facture envoyee par email';
    default:
      return "A convenir avec l'artiste";
  }
}

// Lalou
