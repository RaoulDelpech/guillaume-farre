/**
 * Tests unitaires - /api/admin/pricing
 *
 * @author Lalou
 * @date 2026-04-17
 *
 * Couvre :
 * - GET sans cookie gf_admin → 401
 * - GET avec cookie invalide → 401
 * - GET avec cookie valide → 200 + { success, formats, standardFormats }
 *
 * Note : cette route n'expose QUE GET (pas de POST). Le prompt initial
 * demandait des tests POST, mais la route n'en fournit pas — documente
 * dans le rapport final.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

process.env.MAGIC_LINK_SECRET =
  process.env.MAGIC_LINK_SECRET || 'test-magic-link-secret-admin-pricing';

import { signAdminCookie } from '@/lib/admin-cookie';

const mockCookiesGet = vi.fn();
function validAdminCookie() {
  return { value: signAdminCookie().value };
}

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ get: mockCookiesGet })),
}));

async function importRoute() {
  const mod = await import('../pricing/route');
  return { GET: mod.GET };
}

describe('GET /api/admin/pricing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('authentification', () => {
    it('returns 401 when cookie gf_admin is missing', async () => {
      mockCookiesGet.mockReturnValue(undefined);

      const { GET } = await importRoute();
      const res = await GET();

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBeDefined();
    });

    it('returns 401 when cookie gf_admin has wrong value', async () => {
      mockCookiesGet.mockReturnValue({ value: 'not-authenticated' });

      const { GET } = await importRoute();
      const res = await GET();

      expect(res.status).toBe(401);
    });

    it('returns 401 when cookie value is empty string', async () => {
      mockCookiesGet.mockReturnValue({ value: '' });

      const { GET } = await importRoute();
      const res = await GET();

      expect(res.status).toBe(401);
    });
  });

  describe('succes', () => {
    it('returns 200 with success=true when authenticated', async () => {
      mockCookiesGet.mockReturnValue(validAdminCookie());

      const { GET } = await importRoute();
      const res = await GET();

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
    });

    it('includes formats object in response', async () => {
      mockCookiesGet.mockReturnValue(validAdminCookie());

      const { GET } = await importRoute();
      const res = await GET();

      const body = await res.json();
      expect(body.formats).toBeDefined();
      expect(typeof body.formats).toBe('object');
    });

    it('includes standardFormats array in response', async () => {
      mockCookiesGet.mockReturnValue(validAdminCookie());

      const { GET } = await importRoute();
      const res = await GET();

      const body = await res.json();
      expect(body.standardFormats).toBeDefined();
      expect(Array.isArray(body.standardFormats)).toBe(true);
    });

    it('formats contains known print sizes (24x36, 40x60, 80x120)', async () => {
      mockCookiesGet.mockReturnValue(validAdminCookie());

      const { GET } = await importRoute();
      const res = await GET();

      const body = await res.json();
      expect(body.formats['24x36']).toBeDefined();
      expect(body.formats['40x60']).toBeDefined();
      expect(body.formats['80x120']).toBeDefined();
    });

    it('each format exposes label, dimensions, price, exemplaires', async () => {
      mockCookiesGet.mockReturnValue(validAdminCookie());

      const { GET } = await importRoute();
      const res = await GET();

      const body = await res.json();
      const format = body.formats['24x36'];
      expect(format.label).toBeDefined();
      expect(format.dimensions).toBeDefined();
      expect(format).toHaveProperty('price');
      expect(format.exemplaires).toBeDefined();
    });
  });
});
