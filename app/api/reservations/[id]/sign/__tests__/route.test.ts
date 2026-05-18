/**
 * Tests d'integration - POST /api/reservations/[id]/sign
 *
 * Couvre les intentions Sprint 3 :
 *  - I2 : signature OK -> 200 + PDF ecrit + reservation 'signed' + toile 'reserved_signed'
 *  - I4 : validation Zod (body manquant, fullName trop court, dataURL invalide)
 *  - I5 : auth VIP requise (cookie absent -> 401)
 *  - I6 : reservation deja signed -> 409 idempotent
 *  - I7 : lock indisponible -> 503
 *
 * Toutes les deps qui touchent le disque ou le reseau sont mockees :
 *  - @/lib/access (getAccessLevel)
 *  - @/lib/locks (acquireLock)
 *  - @/lib/reservations-store (read/write)
 *  - @/lib/resend/contract-emails (no-op)
 *  - fs.promises.mkdir + fs.promises.writeFile (no-op pour eviter ecrire le PDF reel)
 *
 * @author Lalou
 */

import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

process.env.MAGIC_LINK_SECRET = process.env.MAGIC_LINK_SECRET || 'test-secret-sprint3';

const VIP_SESSION_ID = '11111111-2222-3333-4444-555555555555';
const VIP_SESSION_OK = {
  level: 'secret' as const,
  sessionId: VIP_SESSION_ID,
  code: 'AAAAAAAA',
  expiresAt: Date.now() + 60_000,
};
const mockGetVipSession = vi.fn();
const mockAcquireLock = vi.fn();
const mockRelease = vi.fn(async () => {});
const mockReadReservations = vi.fn();
const mockReadToiles = vi.fn();
const mockWriteReservations = vi.fn<(reservations: unknown[]) => Promise<void>>(async () => {});
const mockWriteToiles = vi.fn<(toiles: unknown[]) => Promise<void>>(async () => {});
const mockSendSignedContract = vi.fn(async () => ({ success: false, error: 'no-op' }));
const mockSendNewSigned = vi.fn(async () => ({ success: false, error: 'no-op' }));
interface PostSigArg {
  to: string;
  buyerName: string;
  canvasTitle: string;
  reservationId: string;
  checkoutUrl: string;
}
const mockSendPostSignatureCheckoutLink = vi.fn<(p: PostSigArg) => Promise<{ success: boolean; error?: string }>>(async () => ({ success: false, error: 'no-op' }));

vi.mock('@/lib/access', () => ({
  getVipSession: mockGetVipSession,
}));

vi.mock('@/lib/locks', () => ({
  acquireLock: mockAcquireLock,
}));

vi.mock('@/lib/reservations-store', async (orig) => {
  const actual = await (orig() as Promise<typeof import('@/lib/reservations-store')>);
  return {
    ...actual,
    readReservations: mockReadReservations,
    readToiles: mockReadToiles,
    writeReservations: mockWriteReservations,
    writeToiles: mockWriteToiles,
  };
});

vi.mock('@/lib/resend/contract-emails', () => ({
  sendSignedContractEmail: mockSendSignedContract,
  sendNewSignedReservationEmail: mockSendNewSigned,
}));

vi.mock('@/lib/resend/post-signature-checkout-link', () => ({
  sendPostSignatureCheckoutLink: mockSendPostSignatureCheckoutLink,
}));

vi.mock('fs', async () => {
  const actual = await vi.importActual<typeof import('fs')>('fs');
  return {
    ...actual,
    promises: {
      ...actual.promises,
      mkdir: vi.fn(async () => undefined),
      writeFile: vi.fn(async () => undefined),
    },
  };
});

