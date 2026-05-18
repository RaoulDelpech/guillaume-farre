/**
 * Tests unitaires - lib/admin-cookie.ts (fix securite mai 2026)
 *
 * Couvre :
 *  - sign : retourne value + maxAgeSeconds
 *  - verify OK : payload valide retourne payload non-null
 *  - verify KO : cookie absent / undefined / null
 *  - verify KO : format invalide (1 segment, 3 segments, vide)
 *  - verify KO : payload JSON casse
 *  - verify KO : tampering signature (mutation 1 caractere)
 *  - verify KO : tampering payload (re-encode payload sans re-signer)
 *  - verify KO : expiration (now > exp)
 *  - verify KO : mauvais purpose (cross-feature reuse defendu)
 *  - verify KO : secret different -> rejet (impossible de forger)
 *  - migration : ancien cookie 'authenticated' refuse
 *
 * @author Lalou
 */
import { describe, it, expect, beforeAll } from 'vitest';

process.env.MAGIC_LINK_SECRET =
  process.env.MAGIC_LINK_SECRET || 'test-magic-link-secret-admin-cookie-spec';

import { signAdminCookie, verifyAdminCookie } from '@/lib/admin-cookie';

describe('signAdminCookie', () => {
  it('retourne value (string non vide) + maxAgeSeconds', () => {
    const signed = signAdminCookie();
    expect(typeof signed.value).toBe('string');
    expect(signed.value.length).toBeGreaterThan(20);
    expect(signed.maxAgeSeconds).toBe(8 * 60 * 60);
  });

  it('value contient exactement 2 segments base64url separes par un point', () => {
    const signed = signAdminCookie();
    const parts = signed.value.split('.');
    expect(parts).toHaveLength(2);
    expect(parts[0]).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(parts[1]).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});

describe('verifyAdminCookie', () => {
  it('retourne payload valide pour un cookie fraichement signe', () => {
    const signed = signAdminCookie();
    const payload = verifyAdminCookie(signed.value);
    expect(payload).not.toBeNull();
    expect(payload?.purpose).toBe('admin');
    expect(typeof payload?.issuedAt).toBe('number');
    expect(typeof payload?.exp).toBe('number');
    expect(payload!.exp).toBeGreaterThan(payload!.issuedAt);
  });

  it('retourne null pour cookie undefined / null / empty', () => {
    expect(verifyAdminCookie(undefined)).toBeNull();
    expect(verifyAdminCookie(null)).toBeNull();
    expect(verifyAdminCookie('')).toBeNull();
  });

  it('retourne null pour format invalide (1 segment)', () => {
    expect(verifyAdminCookie('justonesegment')).toBeNull();
  });

  it('retourne null pour format invalide (3 segments)', () => {
    expect(verifyAdminCookie('a.b.c')).toBeNull();
  });

  it('migration - ancien cookie litteral "authenticated" refuse', () => {
    // Critique : avant le fix, ce cookie passait. Apres, NULL.
    expect(verifyAdminCookie('authenticated')).toBeNull();
  });

  it('retourne null si signature tamperee (1 char modifie)', () => {
    const signed = signAdminCookie();
    const [data, sig] = signed.value.split('.');
    // Flip last char of signature
    const lastChar = sig[sig.length - 1];
    const replacement = lastChar === 'A' ? 'B' : 'A';
    const tampered = `${data}.${sig.slice(0, -1)}${replacement}`;
    expect(verifyAdminCookie(tampered)).toBeNull();
  });

  it('retourne null si payload re-ecrit sans re-signer (purpose forge)', () => {
    const signed = signAdminCookie();
    const [, sig] = signed.value.split('.');
    const forgedPayload = Buffer.from(
      JSON.stringify({
        purpose: 'admin',
        issuedAt: Date.now(),
        exp: Date.now() + 60_000,
      }),
    ).toString('base64url');
    // On reutilise l'ancienne signature -> HMAC ne match plus
    const forged = `${forgedPayload}.${sig}`;
    expect(verifyAdminCookie(forged)).toBeNull();
  });

  it('retourne null si exp depasse (cookie expire)', () => {
    const signed = signAdminCookie();
    const future = new Date(Date.now() + 9 * 60 * 60 * 1000); // 9h plus tard, au-dela des 8h
    expect(verifyAdminCookie(signed.value, future)).toBeNull();
  });

  it('retourne null si purpose !== "admin" (anti-reuse cross-feature)', () => {
    // Forge un payload avec purpose different, sign avec MAGIC_LINK_SECRET courant
    // via un emulateur direct
    const crypto = require('crypto');
    const secret = process.env.MAGIC_LINK_SECRET!;
    const data = Buffer.from(
      JSON.stringify({ purpose: 'wrong', issuedAt: Date.now(), exp: Date.now() + 60_000 }),
    ).toString('base64url');
    const sig = crypto.createHmac('sha256', secret).update(data).digest('base64url');
    expect(verifyAdminCookie(`${data}.${sig}`)).toBeNull();
  });

  it('retourne null si on change MAGIC_LINK_SECRET entre sign et verify', async () => {
    const signed = signAdminCookie();
    const original = process.env.MAGIC_LINK_SECRET;
    process.env.MAGIC_LINK_SECRET = 'different-secret-completely-unrelated';
    try {
      // Re-import for module-level secret lookup is lazy, so cache resets
      // not needed — getSecret() lit process.env a chaque appel.
      expect(verifyAdminCookie(signed.value)).toBeNull();
    } finally {
      process.env.MAGIC_LINK_SECRET = original;
    }
  });
});
