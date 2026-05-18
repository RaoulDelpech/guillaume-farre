/**
 * Tests unitaires - /api/admin/reservations/[id]/regenerate-balance-link
 *
 * @author Lalou
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validAdminCookie } from '@/lib/__tests__/helpers/admin-test-cookie';

const mockCookiesGet = vi.fn();
const mockReadReservations = vi.fn();
const mockReadToiles = vi.fn();
const mockWriteReservations = vi.fn();
const mockSignToken = vi.fn();
const mockSendEmail = vi.fn();

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ get: mockCookiesGet })),
}));

vi.mock('@/lib/reservations-store', () => ({
  readReservations: mockReadReservations,
  readToiles: mockReadToiles,
  writeReservations: mockWriteReservations,
}));

vi.mock('@/lib/balance-token', () => ({
  signBalanceToken: mockSignToken,
}));

vi.mock('@/lib/resend/balance-link-reminder', () => ({
  sendBalanceLinkReminderEmail: mockSendEmail,
}));

async function importRoute() {
  const mod = await import('../[id]/regenerate-balance-link/route');
  return mod.POST;
}

function buildPartialPaid(overrides: any = {}) {
  return {
    id: 'res-1',
    canvasId: 1,
    canvasTitle: 'Toile 1',
    firstName: 'J',
    lastName: 'D',
    name: 'J D',
    email: 'buyer@x.com',
    phone: '+33',
    address: { line1: '1', city: 'P', postalCode: '75', country: 'FR' },
    buyerType: 'particulier',
    createdAt: '2026-04-01T10:00:00Z',
    expiresAt: '2026-04-08T10:00:00Z',
    status: 'partial_paid',
    depositAmount: 1500,
    balanceDueAt: '2026-04-20T10:00:00Z',
    ...overrides,
  };
}

describe('POST /api/admin/reservations/[id]/regenerate-balance-link', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignToken.mockReturnValue('mock-token-abc');
    mockSendEmail.mockResolvedValue({ success: true, messageId: 'msg-1' });
    mockWriteReservations.mockResolvedValue(undefined);
    mockReadToiles.mockResolvedValue([
      { id: 1, name: 'T1', price: 5000 },
    ]);
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
    mockCookiesGet.mockReturnValue(validAdminCookie());
    mockReadReservations.mockResolvedValue([]);
    const POST = await importRoute();
    const res = await POST(new Request('http://x') as any, {
      params: Promise.resolve({ id: 'missing' }),
    });
    expect(res.status).toBe(404);
  });

  it('409 when status not partial_paid', async () => {
    mockCookiesGet.mockReturnValue(validAdminCookie());
    mockReadReservations.mockResolvedValue([buildPartialPaid({ status: 'paid' })]);
    const POST = await importRoute();
    const res = await POST(new Request('http://x') as any, {
      params: Promise.resolve({ id: 'res-1' }),
    });
    expect(res.status).toBe(409);
  });

  it('422 when balanceDueAt missing', async () => {
    mockCookiesGet.mockReturnValue(validAdminCookie());
    const r = buildPartialPaid();
    delete r.balanceDueAt;
    mockReadReservations.mockResolvedValue([r]);
    const POST = await importRoute();
    const res = await POST(new Request('http://x') as any, {
      params: Promise.resolve({ id: 'res-1' }),
    });
    expect(res.status).toBe(422);
  });

  it('422 when depositAmount missing', async () => {
    mockCookiesGet.mockReturnValue(validAdminCookie());
    const r = buildPartialPaid();
    delete r.depositAmount;
    mockReadReservations.mockResolvedValue([r]);
    const POST = await importRoute();
    const res = await POST(new Request('http://x') as any, {
      params: Promise.resolve({ id: 'res-1' }),
    });
    expect(res.status).toBe(422);
  });

  it('signs token, sends email, stamps balanceLinkLastRegeneratedAt', async () => {
    mockCookiesGet.mockReturnValue(validAdminCookie());
    mockReadReservations.mockResolvedValue([buildPartialPaid()]);
    const POST = await importRoute();
    const res = await POST(new Request('http://x') as any, {
      params: Promise.resolve({ id: 'res-1' }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.balanceCheckoutUrl).toContain('mock-token-abc');
    expect(body.balanceCheckoutUrl).toContain('/fr/vip/reservation/res-1/balance');
    expect(body.emailSent).toBe(true);
    expect(body.reservation.balanceLinkLastRegeneratedAt).toBeDefined();
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'buyer@x.com',
        balanceAmount: 3500, // 5000 - 1500
        reservationId: 'res-1',
      }),
    );
  });

  it('returns success with emailSent=false when Resend fails (degraded mode)', async () => {
    mockCookiesGet.mockReturnValue(validAdminCookie());
    mockReadReservations.mockResolvedValue([buildPartialPaid()]);
    mockSendEmail.mockResolvedValue({ success: false, error: 'API key missing' });
    const POST = await importRoute();
    const res = await POST(new Request('http://x') as any, {
      params: Promise.resolve({ id: 'res-1' }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.emailSent).toBe(false);
    expect(body.emailError).toBe('API key missing');
    // mais le balanceCheckoutUrl est quand meme dispo pour copy/paste
    expect(body.balanceCheckoutUrl).toBeDefined();
  });

  it('422 when toile not found', async () => {
    mockCookiesGet.mockReturnValue(validAdminCookie());
    mockReadReservations.mockResolvedValue([buildPartialPaid({ canvasId: 999 })]);
    mockReadToiles.mockResolvedValue([{ id: 1, name: 'T1', price: 5000 }]);
    const POST = await importRoute();
    const res = await POST(new Request('http://x') as any, {
      params: Promise.resolve({ id: 'res-1' }),
    });
    expect(res.status).toBe(422);
  });
});
