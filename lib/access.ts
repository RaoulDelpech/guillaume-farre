import { cookies } from 'next/headers';
import { verifyVipCookie, VIP_COOKIE_NAME } from './vip-cookie';

export type AccessLevel = 'normal' | 'hidden' | 'secret';

/**
 * Determine le niveau d'acces depuis les cookies.
 * - `normal` : visiteur standard
 * - `hidden` : voit toutes les oeuvres (y compris cachees), pas de prix
 * - `secret` : tout + prix des toiles
 *
 * Format cookie `gf_vip` :
 *   - Nouveau (Sprint 0+) : `CODE:level:expiresAt:hmac` (signe HMAC, voir lib/vip-cookie.ts)
 *   - Legacy : `CODE:level` ou `CODE` — tolere ici pour ne pas casser les sessions
 *     en cours en mode public. Le middleware en pre-launch n'accepte QUE le nouveau format.
 *
 * @author Lalou
 */
export async function getAccessLevel(): Promise<AccessLevel> {
  const cookieStore = await cookies();
  const vipCookie = cookieStore.get(VIP_COOKIE_NAME);
  if (!vipCookie?.value) return 'normal';

  // Cas nominal : cookie HMAC signe et valide
  const payload = await verifyVipCookie(vipCookie.value);
  if (payload) return payload.level;

  // Fallback legacy (mode public uniquement — le middleware filtre deja en pre-launch)
  return parseLegacyAccessLevel(vipCookie.value);
}

/**
 * Parse les anciens formats de cookie (avant Sprint 0).
 * Conserve uniquement pour ne pas deconnecter les VIP qui auraient
 * un cookie de l'ancienne version au moment du deploiement.
 */
function parseLegacyAccessLevel(cookieValue: string): AccessLevel {
  const parts = cookieValue.split(':');
  if (parts.length === 2) {
    const level = parts[1];
    if (level === 'hidden' || level === 'secret') return level;
  }
  if (parts.length === 1) return 'secret';
  return 'normal';
}

/**
 * Extrait le code VIP du cookie (sans le suffixe niveau / signature).
 * Compatible nouveau format HMAC et legacy.
 */
export function parseVipCookieCode(cookieValue: string): string {
  const colonIndex = cookieValue.indexOf(':');
  return colonIndex > 0 ? cookieValue.substring(0, colonIndex) : cookieValue;
}
