/**
 * Tests unitaires - /api/admin/reservations (GET liste + filtres)
 *
 * Couvre :
 * - 401 sans cookie gf_admin (et cookie invalide)
 * - 200 + structure response { reservations, stats, toiles }
 * - Filtres status, mode, canvasId, search
 * - Tri descendant par createdAt
 *
 * @author Lalou
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validAdminCookie } from '@/lib/__tests__/helpers/admin-test-cookie';

const mockCookiesGet = vi.fn();
const mockReadReservations = vi.fn();
const mockReadToiles = vi.fn();

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ get: mockCookiesGet })),
}));

vi.mock('@/lib/reservations-store', () => ({
  readReservations: mockReadReservations,
  readToiles: mockReadToiles,
}));

async function importRoute() {
  const mod = await import('../route');
  return mod.GET;
}

function buildReservation(overrides: any = {}) {
  return {
    id: 'res-1',
    canvasId: 1,
    canvasTitle: 'Toile 1',
    firstName: 'Jean',
    lastName: 'Dupont',
    name: 'Jean Dupont',
    email: 'jean@x.com',
    phone: '+33611',
    address: { line1: '1', city: 'P', postalCode: '75', country: 'FR' },
    buyerType: 'particulier',
    createdAt: '2026-04-01T10:00:00.000Z',
    expiresAt: '2026-04-08T10:00:00.000Z',
    status: 'pending',
    ...overrides,
  };
}

describe('GET /api/admin/reservations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReadReservations.mockResolvedValue([]);
    mockReadToiles.mockResolvedValue([]);
  });

  describe('auth', () => {
    it('returns 401 without cookie', async () => {
      mockCookiesGet.mockReturnValue(undefined);
      const GET = await importRoute();
      const res = await GET(new Request('http://localhost/api/admin/reservations') as any);
      expect(res.status).toBe(401);
    });

    it('returns 401 with wrong cookie', async () => {
      mockCookiesGet.mockReturnValue({ value: 'nope' });
      const GET = await importRoute();
      const res = await GET(new Request('http://localhost/api/admin/reservations') as any);
      expect(res.status).toBe(401);
    });
  });

  describe('succes', () => {
    beforeEach(() => {
      mockCookiesGet.mockReturnValue(validAdminCookie());
    });

    it('returns 200 with empty data', async () => {
      const GET = await importRoute();
      const res = await GET(new Request('http://localhost/api/admin/reservations') as any);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.reservations).toEqual([]);
      expect(body.stats.total).toBe(0);
      expect(body.toiles).toEqual([]);
    });

    it('returns reservations sorted by createdAt desc', async () => {
      mockReadReservations.mockResolvedValue([
        buildReservation({ id: 'old', createdAt: '2026-01-01T00:00:00Z' }),
        buildReservation({ id: 'new', createdAt: '2026-04-01T00:00:00Z' }),
      ]);
      const GET = await importRoute();
      const res = await GET(new Request('http://localhost/api/admin/reservations') as any);
      const body = await res.json();
      expect(body.reservations.map((r: any) => r.id)).toEqual(['new', 'old']);
    });

    it('applies status filter', async () => {
      mockReadReservations.mockResolvedValue([
        buildReservation({ id: 'a', status: 'pending' }),
        buildReservation({ id: 'b', status: 'paid' }),
        buildReservation({ id: 'c', status: 'cancelled' }),
      ]);
      const GET = await importRoute();
      const res = await GET(
        new Request('http://localhost/api/admin/reservations?status=pending,paid') as any,
      );
      const body = await res.json();
      expect(body.reservations).toHaveLength(2);
    });

    it('applies search filter', async () => {
      mockReadReservations.mockResolvedValue([
        buildReservation({ id: 'a', email: 'jean@x.com' }),
        buildReservation({ id: 'b', email: 'marie@x.com' }),
      ]);
      const GET = await importRoute();
      const res = await GET(
        new Request('http://localhost/api/admin/reservations?search=marie') as any,
      );
      const body = await res.json();
      expect(body.reservations).toHaveLength(1);
      expect(body.reservations[0].id).toBe('b');
    });

    it('computes stats from full list, not filtered list', async () => {
      mockReadReservations.mockResolvedValue([
        buildReservation({ id: 'a', status: 'pending' }),
        buildReservation({ id: 'b', status: 'paid', canvasId: 1 }),
      ]);
      mockReadToiles.mockResolvedValue([{ id: 1, name: 'T1', price: 5000 }]);
      const GET = await importRoute();
      const res = await GET(
        new Request('http://localhost/api/admin/reservations?status=pending') as any,
      );
      const body = await res.json();
      expect(body.reservations).toHaveLength(1);
      expect(body.stats.total).toBe(2);
      expect(body.stats.caTotalPaid).toBe(5000);
    });

    it('returns toiles list with id/name/price only', async () => {
      mockReadToiles.mockResolvedValue([
        { id: 1, name: 'T1', price: 5000, dimensions: '100x100', technique: 'huile', year: 2024, status: 'available' },
      ]);
      const GET = await importRoute();
      const res = await GET(new Request('http://localhost/api/admin/reservations') as any);
      const body = await res.json();
      expect(body.toiles).toEqual([{ id: 1, name: 'T1', price: 5000 }]);
    });
  });

  describe('erreurs', () => {
    it('returns 500 if readReservations throws', async () => {
      mockCookiesGet.mockReturnValue(validAdminCookie());
      mockReadReservations.mockRejectedValue(new Error('boom'));
      const GET = await importRoute();
      const res = await GET(new Request('http://localhost/api/admin/reservations') as any);
      expect(res.status).toBe(500);
    });
  });
});
