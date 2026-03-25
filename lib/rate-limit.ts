/**
 * Rate limiting simple en mémoire (sans dépendances externes)
 *
 * Utilise un Map avec TTL cleanup automatique pour limiter les requêtes
 * par IP sur les endpoints publics (contact, checkout, identity).
 *
 * @author Lalou
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const limits = new Map<string, RateLimitEntry>();

// Cleanup automatique toutes les minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of limits.entries()) {
    if (entry.resetAt < now) {
      limits.delete(key);
    }
  }
}, 60000);

/**
 * Vérifie si une requête dépasse le rate limit
 *
 * @param identifier - Clé unique (généralement IP + endpoint)
 * @param maxRequests - Nombre max de requêtes autorisées
 * @param windowMs - Fenêtre de temps en millisecondes
 * @returns true si rate limit dépassé, false sinon
 */
export function isRateLimited(
  identifier: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = limits.get(identifier);

  if (!entry || entry.resetAt < now) {
    // Nouveau compteur ou expiré
    limits.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return false;
  }

  if (entry.count >= maxRequests) {
    // Limite atteinte
    return true;
  }

  // Incrémenter compteur
  entry.count++;
  return false;
}

/**
 * Helper pour extraire l'IP client de la requête Next.js
 *
 * Gère les proxies (x-forwarded-for, x-real-ip) et fallback localhost.
 */
export function getClientIP(req: Request): string {
  const headers = new Headers(req.headers);

  // Essayer x-forwarded-for (proxy/CDN)
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  // Essayer x-real-ip (nginx)
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback localhost (dev)
  return '127.0.0.1';
}

// Lalou
