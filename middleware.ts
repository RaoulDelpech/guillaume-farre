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
 * Extraire le niveau d'acces depuis le cookie VIP
 * Format : "CODE:level" ou "CODE" (legacy = secret)
 */
function getVipLevel(cookieValue: string): 'hidden' | 'secret' {
  const colonIndex = cookieValue.indexOf(':');
  if (colonIndex > 0) {
    const level = cookieValue.substring(colonIndex + 1);
    if (level === 'hidden' || level === 'secret') return level;
  }
  return 'secret'; // legacy
}

/**
 * Middleware 3 niveaux d'acces :
 * 1. Normal (mot de passe site) — oeuvres publiques, pas de prix
 * 2. Hidden (lien VIP 24h) — toutes les oeuvres, pas de prix
 * 3. Secret (lien VIP 24h) — tout + prix + /toiles
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

  // --- Protection /toiles : seul le niveau 'secret' y accede ---
  if (pathname.match(/\/(fr|en|it)\/toiles/)) {
    if (!hasVipAccess) {
      return NextResponse.redirect(new URL(`/${locale}/vip`, request.url));
    }
    const level = getVipLevel(vipCookie!.value);
    if (level !== 'secret') {
      // Niveau hidden → rediriger vers galerie (pas acces aux toiles/prix)
      return NextResponse.redirect(new URL(`/${locale}/galerie`, request.url));
    }
    return intlMiddleware(request);
  }

  // --- VIP (hidden ou secret) bypass le mode pre-launch ---
  if (hasVipAccess) {
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
