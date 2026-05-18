/**
 * Tests unitaires - /api/admin/login
 *
 * @author Lalou
 * @date 2026-04-17
 *
 * Couvre :
 * - Mot de passe correct → 200 + cookie gf_admin (8h, HttpOnly, SameSite=Lax)
 * - Mot de passe incorrect → 401
 * - Body invalide → 500
 * - Rate limit (5 tentatives / 5 min par IP) → 429
 *
 * Note : requireEnv("ADMIN_PASSWORD") est evalue au top-level du module.
 * Si ADMIN_PASSWORD est absent, le module crash a l'import (fail-fast).
 * Ce comportement est voulu — pas teste directement car l'import throw
 * avant que la route soit atteinte.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

function buildReq(body: unknown, shouldThrowOnJson = false, headers: Record<string, string> = {}) {
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

describe('POST /api/admin/login', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.ADMIN_PASSWORD = 'test_admin_password';
    process.env.MAGIC_LINK_SECRET =
      process.env.MAGIC_LINK_SECRET || 'test-magic-link-secret-admin-login';
  });

  describe('mot de passe correct', () => {
    it('returns 200 with success=true', async () => {
      const POST = await importRoute();
      const res = await POST(
        buildReq({ password: 'test_admin_password' }, false, { 'x-forwarded-for': '10.0.0.1' })
      );

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toEqual({ success: true });
    });

    it('sets gf_admin cookie with HttpOnly and SameSite=Strict (HMAC-signed)', async () => {
      const POST = await importRoute();
      const res = await POST(
        buildReq({ password: 'test_admin_password' }, false, { 'x-forwarded-for': '10.0.0.2' })
      );

      const setCookie = res.headers.get('set-cookie') || '';
      // Le cookie est maintenant HMAC-signe : <base64payload>.<base64sig>
      // (depuis fix securite mai 2026, plus de string litterale 'authenticated').
      expect(setCookie).toMatch(/gf_admin=[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
      expect(setCookie).not.toContain('gf_admin=authenticated');
      expect(setCookie).toContain('HttpOnly');
      expect(setCookie.toLowerCase()).toContain('samesite=strict');
      expect(setCookie).toContain('Path=/');
    });

    it('sets Max-Age to 8 hours (28800 seconds)', async () => {
      const POST = await importRoute();
      const res = await POST(
        buildReq({ password: 'test_admin_password' }, false, { 'x-forwarded-for': '10.0.0.3' })
      );

      const setCookie = res.headers.get('set-cookie') || '';
      expect(setCookie).toMatch(/Max-Age=28800/i);
    });
  });

  describe('mot de passe incorrect', () => {
    it('returns 401 with wrong same-length password', async () => {
      const POST = await importRoute();
      const res = await POST(
        buildReq({ password: 'bad_admin_password__' }, false, { 'x-forwarded-for': '10.0.0.4' })
      );

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.error).toContain('incorrect');
    });

    it('returns 401 with shorter password', async () => {
      const POST = await importRoute();
      const res = await POST(
        buildReq({ password: 'x' }, false, { 'x-forwarded-for': '10.0.0.5' })
      );

      expect(res.status).toBe(401);
    });

    it('returns 401 with empty password', async () => {
      const POST = await importRoute();
      const res = await POST(
        buildReq({ password: '' }, false, { 'x-forwarded-for': '10.0.0.6' })
      );

      expect(res.status).toBe(401);
    });

    it('returns 401 with missing password field', async () => {
      const POST = await importRoute();
      const res = await POST(
        buildReq({}, false, { 'x-forwarded-for': '10.0.0.7' })
      );

      expect(res.status).toBe(401);
    });
  });

  describe('body invalide', () => {
    it('returns 500 when JSON.parse throws', async () => {
      const POST = await importRoute();
      const res = await POST(
        buildReq(null, true, { 'x-forwarded-for': '10.0.0.8' })
      );

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.success).toBe(false);
    });
  });

  describe('rate limiting', () => {
    it('returns 429 after 5 attempts from same IP', async () => {
      const POST = await importRoute();
      const ip = '10.0.0.100';

      for (let i = 0; i < 5; i++) {
        const res = await POST(
          buildReq({ password: 'wrong_password' }, false, { 'x-forwarded-for': ip })
        );
        expect(res.status).toBe(401);
      }

      const res = await POST(
        buildReq({ password: 'test_admin_password' }, false, { 'x-forwarded-for': ip })
      );
      expect(res.status).toBe(429);
      const body = await res.json();
      expect(body.error).toContain('Trop de tentatives');
    });

    it('does NOT rate-limit different IPs', async () => {
      const POST = await importRoute();

      const res = await POST(
        buildReq({ password: 'test_admin_password' }, false, { 'x-forwarded-for': '10.0.0.200' })
      );
      expect(res.status).toBe(200);
    });
  });
});
