/**
 * Tests unitaires - /api/admin/photos
 *
 * @author Lalou
 * @date 2026-04-17
 *
 * Couvre :
 * - GET sans cookie gf_admin → 401
 * - GET avec cookie gf_admin valide → 200 + liste photos
 * - GET quand mergePhotoData throw → 500
 * - POST sans cookie gf_admin → 401
 * - POST body JSON valide conforme au schema → 200 + savePhotoMetadata appele
 * - POST body non-array → 400
 * - POST body avec item sans filename (champ requis) → 400
 * - POST body avec categories invalide (enum) → 400
 * - POST body avec prototype pollution (__proto__) → schema strip, pas d'impact
 * - POST body > 5 MB → 413
 * - POST JSON malforme → 400
 * - POST quand request.text throw → 500
 * - POST quand savePhotoMetadata throw → 500
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

process.env.MAGIC_LINK_SECRET =
  process.env.MAGIC_LINK_SECRET || 'test-magic-link-secret-admin-photos';

import { signAdminCookie } from '@/lib/admin-cookie';

const mockCookiesGet = vi.fn();
const mockMergePhotoData = vi.fn();
const mockSavePhotoMetadata = vi.fn();
const mockScanAllPhotos = vi.fn();
const mockLoadPhotoMetadata = vi.fn();

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ get: mockCookiesGet })),
}));

vi.mock('@/lib/admin/photo-manager', () => ({
  mergePhotoData: mockMergePhotoData,
  savePhotoMetadata: mockSavePhotoMetadata,
  scanAllPhotos: mockScanAllPhotos,
  loadPhotoMetadata: mockLoadPhotoMetadata,
}));

/**
 * Construit une Request factice pour POST avec support .text().
 *
 * - `body` : objet JS serialise avec JSON.stringify
 * - `rawText` : string brute renvoyee telle quelle (pour tester JSON malforme / body oversize)
 * - `throwOnText` : force `text()` a throw (simule lecture body defaillante)
 */
function buildReq({
  body,
  rawText,
  throwOnText = false,
}: {
  body?: unknown;
  rawText?: string;
  throwOnText?: boolean;
} = {}) {
  return {
    text: async () => {
      if (throwOnText) throw new Error('Text read failed');
      if (rawText !== undefined) return rawText;
      return JSON.stringify(body ?? null);
    },
  } as any;
}

async function importRoute() {
  const mod = await import('../photos/route');
  return { GET: mod.GET, POST: mod.POST };
}

function mockAuthenticatedCookie() {
  // Cookie HMAC-signe (depuis fix securite mai 2026, plus de literal 'authenticated').
  mockCookiesGet.mockReturnValue({ value: signAdminCookie().value });
}

function mockNoCookie() {
  mockCookiesGet.mockReturnValue(undefined);
}

function mockInvalidCookie() {
  mockCookiesGet.mockReturnValue({ value: 'wrong-value' });
}

// Photo valide minimale (tous les champs obligatoires du schema)
const validPhoto = {
  filename: 'photo1.jpg',
  path: '/images/photo1.jpg',
  categories: ['limited'],
  status: null,
  visible: true,
  forSale: true,
};

