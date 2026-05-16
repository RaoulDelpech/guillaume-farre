/**
 * Tests d'integration - processCanvasCheckoutSession
 *
 * Couvre :
 *  - metadata.type absent -> no-op (early return, pas d'ecriture)
 *  - reservationId manquant -> no-op
 *  - reservation introuvable -> no-op
 *  - reservation deja paid -> idempotent (skip)
 *  - succes -> writeReservations + writeToiles + createOrder + emails
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
  const mod = await import('../canvas-checkout-handler');
  return mod.processCanvasCheckoutSession;
}

function buildSession(overrides: Record<string, unknown> = {}) {
  return {
    id: 'cs_test_xyz',
    amount_total: 20000 * 100,
    metadata: {
      type: 'vip-canvas-payment',
      reservationId: 'res-abc-123',
      canvasId: '1',
    },
    payment_status: 'paid',
    ...overrides,
  } as unknown as import('stripe').Stripe.Checkout.Session;
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
  mockCreateOrder.mockReset();
  mockSendOrderConfirmation.mockReset();
  mockSendTestEmail.mockReset();
  mockWriteReservations.mockResolvedValue(undefined);
  mockWriteToiles.mockResolvedValue(undefined);
  mockSendOrderConfirmation.mockResolvedValue({ success: true });
  mockSendTestEmail.mockResolvedValue({ success: true });
});

describe('processCanvasCheckoutSession', () => {
  it('no-op si metadata.type absent', async () => {
    const handler = await importHandler();
    await handler(buildSession({ metadata: { reservationId: 'res-abc-123' } }));
    expect(mockReadReservations).not.toHaveBeenCalled();
  });

  it('no-op si reservationId absent', async () => {
    const handler = await importHandler();
    await handler(buildSession({ metadata: { type: 'vip-canvas-payment' } }));
    expect(mockReadReservations).not.toHaveBeenCalled();
  });

  it('no-op si reservation introuvable', async () => {
    mockReadReservations.mockResolvedValue([]);
    const handler = await importHandler();
    await handler(buildSession());
    expect(mockWriteReservations).not.toHaveBeenCalled();
    expect(mockCreateOrder).not.toHaveBeenCalled();
  });

  it('idempotent si reservation deja paid', async () => {
    mockReadReservations.mockResolvedValue([{ ...SAMPLE_RESERVATION, status: 'paid' }]);
    const handler = await importHandler();
    await handler(buildSession());
    expect(mockWriteReservations).not.toHaveBeenCalled();
    expect(mockCreateOrder).not.toHaveBeenCalled();
    expect(mockSendOrderConfirmation).not.toHaveBeenCalled();
  });

  it('succes : met a jour reservation, toile, cree order, envoie emails', async () => {
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    mockReadToiles.mockResolvedValue([SAMPLE_TOILE]);
    mockCreateOrder.mockResolvedValue({ orderNumber: 'GF-12345678' });

    const handler = await importHandler();
    await handler(buildSession());

    expect(mockWriteReservations).toHaveBeenCalled();
    const writtenReservations = mockWriteReservations.mock.calls[0][0];
    expect(writtenReservations[0].status).toBe('paid');
    expect(writtenReservations[0].paymentMode).toBe('integral');
    expect(writtenReservations[0].paidAt).toBeDefined();

    expect(mockWriteToiles).toHaveBeenCalled();
    const writtenToiles = mockWriteToiles.mock.calls[0][0];
    expect(writtenToiles[0].status).toBe('paid');

    expect(mockCreateOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        stripeSessionId: 'cs_test_xyz',
        customerEmail: SAMPLE_RESERVATION.email,
        type: 'canvas',
        status: 'paid',
        totalAmount: 20000,
      }),
    );

    expect(mockSendOrderConfirmation).toHaveBeenCalled();
    const emailCall = mockSendOrderConfirmation.mock.calls[0][0];
    expect(emailCall.to).toBe(SAMPLE_RESERVATION.email);
    expect(emailCall.orderNumber).toBe('GF-12345678');

    expect(mockSendTestEmail).toHaveBeenCalledWith('contact@guillaumefarre.com');
  });
});
