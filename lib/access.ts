import { cookies } from 'next/headers';

export type AccessLevel = 'normal' | 'hidden' | 'secret';

const VIP_COOKIE = 'gf_vip';

/**
 * Determine le niveau d'acces depuis les cookies
 * - normal : visiteur standard (mot de passe site)
 * - hidden : voit toutes les oeuvres (y compris cachees), pas de prix
 * - secret : tout + prix des toiles (lien 24h)
 *
 * Format cookie gf_vip : "CODE:level" ou "CODE" (legacy = secret)
 *
 * @author Lalou
 */
export async function getAccessLevel(): Promise<AccessLevel> {
  const cookieStore = await cookies();
  const vipCookie = cookieStore.get(VIP_COOKIE);

  if (!vipCookie?.value) return 'normal';

  // Format : "CODE:level"
  const colonIndex = vipCookie.value.indexOf(':');
  if (colonIndex > 0) {
    const level = vipCookie.value.substring(colonIndex + 1);
    if (level === 'hidden' || level === 'secret') return level;
  }

  // Legacy codes sans niveau = secret
  return 'secret';
}

/**
 * Extrait le code VIP du cookie (sans le suffixe niveau)
 */
export function parseVipCookieCode(cookieValue: string): string {
  const colonIndex = cookieValue.indexOf(':');
  return colonIndex > 0 ? cookieValue.substring(0, colonIndex) : cookieValue;
}
