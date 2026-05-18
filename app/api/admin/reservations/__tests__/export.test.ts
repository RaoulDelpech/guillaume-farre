/**
 * Tests unitaires - /api/admin/reservations/export.csv
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
  const mod = await import('../export.csv/route');
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
    createdAt: '2026-04-01T10:00:00Z',
    expiresAt: '2026-04-08T10:00:00Z',
    status: 'paid',
    paymentMode: 'integral',
    orderNumber: 'GF-001',
    paidAt: '2026-04-02T10:00:00Z',
    ...overrides,
  };
}

describe('GET /api/admin/reservations/export.csv', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReadReservations.mockResolvedValue([]);
    mockReadToiles.mockResolvedValue([]);
  });

  it('401 without cookie', async () => {
    mockCookiesGet.mockReturnValue(undefined);
    const GET = await importRoute();
    const res = await GET(new Request('http://x/api/admin/reservations/export.csv') as any);
    expect(res.status).toBe(401);
  });

  it('200 with CSV headers and BOM', async () => {
    mockCookiesGet.mockReturnValue(validAdminCookie());
    mockReadReservations.mockResolvedValue([buildReservation()]);
    mockReadToiles.mockResolvedValue([{ id: 1, name: 'T1', price: 5000 }]);
    const GET = await importRoute();
    const res = await GET(new Request('http://x/api/admin/reservations/export.csv') as any);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('text/csv');
    expect(res.headers.get('Content-Disposition')).toContain('attachment');
    expect(res.headers.get('Content-Disposition')).toContain('.csv');
    const buffer = await res.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    expect(bytes[0]).toBe(0xef);
    expect(bytes[1]).toBe(0xbb);
    expect(bytes[2]).toBe(0xbf);
    const body = new TextDecoder('utf-8').decode(buffer);
    expect(body).toContain('id,createdAt,status');
    expect(body).toContain('res-1');
    expect(body).toContain('5000');
    expect(body).toContain('GF-001');
  });

  it('applies filters (status)', async () => {
    mockCookiesGet.mockReturnValue(validAdminCookie());
    mockReadReservations.mockResolvedValue([
      buildReservation({ id: 'a', status: 'pending' }),
      buildReservation({ id: 'b', status: 'paid' }),
    ]);
    mockReadToiles.mockResolvedValue([{ id: 1, name: 'T1', price: 5000 }]);
    const GET = await importRoute();
    const res = await GET(
      new Request('http://x/api/admin/reservations/export.csv?status=paid') as any,
    );
    const body = await res.text();
    expect(body).toContain('b');
    expect(body).not.toMatch(/\na,/);
  });

  it('filename has date stamp YYYY-MM-DD', async () => {
    mockCookiesGet.mockReturnValue(validAdminCookie());
    const GET = await importRoute();
    const res = await GET(new Request('http://x/api/admin/reservations/export.csv') as any);
    const disposition = res.headers.get('Content-Disposition') || '';
    expect(disposition).toMatch(/reservations-vip-\d{4}-\d{2}-\d{2}\.csv/);
  });
});
