/**
 * Cookie VIP signe (HMAC-SHA256).
 *
 * Format : `CODE:level:expiresAt:hmac`
 *   - CODE        : 8 caracteres alphanumeriques upcase
 *   - level       : `hidden` ou `secret`
 *   - expiresAt   : milliseconds epoch (date limite cote serveur)
 *   - hmac        : HMAC-SHA256(MAGIC_LINK_SECRET, `${code}|${level}|${expiresAt}`)
 *                   encode en base64url, sans padding
 *
 * Le HMAC permet au middleware Edge de verifier le cookie sans lire le
 * disque (Edge runtime n'a pas acces a `fs`). Toute la verification se
 * fait via la Web Crypto API, disponible en Edge et en Node 18+.
 *
 * @author Lalou
 */

export type VipAccessLevel = 'hidden' | 'secret';

export const VIP_COOKIE_NAME = 'gf_vip';

const COOKIE_MAX_AGE_SECONDS = 24 * 60 * 60; // 24h pour Set-Cookie
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h pour expiresAt

export interface VipCookiePayload {
  code: string;
  level: VipAccessLevel;
  expiresAt: number; // ms epoch
}

function getSecret(): string | null {
  const s = process.env.MAGIC_LINK_SECRET;
  if (!s || s.length < 16) return null;
  return s;
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmacSha256Base64Url(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return bufferToBase64Url(sig);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let acc = 0;
  for (let i = 0; i < a.length; i++) acc |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return acc === 0;
}

/**
 * Construit la valeur du cookie signe pour un code VIP valide.
 * A poser via `Set-Cookie` avec httpOnly, sameSite=lax, secure en prod,
 * maxAge = 24h. Retourne `null` si MAGIC_LINK_SECRET n'est pas configure.
 */
export async function signVipCookie(
  code: string,
  level: VipAccessLevel,
): Promise<{ value: string; maxAgeSeconds: number } | null> {
  const secret = getSecret();
  if (!secret) return null;
  const upper = code.toUpperCase();
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const message = `${upper}|${level}|${expiresAt}`;
  const hmac = await hmacSha256Base64Url(secret, message);
  return {
    value: `${upper}:${level}:${expiresAt}:${hmac}`,
    maxAgeSeconds: COOKIE_MAX_AGE_SECONDS,
  };
}

/**
 * Verifie un cookie VIP signe. Retourne le payload uniquement si :
 *   - le cookie a 4 segments separes par `:`
 *   - le niveau est valide (`hidden` ou `secret`)
 *   - expiresAt > now
 *   - le HMAC recalcule est egal au HMAC fourni (comparaison constant-time)
 *
 * Retourne `null` dans tous les autres cas (cookie absent, malforme,
 * expire, signature invalide, ou MAGIC_LINK_SECRET manquant).
 */
export async function verifyVipCookie(
  cookieValue: string | undefined | null,
): Promise<VipCookiePayload | null> {
  if (!cookieValue) return null;
  const parts = cookieValue.split(':');
  if (parts.length !== 4) return null;
  const [code, level, expiresAtStr, hmac] = parts;

  if (!code || code.length !== 8) return null;
  if (level !== 'hidden' && level !== 'secret') return null;

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null;

  const secret = getSecret();
  if (!secret) return null;

  const expected = await hmacSha256Base64Url(secret, `${code}|${level}|${expiresAt}`);
  if (!constantTimeEqual(expected, hmac)) return null;

  return { code, level: level as VipAccessLevel, expiresAt };
}
