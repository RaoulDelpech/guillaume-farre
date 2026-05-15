import { NextResponse } from 'next/server';
import { VIP_COOKIE_NAME } from '@/lib/vip-cookie';

/**
 * Termine la session VIP courante : ecrase le cookie `gf_vip` (HttpOnly,
 * non lisible cote JS) avec une valeur vide et `Max-Age=0`. Le navigateur
 * le supprime immediatement.
 *
 * Pas d'auth requise : n'importe qui peut "sortir" de sa propre session
 * (au pire, on supprime un cookie deja absent — idempotent). Le cookie
 * est `HttpOnly`, donc la suppression ne peut PAS etre faite cote client
 * sans cette route.
 *
 * Dependances middleware :
 * - mode `public` : route accessible directement (toute API passe).
 * - mode `pre-launch` : la route N'EST PAS dans PUBLIC_API_ROUTES. Si on
 *   revient un jour en pre-launch, il faudra l'ajouter ou exiger un cookie
 *   VIP valide pour la consommer. Ce trade-off est documente dans le
 *   rapport Sprint 1 — pas de modification du middleware (Sprint 0 stable).
 *
 * @author Lalou
 */
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(VIP_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
