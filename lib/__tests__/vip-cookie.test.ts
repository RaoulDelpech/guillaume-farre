/**
 * Tests unitaires - lib/vip-cookie.ts (fix securite mai 2026 - liaison sessionId)
 *
 * Couvre :
 *  - sign genere un sessionId UUID v4 distinct a chaque appel
 *  - sign genere une value au format 5 segments (CODE:level:sessionId:expiresAt:hmac)
 *  - verify retourne payload incluant sessionId
 *  - verify refuse les anciens cookies 4 segments (format pre-fix)
 *  - verify refuse un sessionId mal forme
 *  - verify refuse signature tamperee
 *  - verify refuse signature recalculee SANS le sessionId (verifie que le
 *    sessionId est bien inclus dans le payload HMAC)
 *
 * @author Lalou
 */
import { describe, it, expect } from 'vitest';

process.env.MAGIC_LINK_SECRET =
  process.env.MAGIC_LINK_SECRET || 'test-magic-link-secret-vip-cookie-spec';

import { signVipCookie, verifyVipCookie } from '@/lib/vip-cookie';

describe('signVipCookie + verifyVipCookie - liaison sessionId', () => {
  it('signe un cookie avec 5 segments dont un sessionId UUID v4', async () => {
    const signed = await signVipCookie('ABCD1234', 'secret');
    expect(signed).not.toBeNull();
    const value = signed!.value;
    const parts = value.split(':');
    expect(parts).toHaveLength(5);
    // sessionId est le 3e segment
    expect(parts[2]).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(signed!.sessionId).toBe(parts[2]);
  });

  it('genere un sessionId distinct a chaque appel (uniqueness)', async () => {
    const a = await signVipCookie('ABCD1234', 'secret');
    const b = await signVipCookie('ABCD1234', 'secret');
    expect(a!.sessionId).not.toBe(b!.sessionId);
  });

  it('verifie un cookie fraichement signe et retourne sessionId', async () => {
    const signed = await signVipCookie('ABCD1234', 'secret');
    const payload = await verifyVipCookie(signed!.value);
    expect(payload).not.toBeNull();
    expect(payload?.code).toBe('ABCD1234');
    expect(payload?.level).toBe('secret');
    expect(payload?.sessionId).toBe(signed!.sessionId);
    expect(payload?.expiresAt).toBeGreaterThan(Date.now());
  });

  it('migration - rejette les anciens cookies 4 segments (pre-fix)', async () => {
    // Simule un ancien cookie : CODE:level:expiresAt:hmac (4 segments).
    // Meme si on calcule un HMAC techniquement valide pour cet ancien format,
    // verifyVipCookie doit rejeter car le format n'a plus 5 segments.
    const legacy = 'ABCD1234:secret:9999999999999:somehmac';
    expect(await verifyVipCookie(legacy)).toBeNull();
  });

  it('rejette un sessionId mal forme', async () => {
    // Force un cookie avec sessionId qui n'est pas un UUID v4
    const signed = await signVipCookie('ABCD1234', 'secret');
    const parts = signed!.value.split(':');
    parts[2] = 'not-a-uuid';
    expect(await verifyVipCookie(parts.join(':'))).toBeNull();
  });

  it('rejette une signature tamperee', async () => {
    const signed = await signVipCookie('ABCD1234', 'secret');
    const parts = signed!.value.split(':');
    const sig = parts[4];
    parts[4] = sig.slice(0, -1) + (sig[sig.length - 1] === 'A' ? 'B' : 'A');
    expect(await verifyVipCookie(parts.join(':'))).toBeNull();
  });

  it('rejette si on swap le sessionId (signature ne couvre pas la nouvelle valeur)', async () => {
    const a = await signVipCookie('ABCD1234', 'secret');
    const b = await signVipCookie('ABCD1234', 'secret');
    // Composite : prendre la signature de A mais le sessionId de B
    const partsA = a!.value.split(':');
    const partsB = b!.value.split(':');
    const composite = [partsA[0], partsA[1], partsB[2], partsA[3], partsA[4]].join(':');
    expect(await verifyVipCookie(composite)).toBeNull();
  });
});
