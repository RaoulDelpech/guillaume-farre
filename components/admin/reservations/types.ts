/**
 * Types et constantes partages par les sous-composants admin VIP reservations.
 *
 * @author Lalou
 */

export interface Reservation {
  id: string;
  canvasId: number | string;
  canvasTitle: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  status: string;
  paymentMode?: string;
  depositAmount?: number;
  depositPaidAt?: string;
  balanceDueAt?: string;
  paidAt?: string;
  orderNumber?: string;
}

export interface Stats {
  total: number;
  pending: number;
  signed: number;
  partialPaid: number;
  paid: number;
  closed: number;
  caTotalPaid: number;
  caEnCours: number;
}

export interface ToileLite {
  id: number | string;
  name: string;
  price: number;
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
  confirmed: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  declined: "bg-red-500/20 text-red-300 border-red-500/30",
  invoiced: "bg-blue-500/20 text-blue-300 border-blue-500/30",
};

export const MODE_LABELS: Record<string, string> = {
  integral: "Intégral",
  deposit_balance: "Acompte + solde",
  invoice_email: "Facture email",
};

export const ALL_STATUSES = [
  "pending",
  "signed",
  "partial_paid",
  "paid",
  "expired",
  "cancelled",
  "refunded",
];

export const ALL_MODES = ["integral", "deposit_balance", "invoice_email"];

export const PAGE_SIZE = 20;

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
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
