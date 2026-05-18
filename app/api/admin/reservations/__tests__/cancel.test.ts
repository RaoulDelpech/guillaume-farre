/**
 * Tests unitaires - /api/admin/reservations/[id]/cancel
 *
 * @author Lalou
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validAdminCookie } from '@/lib/__tests__/helpers/admin-test-cookie';

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
  const mod = await import('../[id]/cancel/route');
  return mod.POST;
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

describe('POST /api/admin/reservations/[id]/cancel', () => {
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

  it('404 when reservation not found', async () => {
    mockCookiesGet.mockReturnValue(validAdminCookie());
    mockReadReservations.mockResolvedValue([]);
    const POST = await importRoute();
    const res = await POST(new Request('http://x') as any, {
      params: Promise.resolve({ id: 'missing' }),
    });
    expect(res.status).toBe(404);
  });

  it('409 when reservation in terminal status', async () => {
    mockCookiesGet.mockReturnValue(validAdminCookie());
    mockReadReservations.mockResolvedValue([buildReservation({ status: 'paid' })]);
    const POST = await importRoute();
    const res = await POST(new Request('http://x') as any, {
      params: Promise.resolve({ id: 'res-1' }),
    });
    expect(res.status).toBe(409);
  });

  it('cancels reservation + releases toile + writes both files', async () => {
    mockCookiesGet.mockReturnValue(validAdminCookie());
    const reservation = buildReservation({ status: 'pending', canvasId: 7 });
    mockReadReservations.mockResolvedValue([reservation]);
    mockReadToiles.mockResolvedValue([
      { id: 7, name: 'T7', price: 5000, status: 'reserved_pending', reservationId: 'res-1' },
    ]);
    const POST = await importRoute();
    const res = await POST(new Request('http://x') as any, {
      params: Promise.resolve({ id: 'res-1' }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.reservation.status).toBe('cancelled');
    expect(body.reservation.cancelledAt).toBeDefined();

    expect(mockWriteReservations).toHaveBeenCalledOnce();
    const writtenRes = mockWriteReservations.mock.calls[0][0];
    expect(writtenRes[0].status).toBe('cancelled');

    expect(mockWriteToiles).toHaveBeenCalledOnce();
    const writtenToiles = mockWriteToiles.mock.calls[0][0];
    expect(writtenToiles[0].status).toBe('available');
    expect(writtenToiles[0].reservationId).toBe(null);
    expect(mockRelease).toHaveBeenCalled();
  });

  it('does not release toile if it points to another reservation', async () => {
    mockCookiesGet.mockReturnValue(validAdminCookie());
    mockReadReservations.mockResolvedValue([buildReservation({ status: 'pending', canvasId: 7 })]);
    mockReadToiles.mockResolvedValue([
      { id: 7, name: 'T7', price: 5000, status: 'reserved_pending', reservationId: 'OTHER-RES' },
    ]);
    const POST = await importRoute();
    const res = await POST(new Request('http://x') as any, {
      params: Promise.resolve({ id: 'res-1' }),
    });
    expect(res.status).toBe(200);
    const writtenToiles = mockWriteToiles.mock.calls[0][0];
    expect(writtenToiles[0].reservationId).toBe('OTHER-RES');
    expect(writtenToiles[0].status).toBe('reserved_pending');
  });

  it('503 when lock cannot be acquired', async () => {
    mockCookiesGet.mockReturnValue(validAdminCookie());
    mockReadReservations.mockResolvedValue([buildReservation({ status: 'pending' })]);
    mockAcquireLock.mockResolvedValue(null);
    const POST = await importRoute();
    const res = await POST(new Request('http://x') as any, {
      params: Promise.resolve({ id: 'res-1' }),
    });
    expect(res.status).toBe(503);
  });
});
