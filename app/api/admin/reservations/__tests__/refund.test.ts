/**
 * Tests unitaires - /api/admin/reservations/[id]/refund
 *
 * @author Lalou
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCookiesGet = vi.fn();
const mockReadReservations = vi.fn();
const mockReadToiles = vi.fn();
const mockWriteReservations = vi.fn();
const mockWriteToiles = vi.fn();
const mockAcquireLock = vi.fn();
const mockRelease = vi.fn();

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ get: mockCookiesGet })),
}));

vi.mock('@/lib/reservations-store', () => ({
  readReservations: mockReadReservations,
  readToiles: mockReadToiles,
  writeReservations: mockWriteReservations,
  writeToiles: mockWriteToiles,
}));

vi.mock('@/lib/locks', () => ({
  acquireLock: mockAcquireLock,
}));

async function importRoute() {
  const mod = await import('../[id]/refund/route');
  return mod.POST;
}

function buildPaidReservation(overrides: any = {}) {
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
    status: 'paid',
    paidAt: '2026-04-05T10:00:00Z',
    ...overrides,
  };
}

describe('POST /api/admin/reservations/[id]/refund', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAcquireLock.mockResolvedValue({ release: mockRelease });
    mockRelease.mockResolvedValue(undefined);
    mockWriteReservations.mockResolvedValue(undefined);
    mockWriteToiles.mockResolvedValue(undefined);
  });

  it('401 without cookie', async () => {
    mockCookiesGet.mockReturnValue(undefined);
    const POST = await importRoute();
    const res = await POST(new Request('http://x') as any, {
      params: Promise.resolve({ id: 'res-1' }),
    });
    expect(res.status).toBe(401);
  });

  it('404 when not found', async () => {
    mockCookiesGet.mockReturnValue({ value: 'authenticated' });
    mockReadReservations.mockResolvedValue([]);
    const POST = await importRoute();
    const res = await POST(new Request('http://x') as any, {
      params: Promise.resolve({ id: 'missing' }),
    });
    expect(res.status).toBe(404);
  });

  it('409 when not paid (pending)', async () => {
    mockCookiesGet.mockReturnValue({ value: 'authenticated' });
    mockReadReservations.mockResolvedValue([buildPaidReservation({ status: 'pending' })]);
    const POST = await importRoute();
    const res = await POST(new Request('http://x') as any, {
      params: Promise.resolve({ id: 'res-1' }),
    });
    expect(res.status).toBe(409);
  });

  it('409 when partial_paid', async () => {
    mockCookiesGet.mockReturnValue({ value: 'authenticated' });
    mockReadReservations.mockResolvedValue([buildPaidReservation({ status: 'partial_paid' })]);
    const POST = await importRoute();
    const res = await POST(new Request('http://x') as any, {
      params: Promise.resolve({ id: 'res-1' }),
    });
    expect(res.status).toBe(409);
  });

  it('marks refunded + releases toile + stamps refundedAt', async () => {
    mockCookiesGet.mockReturnValue({ value: 'authenticated' });
    mockReadReservations.mockResolvedValue([buildPaidReservation({ canvasId: 7 })]);
    mockReadToiles.mockResolvedValue([
      { id: 7, name: 'T7', price: 5000, status: 'paid', reservationId: 'res-1' },
    ]);
    const POST = await importRoute();
    const res = await POST(new Request('http://x') as any, {
      params: Promise.resolve({ id: 'res-1' }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.reservation.status).toBe('refunded');
    expect(body.reservation.refundedAt).toBeDefined();

    const writtenToiles = mockWriteToiles.mock.calls[0][0];
    expect(writtenToiles[0].status).toBe('available');
    expect(writtenToiles[0].reservationId).toBe(null);
  });

  it('503 when lock cannot be acquired', async () => {
    mockCookiesGet.mockReturnValue({ value: 'authenticated' });
    mockReadReservations.mockResolvedValue([buildPaidReservation()]);
    mockAcquireLock.mockResolvedValue(null);
    const POST = await importRoute();
    const res = await POST(new Request('http://x') as any, {
      params: Promise.resolve({ id: 'res-1' }),
    });
    expect(res.status).toBe(503);
  });
});
