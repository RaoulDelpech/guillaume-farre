/**
 * Generateur PDF - Contrat de vente d'oeuvre d'art (orchestrateur)
 *
 * Si `data.signature` est fourni :
 *   - l'image JPEG du signataire est embarquee en page 2 comme XObject /Image
 *   - le footer eIDAS technique est imprime en pied de page 2
 *
 * @author Lalou
 */

import type { SaleContractData } from './types';
import { generatePage1Content } from './sale-contract-page1';
import { generatePage2Content } from './sale-contract-page2';

const SIGNATURE_IMAGE_NAME = 'SigImg';

/**
 * Genere un contrat de vente d'oeuvre d'art (2 pages PDF).
 * Le PDF est entierement assemble en binary buffer (pas de dependance lib PDF).
 */
export function generateSaleContractPDF(data: SaleContractData): Buffer {
  const chunks: Buffer[] = [];
  let cursor = 0;
  const xrefOffsets: number[] = [];

  const pushText = (text: string): void => {
    const buf = Buffer.from(text, 'binary');
    chunks.push(buf);
    cursor += buf.length;
  };
  const pushBytes = (buf: Buffer): void => {
    chunks.push(buf);
    cursor += buf.length;
  };
  const recordOffset = (): void => {
    xrefOffsets.push(cursor);
  };

  pushText('%PDF-1.4\n');
  pushText('%\xe2\xe3\xcf\xd3\n');

  const hasSignature = !!data.signature;

  const objects: Array<() => void> = [];

  objects.push(() => pushText('1 0 obj\n<<\n  /Type /Catalog\n  /Pages 2 0 R\n>>\nendobj\n'));
  objects.push(() => pushText('2 0 obj\n<<\n  /Type /Pages\n  /Kids [3 0 R 4 0 R]\n  /Count 2\n>>\nendobj\n'));

  const priceFormatted = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(data.artwork.price);

  const p1Stream = generatePage1Content(data, priceFormatted);
  const p2Stream = generatePage2Content(data);

  // Page 1
  objects.push(() =>
    pushText(
      `3 0 obj\n<<\n  /Type /Page\n  /Parent 2 0 R\n  /MediaBox [0 0 595 842]\n  /Contents 5 0 R\n  /Resources << /Font << /F1 7 0 R /F2 8 0 R >> >>\n>>\nendobj\n`,
    ),
  );

  // Page 2 — inclut /XObject si signature presente
  const page2Resources = hasSignature
    ? `<< /Font << /F1 7 0 R /F2 8 0 R >> /XObject << /${SIGNATURE_IMAGE_NAME} 9 0 R >> >>`
    : `<< /Font << /F1 7 0 R /F2 8 0 R >> >>`;
  objects.push(() =>
    pushText(
      `4 0 obj\n<<\n  /Type /Page\n  /Parent 2 0 R\n  /MediaBox [0 0 595 842]\n  /Contents 6 0 R\n  /Resources ${page2Resources}\n>>\nendobj\n`,
    ),
  );

  // Stream page 1
  objects.push(() => {
    const stream = Buffer.from(p1Stream, 'binary');
    pushText(`5 0 obj\n<<\n  /Length ${stream.length}\n>>\nstream\n`);
    pushBytes(stream);
    pushText('\nendstream\nendobj\n');
  });

  // Stream page 2
  objects.push(() => {
    const stream = Buffer.from(p2Stream, 'binary');
    pushText(`6 0 obj\n<<\n  /Length ${stream.length}\n>>\nstream\n`);
    pushBytes(stream);
    pushText('\nendstream\nendobj\n');
  });

  // Fonts — encoding WinAnsi explicite (CP1252) pour rendre € (0x80), ° (0xB0),
  // et tous les accents latin-1 utilises dans les noms acquereurs etrangers.
  // Sans cet attribut les fonts Type1 retombent sur StandardEncoding qui ignore
  // 0x80-0xFF, provoquant des glyphes parasites ou silencieusement absents.
  objects.push(() =>
    pushText(
      '7 0 obj\n<<\n  /Type /Font\n  /Subtype /Type1\n  /BaseFont /Helvetica-Bold\n  /Encoding /WinAnsiEncoding\n>>\nendobj\n',
    ),
  );
  objects.push(() =>
    pushText(
      '8 0 obj\n<<\n  /Type /Font\n  /Subtype /Type1\n  /BaseFont /Helvetica\n  /Encoding /WinAnsiEncoding\n>>\nendobj\n',
    ),
  );

  // Signature XObject (object 9)
  if (hasSignature && data.signature) {
    const { jpegBuffer, jpegWidth, jpegHeight } = data.signature;
    objects.push(() => {
      pushText(
        `9 0 obj\n<<\n  /Type /XObject\n  /Subtype /Image\n  /Width ${jpegWidth}\n  /Height ${jpegHeight}\n  /ColorSpace /DeviceRGB\n  /BitsPerComponent 8\n  /Filter /DCTDecode\n  /Length ${jpegBuffer.length}\n>>\nstream\n`,
      );
      pushBytes(jpegBuffer);
      pushText('\nendstream\nendobj\n');
    });
  }

  // Ecrit les objets sequentiellement et capture leurs offsets.
  for (const writeObj of objects) {
    recordOffset();
    writeObj();
  }

  const xrefStart = cursor;
  const objectCount = objects.length + 1;
  pushText('xref\n');
  pushText(`0 ${objectCount}\n`);
  pushText('0000000000 65535 f \n');
  for (const off of xrefOffsets) {
    pushText(`${off.toString().padStart(10, '0')} 00000 n \n`);
  }

  pushText('trailer\n');
  pushText(`<<\n  /Size ${objectCount}\n  /Root 1 0 R\n>>\n`);
  pushText('startxref\n');
  pushText(`${xrefStart}\n`);
  pushText('%%EOF\n');

  return Buffer.concat(chunks);
}

// Lalou
