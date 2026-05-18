/**
 * Tests d'integration - POST /api/stripe/checkout/canvas-balance (Sprint 5)
 *
 * @author Lalou
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const STRIPE_STUB_KEY = ['sk', 'test', 'stub'].join('_');
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || STRIPE_STUB_KEY;
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3343';

const VIP_SESSION_ID = '11111111-2222-3333-4444-555555555555';
const VIP_SESSION_OK = {
  level: 'secret' as const,
  sessionId: VIP_SESSION_ID,
  code: 'AAAAAAAA',
  expiresAt: Date.now() + 60_000,
};
const mockGetVipSession = vi.fn();
const mockReadReservations = vi.fn();
const mockReadToiles = vi.fn();
const mockSessionsCreate = vi.fn();

vi.mock('@/lib/access', () => ({
  getVipSession: mockGetVipSession,
}));

vi.mock('@/lib/reservations-store', async (orig) => {
  const actual = await (orig() as Promise<typeof import('@/lib/reservations-store')>);
  return {
    ...actual,
    readReservations: mockReadReservations,
    readToiles: mockReadToiles,
  };
});

vi.mock('stripe', () => ({
  default: class MockStripe {
    checkout = {
      sessions: {
        create: (...args: unknown[]) => mockSessionsCreate(...args),
      },
    };
  },
}));

function buildReq(body: unknown) {
  return {
    json: async () => body,
    headers: new Headers({
      'user-agent': 'TestRunner/1.0',
      'accept-language': 'fr-FR,fr;q=0.9',
    }),
  } as unknown as import('next/server').NextRequest;
}

const FUTURE_ISO = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
const PAST_ISO = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();

const SAMPLE_RESERVATION = {
  id: 'res-bal-001',
  canvasId: 1,
  canvasTitle: 'Klein',
  firstName: 'Jean',
  lastName: 'Dupont',
  name: 'Jean Dupont',
  email: 'jean@example.org',
  phone: '+33612345678',
  address: { line1: '1 rue X', city: 'Paris', postalCode: '75001', country: 'FR' },
  buyerType: 'particulier' as const,
  createdAt: '2026-05-16T10:00:00.000Z',
  expiresAt: FUTURE_ISO,
  status: 'partial_paid' as const,
  paymentMode: 'deposit_balance' as const,
  depositAmount: 6000,
  depositPaidAt: '2026-05-17T10:00:00.000Z',
  balanceDueAt: FUTURE_ISO,
  vipSessionId: VIP_SESSION_ID,
};

const SAMPLE_TOILE = {
  id: 1,
  name: 'Klein',
  dimensions: '100x130 cm',
  technique: 'Acrylique sur toile',
  year: 2026,
  price: 20000,
  status: 'partial_paid' as const,
};

async function importRoute() {
  const mod = await import('../route');
  return mod.POST;
}

beforeEach(() => {
  mockGetVipSession.mockReset();
  mockReadReservations.mockReset();
  mockReadToiles.mockReset();
  mockSessionsCreate.mockReset();
});

describe('POST /api/stripe/checkout/canvas-balance', () => {
  it('401 sans cookie VIP secret', async () => {
    mockGetVipSession.mockResolvedValue(null);
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: 'res-bal-001' }));
    expect(res.status).toBe(401);
  });

  it('404 reservation introuvable', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([]);
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: 'inconnu' }));
    expect(res.status).toBe(404);
  });

  it('400 si reservation pas en partial_paid', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([
      { ...SAMPLE_RESERVATION, status: 'signed' },
    ]);
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: SAMPLE_RESERVATION.id }));
    expect(res.status).toBe(400);
  });

  it('410 si balance expire', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([
      { ...SAMPLE_RESERVATION, balanceDueAt: PAST_ISO },
    ]);
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: SAMPLE_RESERVATION.id }));
    expect(res.status).toBe(410);
    const body = await res.json();
    expect(body.error).toBe('balance_expired');
  });

  it('404 toile introuvable', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    mockReadToiles.mockResolvedValue([]);
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: SAMPLE_RESERVATION.id }));
    expect(res.status).toBe(404);
  });

  it('200 + calcule balanceAmount correctement', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    mockReadToiles.mockResolvedValue([SAMPLE_TOILE]);
    mockSessionsCreate.mockResolvedValue({
      id: 'cs_bal_123',
      url: 'https://checkout.stripe.com/c/pay/cs_bal_123',
    });
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: SAMPLE_RESERVATION.id, locale: 'fr' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.balanceAmount).toBe(14000); // 20000 - 6000
    expect(body.sessionId).toBe('cs_bal_123');

    const callArgs = mockSessionsCreate.mock.calls[0][0];
    expect(callArgs.metadata.type).toBe('vip-canvas-balance');
    expect(callArgs.metadata.balanceAmountEur).toBe('14000');
    expect(callArgs.line_items[0].price_data.unit_amount).toBe(14000 * 100);
    expect(callArgs.success_url).toContain('step=balance');
  });

  it('502 si Stripe echoue', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    mockReadToiles.mockResolvedValue([SAMPLE_TOILE]);
    mockSessionsCreate.mockRejectedValue(new Error('Stripe down'));
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: SAMPLE_RESERVATION.id }));
    expect(res.status).toBe(502);
  });

  describe('Sprint 6 : auth par balanceToken HMAC (fallback sans cookie)', () => {
    it('200 si balanceToken valide pour la reservation (cookie absent)', async () => {
      mockGetVipSession.mockResolvedValue(null); // pas secret
      mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
      mockReadToiles.mockResolvedValue([SAMPLE_TOILE]);
      mockSessionsCreate.mockResolvedValue({
        id: 'cs_bal_token_ok',
        url: 'https://checkout.stripe.com/c/pay/cs_bal_token_ok',
      });

      const { signBalanceToken } = await import('@/lib/balance-token');
      const token = signBalanceToken({
        reservationId: SAMPLE_RESERVATION.id,
        exp: FUTURE_ISO,
      });

      const POST = await importRoute();
      const res = await POST(
        buildReq({ reservationId: SAMPLE_RESERVATION.id, balanceToken: token }),
      );
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
    });

    it('401 si balanceToken valide mais reservationId different', async () => {
      mockGetVipSession.mockResolvedValue(null);
      const { signBalanceToken } = await import('@/lib/balance-token');
      const tokenForOther = signBalanceToken({
        reservationId: 'res-AUTRE-XYZ',
        exp: FUTURE_ISO,
      });

      const POST = await importRoute();
      const res = await POST(
        buildReq({
          reservationId: SAMPLE_RESERVATION.id,
          balanceToken: tokenForOther,
        }),
      );
      expect(res.status).toBe(401);
    });

    it('401 si balanceToken expire', async () => {
      mockGetVipSession.mockResolvedValue(null);
      const { signBalanceToken } = await import('@/lib/balance-token');
      const expiredToken = signBalanceToken({
        reservationId: SAMPLE_RESERVATION.id,
        exp: PAST_ISO,
      });

      const POST = await importRoute();
      const res = await POST(
        buildReq({
          reservationId: SAMPLE_RESERVATION.id,
          balanceToken: expiredToken,
        }),
      );
      expect(res.status).toBe(401);
    });

    it('401 si balanceToken garbage', async () => {
      mockGetVipSession.mockResolvedValue(null);
      const POST = await importRoute();
      const res = await POST(
        buildReq({
          reservationId: SAMPLE_RESERVATION.id,
          balanceToken: 'completely.invalid',
        }),
      );
      expect(res.status).toBe(401);
    });

    it('cookie VIP secret prevaut meme si balanceToken absent', async () => {
      mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
      mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
      mockReadToiles.mockResolvedValue([SAMPLE_TOILE]);
      mockSessionsCreate.mockResolvedValue({
        id: 'cs_bal_cookie',
        url: 'https://checkout.stripe.com/c/pay/cs_bal_cookie',
      });
      const POST = await importRoute();
      const res = await POST(buildReq({ reservationId: SAMPLE_RESERVATION.id }));
      expect(res.status).toBe(200);
    });
  });
});
