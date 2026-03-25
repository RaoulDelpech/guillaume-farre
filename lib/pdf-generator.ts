/**
 * Générateur de PDF manuel (certificat d'authenticité)
 *
 * Génère un PDF sans dépendances externes en utilisant la syntaxe PDF brute.
 * PDF 1.4 compatible avec tous les lecteurs.
 *
 * @author Lalou
 */

interface CertificateData {
  orderNumber: string;
  customerName: string;
  items: {
    title: string;
    format: string;
    edition?: string;
  }[];
  purchaseDate: string;
  certificateId: string;
}

/**
 * Génère un PDF de certificat d'authenticité
 * @returns Buffer contenant le PDF
 */
export function generateCertificatePDF(data: CertificateData): Buffer {
  const lines: string[] = [];
  let objectNumber = 1;
  const xrefOffsets: number[] = [0]; // Premier offset toujours 0

  // Fonction helper pour ajouter un objet PDF
  const addObject = (content: string): number => {
    const objNum = objectNumber++;
    const offset = lines.join('\n').length;
    xrefOffsets.push(offset);
    lines.push(`${objNum} 0 obj`);
    lines.push(content);
    lines.push('endobj');
    return objNum;
  };

  // Header PDF 1.4
  lines.push('%PDF-1.4');
  lines.push('%âãÏÓ'); // Binary marker pour compatibilité

  // Object 1: Catalog
  const catalogRef = addObject(`<<
  /Type /Catalog
  /Pages 2 0 R
>>`);

  // Object 2: Pages
  const pagesRef = addObject(`<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>`);

  // Construire le contenu de la page (stream)
  const contentLines: string[] = [];

  // Configuration texte
  contentLines.push('BT'); // Begin text

  // TITRE PRINCIPAL
  contentLines.push('/F1 28 Tf'); // Helvetica Bold 28pt
  contentLines.push('100 750 Td'); // Position x=100, y=750
  contentLines.push(`(CERTIFICAT D'AUTHENTICITE) Tj`);

  // Sous-titre anglais
  contentLines.push('/F2 14 Tf'); // Helvetica 14pt
  contentLines.push('0 -25 Td'); // Descendre de 25pt
  contentLines.push('(Certificate of Authenticity) Tj');

  contentLines.push('ET'); // End text

  // Ligne horizontale sous le titre
  contentLines.push('q'); // Save state
  contentLines.push('0.5 w'); // Line width
  contentLines.push('80 710 m'); // Move to x=80, y=710
  contentLines.push('515 710 l'); // Line to x=515, y=710
  contentLines.push('S'); // Stroke
  contentLines.push('Q'); // Restore state

  // Corps du texte
  contentLines.push('BT');
  contentLines.push('/F1 14 Tf'); // Helvetica Bold 14pt
  contentLines.push('80 680 Td');
  contentLines.push('(Guillaume Farre - Artiste Sculpteur) Tj');

  contentLines.push('/F2 12 Tf'); // Helvetica 12pt
  contentLines.push('0 -30 Td');
  contentLines.push('(certifie que l\'oeuvre suivante est une edition originale,) Tj');
  contentLines.push('0 -18 Td');
  contentLines.push('(numerotee et signee :) Tj');

  // Liste des œuvres
  let currentY = 0;
  data.items.forEach((item, index) => {
    currentY -= 35;
    contentLines.push(`0 ${currentY} Td`);
    contentLines.push('/F1 13 Tf');

    // Escape parenthèses dans le titre
    const escapedTitle = item.title.replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    contentLines.push(`(Titre : ${escapedTitle}) Tj`);

    currentY -= 18;
    contentLines.push(`0 ${currentY - (-18)} Td`);
    contentLines.push('/F2 11 Tf');
    contentLines.push(`(Format : ${item.format}) Tj`);

    if (item.edition) {
      currentY -= 18;
      contentLines.push(`0 ${currentY - (-18)} Td`);
      contentLines.push(`(Edition : ${item.edition}) Tj`);
    }
  });

  // Informations acquisition
  currentY -= 35;
  contentLines.push(`0 ${currentY} Td`);
  contentLines.push('/F1 12 Tf');
  const escapedName = data.customerName.replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  contentLines.push(`(Acquise par : ${escapedName}) Tj`);

  currentY -= 20;
  contentLines.push(`0 ${currentY - (-20)} Td`);
  contentLines.push(`(Date d'acquisition : ${formatDateFrench(data.purchaseDate)}) Tj`);

  currentY -= 20;
  contentLines.push(`0 ${currentY - (-20)} Td`);
  contentLines.push(`(Numero de certificat : ${data.certificateId}) Tj`);

  contentLines.push('ET');

  // Ligne horizontale avant la mention légale
  currentY -= 35;
  const lineY = 680 + currentY;
  contentLines.push('q');
  contentLines.push('0.5 w');
  contentLines.push(`80 ${lineY} m`);
  contentLines.push(`515 ${lineY} l`);
  contentLines.push('S');
  contentLines.push('Q');

  // Mention légale
  currentY -= 25;
  contentLines.push('BT');
  contentLines.push('/F2 11 Tf');
  contentLines.push(`80 ${680 + currentY} Td`);
  contentLines.push('(Ce certificat atteste de l\'authenticite de l\'oeuvre et de son caractere original.) Tj');

  currentY -= 30;
  contentLines.push(`0 ${currentY - (-30)} Td`);
  contentLines.push('/F1 12 Tf');
  contentLines.push('(Guillaume Farre) Tj');

  // Footer
  contentLines.push('/F2 9 Tf');
  contentLines.push('80 60 Td');
  const today = new Date().toLocaleDateString('fr-FR');
  contentLines.push(`(guillaumefarre.com - certificat genere le ${today}) Tj`);

  contentLines.push('ET');

  const contentStream = contentLines.join('\n');

  // Object 3: Page
  const pageRef = addObject(`<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 595 842]
  /Contents 4 0 R
  /Resources <<
    /Font <<
      /F1 5 0 R
      /F2 6 0 R
    >>
  >>
>>`);

  // Object 4: Content Stream
  const streamRef = addObject(`<<
  /Length ${contentStream.length}
>>
stream
${contentStream}
endstream`);

  // Object 5: Font Helvetica-Bold
  const fontBoldRef = addObject(`<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica-Bold
>>`);

  // Object 6: Font Helvetica
  const fontRef = addObject(`<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica
>>`);

  // Construire la table XREF
  const xrefStart = lines.join('\n').length;
  lines.push('xref');
  lines.push(`0 ${objectNumber}`);
  lines.push('0000000000 65535 f ');

  for (let i = 1; i < xrefOffsets.length; i++) {
    const offset = xrefOffsets[i].toString().padStart(10, '0');
    lines.push(`${offset} 00000 n `);
  }

  // Trailer
  lines.push('trailer');
  lines.push(`<<
  /Size ${objectNumber}
  /Root 1 0 R
>>`);
  lines.push('startxref');
  lines.push(xrefStart.toString());
  lines.push('%%EOF');

  return Buffer.from(lines.join('\n'), 'utf-8');
}

/**
 * Formate une date ISO en français
 */
function formatDateFrench(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Lalou
