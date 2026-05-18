/**
 * Cookie VIP signe (HMAC-SHA256).
 *
 * Format : `CODE:level:sessionId:expiresAt:hmac`
 *   - CODE        : 8 caracteres alphanumeriques upcase
 *   - level       : `hidden` ou `secret`
 *   - sessionId   : UUID v4 (36 chars) genere lors de la validation du code.
 *                   Lie le cookie a une session unique. La reservation creee
 *                   via ce cookie memorise cet sessionId ; les routes
 *                   /sign et /contract verifient que le cookie presente le
 *                   meme sessionId (ferme l'IDOR cross-VIP audite mai 2026).
 *   - expiresAt   : milliseconds epoch (date limite cote serveur)
 *   - hmac        : HMAC-SHA256(MAGIC_LINK_SECRET, `${code}|${level}|${sessionId}|${expiresAt}`)
 *                   encode en base64url, sans padding
 *
 * Le HMAC permet au middleware Edge de verifier le cookie sans lire le
 * disque (Edge runtime n'a pas acces a `fs`). Toute la verification se
 * fait via la Web Crypto API, disponible en Edge et en Node 18+.
 *
 * Format precedent (pre-fix mai 2026) : `CODE:level:expiresAt:hmac` (4 segments).
 * Tous les anciens cookies sont invalides au deploy — les invites VIP doivent
 * re-saisir leur code une fois pour recuperer un cookie avec sessionId.
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
  sessionId: string;
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

// UUID v4 minimal — n'utilise pas le module Node `crypto` pour rester
// compatible avec le runtime Edge (la validation peut etre appelee en
// Edge dans certains contextes futurs ; aujourd'hui /api/vip/validate
// tourne en Node, mais on ne se ferme pas la porte).
function generateSessionId(): string {
  // crypto.randomUUID() est disponible en Web Crypto API (Edge + Node 19+).
  // Fallback : 16 bytes randoms encodes manuellement (peu probable d'arriver).
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

const SESSION_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Construit la valeur du cookie signe pour un code VIP valide.
 * A poser via `Set-Cookie` avec httpOnly, sameSite=lax, secure en prod,
 * maxAge = 24h. Retourne `null` si MAGIC_LINK_SECRET n'est pas configure.
 *
 * Le sessionId est genere ici (UUID v4) et inclus dans le payload signe.
 * Cote serveur, la reservation creee avec ce cookie memorise sessionId,
 * et les routes /sign /contract /checkout verifient que le cookie present
 * porte le meme sessionId (ferme IDOR cross-VIP).
 */
export async function signVipCookie(
  code: string,
  level: VipAccessLevel,
): Promise<{ value: string; maxAgeSeconds: number; sessionId: string } | null> {
  const secret = getSecret();
  if (!secret) return null;
  const upper = code.toUpperCase();
  const sessionId = generateSessionId();
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const message = `${upper}|${level}|${sessionId}|${expiresAt}`;
  const hmac = await hmacSha256Base64Url(secret, message);
  return {
    value: `${upper}:${level}:${sessionId}:${expiresAt}:${hmac}`,
    maxAgeSeconds: COOKIE_MAX_AGE_SECONDS,
    sessionId,
  };
}

/**
 * Verifie un cookie VIP signe. Retourne le payload uniquement si :
 *   - le cookie a 5 segments separes par `:`
 *   - le niveau est valide (`hidden` ou `secret`)
 *   - le sessionId est un UUID v4 bien forme
 *   - expiresAt > now
 *   - le HMAC recalcule est egal au HMAC fourni (comparaison constant-time)
 *
 * Retourne `null` dans tous les autres cas (cookie absent, malforme,
 * expire, signature invalide, ou MAGIC_LINK_SECRET manquant).
 *
 * Les cookies au format 4 segments (pre-fix mai 2026) sont rejetes —
 * pas de backward-compat, les invites doivent re-saisir leur code.
 */
export async function verifyVipCookie(
  cookieValue: string | undefined | null,
): Promise<VipCookiePayload | null> {
  if (!cookieValue) return null;
  const parts = cookieValue.split(':');
  if (parts.length !== 5) return null;
  const [code, level, sessionId, expiresAtStr, hmac] = parts;

  if (!code || code.length !== 8) return null;
  if (level !== 'hidden' && level !== 'secret') return null;
  if (!sessionId || !SESSION_ID_RE.test(sessionId)) return null;

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null;

  const secret = getSecret();
  if (!secret) return null;

  const expected = await hmacSha256Base64Url(
    secret,
    `${code}|${level}|${sessionId}|${expiresAt}`,
  );
  if (!constantTimeEqual(expected, hmac)) return null;

  return { code, level: level as VipAccessLevel, sessionId, expiresAt };
}