describe('GET /api/admin/photos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('authentification', () => {
    it('returns 401 when cookie gf_admin is missing', async () => {
      mockNoCookie();

      const { GET } = await importRoute();
      const res = await GET();

      expect(res.status).toBe(401);
      expect(mockMergePhotoData).not.toHaveBeenCalled();
    });

    it('returns 401 when cookie gf_admin has wrong value', async () => {
      mockInvalidCookie();

      const { GET } = await importRoute();
      const res = await GET();

      expect(res.status).toBe(401);
      expect(mockMergePhotoData).not.toHaveBeenCalled();
    });

    it('returns 401 with proper error message', async () => {
      mockNoCookie();

      const { GET } = await importRoute();
      const res = await GET();

      const body = await res.json();
      expect(body.error).toBeDefined();
    });
  });

  describe('succes', () => {
    it('returns 200 with photos list when authenticated', async () => {
      mockAuthenticatedCookie();
      const fakePhotos = [
        { filename: 'photo1.jpg', path: '/images/photo1.jpg', categories: ['limited'], status: null, visible: true, forSale: true },
        { filename: 'photo2.jpg', path: '/images/photo2.jpg', categories: ['unlimited'], status: null, visible: true, forSale: true },
      ];
      mockMergePhotoData.mockResolvedValue(fakePhotos);

      const { GET } = await importRoute();
      const res = await GET();

      expect(res.status).toBe(200);
      expect(mockMergePhotoData).toHaveBeenCalledTimes(1);
      const body = await res.json();
      expect(body).toEqual(fakePhotos);
    });

    it('returns 200 with empty array when no photos', async () => {
      mockAuthenticatedCookie();
      mockMergePhotoData.mockResolvedValue([]);

      const { GET } = await importRoute();
      const res = await GET();

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toEqual([]);
    });
  });

  describe('erreurs', () => {
    it('returns 500 when mergePhotoData throws', async () => {
      mockAuthenticatedCookie();
      mockMergePhotoData.mockRejectedValue(new Error('FS read failed'));

      const { GET } = await importRoute();
      const res = await GET();

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.error).toContain('fetch');
    });
  });
});

