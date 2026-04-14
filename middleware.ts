import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const AUTH_COOKIE = "gf_auth";
const VALID_LOCALES = ['fr', 'en', 'it'];

// Token unique — DOIT correspondre a celui dans app/api/auth/login/route.ts
const AUTH_TOKEN = "681cb964982c5f2ccc2accaded688f3b";

// Origines autorisées pour les requêtes admin mutantes (CSRF)
const ALLOWED_ORIGINS = [
  'https://guillaumefarre.com',
  'https://www.guillaumefarre.com',
  'http://localhost:3000',
];

// "pre-launch" = site cache (mot de passe), "public" = site ouvert
const SITE_MODE = process.env.SITE_MODE || 'pre-launch';

// APIs accessibles sans auth en mode pre-launch
const PUBLIC_API_ROUTES = ['/api/auth/login', '/api/newsletter/subscribe', '/api/stripe/'];

const intlMiddleware = createMiddleware(routing);

function getLocale(pathname: string): string {
  const segment = pathname.split('/')[1] || 'fr';
  return VALID_LOCALES.includes(segment) ? segment : 'fr';
}

/**
 * Middleware securise — mode pre-launch strict
 *
 * En pre-launch : SEUL le cookie avec le bon token donne acces.
 * Les cookies VIP, les anciens cookies "authenticated" sont ignores.
 * Whitelist stricte : /login, /api/auth/login, /api/newsletter/subscribe, assets.
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

  // Assets et fichiers statiques — toujours accessibles
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images/') ||
    pathname.includes('.')
  ) {
    return intlMiddleware(request);
  }

  // --- Mode pre-launch : verrouillage strict ---
  if (SITE_MODE === 'pre-launch') {
    // APIs publiques whitelistees
    if (pathname.startsWith('/api/')) {
      if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
      }
      // Toute autre API bloquee sans auth
      const authCookie = request.cookies.get(AUTH_COOKIE);
      if (authCookie?.value !== AUTH_TOKEN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.next();
    }

    // Page login toujours accessible
    if (pathname.endsWith('/login')) {
      return intlMiddleware(request);
    }

    // Verifier auth — UNIQUEMENT le nouveau token, PAS "authenticated", PAS VIP
    const authCookie = request.cookies.get(AUTH_COOKIE);
    const isAuthenticated = authCookie?.value === AUTH_TOKEN;

    if (!isAuthenticated) {
      const locale = getLocale(pathname);
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    return intlMiddleware(request);
  }

  // --- Mode public : comportement normal ---

  // API routes — pas de middleware i18n
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Pages toujours accessibles
  if (pathname.endsWith('/login') || pathname.endsWith('/vip')) {
    return intlMiddleware(request);
  }

  // Tout OK en mode public, continuer avec i18n
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)']
};
