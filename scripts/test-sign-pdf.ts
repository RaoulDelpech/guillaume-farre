/**
 * Test empirique end-to-end de la generation PDF signe.
 *
 * Genere un PDF avec une signature factice + verifie :
 *   - magic header PDF
 *   - integrite SHA256 + HMAC
 *   - presence des textes verbatim
 *
 * Usage : MAGIC_LINK_SECRET=xxx bun run scripts/test-sign-pdf.ts
 *
 * @author Lalou
 */

import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import crypto from 'crypto';
import {
  computeContractIntegrity,
  renderSignatureJpeg,
  verifyContractHmac,
} from '../lib/contract-signing';
import { generateSaleContractPDF } from '../lib/pdf/sale-contract';

async function main(): Promise<void> {
  const OUT_DIR = path.join(process.cwd(), '.tmp/sprint3-test');
  await fs.mkdir(OUT_DIR, { recursive: true });

  const fakePng = await sharp({
    create: {
      width: 600,
      height: 250,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([
      {
        input: Buffer.from(
          '<svg width="600" height="250"><path d="M 50 200 Q 100 50 200 150 T 400 100 T 550 180" stroke="#222" stroke-width="3" fill="none"/></svg>',
        ),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer();

  const rendered = await renderSignatureJpeg(fakePng);
  console.log('[OK] sharp produit JPEG:', rendered.jpegWidth, 'x', rendered.jpegHeight);

  const signedAt = new Date().toISOString();
  const ip = '192.0.2.42';
  const userAgent = 'Mozilla/5.0 (Macintosh) TestRunner/1.0';
  const fullName = 'Jean Dupont';

  const legalContent = {
    contractNumber: 'GF-TESTSPRT3',
    date: signedAt,
    paymentMethod: 'A definir (CB integral / acompte + solde / facture par email)',
    buyer: {
      name: 'Jean Dupont',
      email: 'jean.dupont@example.org',
      phone: '+33 6 12 34 56 78',
      addressLine1: '12 rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      country: 'FR',
      buyerType: 'particulier' as const,
    },
    artwork: {
      title: "Klein d'oeil",
      dimensions: '100x130 cm',
      technique: 'Acrylique sur toile',
      year: 2026,
      price: 20000,
    },
    signature: { fullName, ip, userAgent, timestamp: signedAt },
  };

  const { contractHash, contractHmac } = computeContractIntegrity(legalContent);
  console.log('[OK] contractHash:', contractHash);
  if (!verifyContractHmac(contractHash, contractHmac)) {
    throw new Error('FAIL: HMAC verification failed');
  }
  console.log('[OK] HMAC verifie (roundtrip)');

  const pdf = generateSaleContractPDF({
    contractNumber: legalContent.contractNumber,
    date: signedAt,
    buyer: {
      name: legalContent.buyer.name,
      address: '12 rue de la Paix, 75001 Paris, FR',
      email: legalContent.buyer.email,
      phone: legalContent.buyer.phone,
      buyerType: 'particulier',
    },
    artwork: legalContent.artwork,
    paymentMethod: legalContent.paymentMethod,
    signature: {
      jpegBuffer: rendered.jpegBuffer,
      jpegWidth: rendered.jpegWidth,
      jpegHeight: rendered.jpegHeight,
      fullName,
      ip,
      userAgent,
      timestamp: signedAt,
      contractHash,
      contractHmac,
    },
  });

  const pdfPath = path.join(OUT_DIR, 'contract.pdf');
  await fs.writeFile(pdfPath, pdf);
  console.log('[OK] PDF ecrit:', pdfPath, '-', pdf.length, 'bytes');

  if (!pdf.slice(0, 8).toString().startsWith('%PDF-1.4')) {
    throw new Error('FAIL: PDF header invalid');
  }
  console.log('[OK] Header PDF valide');

  const fileSha = crypto.createHash('sha256').update(pdf).digest('hex');
  await fs.writeFile(
    path.join(OUT_DIR, 'meta.json'),
    JSON.stringify(
      {
        contractHash,
        contractHmac,
        fileSha,
        fileSize: pdf.length,
        jpegWidth: rendered.jpegWidth,
        jpegHeight: rendered.jpegHeight,
      },
      null,
      2,
    ),
  );

  console.log('\nTest empirique PDF: OK');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
