/**
 * Tests unitaires - /api/admin/reservations/[id] (GET detail)
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
  const mod = await import('../[id]/route');
  return mod.GET;
}

function buildReservation(overrides: any = {}) {
  return {
    id: 'res-1',
    canvasId: 1,
    canvasTitle: 'Toile 1',
    firstName: 'J',
    lastName: 'D',
    name: 'J D',
    email: 'j@x.com',
    phone: '+33',
    address: { line1: '1', city: 'P', postalCode: '75', country: 'FR' },
    buyerType: 'particulier',
    createdAt: '2026-04-01T10:00:00Z',
    expiresAt: '2026-04-08T10:00:00Z',
    status: 'pending',
    ...overrides,
  };
}

describe('GET /api/admin/reservations/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReadReservations.mockResolvedValue([]);
    mockReadToiles.mockResolvedValue([]);
  });

  it('401 without cookie', async () => {
    mockCookiesGet.mockReturnValue(undefined);
    const GET = await importRoute();
    const res = await GET(new Request('http://x/api/admin/reservations/res-1') as any, {
      params: Promise.resolve({ id: 'res-1' }),
    });
    expect(res.status).toBe(401);
  });

  it('404 when reservation not found', async () => {
    mockCookiesGet.mockReturnValue(validAdminCookie());
    const GET = await importRoute();
    const res = await GET(new Request('http://x/api/admin/reservations/missing') as any, {
      params: Promise.resolve({ id: 'missing' }),
    });
    expect(res.status).toBe(404);
  });

  it('200 with reservation + matched toile', async () => {
    mockCookiesGet.mockReturnValue(validAdminCookie());
    mockReadReservations.mockResolvedValue([buildReservation({ id: 'res-42', canvasId: 7 })]);
    mockReadToiles.mockResolvedValue([
      { id: 7, name: 'Toile 7', price: 5000, dimensions: '100x100', technique: 'huile', year: 2024 },
    ]);
    const GET = await importRoute();
    const res = await GET(new Request('http://x/api/admin/reservations/res-42') as any, {
      params: Promise.resolve({ id: 'res-42' }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.reservation.id).toBe('res-42');
    expect(body.toile.id).toBe(7);
  });

  it('200 with reservation + null toile if canvas missing', async () => {
    mockCookiesGet.mockReturnValue(validAdminCookie());
    mockReadReservations.mockResolvedValue([buildReservation({ id: 'res-x', canvasId: 999 })]);
    const GET = await importRoute();
    const res = await GET(new Request('http://x/api/admin/reservations/res-x') as any, {
      params: Promise.resolve({ id: 'res-x' }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.toile).toBe(null);
  });

  it('400 when id is empty', async () => {
    mockCookiesGet.mockReturnValue(validAdminCookie());
    const GET = await importRoute();
    const res = await GET(new Request('http://x/api/admin/reservations/') as any, {
      params: Promise.resolve({ id: '' }),
    });
    expect(res.status).toBe(400);
  });
});
