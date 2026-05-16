/**
 * Tests unitaires des helpers de signature electronique.
 *
 * @author Lalou
 */

import { describe, it, expect, beforeAll } from 'vitest';

beforeAll(() => {
  process.env.MAGIC_LINK_SECRET = process.env.MAGIC_LINK_SECRET || 'test-secret-sprint3';
});

async function loadModule() {
  return await import('../contract-signing');
}

describe('decodeSignatureDataUrl', () => {
  it('accepte un dataURL PNG valide avec header magique correct', async () => {
    const { decodeSignatureDataUrl } = await loadModule();
    // 8 bytes header PNG valides + chunk minimal
    const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
    const dataUrl = `data:image/png;base64,${pngHeader.toString('base64')}`;
    const result = decodeSignatureDataUrl(dataUrl);
    expect(result).not.toBeNull();
    expect(result?.pngBuffer.length).toBe(12);
  });

  it('rejette un dataURL avec prefixe invalide', async () => {
    const { decodeSignatureDataUrl } = await loadModule();
    expect(decodeSignatureDataUrl('data:image/jpeg;base64,abcd')).toBeNull();
    expect(decodeSignatureDataUrl('image/png;base64,abcd')).toBeNull();
  });

  it('rejette un dataURL sans header magique PNG', async () => {
    const { decodeSignatureDataUrl } = await loadModule();
    const fake = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const dataUrl = `data:image/png;base64,${fake.toString('base64')}`;
    expect(decodeSignatureDataUrl(dataUrl)).toBeNull();
  });

  it('rejette un payload trop volumineux', async () => {
    const { decodeSignatureDataUrl } = await loadModule();
    const huge = 'A'.repeat(4_000_100);
    const dataUrl = `data:image/png;base64,${huge}`;
    expect(decodeSignatureDataUrl(dataUrl)).toBeNull();
  });

  it('rejette une chaine vide', async () => {
    const { decodeSignatureDataUrl } = await loadModule();
    expect(decodeSignatureDataUrl('')).toBeNull();
  });
});

describe('computeContractIntegrity + verifyContractHmac', () => {
  const content = {
    contractNumber: 'GF-TEST',
    date: '2026-05-16T10:00:00.000Z',
    paymentMethod: 'integral',
    buyer: {
      name: 'Alice Martin',
      email: 'alice@example.org',
      phone: '+33612345678',
      addressLine1: '1 rue X',
      city: 'Paris',
      postalCode: '75001',
      country: 'FR',
      buyerType: 'particulier' as const,
    },
    artwork: {
      title: 'Toile A',
      dimensions: '50x70',
      technique: 'Acrylique',
      year: 2025,
      price: 1500,
    },
    signature: {
      fullName: 'Alice Martin',
      ip: '127.0.0.1',
      userAgent: 'TestRunner/1.0',
      timestamp: '2026-05-16T10:00:00.000Z',
    },
  };

  it('produit un hash SHA256 hex 64 chars', async () => {
    const { computeContractIntegrity } = await loadModule();
    const { contractHash, contractHmac } = computeContractIntegrity(content);
    expect(contractHash).toMatch(/^[a-f0-9]{64}$/);
    expect(contractHmac).toMatch(/^[a-f0-9]{64}$/);
  });

  it('hash est deterministe sur le meme contenu (sort canonical)', async () => {
    const { computeContractIntegrity } = await loadModule();
    const a = computeContractIntegrity(content);
    const b = computeContractIntegrity(content);
    expect(a.contractHash).toBe(b.contractHash);
    expect(a.contractHmac).toBe(b.contractHmac);
  });

  it('hash change quand UN seul champ change', async () => {
    const { computeContractIntegrity } = await loadModule();
    const a = computeContractIntegrity(content);
    const b = computeContractIntegrity({
      ...content,
      signature: { ...content.signature, ip: '10.0.0.1' },
    });
    expect(a.contractHash).not.toBe(b.contractHash);
  });

  it('verifyContractHmac valide le hash signe par le serveur', async () => {
    const { computeContractIntegrity, verifyContractHmac } = await loadModule();
    const { contractHash, contractHmac } = computeContractIntegrity(content);
    expect(verifyContractHmac(contractHash, contractHmac)).toBe(true);
  });

  it('verifyContractHmac rejette un HMAC altere', async () => {
    const { computeContractIntegrity, verifyContractHmac } = await loadModule();
    const { contractHash, contractHmac } = computeContractIntegrity(content);
    const tamperedHmac = contractHmac.slice(0, -2) + '00';
    expect(verifyContractHmac(contractHash, tamperedHmac)).toBe(false);
  });

  it('verifyContractHmac rejette un hash hors format', async () => {
    const { verifyContractHmac } = await loadModule();
    expect(verifyContractHmac('not-hex', 'aabb')).toBe(false);
    expect(verifyContractHmac('aabb', 'cc'.repeat(32))).toBe(false);
  });
});
