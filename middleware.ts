import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const COOKIE_NAME = "gf_auth";

const intlMiddleware = createMiddleware(routing);

/**
 * Middleware avec protection mot de passe simple
 * @author Lalou
 * @date 2025-11-30
 */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API routes - pas de middleware i18n ni auth
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Routes publiques (pas besoin d'auth mais besoin i18n)
  if (
    pathname.endsWith('/login') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images/') ||
    pathname.includes('.')
  ) {
    return intlMiddleware(request);
  }

  // Vérifier le cookie d'authentification
  const authCookie = request.cookies.get(COOKIE_NAME);

  if (!authCookie || authCookie.value !== 'authenticated') {
    // Rediriger vers login avec la bonne locale
    const locale = pathname.split('/')[1] || 'fr';
    const validLocales = ['fr', 'en', 'it'];
    const targetLocale = validLocales.includes(locale) ? locale : 'fr';
    return NextResponse.redirect(new URL(`/${targetLocale}/login`, request.url));
  }

  // Utilisateur authentifié, continuer avec le middleware i18n
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)']
};
