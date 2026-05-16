/**
 * Generateur PDF - Contrat de vente d'oeuvre d'art (orchestrateur)
 *
 * @author Lalou
 */

import type { SaleContractData } from './types';
import { generatePage1Content } from './sale-contract-page1';
import { generatePage2Content } from './sale-contract-page2';

/**
 * Genere un contrat de vente d'oeuvre d'art (2 pages PDF)
 * @returns Buffer contenant le PDF
 */
export function generateSaleContractPDF(data: SaleContractData): Buffer {
  const lines: string[] = [];
  let objectNumber = 1;
  const xrefOffsets: number[] = [0];

  const addObject = (content: string): number => {
    const objNum = objectNumber++;
    const offset = lines.join('\n').length;
    xrefOffsets.push(offset);
    lines.push(`${objNum} 0 obj`);
    lines.push(content);
    lines.push('endobj');
    return objNum;
  };

  // Header
  lines.push('%PDF-1.4');
  lines.push('%\xe2\xe3\xcf\xd3');

  // Catalog -> Pages -> 2 pages
  addObject(`<<\n  /Type /Catalog\n  /Pages 2 0 R\n>>`);
  addObject(`<<\n  /Type /Pages\n  /Kids [3 0 R 4 0 R]\n  /Count 2\n>>`);

  const priceFormatted = new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
  }).format(data.artwork.price);

  const p1Stream = generatePage1Content(data, priceFormatted);
  const p2Stream = generatePage2Content(data);

  // Objects PDF
  // 3: Page 1
  addObject(`<<\n  /Type /Page\n  /Parent 2 0 R\n  /MediaBox [0 0 595 842]\n  /Contents 5 0 R\n  /Resources << /Font << /F1 7 0 R /F2 8 0 R >> >>\n>>`);
  // 4: Page 2
  addObject(`<<\n  /Type /Page\n  /Parent 2 0 R\n  /MediaBox [0 0 595 842]\n  /Contents 6 0 R\n  /Resources << /Font << /F1 7 0 R /F2 8 0 R >> >>\n>>`);
  // 5: Stream page 1
  addObject(`<<\n  /Length ${p1Stream.length}\n>>\nstream\n${p1Stream}\nendstream`);
  // 6: Stream page 2
  addObject(`<<\n  /Length ${p2Stream.length}\n>>\nstream\n${p2Stream}\nendstream`);
  // 7: Font Bold
  addObject(`<<\n  /Type /Font\n  /Subtype /Type1\n  /BaseFont /Helvetica-Bold\n>>`);
  // 8: Font Regular
  addObject(`<<\n  /Type /Font\n  /Subtype /Type1\n  /BaseFont /Helvetica\n>>`);

  // XREF
  const xrefStart = lines.join('\n').length;
  lines.push('xref');
  lines.push(`0 ${objectNumber}`);
  lines.push('0000000000 65535 f ');
  for (let i = 1; i < xrefOffsets.length; i++) {
    lines.push(`${xrefOffsets[i].toString().padStart(10, '0')} 00000 n `);
  }

  lines.push('trailer');
  lines.push(`<<\n  /Size ${objectNumber}\n  /Root 1 0 R\n>>`);
  lines.push('startxref');
  lines.push(xrefStart.toString());
  lines.push('%%EOF');

  return Buffer.from(lines.join('\n'), 'utf-8');
}

// Lalou
