/**
 * Tests unitaires - lib/admin/reservations-helpers
 *
 * Couvre :
 * - filterReservations : statuts, modes, canvasId, search multi-champs
 * - sortReservationsByCreatedDesc
 * - computeReservationStats : agregats CA + buckets
 * - reservationsToCsv : header, escape (virgule, guillemet, newline), prix lookup
 * - parseFiltersFromSearchParams
 *
 * @author Lalou
 */

import { describe, it, expect } from 'vitest';
import {
  filterReservations,
  sortReservationsByCreatedDesc,
  computeReservationStats,
  reservationsToCsv,
  parseFiltersFromSearchParams,
} from '../reservations-helpers';
import type { Reservation } from '@/lib/reservations-store';

function buildReservation(overrides: Partial<Reservation> = {}): Reservation {
  return {
    id: 'res-1',
    canvasId: 7,
    canvasTitle: 'Toile 7',
    firstName: 'Jean',
    lastName: 'Dupont',
    name: 'Jean Dupont',
    email: 'jean@example.com',
    phone: '+33611111111',
    address: {
      line1: '1 rue X',
      city: 'Paris',
      postalCode: '75001',
      country: 'FR',
    },
    buyerType: 'particulier',
    createdAt: '2026-04-01T10:00:00.000Z',
    expiresAt: '2026-04-08T10:00:00.000Z',
    status: 'pending',
    ...overrides,
  };
}

describe('filterReservations', () => {
  const list = [
    buildReservation({ id: 'a', status: 'pending', paymentMode: 'integral', canvasId: 1, email: 'a@x.com' }),
    buildReservation({ id: 'b', status: 'paid', paymentMode: 'deposit_balance', canvasId: 2, email: 'b@x.com', orderNumber: 'GF-001' }),
    buildReservation({ id: 'c', status: 'partial_paid', paymentMode: 'deposit_balance', canvasId: 1, email: 'c@x.com' }),
    buildReservation({ id: 'd', status: 'cancelled', paymentMode: 'invoice_email', canvasId: 3, name: 'Alice Smith' }),
  ];

  it('returns all when no filters', () => {
    expect(filterReservations(list, {})).toHaveLength(4);
  });

  it('filters by statuses (multi)', () => {
    const filtered = filterReservations(list, { statuses: ['pending', 'paid'] });
    expect(filtered.map((r) => r.id)).toEqual(['a', 'b']);
  });

  it('filters by paymentModes', () => {
    const filtered = filterReservations(list, { paymentModes: ['deposit_balance'] });
    expect(filtered.map((r) => r.id).sort()).toEqual(['b', 'c']);
  });

  it('filters by canvasId (string or number both match)', () => {
    expect(filterReservations(list, { canvasId: 1 }).map((r) => r.id).sort()).toEqual(['a', 'c']);
    expect(filterReservations(list, { canvasId: '2' }).map((r) => r.id)).toEqual(['b']);
  });

  it('search matches email substring case-insensitive', () => {
    expect(filterReservations(list, { search: 'A@X' })).toHaveLength(1);
  });

  it('search matches name, orderNumber, id', () => {
    expect(filterReservations(list, { search: 'GF-001' })).toHaveLength(1);
    expect(filterReservations(list, { search: 'alice' })).toHaveLength(1);
    expect(filterReservations(list, { search: 'b' }).map((r) => r.id)).toContain('b');
  });

  it('combines filters in AND', () => {
    const filtered = filterReservations(list, {
      statuses: ['paid', 'partial_paid'],
      paymentModes: ['deposit_balance'],
      canvasId: 1,
    });
    expect(filtered.map((r) => r.id)).toEqual(['c']);
  });

  it('empty arrays act as no filter for that key', () => {
    expect(filterReservations(list, { statuses: [], paymentModes: [] })).toHaveLength(4);
  });
});

describe('sortReservationsByCreatedDesc', () => {
  it('sorts most recent first, original array untouched', () => {
    const list = [
      buildReservation({ id: 'old', createdAt: '2026-01-01T00:00:00Z' }),
      buildReservation({ id: 'new', createdAt: '2026-04-01T00:00:00Z' }),
      buildReservation({ id: 'mid', createdAt: '2026-02-01T00:00:00Z' }),
    ];
    const sorted = sortReservationsByCreatedDesc(list);
    expect(sorted.map((r) => r.id)).toEqual(['new', 'mid', 'old']);
    expect(list.map((r) => r.id)).toEqual(['old', 'new', 'mid']);
  });

  it('handles malformed createdAt as 0', () => {
    const list = [
      buildReservation({ id: 'bad', createdAt: 'not-a-date' }),
      buildReservation({ id: 'ok', createdAt: '2026-04-01T00:00:00Z' }),
    ];
    const sorted = sortReservationsByCreatedDesc(list);
    expect(sorted[0].id).toBe('ok');
  });
});

