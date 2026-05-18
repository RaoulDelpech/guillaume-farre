import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { verifyVipCookie, VIP_COOKIE_NAME } from './lib/vip-cookie';
import { isCodeRevoked } from './lib/vip-revocation';
import { ADMIN_COOKIE_NAME, verifyAdminCookie } from './lib/admin-cookie';

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
// `/api/vip/validate` est PUBLIC : c'est la route qui delivre le cookie HMAC
// apres saisie d'un code VIP valide — l'invite n'a pas encore de cookie quand
// il atterrit dessus (chicken-and-egg). La protection contre l'abus repose sur
// (1) la rarete des codes generes (8 chars sans ambiguite),
// (2) leur duree de vie 24h (poly-use pendant cette fenetre, decision Q3),
// (3) la revocation cote serveur (cf. isCodeRevoked dans lib/vip-revocation.ts,
//     applique par isVipCookieAccepted plus bas dans ce meme middleware).
const PUBLIC_API_ROUTES = [
  '/api/auth/login',
  '/api/newsletter/subscribe',
  '/api/stripe/',
  '/api/vip/validate',
];

// APIs accessibles aux VIP authentifies en mode pre-launch (en plus des publiques)
const VIP_API_ROUTES = ['/api/vip/list', '/api/toiles', '/api/reservations'];

// Pages localisees (`/fr/vip`, `/en/vip`, `/it/vip`) qui doivent rester
// accessibles SANS aucun cookie en pre-launch — c'est la porte d'entree VIP.
// On exclut volontairement `/admin/vip` (admin requiert cookie admin).
const VIP_LANDING_PAGE_RE = /^\/(fr|en|it)\/vip$/;

const intlMiddleware = createMiddleware(routing);

function getLocale(pathname: string): string {
  const segment = pathname.split('/')[1] || 'fr';
  return VALID_LOCALES.includes(segment) ? segment : 'fr';
}

/**
 * Helper : verifie qu'un cookie VIP est valide (HMAC signe, non expire)
 * ET que son code n'a pas ete revoque cote serveur. Retourne true si tout
 * est OK, false sinon (cookie absent / malforme / expire / signature
 * invalide / code revoque par l'admin).
 *
 * La verification de revocation lit `data/vip-codes.json` via un cache
 * module-level (TTL 5s) — voir lib/vip-revocation.ts. Necessite que le
 * middleware tourne en runtime Node.js (`experimental.nodeMiddleware`).
 */
async function isVipCookieAccepted(cookieValue: string | undefined): Promise<boolean> {
  const payload = await verifyVipCookie(cookieValue);
  if (!payload) return false;
  if (await isCodeRevoked(payload.code)) return false;
  return true;
}

/**
 * Middleware — mode pre-launch + zone VIP.
 *
 * Runtime : Node.js (`experimental.nodeMiddleware` active dans next.config.mjs).
 * Choix volontaire pour pouvoir lire `data/vip-codes.json` au passage et
 * faire respecter la revocation des codes — un cookie HMAC signe mais
 * dont le code a ete revoque par Guillaume DOIT etre rejete immediatement.
 *
 * En pre-launch : acces autorise si l'une des conditions est remplie :
 *   - cookie `gf_auth` egal a AUTH_SECRET (acces global pre-launch)
 *   - cookie `gf_vip` valide (HMAC signe + code non revoque + non expire)
 *
 * En public : comportement normal, le cookie VIP debloque le contenu
 * enrichi via lib/access.ts (server components). La page /vip et la
 * route /api/vip/validate restent accessibles sans cookie (porte d'entree).
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

      // Routes admin : auth via cookie HMAC `gf_admin` (pose par /api/admin/login).
      // En pre-launch, Guillaume peut se logger admin SANS avoir le cookie
      // gf_auth (qui sert au site public phase 2). Avant ce fix, le middleware
      // exigeait gf_auth pour TOUTES les routes API non-whitelistees, ce qui
      // bloquait Guillaume sur /api/admin/* meme apres login admin valide.
      // Bug visible : panel "Detecter photos similaires" -> 401 systematique.
      if (pathname.startsWith('/api/admin/')) {
        const adminCookie = request.cookies.get(ADMIN_COOKIE_NAME);
        if (verifyAdminCookie(adminCookie?.value) !== null) {
          return NextResponse.next();
        }
        // Pas de cookie admin valide : laisser passer pour que la route elle-meme
        // applique requireAdminAuth() et retourne 401 avec son propre message.
        // (les routes whitelistees comme /api/admin/login doivent atteindre
        // leur handler pour pouvoir poser le cookie HMAC apres validation.)
        return NextResponse.next();
      }

      const authCookie = request.cookies.get(AUTH_COOKIE);
      const hasFullAuth = !!AUTH_TOKEN && authCookie?.value === AUTH_TOKEN;

      // API VIP autorisees aux porteurs d'un cookie VIP valide (ou gf_auth)
      if (VIP_API_ROUTES.some(route => pathname.startsWith(route))) {
        if (hasFullAuth) return NextResponse.next();
        if (await isVipCookieAccepted(request.cookies.get(VIP_COOKIE_NAME)?.value)) {
          return NextResponse.next();
        }
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

    // Page d'entree VIP `/fr/vip` (et locales) — accessible SANS cookie.
    // C'est la porte d'entree : l'invite saisit son code, recoit son cookie
    // HMAC, puis acceder au reste du contenu prive. La page elle-meme reste
    // affichee si l'invite revient avec un cookie HMAC valide (re-entree).
    if (VIP_LANDING_PAGE_RE.test(pathname)) {
      return intlMiddleware(request);
    }

    // Acces pages : gf_auth OU cookie VIP signe
    const authCookie = request.cookies.get(AUTH_COOKIE);
    const isFullyAuthenticated = !!AUTH_TOKEN && authCookie?.value === AUTH_TOKEN;

    if (isFullyAuthenticated) {
      return intlMiddleware(request);
    }

    if (await isVipCookieAccepted(request.cookies.get(VIP_COOKIE_NAME)?.value)) {
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
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
  runtime: 'nodejs',
};
