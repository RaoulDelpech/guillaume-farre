/**
 * Tests d'integration - POST /api/stripe/checkout/canvas
 *
 * Couvre les intentions Sprint 4 :
 *  - 401 sans cookie VIP secret
 *  - 400 reservation pas en status 'signed'
 *  - 404 reservation introuvable
 *  - 404 toile introuvable
 *  - 200 succes -> renvoie sessionUrl
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
  id: 'res-abc-123',
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
  mockSessionsCreate.mockReset();
});

describe('POST /api/stripe/checkout/canvas', () => {
  it('retourne 401 sans cookie VIP secret', async () => {
    mockGetVipSession.mockResolvedValue(null);
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: 'res-abc-123' }));
    expect(res.status).toBe(401);
  });

  it('retourne 401 si niveau hidden (pas secret)', async () => {
    mockGetVipSession.mockResolvedValue({
      level: 'hidden' as const,
      sessionId: VIP_SESSION_ID,
      code: 'AAAAAAAA',
      expiresAt: Date.now() + 60_000,
    });
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: 'res-abc-123' }));
    expect(res.status).toBe(401);
  });

  it('retourne 400 si body invalide (reservationId manquant)', async () => {
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

  it('retourne 404 si toile introuvable', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    mockReadToiles.mockResolvedValue([]);
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: SAMPLE_RESERVATION.id }));
    expect(res.status).toBe(404);
  });

  it('retourne 200 + sessionUrl en cas de succes', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    mockReadToiles.mockResolvedValue([SAMPLE_TOILE]);
    mockSessionsCreate.mockResolvedValue({
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/c/pay/cs_test_123',
    });
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: SAMPLE_RESERVATION.id, locale: 'fr' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.sessionUrl).toContain('checkout.stripe.com');
    expect(body.sessionId).toBe('cs_test_123');

    expect(mockSessionsCreate).toHaveBeenCalledTimes(1);
    const callArgs = mockSessionsCreate.mock.calls[0][0];
    expect(callArgs.metadata.type).toBe('vip-canvas-payment');
    expect(callArgs.metadata.reservationId).toBe(SAMPLE_RESERVATION.id);
    expect(callArgs.line_items[0].price_data.unit_amount).toBe(20000 * 100);
    expect(callArgs.customer_email).toBe(SAMPLE_RESERVATION.email);
    expect(callArgs.success_url).toContain('/fr/vip/reservation/');
    expect(callArgs.success_url).toContain('/confirmation');
    expect(callArgs.cancel_url).toContain('/checkout');
  });
});