describe('computeReservationStats', () => {
  const priceMap = new Map<string, number>([
    ['1', 5000],
    ['2', 10000],
    ['3', 7500],
  ]);

  it('counts buckets correctly', () => {
    const list = [
      buildReservation({ status: 'pending', canvasId: 1 }),
      buildReservation({ status: 'signed', canvasId: 2 }),
      buildReservation({ status: 'partial_paid', canvasId: 1, depositAmount: 1500 }),
      buildReservation({ status: 'partial_paid', canvasId: 2, depositAmount: 3000 }),
      buildReservation({ status: 'paid', canvasId: 1 }),
      buildReservation({ status: 'expired', canvasId: 3 }),
      buildReservation({ status: 'cancelled', canvasId: 3 }),
      buildReservation({ status: 'refunded', canvasId: 2 }),
    ];
    const stats = computeReservationStats(list, priceMap);
    expect(stats.total).toBe(8);
    expect(stats.pending).toBe(1);
    expect(stats.signed).toBe(1);
    expect(stats.partialPaid).toBe(2);
    expect(stats.paid).toBe(1);
    expect(stats.closed).toBe(3);
    expect(stats.caEnCours).toBe(4500);
    expect(stats.caTotalPaid).toBe(5000);
  });

  it('ignore missing prices in caTotalPaid', () => {
    const list = [
      buildReservation({ status: 'paid', canvasId: 999 }),
    ];
    const stats = computeReservationStats(list, priceMap);
    expect(stats.caTotalPaid).toBe(0);
  });

  it('handles empty list', () => {
    const stats = computeReservationStats([], priceMap);
    expect(stats.total).toBe(0);
    expect(stats.caEnCours).toBe(0);
    expect(stats.caTotalPaid).toBe(0);
  });
});

describe('reservationsToCsv', () => {
  const priceMap = new Map<string, number>([['1', 5000]]);

  it('renders header on first line', () => {
    const csv = reservationsToCsv([], priceMap);
    const firstLine = csv.split('\r\n')[0];
    expect(firstLine).toContain('id,createdAt,status');
    expect(firstLine).toContain('paymentMode');
    expect(firstLine).toContain('canvasTitle');
    expect(firstLine).toContain('orderNumber');
  });

  it('serializes a row with prix lookup', () => {
    const list = [
      buildReservation({
        id: 'res-42',
        canvasId: 1,
        canvasTitle: 'Toile X',
        status: 'paid',
        paymentMode: 'integral',
      }),
    ];
    const csv = reservationsToCsv(list, priceMap);
    const lines = csv.split('\r\n');
    expect(lines[1]).toContain('res-42');
    expect(lines[1]).toContain('5000');
    expect(lines[1]).toContain('paid');
  });

  it('escapes commas, quotes, newlines', () => {
    const list = [
      buildReservation({
        id: 'res-1',
        canvasTitle: 'Toile, avec virgule',
        firstName: 'Jean "le grand"',
        email: 'multi\nline@x.com',
      }),
    ];
    const csv = reservationsToCsv(list, priceMap);
    expect(csv).toContain('"Toile, avec virgule"');
    expect(csv).toContain('"Jean ""le grand"""');
    expect(csv).toContain('"multi\nline@x.com"');
  });

  it('ends each line with CRLF', () => {
    const csv = reservationsToCsv([buildReservation()], priceMap);
    expect(csv.endsWith('\r\n')).toBe(true);
  });

  it('empty values are empty strings (not "undefined")', () => {
    const list = [buildReservation({ orderNumber: undefined, depositAmount: undefined })];
    const csv = reservationsToCsv(list, priceMap);
    expect(csv).not.toContain('undefined');
  });
});

describe('parseFiltersFromSearchParams', () => {
  it('parses statuses CSV', () => {
    const params = new URLSearchParams('status=pending,paid');
    expect(parseFiltersFromSearchParams(params).statuses).toEqual(['pending', 'paid']);
  });

  it('parses modes CSV', () => {
    const params = new URLSearchParams('mode=integral,deposit_balance');
    expect(parseFiltersFromSearchParams(params).paymentModes).toEqual([
      'integral',
      'deposit_balance',
    ]);
  });

  it('parses canvasId + search', () => {
    const params = new URLSearchParams('canvasId=5&search=jean');
    const filters = parseFiltersFromSearchParams(params);
    expect(filters.canvasId).toBe('5');
    expect(filters.search).toBe('jean');
  });

  it('returns empty filters when no params', () => {
    expect(parseFiltersFromSearchParams(new URLSearchParams())).toEqual({});
  });
});
