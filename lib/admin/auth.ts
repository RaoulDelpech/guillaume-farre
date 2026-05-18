import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminCookie } from '@/lib/admin-cookie';

/**
 * Cookie d'authentification admin.
 *
 * IMPORTANT : ce cookie est DISTINCT de `gf_auth` (cookie site public).
 * Le cookie `gf_auth` ne donne AUCUN acces aux routes admin.
 * Seul `gf_admin` (pose par /api/admin/login apres validation ADMIN_PASSWORD)
 * permet d'acceder aux routes `/api/admin/*`.
 *
 * Depuis fix securite mai 2026 : le cookie est signe HMAC-SHA256 avec
 * MAGIC_LINK_SECRET (cf. lib/admin-cookie.ts). L'ancienne valeur statique
 * `'authenticated'` est INVALIDE — toute session admin doit etre re-emise
 * via /api/admin/login.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(ADMIN_COOKIE_NAME);
    return verifyAdminCookie(authCookie?.value) !== null;
  } catch {
    return false;
  }
}

/**
 * Réponse 401 Unauthorized standard
 */
export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Non autorisé. Connectez-vous d\'abord.' },
    { status: 401 }
  );
}

/**
 * Helper pour protéger une route API admin
 * Usage:
 * ```
 * export async function GET() {
 *   const authError = await requireAdminAuth();
 *   if (authError) return authError;
 *   // ... reste du code
 * }
 * ```
 */
export async function requireAdminAuth(): Promise<NextResponse | null> {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return unauthorizedResponse();
  }
  return null;
}
