import crypto from "crypto";

// Stocker les tokens valides en mémoire (session serveur)
const validTokens = new Set<string>();

/**
 * Génère un token unique sécurisé
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Ajoute un token aux tokens valides avec expiration automatique
 * @param token Token à ajouter
 * @param expirationMs Durée de validité en millisecondes (défaut: 8 heures)
 */
export function addToken(token: string, expirationMs: number = 8 * 60 * 60 * 1000): void {
  validTokens.add(token);

  // Token expire automatiquement
  setTimeout(() => {
    validTokens.delete(token);
  }, expirationMs);
}

/**
 * Vérifie si un token est valide
 * @param token Token à vérifier
 * @returns true si le token est valide, false sinon
 */
export function verifyAdminToken(token: string | null): boolean {
  if (!token) return false;
  return validTokens.has(token);
}

/**
 * Révoque un token immédiatement
 * @param token Token à révoquer
 */
export function revokeToken(token: string): void {
  validTokens.delete(token);
}

// Lalou
