/**
 * Tests d'integration - processCanvasDepositCheckoutSession (Sprint 5)
 *
 * @author Lalou
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockReadReservations = vi.fn();
const mockWriteReservations = vi.fn();
const mockReadToiles = vi.fn();
const mockWriteToiles = vi.fn();
const mockSendDepositConfirmed = vi.fn();
const mockGetResendClient = vi.fn();

vi.mock('@/lib/reservations-store', async (orig) => {
  const actual = await (orig() as Promise<typeof import('@/lib/reservations-store')>);
  return {
    ...actual,
    readReservations: mockReadReservations,
    writeReservations: mockWriteReservations,
    readToiles: mockReadToiles,
    writeToiles: mockWriteToiles,
  };
});

vi.mock('@/lib/resend/deposit-confirmed', () => ({
  sendDepositConfirmedEmail: mockSendDepositConfirmed,
}));

vi.mock('@/lib/resend/client', () => ({
  getResendClient: mockGetResendClient,
  FROM_EMAIL: 'Guillaume Farré <noreply@guillaumefarre.com>',
}));

async function importHandler() {
  const mod = await import('../canvas-deposit-handler');
  return mod.processCanvasDepositCheckoutSession;
}

function buildSession(overrides: Record<string, unknown> = {}) {
  return {
    id: 'cs_dep_xyz',
    amount_total: 6000 * 100,
    metadata: {
      type: 'vip-canvas-deposit',
      reservationId: 'res-dep-001',
      canvasId: '1',
      depositAmountEur: '6000',
      balanceAmountEur: '14000',
    },
    payment_status: 'paid',
    ...overrides,
  } as unknown as import('stripe').Stripe.Checkout.Session;
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
  paymentMode: 'deposit_balance' as const,
  depositAmount: 6000,
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

beforeEach(() => {
  mockReadReservations.mockReset();
  mockWriteReservations.mockReset();
  mockReadToiles.mockReset();
  mockWriteToiles.mockReset();
  mockSendDepositConfirmed.mockReset();
  mockGetResendClient.mockReset();
  mockWriteReservations.mockResolvedValue(undefined);
  mockWriteToiles.mockResolvedValue(undefined);
  mockSendDepositConfirmed.mockResolvedValue({ success: true });
  mockGetResendClient.mockReturnValue(null); // pas d'email Guillaume par defaut
});

describe('processCanvasDepositCheckoutSession', () => {
  it('no-op si metadata.type absent', async () => {
    const handler = await importHandler();
    await handler(buildSession({ metadata: { reservationId: 'res-dep-001' } }));
    expect(mockReadReservations).not.toHaveBeenCalled();
  });

  it('no-op si metadata.type est mauvais', async () => {
    const handler = await importHandler();
    await handler(buildSession({ metadata: { type: 'vip-canvas-payment', reservationId: 'res-dep-001' } }));
    expect(mockReadReservations).not.toHaveBeenCalled();
  });

  it('no-op si reservation introuvable', async () => {
    mockReadReservations.mockResolvedValue([]);
    const handler = await importHandler();
    await handler(buildSession());
    expect(mockWriteReservations).not.toHaveBeenCalled();
  });

  it('idempotent si deja partial_paid avec meme sessionId', async () => {
    mockReadReservations.mockResolvedValue([
      {
        ...SAMPLE_RESERVATION,
        status: 'partial_paid',
        stripeDepositSessionId: 'cs_dep_xyz',
      },
    ]);
    const handler = await importHandler();
    await handler(buildSession());
    expect(mockWriteReservations).not.toHaveBeenCalled();
  });

  it('idempotent si deja paid (cas tardif solde paye avant trigger deposit)', async () => {
    mockReadReservations.mockResolvedValue([
      { ...SAMPLE_RESERVATION, status: 'paid' },
    ]);
    const handler = await importHandler();
    await handler(buildSession());
    expect(mockWriteReservations).not.toHaveBeenCalled();
  });

  it('succes : status -> partial_paid + balanceDueAt J+14 + toile partial_paid + email', async () => {
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    mockReadToiles.mockResolvedValue([SAMPLE_TOILE]);

    const before = Date.now();
    const handler = await importHandler();
    await handler(buildSession());
    const after = Date.now();

    expect(mockWriteReservations).toHaveBeenCalled();
    const written = mockWriteReservations.mock.calls[0][0];
    expect(written[0].status).toBe('partial_paid');
    expect(written[0].paymentMode).toBe('deposit_balance');
    expect(written[0].depositAmount).toBe(6000);
    expect(written[0].depositPaidAt).toBeDefined();
    expect(written[0].balanceDueAt).toBeDefined();
    expect(written[0].expiresAt).toBe(written[0].balanceDueAt);
    expect(written[0].stripeDepositSessionId).toBe('cs_dep_xyz');

    // balanceDueAt doit etre ~14 jours apres depositPaidAt
    const depositTs = new Date(written[0].depositPaidAt).getTime();
    const dueTs = new Date(written[0].balanceDueAt).getTime();
    const diffDays = (dueTs - depositTs) / (1000 * 60 * 60 * 24);
    expect(diffDays).toBeCloseTo(14, 0);

    // depositPaidAt entre before et after
    expect(depositTs).toBeGreaterThanOrEqual(before);
    expect(depositTs).toBeLessThanOrEqual(after + 1000);

    expect(mockWriteToiles).toHaveBeenCalled();
    const writtenToiles = mockWriteToiles.mock.calls[0][0];
    expect(writtenToiles[0].status).toBe('partial_paid');

    expect(mockSendDepositConfirmed).toHaveBeenCalled();
    const emailArgs = mockSendDepositConfirmed.mock.calls[0][0];
    expect(emailArgs.to).toBe(SAMPLE_RESERVATION.email);
    expect(emailArgs.depositAmount).toBe(6000);
    expect(emailArgs.balanceAmount).toBe(14000);
    expect(emailArgs.totalAmount).toBe(20000);
    expect(emailArgs.balanceCheckoutUrl).toContain(`/vip/reservation/${SAMPLE_RESERVATION.id}/balance`);
  });

  it('utilise depositAmount de session si reservation.depositAmount absent', async () => {
    mockReadReservations.mockResolvedValue([
      { ...SAMPLE_RESERVATION, depositAmount: undefined },
    ]);
    mockReadToiles.mockResolvedValue([SAMPLE_TOILE]);

    const handler = await importHandler();
    await handler(buildSession());

    const written = mockWriteReservations.mock.calls[0][0];
    expect(written[0].depositAmount).toBe(6000); // 6000 EUR depuis amount_total
  });
});
