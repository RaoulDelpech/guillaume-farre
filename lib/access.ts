import { cookies } from 'next/headers';
import { verifyVipCookie, VIP_COOKIE_NAME } from './vip-cookie';

export type AccessLevel = 'normal' | 'hidden' | 'secret';

/**
 * Determine le niveau d'acces depuis les cookies.
 * - `normal` : visiteur standard
 * - `hidden` : voit toutes les oeuvres (y compris cachees), pas de prix
 * - `secret` : tout + prix des toiles
 *
 * Format cookie `gf_vip` accepte : `CODE:level:expiresAt:hmac` (signe HMAC,
 * voir lib/vip-cookie.ts). Aucun fallback legacy : un cookie sans signature
 * HMAC valide est traite comme un visiteur normal — y compris en mode
 * public. Cela ferme le bypass ou un cookie `gf_vip=XXXXXXXX` pose
 * manuellement (DevTools) suffisait a obtenir le niveau secret.
 *
 * @author Lalou
 */
export async function getAccessLevel(): Promise<AccessLevel> {
  const cookieStore = await cookies();
  const vipCookie = cookieStore.get(VIP_COOKIE_NAME);
  if (!vipCookie?.value) return 'normal';

  const payload = await verifyVipCookie(vipCookie.value);
  if (payload) return payload.level;

  return 'normal';
}
