import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Cookie d'authentification admin.
 *
 * IMPORTANT : ce cookie est DISTINCT de `gf_auth` (cookie site public).
 * Le cookie `gf_auth` ne donne AUCUN acces aux routes admin.
 * Seul `gf_admin` (pose par /api/admin/login apres validation ADMIN_PASSWORD)
 * permet d'acceder aux routes `/api/admin/*`.
 */
const ADMIN_COOKIE_NAME = 'gf_admin';
const ADMIN_COOKIE_VALUE = 'authenticated';

/**
 * Vérifie si l'utilisateur est authentifié comme admin.
 *
 * @returns true si le cookie `gf_admin` est présent et valide
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(ADMIN_COOKIE_NAME);
    return authCookie?.value === ADMIN_COOKIE_VALUE;
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
