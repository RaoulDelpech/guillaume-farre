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
 * - Rate limit (10 tentatives / 15 min par IP) → 429
 * - Isolation rate-limit inter-IP (A saturee, B autorisee)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

function buildReq(
  body: unknown,
  shouldThrowOnJson = false,
  headers: Record<string, string> = {}
) {
  return {
    json: async () => {
      if (shouldThrowOnJson) {
        throw new Error('Invalid JSON');
      }
      return body;
    },
    headers: new Headers(headers),
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

  describe('rate limiting', () => {
    it('returns 429 after 10 attempts from same IP in 15min window', async () => {
      const POST = await importRoute();
      const ip = '10.0.0.100';

      // Les 10 premieres tentatives (mauvais password) doivent retourner 401
      for (let i = 0; i < 10; i++) {
        const res = await POST(
          buildReq({ password: 'wrong_password_xxx' }, false, { 'x-forwarded-for': ip })
        );
        expect(res.status).toBe(401);
      }

      // La 11e tentative doit etre bloquee - meme avec le bon password
      const res = await POST(
        buildReq({ password: 'test_site_password' }, false, { 'x-forwarded-for': ip })
      );
      expect(res.status).toBe(429);
      const body = await res.json();
      expect(body.error).toContain('Too many attempts');
    });

    it('isolates rate-limit per IP (A saturated, B still allowed)', async () => {
      const POST = await importRoute();
      const ipA = '10.0.0.201';
      const ipB = '10.0.0.202';

      // Saturer IP A avec 10 tentatives echouees
      for (let i = 0; i < 10; i++) {
        const resA = await POST(
          buildReq({ password: 'wrong_password_xxx' }, false, { 'x-forwarded-for': ipA })
        );
        expect(resA.status).toBe(401);
      }

      // IP A doit etre rate-limited (meme avec bon password)
      const resA11 = await POST(
        buildReq({ password: 'test_site_password' }, false, { 'x-forwarded-for': ipA })
      );
      expect(resA11.status).toBe(429);

      // IP B n'a jamais tente : doit pouvoir se connecter normalement
      const resB = await POST(
        buildReq({ password: 'test_site_password' }, false, { 'x-forwarded-for': ipB })
      );
      expect(resB.status).toBe(200);
    });

    it('counts failed attempts even when service returns 401', async () => {
      const POST = await importRoute();
      const ip = '10.0.0.150';

      // 9 tentatives ratees : toutes passent
      for (let i = 0; i < 9; i++) {
        const res = await POST(
          buildReq({ password: 'wrong_xxxxxxxxxxxxxxx' }, false, { 'x-forwarded-for': ip })
        );
        expect(res.status).toBe(401);
      }

      // 10e tentative : encore 401, pas encore bloquee
      const res10 = await POST(
        buildReq({ password: 'wrong_xxxxxxxxxxxxxxx' }, false, { 'x-forwarded-for': ip })
      );
      expect(res10.status).toBe(401);

      // 11e tentative : bloquee
      const res11 = await POST(
        buildReq({ password: 'wrong_xxxxxxxxxxxxxxx' }, false, { 'x-forwarded-for': ip })
      );
      expect(res11.status).toBe(429);
    });
  });
});
