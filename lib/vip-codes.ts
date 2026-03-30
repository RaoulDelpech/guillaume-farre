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
  used: boolean;
  usedAt?: string;         // ISO
  accessLevel: 'hidden' | 'secret'; // hidden = toutes oeuvres sans prix, secret = tout + prix
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

// Valide un code : verifie existence, expiration, usage
export async function validateVipCode(code: string): Promise<{ valid: boolean; error?: string; accessLevel?: 'hidden' | 'secret' }> {
  const codes = await readCodes();
  const found = codes.find(c => c.code === code.toUpperCase());

  if (!found) {
    return { valid: false, error: 'invalid' };
  }

  if (found.used) {
    return { valid: false, error: 'already_used' };
  }

  if (new Date(found.expiresAt) < new Date()) {
    return { valid: false, error: 'expired' };
  }

  return { valid: true, accessLevel: found.accessLevel || 'secret' };
}

// Marque un code comme utilise
export async function markCodeUsed(code: string): Promise<void> {
  const codes = await readCodes();
  const found = codes.find(c => c.code === code.toUpperCase());

  if (found) {
    found.used = true;
    found.usedAt = new Date().toISOString();
    await writeCodes(codes);
  }
}

// Liste les codes actifs (non-expires)
export async function listActiveCodes(): Promise<VipCode[]> {
  const codes = await readCodes();
  const now = new Date();
  return codes.filter(c => new Date(c.expiresAt) > now);
}
