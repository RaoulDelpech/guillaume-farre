/**
 * Tests d'integration - POST /api/stripe/invoices/canvas-email (Sprint 5)
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
const mockCustomersList = vi.fn();
const mockCustomersCreate = vi.fn();
const mockInvoiceItemsCreate = vi.fn();
const mockInvoicesCreate = vi.fn();
const mockInvoicesSend = vi.fn();

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

vi.mock('stripe', () => ({
  default: class MockStripe {
    customers = {
      list: (...args: unknown[]) => mockCustomersList(...args),
      create: (...args: unknown[]) => mockCustomersCreate(...args),
    };
    invoiceItems = {
      create: (...args: unknown[]) => mockInvoiceItemsCreate(...args),
    };
    invoices = {
      create: (...args: unknown[]) => mockInvoicesCreate(...args),
      sendInvoice: (...args: unknown[]) => mockInvoicesSend(...args),
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

const SAMPLE_RESERVATION = {
  id: 'res-inv-001',
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
  mockCustomersList.mockReset();
  mockCustomersCreate.mockReset();
  mockInvoiceItemsCreate.mockReset();
  mockInvoicesCreate.mockReset();
  mockInvoicesSend.mockReset();
  mockWriteReservations.mockResolvedValue(undefined);
});

describe('POST /api/stripe/invoices/canvas-email', () => {
  it('401 sans cookie VIP secret', async () => {
    mockGetVipSession.mockResolvedValue(null);
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: 'res-inv-001' }));
    expect(res.status).toBe(401);
  });

  it('404 reservation introuvable', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([]);
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: 'inconnu' }));
    expect(res.status).toBe(404);
  });

  it('400 si reservation pas signed', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([
      { ...SAMPLE_RESERVATION, status: 'pending' },
    ]);
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: SAMPLE_RESERVATION.id }));
    expect(res.status).toBe(400);
  });

  it('400 si reservation deja paid', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([
      { ...SAMPLE_RESERVATION, status: 'paid' },
    ]);
    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: SAMPLE_RESERVATION.id }));
    expect(res.status).toBe(400);
  });

  it('200 + cree customer + invoice + persiste invoiceId', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    mockReadToiles.mockResolvedValue([SAMPLE_TOILE]);
    mockCustomersList.mockResolvedValue({ data: [] });
    mockCustomersCreate.mockResolvedValue({ id: 'cus_test_123' });
    mockInvoiceItemsCreate.mockResolvedValue({ id: 'ii_test_123' });
    mockInvoicesCreate.mockResolvedValue({ id: 'in_test_123' });
    mockInvoicesSend.mockResolvedValue({
      id: 'in_test_123',
      hosted_invoice_url: 'https://invoice.stripe.com/i/abc',
      invoice_pdf: 'https://invoice.stripe.com/i/abc/pdf',
    });

    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: SAMPLE_RESERVATION.id }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.invoiceId).toBe('in_test_123');
    expect(body.hostedUrl).toBe('https://invoice.stripe.com/i/abc');

    expect(mockInvoiceItemsCreate).toHaveBeenCalledTimes(1);
    const itemArgs = mockInvoiceItemsCreate.mock.calls[0][0];
    expect(itemArgs.amount).toBe(20000 * 100);
    expect(itemArgs.customer).toBe('cus_test_123');

    expect(mockInvoicesCreate).toHaveBeenCalledTimes(1);
    const invArgs = mockInvoicesCreate.mock.calls[0][0];
    expect(invArgs.metadata.type).toBe('vip-canvas-invoice');
    expect(invArgs.metadata.reservationId).toBe(SAMPLE_RESERVATION.id);
    expect(invArgs.collection_method).toBe('send_invoice');
    expect(invArgs.days_until_due).toBe(7);

    expect(mockWriteReservations).toHaveBeenCalledTimes(1);
    const persisted = mockWriteReservations.mock.calls[0][0];
    expect(persisted[0].paymentMode).toBe('invoice_email');
    expect(persisted[0].stripeCustomerId).toBe('cus_test_123');
    expect(persisted[0].stripeInvoiceId).toBe('in_test_123');
  });

  it('reutilise customer existant via email lookup', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    mockReadToiles.mockResolvedValue([SAMPLE_TOILE]);
    mockCustomersList.mockResolvedValue({ data: [{ id: 'cus_existing_456' }] });
    mockInvoiceItemsCreate.mockResolvedValue({ id: 'ii_456' });
    mockInvoicesCreate.mockResolvedValue({ id: 'in_456' });
    mockInvoicesSend.mockResolvedValue({
      id: 'in_456',
      hosted_invoice_url: 'https://invoice.stripe.com/i/456',
    });

    const POST = await importRoute();
    await POST(buildReq({ reservationId: SAMPLE_RESERVATION.id }));

    expect(mockCustomersCreate).not.toHaveBeenCalled();
    const itemArgs = mockInvoiceItemsCreate.mock.calls[0][0];
    expect(itemArgs.customer).toBe('cus_existing_456');
  });

  it('502 si Stripe.invoices.create echoue', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    mockReadToiles.mockResolvedValue([SAMPLE_TOILE]);
    mockCustomersList.mockResolvedValue({ data: [{ id: 'cus_x' }] });
    mockInvoiceItemsCreate.mockResolvedValue({ id: 'ii' });
    mockInvoicesCreate.mockRejectedValue(new Error('Stripe invoice down'));

    const POST = await importRoute();
    const res = await POST(buildReq({ reservationId: SAMPLE_RESERVATION.id }));
    expect(res.status).toBe(502);
  });
});
