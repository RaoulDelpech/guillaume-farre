/**
 * Types et constantes pour la page admin VIP detail reservation.
 *
 * @author Lalou
 */

export interface ReservationAddress {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Reservation {
  id: string;
  canvasId: number | string;
  canvasTitle: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  address: ReservationAddress;
  buyerType: "particulier" | "professionnel";
  siret?: string;
  companyName?: string;
  message?: string;
  createdAt: string;
  expiresAt: string;
  status: string;
  signedAt?: string;
  signatureIp?: string;
  signatureUserAgent?: string;
  signatureFullName?: string;
  contractHash?: string;
  contractPath?: string;
  paymentMode?: "integral" | "deposit_balance" | "invoice_email";
  depositAmount?: number;
  depositPaidAt?: string;
  balanceDueAt?: string;
  stripeDepositSessionId?: string;
  stripeBalanceSessionId?: string;
  stripeBalancePaymentIntentId?: string;
  stripeInvoiceId?: string;
  stripeInvoiceUrl?: string;
  stripeCustomerId?: string;
  paidAt?: string;
  orderNumber?: string;
  refundedAt?: string;
  cancelledAt?: string;
  balanceLinkLastRegeneratedAt?: string;
}

export interface Toile {
  id: number | string;
  name: string;
  price: number;
  dimensions?: string;
  technique?: string;
  year?: number;
  status?: string;
}

export const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  signed: "Signée",
  partial_paid: "Acompte versé",
  paid: "Payée",
  expired: "Expirée",
  cancelled: "Annulée",
  refunded: "Remboursée",
  confirmed: "Confirmée",
  declined: "Refusée",
  invoiced: "Facturée",
};

export const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  signed: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  partial_paid: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  paid: "bg-green-500/20 text-green-300 border-green-500/30",
  expired: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
  refunded: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

export const MODE_LABELS: Record<string, string> = {
  integral: "Paiement intégral",
  deposit_balance: "Acompte 30% + solde 70%",
  invoice_email: "Facture par email",
};

export const TERMINAL_STATUSES = new Set([
  "cancelled",
  "refunded",
  "expired",
  "paid",
  "declined",
]);

export function formatDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function formatEur(amount: number | undefined): string {
  if (typeof amount !== "number") return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Lalou