async function generateValidPngDataUrl(): Promise<string> {
  const sharp = (await import('sharp')).default;
  const buf = await sharp({
    create: { width: 100, height: 50, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .png()
    .toBuffer();
  return `data:image/png;base64,${buf.toString('base64')}`;
}

let VALID_PNG_DATA_URL = '';

async function importRoute() {
  const mod = await import('../route');
  return mod.POST;
}

function buildReq(body: unknown, headers: Record<string, string> = {}) {
  return {
    json: async () => body,
    headers: new Headers({
      'user-agent': 'TestRunner/1.0',
      'x-forwarded-for': '203.0.113.42',
      ...headers,
    }),
  } as any;
}

function buildParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

const SAMPLE_RESERVATION = {
  id: '11111111-2222-3333-4444-555555555555',
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
  status: 'pending' as const,
  vipSessionId: VIP_SESSION_ID,
};

const SAMPLE_TOILE = {
  id: 1,
  name: 'Klein',
  dimensions: '100x130 cm',
  technique: 'Acrylique sur toile',
  year: 2026,
  price: 20000,
  status: 'reserved_pending' as const,
};

beforeAll(async () => {
  VALID_PNG_DATA_URL = await generateValidPngDataUrl();
});

beforeEach(() => {
  mockGetVipSession.mockReset();
  mockAcquireLock.mockReset();
  mockRelease.mockClear();
  mockReadReservations.mockReset();
  mockReadToiles.mockReset();
  mockWriteReservations.mockClear();
  mockWriteToiles.mockClear();
  mockSendSignedContract.mockClear();
  mockSendNewSigned.mockClear();
  mockSendPostSignatureCheckoutLink.mockClear();
  mockAcquireLock.mockResolvedValue({ release: mockRelease });
});

describe('POST /api/reservations/[id]/sign', () => {
  it('I5 - retourne 401 sans cookie VIP', async () => {
    mockGetVipSession.mockResolvedValue(null);
    const POST = await importRoute();
    const res = await POST(
      buildReq({ signatureImage: VALID_PNG_DATA_URL, fullName: 'Jean' }),
      buildParams(SAMPLE_RESERVATION.id),
    );
    expect(res.status).toBe(401);
  });

  it('I4 - retourne 400 si fullName trop court', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    const POST = await importRoute();
    const res = await POST(
      buildReq({ signatureImage: VALID_PNG_DATA_URL, fullName: 'A' }),
      buildParams(SAMPLE_RESERVATION.id),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('validation');
  });

  it('I4 - retourne 400 si signatureImage absent', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    const POST = await importRoute();
    const res = await POST(
      buildReq({ fullName: 'Jean Dupont' }),
      buildParams(SAMPLE_RESERVATION.id),
    );
    expect(res.status).toBe(400);
  });

  it('I4 - retourne 400 si signatureImage n est pas PNG valide', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    const POST = await importRoute();
    const res = await POST(
      buildReq({
        signatureImage: 'data:image/png;base64,' + 'A'.repeat(40),
        fullName: 'Jean Dupont',
      }),
      buildParams(SAMPLE_RESERVATION.id),
    );
    expect(res.status).toBe(400);
  });

  it('I6 - retourne 404 si reservation introuvable', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([]);
    const POST = await importRoute();
    const res = await POST(
      buildReq({ signatureImage: VALID_PNG_DATA_URL, fullName: 'Jean Dupont' }),
      buildParams('aaaaaaaa-1111-2222-3333-444444444444'),
    );
    expect(res.status).toBe(404);
  });

  it('IDOR closure - retourne 403 si cookie VIP a un sessionId different de la reservation', async () => {
    mockGetVipSession.mockResolvedValue({
      ...VIP_SESSION_OK,
      sessionId: '99999999-9999-9999-9999-999999999999', // autre VIP
    });
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    const POST = await importRoute();
    const res = await POST(
      buildReq({ signatureImage: VALID_PNG_DATA_URL, fullName: 'Jean Dupont' }),
      buildParams(SAMPLE_RESERVATION.id),
    );
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe('forbidden');
  });

  it('IDOR closure - retourne 403 si la reservation n a pas de vipSessionId (legacy)', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    const legacyReservation = { ...SAMPLE_RESERVATION };
    delete (legacyReservation as { vipSessionId?: string }).vipSessionId;
    mockReadReservations.mockResolvedValue([legacyReservation]);
    const POST = await importRoute();
    const res = await POST(
      buildReq({ signatureImage: VALID_PNG_DATA_URL, fullName: 'Jean Dupont' }),
      buildParams(SAMPLE_RESERVATION.id),
    );
    expect(res.status).toBe(403);
  });

  it('I6 - retourne 409 si reservation deja signed', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([{ ...SAMPLE_RESERVATION, status: 'signed' }]);
    const POST = await importRoute();
    const res = await POST(
      buildReq({ signatureImage: VALID_PNG_DATA_URL, fullName: 'Jean Dupont' }),
      buildParams(SAMPLE_RESERVATION.id),
    );
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toBe('already_signed');
  });

  it('I7 - retourne 503 si lock indisponible', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    mockAcquireLock.mockResolvedValue(null);
    const POST = await importRoute();
    const res = await POST(
      buildReq({ signatureImage: VALID_PNG_DATA_URL, fullName: 'Jean Dupont' }),
      buildParams(SAMPLE_RESERVATION.id),
    );
    expect(res.status).toBe(503);
  });

  it('I2 - signature reussie -> 200 + reservation passe a signed + toile a reserved_signed', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    mockReadToiles.mockResolvedValue([SAMPLE_TOILE]);
    const POST = await importRoute();
    const res = await POST(
      buildReq({ signatureImage: VALID_PNG_DATA_URL, fullName: 'Jean Dupont' }),
      buildParams(SAMPLE_RESERVATION.id),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.contractHash).toMatch(/^[a-f0-9]{64}$/);
    expect(body.signedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    // Verify side effects
    expect(mockWriteReservations).toHaveBeenCalledOnce();
    const writtenReservations = mockWriteReservations.mock.calls[0][0] as Array<{
      status: string;
      signatureIp: string;
      contractHash: string;
    }>;
    expect(writtenReservations[0].status).toBe('signed');
    expect(writtenReservations[0].signatureIp).toBe('203.0.113.42');
    expect(writtenReservations[0].contractHash).toBe(body.contractHash);
    expect(mockWriteToiles).toHaveBeenCalledOnce();
    const writtenToiles = mockWriteToiles.mock.calls[0][0] as Array<{ status: string }>;
    expect(writtenToiles[0].status).toBe('reserved_signed');
    // Lock must be released
    expect(mockRelease).toHaveBeenCalled();
  });

  it('Sprint 4 fix - envoie email post-signature avec lien checkout (locale fr par defaut)', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    mockReadToiles.mockResolvedValue([SAMPLE_TOILE]);
    const previousSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3340';
    try {
      const POST = await importRoute();
      const res = await POST(
        buildReq({ signatureImage: VALID_PNG_DATA_URL, fullName: 'Jean Dupont' }),
        buildParams(SAMPLE_RESERVATION.id),
      );
      expect(res.status).toBe(200);
      // Allow the void Promise.allSettled to settle
      await new Promise((r) => setImmediate(r));
      expect(mockSendPostSignatureCheckoutLink).toHaveBeenCalledOnce();
      const arg = mockSendPostSignatureCheckoutLink.mock.calls[0][0];
      expect(arg.to).toBe(SAMPLE_RESERVATION.email);
      expect(arg.buyerName).toBe(SAMPLE_RESERVATION.name);
      expect(arg.canvasTitle).toBe(SAMPLE_TOILE.name);
      expect(arg.reservationId).toBe(SAMPLE_RESERVATION.id);
      expect(arg.checkoutUrl).toBe(
        `http://localhost:3340/fr/vip/reservation/${SAMPLE_RESERVATION.id}/checkout`,
      );
    } finally {
      if (previousSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
      else process.env.NEXT_PUBLIC_SITE_URL = previousSiteUrl;
    }
  });

  it('Sprint 4 fix - email post-signature utilise la locale de accept-language (en)', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    mockReadToiles.mockResolvedValue([SAMPLE_TOILE]);
    const previousSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = 'https://guillaumefarre.com';
    try {
      const POST = await importRoute();
      await POST(
        buildReq(
          { signatureImage: VALID_PNG_DATA_URL, fullName: 'Jean Dupont' },
          { 'accept-language': 'en-US,en;q=0.9' },
        ),
        buildParams(SAMPLE_RESERVATION.id),
      );
      await new Promise((r) => setImmediate(r));
      const arg = mockSendPostSignatureCheckoutLink.mock.calls[0][0];
      expect(arg.checkoutUrl).toBe(
        `https://guillaumefarre.com/en/vip/reservation/${SAMPLE_RESERVATION.id}/checkout`,
      );
    } finally {
      if (previousSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
      else process.env.NEXT_PUBLIC_SITE_URL = previousSiteUrl;
    }
  });
});
