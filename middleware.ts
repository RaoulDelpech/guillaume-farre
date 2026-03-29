import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const AUTH_COOKIE = "gf_auth";
const VIP_COOKIE = "gf_vip";
const VALID_LOCALES = ['fr', 'en', 'it'];

// "pre-launch" = site cache (mot de passe), "public" = site ouvert
const SITE_MODE = process.env.SITE_MODE || 'pre-launch';

const intlMiddleware = createMiddleware(routing);

function getLocale(pathname: string): string {
  const segment = pathname.split('/')[1] || 'fr';
  return VALID_LOCALES.includes(segment) ? segment : 'fr';
}

/**
 * Middleware 3 niveaux d'acces :
 * 1. Public (SITE_MODE=public) — tout le monde sauf /toiles
 * 2. Cache (SITE_MODE=pre-launch) — mot de passe requis
 * 3. VIP — code temporaire requis pour /toiles
 *
 * @author Lalou
 */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API routes — pas de middleware i18n ni auth
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Assets et fichiers statiques — juste i18n
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images/') ||
    pathname.includes('.')
  ) {
    return intlMiddleware(request);
  }

  // Pages d'auth toujours accessibles (login + vip entry)
  if (pathname.endsWith('/login') || pathname.endsWith('/vip')) {
    return intlMiddleware(request);
  }

  const locale = getLocale(pathname);
  const authCookie = request.cookies.get(AUTH_COOKIE);
  const isAuthenticated = authCookie?.value === 'authenticated';
  const vipCookie = request.cookies.get(VIP_COOKIE);
  const hasVipAccess = !!vipCookie;

  // --- Protection VIP : /toiles necessite un code VIP ---
  // Verifie AVANT le check pre-launch pour que les VIP puissent acceder
  // sans avoir le mot de passe du site
  if (pathname.match(/\/(fr|en|it)\/toiles/)) {
    if (!hasVipAccess) {
      return NextResponse.redirect(new URL(`/${locale}/vip`, request.url));
    }
    // VIP valide → bypass le check pre-launch pour /toiles
    return intlMiddleware(request);
  }

  // --- Mode pre-launch : tout le site est cache ---
  if (SITE_MODE === 'pre-launch' && !isAuthenticated) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Tout OK, continuer avec i18n
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)']
};
