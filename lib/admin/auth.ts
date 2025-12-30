import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const COOKIE_NAME = 'gf_auth';
const COOKIE_VALUE = 'authenticated';

/**
 * Vérifie si l'utilisateur est authentifié comme admin
 * @returns true si authentifié, false sinon
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(COOKIE_NAME);
    return authCookie?.value === COOKIE_VALUE;
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
