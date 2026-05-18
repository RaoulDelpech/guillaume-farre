/**
 * Tests d'integration - GET /api/reservations/[id]/contract (Sprint 4 fix)
 *
 * Strategie : test 100% real-fs. On ecrit/efface un vrai PDF dans
 * `data/contracts/` pour valider que la route lit correctement le fichier,
 * pose les bons headers, et gere les cas d'auth + 404.
 *
 * Couvre 6 cas :
 *  1. Cookie VIP absent / niveau 'normal' -> 401
 *  2. Cookie VIP niveau 'hidden' (pas 'secret') -> 401
 *  3a. Reservation introuvable -> 404 { error: 'not_found' }
 *  3b. ReservationId mal forme (path traversal) -> 404
 *  4. Reservation existe mais PDF absent -> 404 { error: 'contract_not_ready' }
 *  5. Reservation existe + PDF present -> 200 + application/pdf + attachment
 *
 * @author Lalou
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';

process.env.MAGIC_LINK_SECRET = process.env.MAGIC_LINK_SECRET || 'test-secret-sprint4';

const VIP_SESSION_ID = '11111111-2222-3333-4444-555555555555';
const VIP_SESSION_OK = {
  level: 'secret' as const,
  sessionId: VIP_SESSION_ID,
  code: 'AAAAAAAA',
  expiresAt: Date.now() + 60_000,
};

const { mockGetVipSession, mockReadReservations } = vi.hoisted(() => ({
  mockGetVipSession: vi.fn(),
  mockReadReservations: vi.fn(),
}));

vi.mock('@/lib/access', () => ({
  getVipSession: mockGetVipSession,
}));

vi.mock('@/lib/reservations-store', async (orig) => {
  const actual = await (orig() as Promise<typeof import('@/lib/reservations-store')>);
  return {
    ...actual,
    readReservations: mockReadReservations,
  };
});

async function importRoute() {
  const mod = await import('../route');
  return mod.GET;
}

function buildReq() {
  return {} as unknown as Parameters<Awaited<ReturnType<typeof importRoute>>>[0];
}

function buildParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

const SAMPLE_ID = 'test-sprint4-contract-route-aaaa-1111';
const SAMPLE_RESERVATION = {
  id: SAMPLE_ID,
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

const CONTRACTS_DIR = path.join(process.cwd(), 'data', 'contracts');
const CONTRACT_PATH = path.join(CONTRACTS_DIR, `${SAMPLE_ID}.pdf`);
const FAKE_PDF = Buffer.from('%PDF-1.4\n%fake content for sprint4 fix test\n%%EOF\n');

beforeEach(() => {
  mockGetVipSession.mockReset();
  mockReadReservations.mockReset();
});

afterEach(async () => {
  // Ensure each test starts clean
  try {
    await fs.unlink(CONTRACT_PATH);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
  }
});

describe('GET /api/reservations/[id]/contract', () => {
  it('Cas 1 - retourne 401 sans cookie VIP (level normal)', async () => {
    mockGetVipSession.mockResolvedValue(null);
    const GET = await importRoute();
    const res = await GET(buildReq(), buildParams(SAMPLE_ID));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('unauthorized');
  });

  it('Cas 2 - retourne 401 avec niveau hidden (insuffisant)', async () => {
    mockGetVipSession.mockResolvedValue({
      level: 'hidden' as const,
      sessionId: VIP_SESSION_ID,
      code: 'AAAAAAAA',
      expiresAt: Date.now() + 60_000,
    });
    const GET = await importRoute();
    const res = await GET(buildReq(), buildParams(SAMPLE_ID));
    expect(res.status).toBe(401);
  });

  it('Cas 3a - retourne 404 si reservation introuvable', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([]);
    const GET = await importRoute();
    const res = await GET(buildReq(), buildParams(SAMPLE_ID));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('not_found');
  });

  it('Cas 3b - retourne 404 si reservationId mal forme (path traversal)', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    const GET = await importRoute();
    const res = await GET(buildReq(), buildParams('../../etc/passwd'));
    expect(res.status).toBe(404);
  });

  it('Cas 4 - retourne 404 contract_not_ready si PDF absent', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    // No file written -> ENOENT path
    const GET = await importRoute();
    const res = await GET(buildReq(), buildParams(SAMPLE_ID));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('contract_not_ready');
  });

  it('IDOR closure - retourne 403 si cookie VIP a un sessionId different de la reservation', async () => {
    mockGetVipSession.mockResolvedValue({
      ...VIP_SESSION_OK,
      sessionId: '99999999-9999-9999-9999-999999999999', // autre VIP
    });
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    await fs.mkdir(CONTRACTS_DIR, { recursive: true });
    await fs.writeFile(CONTRACT_PATH, FAKE_PDF);
    const GET = await importRoute();
    const res = await GET(buildReq(), buildParams(SAMPLE_ID));
    expect(res.status).toBe(403);
    const body = await (res as Response).json();
    expect(body.error).toBe('forbidden');
  });

  it('IDOR closure - retourne 403 si la reservation n a pas de vipSessionId (legacy)', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    const legacyReservation = { ...SAMPLE_RESERVATION };
    delete (legacyReservation as { vipSessionId?: string }).vipSessionId;
    mockReadReservations.mockResolvedValue([legacyReservation]);
    await fs.mkdir(CONTRACTS_DIR, { recursive: true });
    await fs.writeFile(CONTRACT_PATH, FAKE_PDF);
    const GET = await importRoute();
    const res = await GET(buildReq(), buildParams(SAMPLE_ID));
    expect(res.status).toBe(403);
  });

  it('Cas 5 - retourne 200 + application/pdf + attachment si PDF present', async () => {
    mockGetVipSession.mockResolvedValue(VIP_SESSION_OK);
    mockReadReservations.mockResolvedValue([SAMPLE_RESERVATION]);
    await fs.mkdir(CONTRACTS_DIR, { recursive: true });
    await fs.writeFile(CONTRACT_PATH, FAKE_PDF);
    const GET = await importRoute();
    const res = await GET(buildReq(), buildParams(SAMPLE_ID));
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('application/pdf');
    expect(res.headers.get('content-disposition')).toContain('attachment');
    expect(res.headers.get('content-disposition')).toContain(
      `contrat-vente-${SAMPLE_ID.slice(0, 8)}.pdf`,
    );
    expect(res.headers.get('content-length')).toBe(String(FAKE_PDF.byteLength));
    expect(res.headers.get('cache-control')).toContain('no-store');
    const ab = await res.arrayBuffer();
    expect(new Uint8Array(ab).slice(0, 5)).toEqual(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]));
    expect(ab.byteLength).toBe(FAKE_PDF.byteLength);
  });
});
