/**
 * Cookie admin signe (HMAC-SHA256).
 *
 * Format : `base64url(JSON(payload)).hmacBase64Url`
 *   - payload : { purpose: 'admin', issuedAt: <ms>, exp: <ms> }
 *   - hmac    : HMAC-SHA256(MAGIC_LINK_SECRET, base64url(JSON(payload)))
 *               encode en base64url
 *
 * Pourquoi un cookie HMAC plutot qu'une string statique ?
 *   - Avant le fix securite : `gf_admin=authenticated` litteral en clair.
 *     N'importe quel client pouvait forger le cookie via DevTools et
 *     acceder a toutes les routes /api/admin/*.
 *   - Apres : seule la session legitime, qui a passe le check de mot de
 *     passe ADMIN_PASSWORD, possede un cookie signe avec MAGIC_LINK_SECRET.
 *     Toute valeur forgee echoue la verification HMAC constant-time.
 *
 * Le secret reutilise `MAGIC_LINK_SECRET` (deja config pour magic-link /
 * vip-cookie / balance-token). Acces lazy via `getSecret()` pour eviter les
 * pieges de top-level env-loading.
 *
 * Runtime : Node.js uniquement (utilise crypto natif). Les routes admin
 * ne tournent jamais en Edge runtime.
 *
 * @author Lalou
 */
import crypto from 'crypto';

export const ADMIN_COOKIE_NAME = 'gf_admin';
export const ADMIN_COOKIE_PURPOSE = 'admin' as const;

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8h (alignee sur ancien maxAge)

export interface AdminCookiePayload {
  purpose: typeof ADMIN_COOKIE_PURPOSE;
  issuedAt: number;
  exp: number;
}

function getSecret(): string {
  const secret = process.env.MAGIC_LINK_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('MAGIC_LINK_SECRET is not configured (or shorter than 16 chars)');
  }
  return secret;
}

function hmac(data: string): string {
  return crypto.createHmac('sha256', getSecret()).update(data).digest('base64url');
}

/**
 * Signe un cookie admin valide 8h. Appele par /api/admin/login apres
 * verification timingSafeEqual du mot de passe.
 */
export function signAdminCookie(): { value: string; maxAgeSeconds: number } {
  const issuedAt = Date.now();
  const exp = issuedAt + TOKEN_TTL_MS;
  const payload: AdminCookiePayload = {
    purpose: ADMIN_COOKIE_PURPOSE,
    issuedAt,
    exp,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = hmac(data);
  return {
    value: `${data}.${signature}`,
    maxAgeSeconds: Math.floor(TOKEN_TTL_MS / 1000),
  };
}

/**
 * Verifie un cookie admin signe. Retourne le payload uniquement si :
 *   - format `<data>.<signature>` (2 segments)
 *   - HMAC recalcule constant-time-egal au HMAC fourni
 *   - payload JSON parseable
 *   - purpose === 'admin' (anti-reuse cross-feature)
 *   - exp > now
 *
 * Toute autre situation -> null (cookie absent / forge / expire / mauvais
 * secret). Important : aucun fallback string-egal sur 'authenticated' —
 * la migration invalide tous les anciens cookies en clair (decision Q3,
 * lecon audit hostile mai 2026).
 */
export function verifyAdminCookie(
  cookieValue: string | undefined | null,
  now: Date = new Date(),
): AdminCookiePayload | null {
  if (!cookieValue || typeof cookieValue !== 'string') return null;
  const parts = cookieValue.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  const [data, signature] = parts;

  let expected: string;
  try {
    expected = hmac(data);
  } catch {
    return null;
  }
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

  let payload: AdminCookiePayload;
  try {
    payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
  } catch {
    return null;
  }

  if (
    !payload ||
    typeof payload !== 'object' ||
    payload.purpose !== ADMIN_COOKIE_PURPOSE ||
    typeof payload.issuedAt !== 'number' ||
    typeof payload.exp !== 'number'
  ) {
    return null;
  }

  if (now.getTime() > payload.exp) return null;

  return payload;
}
