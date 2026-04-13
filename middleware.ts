import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const AUTH_COOKIE = "gf_auth";
const VIP_COOKIE = "gf_vip";
const VALID_LOCALES = ['fr', 'en', 'it'];

// Origines autorisées pour les requêtes admin mutantes (CSRF)
const ALLOWED_ORIGINS = [
  'https://guillaumefarre.com',
  'https://www.guillaumefarre.com',
  'http://localhost:3000',
];

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

  // API admin mutantes — vérification CSRF Origin
  if (pathname.startsWith('/api/admin/') && request.method !== 'GET') {
    const origin = request.headers.get('origin');
    if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json(
        { error: 'Forbidden: invalid origin' },
        { status: 403 }
      );
    }
  }

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

  // Pages toujours accessibles (auth + demos temporaires)
  if (pathname.endsWith('/login') || pathname.endsWith('/vip') || pathname.includes('/nav-demo') || pathname.includes('/frame-demo')) {
    return intlMiddleware(request);
  }

  const locale = getLocale(pathname);

  const authCookie = request.cookies.get(AUTH_COOKIE);
  const isAuthenticated = authCookie?.value === 'authenticated';
  const vipCookie = request.cookies.get(VIP_COOKIE);
  const hasVipAccess = !!vipCookie;

  // /toiles — accessible a tous (public = sans prix, VIP secret = avec prix)

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
