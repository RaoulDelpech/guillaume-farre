import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

// Caracteres sans ambiguite (pas de 0/O/I/L/1)
const CHARSET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 8;
const CODE_DURATION_MS = 24 * 60 * 60 * 1000; // 24h

export interface VipCode {
  code: string;
  createdAt: string;       // ISO
  expiresAt: string;       // ISO (createdAt + 24h)
  /** @deprecated conserve pour compat backward, plus utilise depuis Sprint 0 — poly-use 24h Q3 */
  used: boolean;
  /** @deprecated conserve pour compat backward, plus utilise depuis Sprint 0 — poly-use 24h Q3 */
  usedAt?: string;         // ISO
  accessLevel: 'hidden' | 'secret'; // hidden = toutes oeuvres sans prix, secret = tout + prix
  revoked?: boolean;       // Code force-revoque par Guillaume (cookie HMAC valide rejete par middleware)
  revokedAt?: string;      // ISO de la revocation
}

const VIP_CODES_PATH = path.join(process.cwd(), 'data', 'vip-codes.json');

async function readCodes(): Promise<VipCode[]> {
  try {
    const data = await fs.readFile(VIP_CODES_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeCodes(codes: VipCode[]): Promise<void> {
  const dataDir = path.join(process.cwd(), 'data');
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(VIP_CODES_PATH, JSON.stringify(codes, null, 2), 'utf-8');
}

export function generateVipCode(): string {
  const bytes = crypto.randomBytes(CODE_LENGTH);
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CHARSET[bytes[i] % CHARSET.length];
  }
  return code;
}

// Cree un nouveau code VIP, nettoie les expires, et retourne le code
export async function createVipCode(accessLevel: 'hidden' | 'secret' = 'secret'): Promise<VipCode> {
  const codes = await readCodes();

  // Nettoyer les codes expires (plus de 48h)
  const cutoff = Date.now() - (2 * CODE_DURATION_MS);
  const cleaned = codes.filter(c => new Date(c.createdAt).getTime() > cutoff);

  const now = new Date();
  const newCode: VipCode = {
    code: generateVipCode(),
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + CODE_DURATION_MS).toISOString(),
    used: false,
    accessLevel,
  };

  cleaned.push(newCode);
  await writeCodes(cleaned);

  return newCode;
}

// Valide un code : verifie existence et expiration. Poly-use 24h (Q3) :
// le code reste valide tant qu'il n'est pas expire et pas revoque, peu
// importe le nombre de fois qu'il a deja servi a poser un cookie HMAC.
export async function validateVipCode(code: string): Promise<{ valid: boolean; error?: string; accessLevel?: 'hidden' | 'secret' }> {
  const codes = await readCodes();
  const found = codes.find(c => c.code === code.toUpperCase());

  if (!found) {
    return { valid: false, error: 'invalid' };
  }

  if (new Date(found.expiresAt) < new Date()) {
    return { valid: false, error: 'expired' };
  }

  return { valid: true, accessLevel: found.accessLevel || 'secret' };
}

// Liste les codes actifs (non-expires)
export async function listActiveCodes(): Promise<VipCode[]> {
  const codes = await readCodes();
  const now = new Date();
  return codes.filter(c => new Date(c.expiresAt) > now);
}

// Revoque un code : marque revoked: true + revokedAt.
// Effet : le middleware Node.js rejettera tout cookie HMAC associe a ce code
// au prochain rafraichissement du cache de revocation (max 5s).
// Retourne true si le code existait, false sinon.
export async function revokeCode(code: string): Promise<boolean> {
  const codes = await readCodes();
  const target = code.toUpperCase();
  const found = codes.find(c => c.code === target);
  if (!found) return false;
  if (found.revoked) return true; // deja revoque, idempotent
  found.revoked = true;
  found.revokedAt = new Date().toISOString();
  await writeCodes(codes);
  return true;
}
