/**
 * Helpers admin reservations : filtres, stats, serialization CSV.
 *
 * Module pur (pas d'I/O ni de Next.js). Tous les helpers sont
 * idempotents et testables unitairement.
 *
 * @author Lalou
 */

import type { Reservation, ReservationStatus } from '@/lib/reservations-store';

export interface ReservationFilters {
  statuses?: ReservationStatus[];
  paymentModes?: Array<'integral' | 'deposit_balance' | 'invoice_email'>;
  canvasId?: string | number;
  search?: string;
}

export interface ReservationStats {
  total: number;
  pending: number;
  signed: number;
  partialPaid: number;
  paid: number;
  closed: number;
  caTotalPaid: number;
  caEnCours: number;
}

const NORMALIZED_SEARCH_FIELDS: Array<keyof Reservation> = [
  'id',
  'name',
  'firstName',
  'lastName',
  'email',
  'orderNumber',
  'canvasTitle',
];

function normalize(input: string | undefined): string {
  if (!input) return '';
  return input.toLowerCase().trim();
}

/**
 * Applique les filtres a une liste de reservations.
 *
 * Tous les filtres sont en AND. `search` matche substring (case-insensitive)
 * sur les champs : id, name, firstName, lastName, email, orderNumber, canvasTitle.
 */
export function filterReservations(
  reservations: Reservation[],
  filters: ReservationFilters,
): Reservation[] {
  const search = normalize(filters.search);
  const canvasIdStr = filters.canvasId !== undefined ? String(filters.canvasId) : undefined;

  return reservations.filter((r) => {
    if (filters.statuses && filters.statuses.length > 0) {
      if (!filters.statuses.includes(r.status)) return false;
    }
    if (filters.paymentModes && filters.paymentModes.length > 0) {
      if (!r.paymentMode || !filters.paymentModes.includes(r.paymentMode)) return false;
    }
    if (canvasIdStr !== undefined) {
      if (String(r.canvasId) !== canvasIdStr) return false;
    }
    if (search) {
      const haystack = NORMALIZED_SEARCH_FIELDS.map((k) => normalize(r[k] as string | undefined))
        .filter(Boolean)
        .join(' ');
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

/**
 * Tri descendant par createdAt (plus recent en premier).
 */
export function sortReservationsByCreatedDesc(reservations: Reservation[]): Reservation[] {
  return [...reservations].sort((a, b) => {
    const ta = Date.parse(a.createdAt) || 0;
    const tb = Date.parse(b.createdAt) || 0;
    return tb - ta;
  });
}

/**
 * Calcule les stats agregees pour le dashboard admin.
 *
 * - `caTotalPaid` : somme des prix integraux des reservations `paid`
 *   (depositAmount + balanceAmount si deposit_balance, sinon prix toile).
 *   Approche simple : on prend `toilePrice` (lookup externe) ou bien on derive
 *   du `depositAmount` * (100 / 30) pour deposit_balance. Pour eviter cette
 *   complexite ici, l'appelant fournit un mapping `priceByCanvasId`.
 * - `caEnCours` : somme des `depositAmount` des reservations `partial_paid`.
 * - `closed` : expired + cancelled + refunded.
 */
export function computeReservationStats(
  reservations: Reservation[],
  priceByCanvasId: Map<string, number>,
): ReservationStats {
  const stats: ReservationStats = {
    total: reservations.length,
    pending: 0,
    signed: 0,
    partialPaid: 0,
    paid: 0,
    closed: 0,
    caTotalPaid: 0,
    caEnCours: 0,
  };

  for (const r of reservations) {
    switch (r.status) {
      case 'pending':
        stats.pending += 1;
        break;
      case 'signed':
        stats.signed += 1;
        break;
      case 'partial_paid':
        stats.partialPaid += 1;
        if (typeof r.depositAmount === 'number') {
          stats.caEnCours += r.depositAmount;
        }
        break;
      case 'paid':
        stats.paid += 1;
        {
          const price = priceByCanvasId.get(String(r.canvasId));
          if (typeof price === 'number') {
            stats.caTotalPaid += price;
          }
        }
        break;
      case 'expired':
      case 'cancelled':
      case 'refunded':
        stats.closed += 1;
        break;
      default:
        break;
    }
  }

  return stats;
}

const CSV_HEADER = [
  'id',
  'createdAt',
  'status',
  'paymentMode',
  'firstName',
  'lastName',
  'email',
  'phone',
  'canvasId',
  'canvasTitle',
  'price',
  'depositAmount',
  'depositPaidAt',
  'balanceDueAt',
  'paidAt',
  'orderNumber',
  'stripePaymentIntentId',
  'signedAt',
] as const;

function escapeCsv(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '';
  const str = typeof value === 'string' ? value : String(value);
  if (str === '') return '';
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Serialize les reservations en CSV (RFC 4180-ish).
 *
 * - Header obligatoire en premiere ligne.
 * - Champs avec virgule, guillemet ou newline sont quotes (echappement "").
 * - Separateur : virgule. Encoding : UTF-8 (BOM optionnel pour Excel FR
 *   ajoute par la route — pas ici pour rester pur).
 */
export function reservationsToCsv(
  reservations: Reservation[],
  priceByCanvasId: Map<string, number>,
): string {
  const lines = [CSV_HEADER.join(',')];
  for (const r of reservations) {
    const price = priceByCanvasId.get(String(r.canvasId));
    const row = [
      escapeCsv(r.id),
      escapeCsv(r.createdAt),
      escapeCsv(r.status),
      escapeCsv(r.paymentMode),
      escapeCsv(r.firstName),
      escapeCsv(r.lastName),
      escapeCsv(r.email),
      escapeCsv(r.phone),
      escapeCsv(String(r.canvasId)),
      escapeCsv(r.canvasTitle),
      escapeCsv(price !== undefined ? price : ''),
      escapeCsv(r.depositAmount),
      escapeCsv(r.depositPaidAt),
      escapeCsv(r.balanceDueAt),
      escapeCsv(r.paidAt),
      escapeCsv(r.orderNumber),
      escapeCsv(r.stripeBalancePaymentIntentId),
      escapeCsv(r.signedAt),
    ];
    lines.push(row.join(','));
  }
  return lines.join('\r\n') + '\r\n';
}

/**
 * Parse les query params de la liste vers `ReservationFilters`.
 * URL search params utilisent `,` pour separer les valeurs multiples.
 */
export function parseFiltersFromSearchParams(
  params: URLSearchParams,
): ReservationFilters {
  const filters: ReservationFilters = {};

  const status = params.get('status');
  if (status) {
    filters.statuses = status
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean) as ReservationStatus[];
  }

  const mode = params.get('mode');
  if (mode) {
    filters.paymentModes = mode
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean) as Array<'integral' | 'deposit_balance' | 'invoice_email'>;
  }

  const canvasId = params.get('canvasId');
  if (canvasId) filters.canvasId = canvasId;

  const search = params.get('search');
  if (search) filters.search = search;

  return filters;
}
