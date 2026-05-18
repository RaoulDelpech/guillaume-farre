import { cookies } from 'next/headers';
import { verifyVipCookie, VIP_COOKIE_NAME, type VipCookiePayload } from './vip-cookie';
import { isCodeRevoked } from './vip-revocation';

export type AccessLevel = 'normal' | 'hidden' | 'secret';

export interface VipSession {
  level: 'hidden' | 'secret';
  sessionId: string;
  code: string;
  expiresAt: number;
}

/**
 * Lit + verifie le cookie VIP signe et retourne la session complete.
 *
 * Retourne `null` si :
 *   - cookie absent / malforme / signature invalide / expire
 *   - code revoque cote serveur (cache 5s, cf. lib/vip-revocation.ts)
 *   - MAGIC_LINK_SECRET manquant
 *
 * Sinon retourne le payload (level, sessionId, code, expiresAt).
 *
 * Le sessionId est utilise pour fermer l'IDOR cross-VIP (audit mai 2026) :
 * les routes /sign et /contract verifient que `reservation.vipSessionId ===
 * session.sessionId` — un VIP qui presente son cookie mais visite la
 * reservation d'un autre VIP sera rejete en 403.
 *
 * @author Lalou
 */
export async function getVipSession(): Promise<VipSession | null> {
  const cookieStore = await cookies();
  const vipCookie = cookieStore.get(VIP_COOKIE_NAME);
  if (!vipCookie?.value) return null;

  const payload: VipCookiePayload | null = await verifyVipCookie(vipCookie.value);
  if (!payload) return null;

  if (await isCodeRevoked(payload.code)) return null;

  return {
    level: payload.level,
    sessionId: payload.sessionId,
    code: payload.code,
    expiresAt: payload.expiresAt,
  };
}

/**
 * Determine le niveau d'acces depuis les cookies.
 * - `normal` : visiteur standard
 * - `hidden` : voit toutes les oeuvres (y compris cachees), pas de prix
 * - `secret` : tout + prix des toiles
 *
 * Format cookie `gf_vip` accepte : `CODE:level:sessionId:expiresAt:hmac` (signe
 * HMAC, voir lib/vip-cookie.ts). Aucun fallback legacy : un cookie sans
 * signature HMAC valide est traite comme un visiteur normal — y compris
 * en mode public. Cela ferme le bypass ou un cookie `gf_vip=XXXXXXXX` pose
 * manuellement (DevTools) suffisait a obtenir le niveau secret.
 *
 * Revocation : meme si le HMAC est valide, on rejette tout cookie dont le
 * code a ete revoque cote serveur (cf. lib/vip-revocation.ts, cache 5s,
 * fail-open sur erreur IO). Sans ce check, un cookie deja emis continuait
 * a debloquer les prix pendant 24h en mode public, meme apres revocation.
 *
 * @author Lalou
 */
export async function getAccessLevel(): Promise<AccessLevel> {
  const session = await getVipSession();
  if (!session) return 'normal';
  return session.level;
}
