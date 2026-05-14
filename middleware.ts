import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { verifyVipCookie, VIP_COOKIE_NAME } from './lib/vip-cookie';

const AUTH_COOKIE = 'gf_auth';
const VALID_LOCALES = ['fr', 'en', 'it'];

// Token d'auth lu depuis env var (doit correspondre au token genere par login/route.ts)
const AUTH_TOKEN = process.env.AUTH_SECRET || null;

// Origines autorisées pour les requêtes admin mutantes (CSRF)
const ALLOWED_ORIGINS = [
  'https://guillaumefarre.com',
  'https://www.guillaumefarre.com',
  'http://localhost:3000',
];

// "pre-launch" = site cache (mot de passe + VIP), "public" = site ouvert
const SITE_MODE = process.env.SITE_MODE || 'pre-launch';

// APIs accessibles sans auth en mode pre-launch
const PUBLIC_API_ROUTES = ['/api/auth/login', '/api/newsletter/subscribe', '/api/stripe/'];

// APIs accessibles aux VIP authentifies en mode pre-launch (en plus des publiques)
const VIP_API_ROUTES = ['/api/vip/validate', '/api/vip/list', '/api/toiles', '/api/reservations'];

const intlMiddleware = createMiddleware(routing);

function getLocale(pathname: string): string {
  const segment = pathname.split('/')[1] || 'fr';
  return VALID_LOCALES.includes(segment) ? segment : 'fr';
}

/**
 * Middleware — mode pre-launch + zone VIP.
 *
 * En pre-launch : acces autorise si l'une des conditions est remplie :
 *   - cookie `gf_auth` egal a AUTH_SECRET (acces global pre-launch)
 *   - cookie `gf_vip` valide (HMAC signe par lib/vip-cookie.ts, non expire)
 *
 * Le cookie VIP est verifie via la Web Crypto API (compatible Edge runtime).
 * On evite ainsi de basculer le middleware en runtime Node.js, ce qui aurait
 * pose des risques de regression avec next-intl. Aucune lecture disque.
 *
 * En public : comportement actuel inchange, le cookie VIP debloque le
 * contenu enrichi via lib/access.ts (server components).
 *
 * @author Lalou
 */
export default async function middleware(request: NextRequest) {
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

  // Redirect /boutique → /galerie (page supprimee)
  if (pathname.endsWith('/boutique')) {
    const locale = getLocale(pathname);
    return NextResponse.redirect(new URL(`/${locale}/galerie`, request.url), 301);
  }

  // Assets et fichiers statiques — toujours accessibles
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images/') ||
    pathname.includes('.')
  ) {
    return intlMiddleware(request);
  }

  // --- Mode pre-launch : auth gf_auth OU cookie VIP signe ---
  if (SITE_MODE === 'pre-launch') {
    // APIs publiques whitelistees
    if (pathname.startsWith('/api/')) {
      if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
      }

      const authCookie = request.cookies.get(AUTH_COOKIE);
      const hasFullAuth = !!AUTH_TOKEN && authCookie?.value === AUTH_TOKEN;

      // API VIP autorisees aux porteurs d'un cookie VIP valide (ou gf_auth)
      if (VIP_API_ROUTES.some(route => pathname.startsWith(route))) {
        if (hasFullAuth) return NextResponse.next();
        const vipPayload = await verifyVipCookie(request.cookies.get(VIP_COOKIE_NAME)?.value);
        if (vipPayload) return NextResponse.next();
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Toute autre API : auth pre-launch obligatoire
      if (!hasFullAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.next();
    }

    // Page login toujours accessible
    if (pathname.endsWith('/login')) {
      return intlMiddleware(request);
    }

    // Acces pages : gf_auth OU cookie VIP signe
    const authCookie = request.cookies.get(AUTH_COOKIE);
    const isFullyAuthenticated = !!AUTH_TOKEN && authCookie?.value === AUTH_TOKEN;

    if (isFullyAuthenticated) {
      return intlMiddleware(request);
    }

    const vipPayload = await verifyVipCookie(request.cookies.get(VIP_COOKIE_NAME)?.value);
    if (vipPayload) {
      return intlMiddleware(request);
    }

    const locale = getLocale(pathname);
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
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
