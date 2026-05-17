/**
 * Tests d'integration - processCanvasBalanceCheckoutSession (Sprint 5)
 *
 * @author Lalou
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockReadReservations = vi.fn();
const mockWriteReservations = vi.fn();
const mockReadToiles = vi.fn();
const mockWriteToiles = vi.fn();
const mockCreateOrder = vi.fn();
const mockSendOrderConfirmation = vi.fn();
const mockSendTestEmail = vi.fn();

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

vi.mock('@/lib/orders', () => ({
  createOrder: mockCreateOrder,
}));

vi.mock('@/lib/resend-client', () => ({
  sendOrderConfirmationEmail: mockSendOrderConfirmation,
  sendTestEmail: mockSendTestEmail,
}));

async function importHandler() {
  const mod = await import('../canvas-balance-handler');
  return mod.processCanvasBalanceCheckoutSession;
}

function buildSession(overrides: Record<string, unknown> = {}) {
  return {
    id: 'cs_bal_xyz',
    amount_total: 14000 * 100,
    payment_intent: 'pi_test_bal_123',
    metadata: {
      type: 'vip-canvas-balance',
      reservationId: 'res-bal-001',
      canvasId: '1',
      balanceAmountEur: '14000',
    },
    payment_status: 'paid',
    ...overrides,
  } as unknown as import('stripe').Stripe.Checkout.Session;
}

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
  expiresAt: '2026-05-31T10:00:00.000Z',
  status: 'partial_paid' as const,
  paymentMode: 'deposit_balance' as const,
  depositAmount: 6000,
  depositPaidAt: '2026-05-17T10:00:00.000Z',
  balanceDueAt: '2026-05-31T10:00:00.000Z',
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

beforeEach(() => {
  mockReadReservations.mockReset();
  mockWriteReservations.mockReset();
  mockReadToiles.mockReset();
  mockWriteToiles.mockReset();
  mockCreateOrder.mockReset();
  mockSendOrderConfirmation.mockReset();
  mockSendTestEmail.mockReset();
  mockWriteReservations.mockResolvedValue(undefined);
  mockWriteToiles.mockResolvedValue(undefined);
  mockSendOrderConfirmation.mockResolvedValue({ success: true });
  mockSendTestEmail.mockResolvedValue({ success: true });
});

describe('processCanvasBalanceCheckoutSession', () => {
  it('no-op si metadata.type absent', async () => {
    const handler = await importHandler();
    await handler(buildSession({ metadata: { reservationId: 'res-bal-001' } }));
    expect(mockReadReservations).not.toHaveBeenCalled();
  });

  it('no-op si reservation introuvable', async () => {
    mockReadReservations.mockResolvedValue([]);
    const handler = await importHandler();
    await handler(buildSession());
    expect(mockWriteReservations).not.toHaveBeenCalled();
  });

  it('idempotent si deja paid', async () => {
    mockReadReservations.mockResolvedValue([{ ...SAMPLE_RESERVATION, status: 'paid' }]);
    const handler = await importHandler();
    await handler(buildSession());
    expect(mockWriteReservations).not.toHaveBeenCalled();
    expect(mockCreateOrder).not.toHaveBeenCalled();
  });

  it('refuse si reservation pas partial_paid', async () => {
    mockReadReservations.mockResolvedValue([{ ...SAMPLE_RESERVATION, status: 'signed' }]);
    const handler = await importHandler();
    await handler(buildSession());
    expect(mockWriteReservations).not.toHaveBeenCalled();
  });

  it('succes : status -> paid + Order avec totalAmount=prix complet + toile paid + emails', async () => {
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    mockReadToiles.mockResolvedValue([SAMPLE_TOILE]);
    mockCreateOrder.mockResolvedValue({ orderNumber: 'GF-99999999' });

    const handler = await importHandler();
    await handler(buildSession());

    // Premier writeReservations = status paid
    expect(mockWriteReservations).toHaveBeenCalled();
    const written = mockWriteReservations.mock.calls[0][0];
    expect(written[0].status).toBe('paid');
    expect(written[0].paidAt).toBeDefined();
    expect(written[0].stripeBalanceSessionId).toBe('cs_bal_xyz');
    expect(written[0].stripeBalancePaymentIntentId).toBe('pi_test_bal_123');

    // Toile passe a paid
    expect(mockWriteToiles).toHaveBeenCalled();
    expect(mockWriteToiles.mock.calls[0][0][0].status).toBe('paid');

    // Order cree avec totalAmount = 20000 (prix complet) pas juste le solde
    expect(mockCreateOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        stripeSessionId: 'cs_bal_xyz',
        totalAmount: 20000,
        status: 'paid',
        type: 'canvas',
      }),
    );

    // Email confirmation envoye avec orderNumber
    expect(mockSendOrderConfirmation).toHaveBeenCalled();
    const emailCall = mockSendOrderConfirmation.mock.calls[0][0];
    expect(emailCall.orderNumber).toBe('GF-99999999');
    expect(emailCall.totalAmount).toBe(20000);

    // Notification Guillaume
    expect(mockSendTestEmail).toHaveBeenCalledWith('contact@guillaumefarre.com');
  });

  it('payment_intent en objet plutot que string', async () => {
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    mockReadToiles.mockResolvedValue([SAMPLE_TOILE]);
    mockCreateOrder.mockResolvedValue({ orderNumber: 'GF-XX' });

    const handler = await importHandler();
    await handler(buildSession({ payment_intent: { id: 'pi_obj_456' } }));

    const written = mockWriteReservations.mock.calls[0][0];
    expect(written[0].stripeBalancePaymentIntentId).toBe('pi_obj_456');
  });
});
