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
 * - POST avec cookie + body JSON valide → 200 + success=true + savePhotoMetadata appele
 * - POST quand request.json throw → 500
 * - POST quand savePhotoMetadata throw → 500
 *
 * Note : la route POST accepte un body JSON (pas FormData) et retourne 200 (pas 201).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

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

function buildReq(body: unknown, shouldThrowOnJson = false) {
  return {
    json: async () => {
      if (shouldThrowOnJson) {
        throw new Error('Invalid JSON');
      }
      return body;
    },
  } as any;
}

async function importRoute() {
  const mod = await import('../photos/route');
  return { GET: mod.GET, POST: mod.POST };
}

function mockAuthenticatedCookie() {
  mockCookiesGet.mockReturnValue({ value: 'authenticated' });
}

function mockNoCookie() {
  mockCookiesGet.mockReturnValue(undefined);
}

function mockInvalidCookie() {
  mockCookiesGet.mockReturnValue({ value: 'wrong-value' });
}

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
      const res = await POST(buildReq([{ filename: 'a.jpg' }]));

      expect(res.status).toBe(401);
      expect(mockSavePhotoMetadata).not.toHaveBeenCalled();
    });

    it('returns 401 when cookie gf_admin has wrong value', async () => {
      mockInvalidCookie();

      const { POST } = await importRoute();
      const res = await POST(buildReq([]));

      expect(res.status).toBe(401);
      expect(mockSavePhotoMetadata).not.toHaveBeenCalled();
    });
  });

  describe('succes', () => {
    it('returns 200 with success=true when body is valid JSON array', async () => {
      mockAuthenticatedCookie();
      mockSavePhotoMetadata.mockResolvedValue(undefined);
      const photos = [
        { filename: 'photo1.jpg', path: '/images/photo1.jpg', categories: ['limited'], status: null, visible: true, forSale: true },
      ];

      const { POST } = await importRoute();
      const res = await POST(buildReq(photos));

      expect(res.status).toBe(200);
      expect(mockSavePhotoMetadata).toHaveBeenCalledWith(photos);
      const body = await res.json();
      expect(body).toEqual({ success: true });
    });

    it('passes received photos unchanged to savePhotoMetadata', async () => {
      mockAuthenticatedCookie();
      mockSavePhotoMetadata.mockResolvedValue(undefined);
      const photos = [
        {
          filename: 'x.jpg',
          path: '/x.jpg',
          categories: ['unlimited'],
          status: 'to-sort',
          visible: false,
          forSale: false,
          title: 'Test',
          year: 2026,
        },
      ];

      const { POST } = await importRoute();
      await POST(buildReq(photos));

      expect(mockSavePhotoMetadata).toHaveBeenCalledWith(photos);
    });

    it('accepts an empty array', async () => {
      mockAuthenticatedCookie();
      mockSavePhotoMetadata.mockResolvedValue(undefined);

      const { POST } = await importRoute();
      const res = await POST(buildReq([]));

      expect(res.status).toBe(200);
      expect(mockSavePhotoMetadata).toHaveBeenCalledWith([]);
    });
  });

  describe('erreurs', () => {
    it('returns 500 when request.json throws', async () => {
      mockAuthenticatedCookie();

      const { POST } = await importRoute();
      const res = await POST(buildReq(null, true));

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.error).toContain('save');
      expect(mockSavePhotoMetadata).not.toHaveBeenCalled();
    });

    it('returns 500 when savePhotoMetadata throws', async () => {
      mockAuthenticatedCookie();
      mockSavePhotoMetadata.mockRejectedValue(new Error('FS write failed'));

      const { POST } = await importRoute();
      const res = await POST(buildReq([{ filename: 'a.jpg' }]));

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.error).toContain('save');
    });
  });
});
