/**
 * Helpers serveur pour la signature electronique des contrats VIP.
 *
 * - decodeSignatureDataUrl : decode une dataURL PNG provenant d'un
 *   <canvas> et renvoie le buffer brut (apres validation du prefixe).
 * - renderSignatureJpeg : convertit le PNG signature en JPEG fond blanc
 *   pour embedding /DCTDecode dans le PDF (sharp).
 * - computeContractIntegrity : calcule SHA256(contenu juridique) +
 *   HMAC(MAGIC_LINK_SECRET, hash) pour preuve d'integrite eIDAS.
 *
 * @author Lalou
 */

import crypto from 'crypto';
import sharp from 'sharp';
import { requireEnv } from './require-env';

const MAGIC_LINK_SECRET = requireEnv('MAGIC_LINK_SECRET');

const PNG_DATA_URL_RE = /^data:image\/png;base64,([A-Za-z0-9+/=\s]+)$/;
const MAX_SIGNATURE_BYTES = 1_500_000; // 1.5 MB max avant conversion JPEG

export interface DecodedSignature {
  pngBuffer: Buffer;
}

export interface RenderedSignatureImage {
  jpegBuffer: Buffer;
  jpegWidth: number;
  jpegHeight: number;
}

export interface ContractLegalContent {
  contractNumber: string;
  date: string;
  paymentMethod: string;
  buyer: {
    name: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
    buyerType: 'particulier' | 'professionnel';
    siret?: string;
    companyName?: string;
  };
  artwork: {
    title: string;
    dimensions: string;
    technique: string;
    year: number;
    price: number;
  };
  signature: {
    fullName: string;
    ip: string;
    userAgent: string;
    timestamp: string;
  };
}

export interface ContractIntegrity {
  contractHash: string;
  contractHmac: string;
}

/**
 * Decode une dataURL PNG. Renvoie null si format invalide.
 * Verifie l'header magique PNG (signature 8 bytes) pour rejeter les
 * dataURL forgees (un attaquant pourrait soumettre un blob arbitraire
 * portant le label image/png).
 */
export function decodeSignatureDataUrl(dataUrl: string): DecodedSignature | null {
  if (typeof dataUrl !== 'string' || dataUrl.length > 4_000_000) return null;
  const match = PNG_DATA_URL_RE.exec(dataUrl);
  if (!match) return null;
  const base64 = match[1].replace(/\s/g, '');
  let pngBuffer: Buffer;
  try {
    pngBuffer = Buffer.from(base64, 'base64');
  } catch {
    return null;
  }
  if (pngBuffer.length === 0 || pngBuffer.length > MAX_SIGNATURE_BYTES) return null;
  // Header PNG : 89 50 4E 47 0D 0A 1A 0A
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  for (let i = 0; i < sig.length; i++) {
    if (pngBuffer[i] !== sig[i]) return null;
  }
  return { pngBuffer };
}

/**
 * Convertit le PNG signature en JPEG (fond blanc, quality 80) pour
 * embedding /DCTDecode dans le PDF. Le JPEG natif PDF evite d'avoir
 * a re-encoder l'image en flate raw RGB.
 */
export async function renderSignatureJpeg(pngBuffer: Buffer): Promise<RenderedSignatureImage> {
  const pipeline = sharp(pngBuffer)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .jpeg({ quality: 80, mozjpeg: false });
  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
  return {
    jpegBuffer: data,
    jpegWidth: info.width,
    jpegHeight: info.height,
  };
}

/**
 * Calcule l'integrite du contrat :
 *   contractHash = SHA256(canonical JSON du contenu legal)
 *   contractHmac = HMAC-SHA256(MAGIC_LINK_SECRET, contractHash)
 *
 * Le canonical JSON trie les cles a chaque niveau pour garantir
 * un hash stable independant de l'ordre d'insertion.
 */
export function computeContractIntegrity(content: ContractLegalContent): ContractIntegrity {
  const canonical = canonicalJson(content);
  const contractHash = crypto.createHash('sha256').update(canonical).digest('hex');
  const contractHmac = crypto
    .createHmac('sha256', MAGIC_LINK_SECRET)
    .update(contractHash)
    .digest('hex');
  return { contractHash, contractHmac };
}

function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map((v) => canonicalJson(v)).join(',')}]`;
  }
  const keys = Object.keys(value as Record<string, unknown>).sort();
  const parts = keys.map((k) => {
    const v = (value as Record<string, unknown>)[k];
    if (v === undefined) return null;
    return `${JSON.stringify(k)}:${canonicalJson(v)}`;
  });
  return `{${parts.filter((p) => p !== null).join(',')}}`;
}

/**
 * Verifie qu'un contractHash a bien ete signe par notre secret
 * (utilise par les tests et la route admin de verification).
 */
export function verifyContractHmac(contractHash: string, contractHmac: string): boolean {
  if (!/^[a-f0-9]{64}$/.test(contractHash)) return false;
  const expected = crypto
    .createHmac('sha256', MAGIC_LINK_SECRET)
    .update(contractHash)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(contractHmac, 'hex'));
  } catch {
    return false;
  }
}

// Lalou