describe('POST /api/admin/photos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('authentification', () => {
    it('returns 401 when cookie gf_admin is missing', async () => {
      mockNoCookie();

      const { POST } = await importRoute();
      const res = await POST(buildReq({ body: [validPhoto] }));

      expect(res.status).toBe(401);
      expect(mockSavePhotoMetadata).not.toHaveBeenCalled();
    });

    it('returns 401 when cookie gf_admin has wrong value', async () => {
      mockInvalidCookie();

      const { POST } = await importRoute();
      const res = await POST(buildReq({ body: [] }));

      expect(res.status).toBe(401);
      expect(mockSavePhotoMetadata).not.toHaveBeenCalled();
    });
  });

  describe('succes', () => {
    it('returns 200 and persists photos conforming to schema', async () => {
      mockAuthenticatedCookie();
      mockSavePhotoMetadata.mockResolvedValue(undefined);

      const { POST } = await importRoute();
      const res = await POST(buildReq({ body: [validPhoto] }));

      expect(res.status).toBe(200);
      expect(mockSavePhotoMetadata).toHaveBeenCalledTimes(1);
      // Le schema passe : la photo validee doit etre persistee telle quelle
      expect(mockSavePhotoMetadata).toHaveBeenCalledWith([validPhoto]);
      const body = await res.json();
      expect(body).toEqual({ success: true });
    });

    it('accepts photos with all optional fields populated', async () => {
      mockAuthenticatedCookie();
      mockSavePhotoMetadata.mockResolvedValue(undefined);

      const rich = {
        ...validPhoto,
        title: 'Test',
        year: 2026,
        tags: ['rouge', 'Ferrari F40'],
        description: 'une photo',
        aiGenerated: false,
        material: 'semi-glossy',
        orientation: 'vertical',
        accessLevel: 'public',
        productType: 'photo',
        photoCategory: 'atelier',
        collection: 'Collection Noir',
        priceSigned: 500,
        priceUnsigned: 250,
      };

      const { POST } = await importRoute();
      const res = await POST(buildReq({ body: [rich] }));

      expect(res.status).toBe(200);
      expect(mockSavePhotoMetadata).toHaveBeenCalledTimes(1);
      expect(mockSavePhotoMetadata).toHaveBeenCalledWith([rich]);
    });

    it('accepts an empty array', async () => {
      mockAuthenticatedCookie();
      mockSavePhotoMetadata.mockResolvedValue(undefined);

      const { POST } = await importRoute();
      const res = await POST(buildReq({ body: [] }));

      expect(res.status).toBe(200);
      expect(mockSavePhotoMetadata).toHaveBeenCalledWith([]);
    });
  });

  describe('validation schema', () => {
    it('returns 400 when body is not an array (object)', async () => {
      mockAuthenticatedCookie();

      const { POST } = await importRoute();
      const res = await POST(buildReq({ body: { foo: 'bar' } }));

      expect(res.status).toBe(400);
      expect(mockSavePhotoMetadata).not.toHaveBeenCalled();
      const body = await res.json();
      expect(body.error).toContain('Invalid photo data');
    });

    it('returns 400 when body is not an array (string)', async () => {
      mockAuthenticatedCookie();

      const { POST } = await importRoute();
      const res = await POST(buildReq({ body: 'not-an-array' }));

      expect(res.status).toBe(400);
      expect(mockSavePhotoMetadata).not.toHaveBeenCalled();
    });

    it('returns 400 when body is not an array (number)', async () => {
      mockAuthenticatedCookie();

      const { POST } = await importRoute();
      const res = await POST(buildReq({ body: 42 }));

      expect(res.status).toBe(400);
      expect(mockSavePhotoMetadata).not.toHaveBeenCalled();
    });

    it('returns 400 when item is missing required filename', async () => {
      mockAuthenticatedCookie();

      const invalid = { ...validPhoto } as Record<string, unknown>;
      delete invalid.filename;

      const { POST } = await importRoute();
      const res = await POST(buildReq({ body: [invalid] }));

      expect(res.status).toBe(400);
      expect(mockSavePhotoMetadata).not.toHaveBeenCalled();
      const body = await res.json();
      expect(body.error).toContain('Invalid photo data');
      expect(body.details).toBeDefined();
    });

    it('returns 400 when item is missing required categories', async () => {
      mockAuthenticatedCookie();

      const invalid = { ...validPhoto } as Record<string, unknown>;
      delete invalid.categories;

      const { POST } = await importRoute();
      const res = await POST(buildReq({ body: [invalid] }));

      expect(res.status).toBe(400);
      expect(mockSavePhotoMetadata).not.toHaveBeenCalled();
    });

    it('returns 400 when categories contains an unknown value', async () => {
      mockAuthenticatedCookie();

      const invalid = { ...validPhoto, categories: ['evil-category'] };

      const { POST } = await importRoute();
      const res = await POST(buildReq({ body: [invalid] }));

      expect(res.status).toBe(400);
      expect(mockSavePhotoMetadata).not.toHaveBeenCalled();
    });

    it('returns 400 when visible is a string instead of boolean', async () => {
      mockAuthenticatedCookie();

      const invalid = { ...validPhoto, visible: 'yes' };

      const { POST } = await importRoute();
      const res = await POST(buildReq({ body: [invalid] }));

      expect(res.status).toBe(400);
      expect(mockSavePhotoMetadata).not.toHaveBeenCalled();
    });

    it('returns 400 when prices.unlimited.a4 is not the expected literal (200 != 150)', async () => {
      mockAuthenticatedCookie();

      // Le schema impose z.literal(150) pour prices.unlimited.a4.
      // Un admin ne doit pas pouvoir persister un prix arbitraire.
      const invalid = {
        ...validPhoto,
        prices: {
          unlimited: {
            a4: 200, // Devrait etre 150 (literal)
            a3: 250,
            a2: 400,
          },
        },
      };

      const { POST } = await importRoute();
      const res = await POST(buildReq({ body: [invalid] }));

      expect(res.status).toBe(400);
      expect(mockSavePhotoMetadata).not.toHaveBeenCalled();
      const body = await res.json();
      expect(body.error).toContain('Invalid photo data');
    });

    it('returns 400 when prices.limited.a1 is not the expected literal (999 != 1200)', async () => {
      mockAuthenticatedCookie();

      const invalid = {
        ...validPhoto,
        prices: {
          limited: {
            a3: 500,
            a2: 800,
            a1: 999, // Devrait etre 1200 (literal)
          },
        },
      };

      const { POST } = await importRoute();
      const res = await POST(buildReq({ body: [invalid] }));

      expect(res.status).toBe(400);
      expect(mockSavePhotoMetadata).not.toHaveBeenCalled();
    });

    it('accepts prices.unlimited/limited with exact literal values', async () => {
      mockAuthenticatedCookie();
      mockSavePhotoMetadata.mockResolvedValue(undefined);

      const valid = {
        ...validPhoto,
        prices: {
          unlimited: { a4: 150, a3: 250, a2: 400 },
          limited: { a3: 500, a2: 800, a1: 1200 },
          xxl: 2500,
          monumental: 8000,
        },
      };

      const { POST } = await importRoute();
      const res = await POST(buildReq({ body: [valid] }));

      expect(res.status).toBe(200);
      expect(mockSavePhotoMetadata).toHaveBeenCalledWith([valid]);
    });

    it('strips unknown fields including __proto__ attempts (prototype pollution)', async () => {
      mockAuthenticatedCookie();
      mockSavePhotoMetadata.mockResolvedValue(undefined);

      // JSON.parse ignore deja __proto__ en clef directe (ES spec).
      // On fournit le body via rawText pour conserver la clef litterale et
      // verifier que le schema strip (mode par defaut) evacue les champs inconnus.
      const rawText = JSON.stringify([
        {
          ...validPhoto,
          evilField: { isAdmin: true },
          constructor: { name: 'attack' },
        },
      ]);

      const { POST } = await importRoute();
      const res = await POST(buildReq({ rawText }));

      expect(res.status).toBe(200);
      expect(mockSavePhotoMetadata).toHaveBeenCalledTimes(1);
      // Les champs inconnus doivent avoir ete stripes par zod
      const persistedArg = mockSavePhotoMetadata.mock.calls[0][0];
      expect(persistedArg[0].evilField).toBeUndefined();
      // La valeur 'attack' ne doit pas figurer dans l'objet persiste :
      // prouve que le clef inconnue `constructor` a bien ete stripee.
      expect(JSON.stringify(persistedArg[0])).not.toContain('attack');
    });
  });

  describe('limites taille / format', () => {
    it('returns 413 when body > 5 MB', async () => {
      mockAuthenticatedCookie();

      // 5 MB + 1 char
      const oversize = 'x'.repeat(5 * 1024 * 1024 + 1);

      const { POST } = await importRoute();
      const res = await POST(buildReq({ rawText: oversize }));

      expect(res.status).toBe(413);
      expect(mockSavePhotoMetadata).not.toHaveBeenCalled();
      const body = await res.json();
      expect(body.error).toContain('too large');
    });

    it('returns 400 when JSON is malformed', async () => {
      mockAuthenticatedCookie();

      const { POST } = await importRoute();
      const res = await POST(buildReq({ rawText: '{not valid json}' }));

      expect(res.status).toBe(400);
      expect(mockSavePhotoMetadata).not.toHaveBeenCalled();
      const body = await res.json();
      expect(body.error).toContain('Invalid JSON');
    });
  });

  describe('erreurs internes', () => {
    it('returns 500 when request.text() throws', async () => {
      mockAuthenticatedCookie();

      const { POST } = await importRoute();
      const res = await POST(buildReq({ throwOnText: true }));

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.error).toContain('save');
      expect(mockSavePhotoMetadata).not.toHaveBeenCalled();
    });

    it('returns 500 when savePhotoMetadata throws', async () => {
      mockAuthenticatedCookie();
      mockSavePhotoMetadata.mockRejectedValue(new Error('FS write failed'));

      const { POST } = await importRoute();
      const res = await POST(buildReq({ body: [validPhoto] }));

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.error).toContain('save');
    });
  });
});
