/**
 * Tests d'integration - POST /api/stripe/checkout/canvas-deposit (Sprint 5)
 *
 * Couvre :
 *  - 401 sans cookie VIP secret
 *  - 400 reservation pas en status signed (sans paymentMode)
 *  - 400 body invalide
 *  - 404 reservation introuvable
 *  - 404 toile introuvable
 *  - 200 succes -> sessionUrl + depositAmount + balanceAmount, persistance
 *  - 200 idempotence si reservation deja en mode deposit_balance status signed
 *  - 400 si reservation deja partial_paid (interdit re-init deposit)
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
const mockWriteReservations = vi.fn();
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
    writeReservations: mockWriteReservations,
  };
});

vi.mock('stripe', () => {
  return {
    default: class MockStripe {
      checkout = {
        sessions: {
          create: (...args: unknown[]) => mockSessionsCreate(...args),
        },
      };
    },
  };
});

function buildReq(body: unknown, headers: Record<string, string> = {}) {
  return {
    json: async () => body,
    headers: new Headers({
      'user-agent': 'TestRunner/1.0',
      'accept-language': 'fr-FR,fr;q=0.9',
      ...headers,
    }),
  } as unknown as import('next/server').NextRequest;
}

const SAMPLE_RESERVATION = {
  id: 'res-dep-001',
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
  expiresAt: '2026-05-23T10:00:00.000Z',
  status: 'signed' as const,
  vipSessionId: VIP_SESSION_ID,
};

const SAMPLE_TOILE = {
  id: 1,
  name: 'Klein',
  dimensions: '100x130 cm',
  technique: 'Acrylique sur toile',
  year: 2026,
  price: 20000,
  status: 'reserved_signed' as const,
};

async function importRoute() {
  const mod = await import('../route');
  return mod.POST;
}

beforeEach(() => {
  mockGetVipSession.mockReset();
  mockReadReservations.mockReset();
  mockReadToiles.mockReset();
  mockWriteReservations.mockReset();
  mockSessionsCreate.mockReset();
  mockWriteReservations.mockResolvedValue(undefined);
});

describe('POST /api/stripe/checkout/canvas-deposit', () => {
  it('retourne 401 sans cookie VIP secret', async () => {
    mockGetVipSession.mockResolvedValue(null);
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: 'res-dep-001' }));
    expect(res.status).toBe(401);
  });

  it('retourne 400 si body invalide', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    const POST = await importRoute();
    const res = await POST(buildReq({}));
    expect(res.status).toBe(400);
  });

  it('retourne 404 si reservation introuvable', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([]);
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: 'inconnu' }));
    expect(res.status).toBe(404);
  });

  it('retourne 400 si reservation pas en status signed', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([
      { ...SAMPLE_RESERVATION, status: 'pending' },
    ]);
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: SAMPLE_RESERVATION.id }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('invalid_state');
  });

  it('retourne 400 si reservation deja partial_paid (acompte deja paye)', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([
      { ...SAMPLE_RESERVATION, status: 'partial_paid', paymentMode: 'deposit_balance' },
    ]);
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: SAMPLE_RESERVATION.id }));
    expect(res.status).toBe(400);
  });

  it('retourne 404 si toile introuvable', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    mockReadToiles.mockResolvedValue([]);
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: SAMPLE_RESERVATION.id }));
    expect(res.status).toBe(404);
  });

  it('retourne 200 + calcule depositAmount = 30% (arrondi sup) et balanceAmount', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    mockReadToiles.mockResolvedValue([SAMPLE_TOILE]);
    mockSessionsCreate.mockResolvedValue({
      id: 'cs_dep_123',
      url: 'https://checkout.stripe.com/c/pay/cs_dep_123',
    });
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: SAMPLE_RESERVATION.id, locale: 'fr' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.depositAmount).toBe(6000); // 30% de 20000
    expect(body.balanceAmount).toBe(14000);
    expect(body.sessionId).toBe('cs_dep_123');

    expect(mockSessionsCreate).toHaveBeenCalledTimes(1);
    const callArgs = mockSessionsCreate.mock.calls[0][0];
    expect(callArgs.metadata.type).toBe('vip-canvas-deposit');
    expect(callArgs.metadata.reservationId).toBe(SAMPLE_RESERVATION.id);
    expect(callArgs.metadata.depositAmountEur).toBe('6000');
    expect(callArgs.metadata.balanceAmountEur).toBe('14000');
    expect(callArgs.line_items[0].price_data.unit_amount).toBe(6000 * 100);
    expect(callArgs.success_url).toContain('step=deposit');
  });

  it('persiste paymentMode=deposit_balance + depositAmount sur la reservation', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    mockReadToiles.mockResolvedValue([SAMPLE_TOILE]);
    mockSessionsCreate.mockResolvedValue({
      id: 'cs_dep_124',
      url: 'https://checkout.stripe.com/c/pay/cs_dep_124',
    });
    const POST = await importRoute();
    await POST(buildReq({ reservationId: SAMPLE_RESERVATION.id }));

    expect(mockWriteReservations).toHaveBeenCalledTimes(1);
    const persisted = mockWriteReservations.mock.calls[0][0];
    expect(persisted[0].paymentMode).toBe('deposit_balance');
    expect(persisted[0].depositAmount).toBe(6000);
  });

  it('idempotent : reservation deja en deposit_balance status signed retourne 200', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([
      {
        ...SAMPLE_RESERVATION,
        paymentMode: 'deposit_balance',
        depositAmount: 6000,
      },
    ]);
    mockReadToiles.mockResolvedValue([SAMPLE_TOILE]);
    mockSessionsCreate.mockResolvedValue({
      id: 'cs_dep_125',
      url: 'https://checkout.stripe.com/c/pay/cs_dep_125',
    });
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: SAMPLE_RESERVATION.id }));
    expect(res.status).toBe(200);
  });

  it('retourne 502 si Stripe.checkout.sessions.create echoue', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    mockReadToiles.mockResolvedValue([SAMPLE_TOILE]);
    mockSessionsCreate.mockRejectedValue(new Error('Stripe API down'));
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: SAMPLE_RESERVATION.id }));
    expect(res.status).toBe(502);
  });
});
