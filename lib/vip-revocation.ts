import { promises as fs } from 'fs';
import path from 'path';

/**
 * Cache module-level des codes revoques.
 *
 * Lu par le middleware Node.js a chaque verification de cookie VIP.
 * Conserve un Set<string> en memoire pour eviter de re-parser le JSON
 * a chaque requete. Rafraichi au-dela de REVOCATION_CACHE_TTL_MS,
 * ou explicitement via `invalidateRevocationCache()` (appelle par la
 * route /api/admin/vip/revoke apres une revocation).
 *
 * Sur le VPS (PM2 single process), ce cache est partage entre le
 * middleware Node.js et les API routes — pas besoin de Redis/KV.
 *
 * @author Lalou
 */

const VIP_CODES_PATH = path.join(process.cwd(), 'data', 'vip-codes.json');
const REVOCATION_CACHE_TTL_MS = 5000;

interface VipCodeOnDisk {
  code: string;
  revoked?: boolean;
}

let cache: { codes: Set<string>; ts: number } | null = null;

async function loadRevokedSet(): Promise<Set<string>> {
  try {
    const data = await fs.readFile(VIP_CODES_PATH, 'utf-8');
    const arr: VipCodeOnDisk[] = JSON.parse(data);
    const set = new Set<string>();
    for (const c of arr) {
      if (c.revoked) set.add(c.code.toUpperCase());
    }
    return set;
  } catch {
    return new Set();
  }
}

/**
 * Verifie si un code VIP est marque comme revoque dans data/vip-codes.json.
 * Le resultat est mis en cache (TTL 5s) pour eviter une lecture disque
 * sur chaque requete. Retourne false si le fichier est absent / illisible
 * (fail-open : on ne bloque pas le trafic legitime sur une erreur IO).
 */
export async function isCodeRevoked(code: string): Promise<boolean> {
  const now = Date.now();
  if (!cache || now - cache.ts >= REVOCATION_CACHE_TTL_MS) {
    cache = { codes: await loadRevokedSet(), ts: now };
  }
  return cache.codes.has(code.toUpperCase());
}

/**
 * Force le prochain `isCodeRevoked` a relire data/vip-codes.json.
 * A appeler depuis la route admin de revocation pour propager immediatement
 * la decision (sans attendre l'expiration du TTL).
 */
export function invalidateRevocationCache(): void {
  cache = null;
}
