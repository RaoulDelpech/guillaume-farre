/**
 * Tests unitaires - Stripe webhook route
 *
 * @author Lalou
 * @date 2026-04-17
 *
 * Couvre :
 * - Signature verification (valide / invalide / absente)
 * - Config manquante (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)
 * - Dispatch events (checkout.session.completed, async_payment_*, invoice.paid)
 * - Errors des handlers ne crashent pas le webhook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockConstructEvent = vi.fn();
const mockProcessOrder = vi.fn();
const mockReserveOrder = vi.fn();
const mockCancelReservation = vi.fn();
const mockProcessCanvasInvoicePaid = vi.fn();
const mockProcessCanvasCheckoutSession = vi.fn();
const mockProcessCanvasDepositCheckoutSession = vi.fn();
const mockProcessCanvasBalanceCheckoutSession = vi.fn();
const mockHeadersGet = vi.fn();

vi.mock('stripe', () => {
  class StripeMock {
    webhooks = { constructEvent: mockConstructEvent };
    checkout = { sessions: { retrieve: vi.fn() } };
  }
  return { default: StripeMock };
});

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => ({ get: mockHeadersGet })),
}));

vi.mock('../order-handler', () => ({
  processOrder: mockProcessOrder,
  reserveOrder: mockReserveOrder,
  cancelReservation: mockCancelReservation,
}));

vi.mock('../canvas-handler', () => ({
  processCanvasInvoicePaid: mockProcessCanvasInvoicePaid,
}));

vi.mock('../canvas-checkout-handler', () => ({
  processCanvasCheckoutSession: mockProcessCanvasCheckoutSession,
}));

vi.mock('../canvas-deposit-handler', () => ({
  processCanvasDepositCheckoutSession: mockProcessCanvasDepositCheckoutSession,
}));

vi.mock('../canvas-balance-handler', () => ({
  processCanvasBalanceCheckoutSession: mockProcessCanvasBalanceCheckoutSession,
}));

function buildReq(body: string) {
  return { text: async () => body } as any;
}

async function importRoute() {
  const mod = await import('../route');
  return mod.POST;
}

describe('Stripe webhook POST', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHeadersGet.mockReturnValue('t=123,v1=dummy');
  });

  describe('Signature verification', () => {
    it('returns 200 when signature valid and event type unknown', async () => {
      mockConstructEvent.mockReturnValue({ type: 'customer.created', data: { object: {} } });

      const POST = await importRoute();
      const res = await POST(buildReq('{"id":"evt_1"}'));

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toEqual({ received: true });
    });

    it('returns 400 when constructEvent throws (invalid signature)', async () => {
      mockConstructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const POST = await importRoute();
      const res = await POST(buildReq('{"id":"evt_1"}'));

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toContain('Invalid signature');
    });

    it('returns 400 when constructEvent throws non-Error', async () => {
      mockConstructEvent.mockImplementation(() => {
        // eslint-disable-next-line no-throw-literal
        throw 'string-error';
      });

      const POST = await importRoute();
      const res = await POST(buildReq('{"id":"evt_1"}'));

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toContain('Unknown error');
    });

    it('passes raw body and signature to constructEvent', async () => {
      mockConstructEvent.mockReturnValue({ type: 'customer.created', data: { object: {} } });
      mockHeadersGet.mockReturnValue('t=abc,v1=xyz');

      const POST = await importRoute();
      await POST(buildReq('raw-body-string'));

      expect(mockConstructEvent).toHaveBeenCalledWith(
        'raw-body-string',
        't=abc,v1=xyz',
        'webhook-secret-placeholder'
      );
    });
  });

  describe('Event dispatch - checkout.session.completed', () => {
    it('calls processOrder when payment_status = paid', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: { object: { id: 'cs_1', payment_status: 'paid' } },
      });
      mockProcessOrder.mockResolvedValue({ success: true });

      const POST = await importRoute();
      const res = await POST(buildReq('{}'));

      expect(res.status).toBe(200);
      expect(mockProcessOrder).toHaveBeenCalledTimes(1);
      expect(mockReserveOrder).not.toHaveBeenCalled();
    });

    it('calls reserveOrder when payment_status = unpaid', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: { object: { id: 'cs_1', payment_status: 'unpaid' } },
      });
      mockReserveOrder.mockResolvedValue(undefined);

      const POST = await importRoute();
      const res = await POST(buildReq('{}'));

      expect(res.status).toBe(200);
      expect(mockReserveOrder).toHaveBeenCalledTimes(1);
      expect(mockProcessOrder).not.toHaveBeenCalled();
    });

    it('does nothing for other payment_status values', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: { object: { id: 'cs_1', payment_status: 'no_payment_required' } },
      });

      const POST = await importRoute();
      const res = await POST(buildReq('{}'));

      expect(res.status).toBe(200);
      expect(mockProcessOrder).not.toHaveBeenCalled();
      expect(mockReserveOrder).not.toHaveBeenCalled();
    });

    it('returns 200 even when processOrder throws', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: { object: { id: 'cs_1', payment_status: 'paid' } },
      });
      mockProcessOrder.mockRejectedValue(new Error('Stock depleted'));

      const POST = await importRoute();
      const res = await POST(buildReq('{}'));

      expect(res.status).toBe(200);
      expect(mockProcessOrder).toHaveBeenCalled();
    });

    it('returns 200 even when reserveOrder throws', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: { object: { id: 'cs_1', payment_status: 'unpaid' } },
      });
      mockReserveOrder.mockRejectedValue(new Error('Email failed'));

      const POST = await importRoute();
      const res = await POST(buildReq('{}'));

      expect(res.status).toBe(200);
    });

    it('dispatches vip-canvas-deposit metadata to deposit handler', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_dep',
            payment_status: 'paid',
            metadata: { type: 'vip-canvas-deposit', reservationId: 'r1' },
          },
        },
      });
      mockProcessCanvasDepositCheckoutSession.mockResolvedValue(undefined);

      const POST = await importRoute();
      const res = await POST(buildReq('{}'));

      expect(res.status).toBe(200);
      expect(mockProcessCanvasDepositCheckoutSession).toHaveBeenCalledTimes(1);
      expect(mockProcessOrder).not.toHaveBeenCalled();
      expect(mockProcessCanvasCheckoutSession).not.toHaveBeenCalled();
    });

    it('dispatches vip-canvas-balance metadata to balance handler', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_bal',
            payment_status: 'paid',
            metadata: { type: 'vip-canvas-balance', reservationId: 'r1' },
          },
        },
      });
      mockProcessCanvasBalanceCheckoutSession.mockResolvedValue(undefined);

      const POST = await importRoute();
      const res = await POST(buildReq('{}'));

      expect(res.status).toBe(200);
      expect(mockProcessCanvasBalanceCheckoutSession).toHaveBeenCalledTimes(1);
      expect(mockProcessOrder).not.toHaveBeenCalled();
    });

    it('returns 200 even if deposit handler throws', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_dep',
            payment_status: 'paid',
            metadata: { type: 'vip-canvas-deposit', reservationId: 'r1' },
          },
        },
      });
      mockProcessCanvasDepositCheckoutSession.mockRejectedValue(new Error('write fail'));

      const POST = await importRoute();
      const res = await POST(buildReq('{}'));

      expect(res.status).toBe(200);
    });
  });

  describe('Event dispatch - async_payment events', () => {
    it('calls processOrder on async_payment_succeeded', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.async_payment_succeeded',
        data: { object: { id: 'cs_async' } },
      });
      mockProcessOrder.mockResolvedValue({ success: true });

      const POST = await importRoute();
      const res = await POST(buildReq('{}'));

      expect(res.status).toBe(200);
      expect(mockProcessOrder).toHaveBeenCalledTimes(1);
    });

    it('calls cancelReservation on async_payment_failed', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.async_payment_failed',
        data: { object: { id: 'cs_fail' } },
      });
      mockCancelReservation.mockResolvedValue(undefined);

      const POST = await importRoute();
      const res = await POST(buildReq('{}'));

      expect(res.status).toBe(200);
      expect(mockCancelReservation).toHaveBeenCalledTimes(1);
    });

    it('returns 200 even if cancelReservation throws', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.async_payment_failed',
        data: { object: { id: 'cs_fail' } },
      });
      mockCancelReservation.mockRejectedValue(new Error('boom'));

      const POST = await importRoute();
      const res = await POST(buildReq('{}'));

      expect(res.status).toBe(200);
    });
  });

  describe('Event dispatch - payment_intent', () => {
    it('returns 200 with no-op on payment_intent.succeeded', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'payment_intent.succeeded',
        data: { object: {} },
      });

      const POST = await importRoute();
      const res = await POST(buildReq('{}'));

      expect(res.status).toBe(200);
      expect(mockProcessOrder).not.toHaveBeenCalled();
      expect(mockReserveOrder).not.toHaveBeenCalled();
      expect(mockProcessCanvasInvoicePaid).not.toHaveBeenCalled();
    });

    it('returns 200 with no-op on payment_intent.payment_failed', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'payment_intent.payment_failed',
        data: { object: {} },
      });

      const POST = await importRoute();
      const res = await POST(buildReq('{}'));

      expect(res.status).toBe(200);
      expect(mockProcessOrder).not.toHaveBeenCalled();
    });
  });

  describe('Event dispatch - invoice.paid', () => {
    it('calls processCanvasInvoicePaid when metadata.reservationId is present', async () => {
      const invoice = { metadata: { reservationId: 'res_123' } };
      mockConstructEvent.mockReturnValue({
        type: 'invoice.paid',
        data: { object: invoice },
      });
      mockProcessCanvasInvoicePaid.mockResolvedValue(undefined);

      const POST = await importRoute();
      const res = await POST(buildReq('{}'));

      expect(res.status).toBe(200);
      expect(mockProcessCanvasInvoicePaid).toHaveBeenCalledWith(invoice);
    });

    it('does NOT call processCanvasInvoicePaid when metadata.reservationId is missing', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'invoice.paid',
        data: { object: { metadata: {} } },
      });

      const POST = await importRoute();
      const res = await POST(buildReq('{}'));

      expect(res.status).toBe(200);
      expect(mockProcessCanvasInvoicePaid).not.toHaveBeenCalled();
    });

    it('does NOT call processCanvasInvoicePaid when metadata is undefined', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'invoice.paid',
        data: { object: {} },
      });

      const POST = await importRoute();
      const res = await POST(buildReq('{}'));

      expect(res.status).toBe(200);
      expect(mockProcessCanvasInvoicePaid).not.toHaveBeenCalled();
    });

    it('returns 200 even if processCanvasInvoicePaid throws', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'invoice.paid',
        data: { object: { metadata: { reservationId: 'res_123' } } },
      });
      mockProcessCanvasInvoicePaid.mockRejectedValue(new Error('Canvas error'));

      const POST = await importRoute();
      const res = await POST(buildReq('{}'));

      expect(res.status).toBe(200);
    });
  });

  describe('Unhandled event types', () => {
    it('returns 200 no-op for unknown events', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'random.unknown.event',
        data: { object: {} },
      });

      const POST = await importRoute();
      const res = await POST(buildReq('{}'));

      expect(res.status).toBe(200);
      expect(mockProcessOrder).not.toHaveBeenCalled();
      expect(mockReserveOrder).not.toHaveBeenCalled();
      expect(mockCancelReservation).not.toHaveBeenCalled();
      expect(mockProcessCanvasInvoicePaid).not.toHaveBeenCalled();
    });
  });
});

describe('Stripe webhook POST - config manquante', () => {
  const originalSecret = process.env.STRIPE_SECRET_KEY;
  const originalWebhook = process.env.STRIPE_WEBHOOK_SECRET;

  beforeEach(() => {
    vi.clearAllMocks();
    mockHeadersGet.mockReturnValue('t=123,v1=dummy');
  });

  afterEach(() => {
    process.env.STRIPE_SECRET_KEY = originalSecret;
    process.env.STRIPE_WEBHOOK_SECRET = originalWebhook;
  });

  it('returns 503 when STRIPE_SECRET_KEY is missing', async () => {
    delete process.env.STRIPE_SECRET_KEY;
    vi.resetModules();

    const mod = await import('../route');
    const res = await mod.POST(buildReq('{}'));

    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toContain('Stripe');
  });

  it('returns 500 when STRIPE_WEBHOOK_SECRET is missing', async () => {
    process.env.STRIPE_SECRET_KEY = 'stripe-key-placeholder';
    delete process.env.STRIPE_WEBHOOK_SECRET;
    vi.resetModules();

    const mod = await import('../route');
    const res = await mod.POST(buildReq('{}'));

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toContain('Webhook secret');
  });
});
