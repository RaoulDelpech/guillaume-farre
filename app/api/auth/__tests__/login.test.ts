/**
 * Tests unitaires - /api/auth/login (site public)
 *
 * @author Lalou
 * @date 2026-04-17
 *
 * Couvre :
 * - Mot de passe correct → 200 + cookie gf_auth HttpOnly
 * - Mot de passe incorrect → 401
 * - Longueur differente (timingSafeEqual ne throw pas)
 * - Body invalide → 500
 * - SITE_PASSWORD ou AUTH_SECRET manquant → 503
 * - Proprietes du cookie (httpOnly, sameSite, maxAge, path)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

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
  const mod = await import('../login/route');
  return mod.POST;
}

describe('POST /api/auth/login - site public', () => {
  const originalPassword = process.env.SITE_PASSWORD;
  const originalSecret = process.env.AUTH_SECRET;

  beforeEach(() => {
    vi.resetModules();
    process.env.SITE_PASSWORD = 'test_site_password';
    process.env.AUTH_SECRET = 'test_auth_secret';
  });

  afterEach(() => {
    process.env.SITE_PASSWORD = originalPassword;
    process.env.AUTH_SECRET = originalSecret;
  });

  describe('mot de passe correct', () => {
    it('returns 200 with success=true', async () => {
      const POST = await importRoute();
      const res = await POST(buildReq({ password: 'test_site_password' }));

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toEqual({ success: true });
    });

    it('sets gf_auth cookie with HttpOnly and lax SameSite', async () => {
      const POST = await importRoute();
      const res = await POST(buildReq({ password: 'test_site_password' }));

      const setCookie = res.headers.get('set-cookie') || '';
      expect(setCookie).toContain('gf_auth=');
      expect(setCookie).toContain('HttpOnly');
      expect(setCookie.toLowerCase()).toContain('samesite=lax');
      expect(setCookie).toContain('Path=/');
    });

    it('sets cookie value to AUTH_SECRET (opaque token)', async () => {
      const POST = await importRoute();
      const res = await POST(buildReq({ password: 'test_site_password' }));

      const setCookie = res.headers.get('set-cookie') || '';
      expect(setCookie).toContain('gf_auth=test_auth_secret');
    });

    it('sets Max-Age to 30 days (2592000 seconds)', async () => {
      const POST = await importRoute();
      const res = await POST(buildReq({ password: 'test_site_password' }));

      const setCookie = res.headers.get('set-cookie') || '';
      expect(setCookie).toMatch(/Max-Age=2592000/i);
    });
  });

  describe('mot de passe incorrect', () => {
    it('returns 401 with same-length but different password', async () => {
      const POST = await importRoute();
      const res = await POST(buildReq({ password: 'wrong_same_length_xx' }));

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBeDefined();
    });

    it('returns 401 with shorter password (no timingSafeEqual throw)', async () => {
      const POST = await importRoute();
      const res = await POST(buildReq({ password: 'short' }));

      expect(res.status).toBe(401);
    });

    it('returns 401 with longer password', async () => {
      const POST = await importRoute();
      const res = await POST(buildReq({ password: 'this_is_a_much_longer_password_than_expected' }));

      expect(res.status).toBe(401);
    });

    it('returns 401 with empty password', async () => {
      const POST = await importRoute();
      const res = await POST(buildReq({ password: '' }));

      expect(res.status).toBe(401);
    });

    it('returns 401 with missing password field', async () => {
      const POST = await importRoute();
      const res = await POST(buildReq({}));

      expect(res.status).toBe(401);
    });
  });

  describe('body invalide', () => {
    it('returns 500 when JSON.parse throws', async () => {
      const POST = await importRoute();
      const res = await POST(buildReq(null, true));

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.error).toBeDefined();
    });
  });

  describe('env vars manquantes', () => {
    it('returns 503 when SITE_PASSWORD is missing', async () => {
      delete process.env.SITE_PASSWORD;
      vi.resetModules();

      const mod = await import('../login/route');
      const res = await mod.POST(buildReq({ password: 'anything' }));

      expect(res.status).toBe(503);
      const body = await res.json();
      expect(body.error).toContain('not configured');
    });

    it('returns 503 when AUTH_SECRET is missing', async () => {
      delete process.env.AUTH_SECRET;
      vi.resetModules();

      const mod = await import('../login/route');
      const res = await mod.POST(buildReq({ password: 'test_site_password' }));

      expect(res.status).toBe(503);
    });
  });
});
