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

/**
 * Escape les parentheses pour syntaxe PDF
 */
function esc(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

/**
 * Donnees pour contrat de vente d'oeuvre d'art (toile)
 */
export interface SaleContractData {
  contractNumber: string;
  date: string;
  buyer: {
    name: string;
    address?: string;
    email: string;
    phone?: string;
  };
  artwork: {
    title: string;
    dimensions: string;
    technique: string;
    year: number;
    price: number;
  };
  paymentMethod: string;
  depositAmount?: number;
}

/**
 * Genere un contrat de vente d'oeuvre d'art (2 pages PDF)
 * @returns Buffer contenant le PDF
 *
 * @author Lalou
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

  // Catalog → Pages → 2 pages
  addObject(`<<\n  /Type /Catalog\n  /Pages 2 0 R\n>>`);
  addObject(`<<\n  /Type /Pages\n  /Kids [3 0 R 4 0 R]\n  /Count 2\n>>`);

  const priceFormatted = new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
  }).format(data.artwork.price);

  // ---- PAGE 1 ----
  const p1: string[] = [];

  // Titre
  p1.push('BT');
  p1.push('/F1 22 Tf');
  p1.push('80 780 Td');
  p1.push(`(CONTRAT DE VENTE D'OEUVRE D'ART) Tj`);
  p1.push('/F2 10 Tf');
  p1.push('0 -18 Td');
  p1.push(`(Art Sale Agreement) Tj`);
  p1.push('ET');

  // Ligne
  p1.push('q 0.5 w 80 750 m 515 750 l S Q');

  // Ref + date
  p1.push('BT');
  p1.push('/F2 10 Tf');
  p1.push('80 735 Td');
  p1.push(`(Contrat n\\260 ${esc(data.contractNumber)} - Date : ${formatDateFrench(data.date)}) Tj`);
  p1.push('ET');

  // ARTICLE 1 : PARTIES
  let y = 700;
  p1.push('BT');
  p1.push('/F1 13 Tf');
  p1.push(`80 ${y} Td`);
  p1.push('(Article 1 - Identification des parties) Tj');

  y -= 22;
  p1.push('/F1 11 Tf');
  p1.push(`0 -22 Td`);
  p1.push('(LE VENDEUR :) Tj');
  p1.push('/F2 10 Tf');
  y -= 16;
  p1.push('0 -16 Td');
  p1.push('(Guillaume Farre, artiste plasticien) Tj');
  y -= 14;
  p1.push('0 -14 Td');
  p1.push('(Atelier : Toulouse, France) Tj');
  y -= 14;
  p1.push('0 -14 Td');
  p1.push('(SIRET : [A completer]) Tj');
  y -= 14;
  p1.push('0 -14 Td');
  p1.push('(Email : contact@guillaumefarre.com) Tj');

  y -= 22;
  p1.push('/F1 11 Tf');
  p1.push('0 -22 Td');
  p1.push(`(L'ACQUEREUR :) Tj`);
  p1.push('/F2 10 Tf');
  y -= 16;
  p1.push('0 -16 Td');
  p1.push(`(Nom : ${esc(data.buyer.name)}) Tj`);
  if (data.buyer.address) {
    y -= 14;
    p1.push('0 -14 Td');
    p1.push(`(Adresse : ${esc(data.buyer.address)}) Tj`);
  }
  y -= 14;
  p1.push('0 -14 Td');
  p1.push(`(Email : ${esc(data.buyer.email)}) Tj`);
  if (data.buyer.phone) {
    y -= 14;
    p1.push('0 -14 Td');
    p1.push(`(Telephone : ${esc(data.buyer.phone)}) Tj`);
  }

  // ARTICLE 2 : OEUVRE
  y -= 28;
  p1.push('/F1 13 Tf');
  p1.push(`0 -28 Td`);
  p1.push(`(Article 2 - Description de l'oeuvre) Tj`);
  p1.push('/F2 10 Tf');
  y -= 18;
  p1.push('0 -18 Td');
  p1.push(`(Titre : ${esc(data.artwork.title)}) Tj`);
  y -= 14;
  p1.push('0 -14 Td');
  p1.push(`(Dimensions : ${esc(data.artwork.dimensions)}) Tj`);
  y -= 14;
  p1.push('0 -14 Td');
  p1.push(`(Technique : ${esc(data.artwork.technique)}) Tj`);
  y -= 14;
  p1.push('0 -14 Td');
  p1.push(`(Annee de creation : ${data.artwork.year}) Tj`);
  y -= 14;
  p1.push('0 -14 Td');
  p1.push(`(Nature : Piece unique \\(oeuvre originale\\)) Tj`);

  // ARTICLE 3 : PRIX
  y -= 28;
  p1.push('/F1 13 Tf');
  p1.push('0 -28 Td');
  p1.push('(Article 3 - Prix et conditions de paiement) Tj');
  p1.push('/F2 10 Tf');
  y -= 18;
  p1.push('0 -18 Td');
  p1.push(`(Prix de vente TTC : ${esc(priceFormatted)}) Tj`);
  y -= 14;
  p1.push('0 -14 Td');
  p1.push(`(Mode de paiement : ${esc(data.paymentMethod)}) Tj`);
  if (data.depositAmount) {
    const depositFormatted = new Intl.NumberFormat('fr-FR', {
      style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
    }).format(data.depositAmount);
    const remaining = new Intl.NumberFormat('fr-FR', {
      style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
    }).format(data.artwork.price - data.depositAmount);
    y -= 14;
    p1.push('0 -14 Td');
    p1.push(`(Acompte verse : ${esc(depositFormatted)} - Solde restant : ${esc(remaining)}) Tj`);
  }
  y -= 14;
  p1.push('0 -14 Td');
  p1.push('(Le transfert de propriete physique est effectif au paiement integral du prix.) Tj');

  // ARTICLE 4 : PROPRIETE INTELLECTUELLE
  y -= 28;
  p1.push('/F1 13 Tf');
  p1.push('0 -28 Td');
  p1.push('(Article 4 - Propriete intellectuelle) Tj');
  p1.push('/F2 10 Tf');
  y -= 18;
  p1.push('0 -18 Td');
  p1.push(`(L'acquisition de l'oeuvre confere a l'acquereur la propriete du support) Tj`);
  y -= 14;
  p1.push('0 -14 Td');
  p1.push(`(materiel uniquement. Les droits d'auteur \\(droit moral et patrimonial\\)) Tj`);
  y -= 14;
  p1.push('0 -14 Td');
  p1.push(`(restent la propriete exclusive de l'artiste \\(art. L111-1 CPI\\).) Tj`);
  y -= 14;
  p1.push('0 -14 Td');
  p1.push('(Toute reproduction est interdite sans autorisation ecrite prealable.) Tj');

  // Footer page 1
  p1.push('/F2 8 Tf');
  p1.push('250 40 Td');
  p1.push('(Page 1/2) Tj');
  p1.push('ET');

  const p1Stream = p1.join('\n');

  // ---- PAGE 2 ----
  const p2: string[] = [];

  // ARTICLE 5 : RETRACTATION
  p2.push('BT');
  p2.push('/F1 13 Tf');
  p2.push('80 780 Td');
  p2.push('(Article 5 - Droit de retractation) Tj');
  p2.push('/F2 10 Tf');
  p2.push('0 -18 Td');
  p2.push(`(Conformement a l'article L221-18 du Code de la consommation, l'acquereur) Tj`);
  p2.push('0 -14 Td');
  p2.push(`(consommateur dispose d'un delai de 14 jours a compter de la reception de) Tj`);
  p2.push('0 -14 Td');
  p2.push(`(l'oeuvre pour exercer son droit de retractation, sans avoir a justifier de) Tj`);
  p2.push('0 -14 Td');
  p2.push('(motifs ni a payer de penalite.) Tj');
  p2.push('0 -18 Td');
  p2.push(`(L'oeuvre devra etre retournee dans son emballage d'origine, en parfait etat.) Tj`);
  p2.push('0 -14 Td');
  p2.push(`(Les frais de retour sont a la charge de l'acquereur.) Tj`);
  p2.push('0 -14 Td');
  p2.push('(Le remboursement intervient sous 14 jours apres reception du retour.) Tj');

  // ARTICLE 6 : LIVRAISON
  p2.push('/F1 13 Tf');
  p2.push('0 -28 Td');
  p2.push('(Article 6 - Livraison et transport) Tj');
  p2.push('/F2 10 Tf');
  p2.push('0 -18 Td');
  p2.push(`(L'oeuvre sera emballee professionnellement et expediee avec assurance) Tj`);
  p2.push('0 -14 Td');
  p2.push('(transport incluse couvrant la valeur totale de la piece.) Tj');
  p2.push('0 -14 Td');
  p2.push(`(Les risques sont transferes a l'acquereur a la reception.) Tj`);
  p2.push('0 -14 Td');
  p2.push('(Delai estimatif : 7 a 21 jours ouvrables selon destination.) Tj');

  // ARTICLE 7 : CERTIFICAT
  p2.push('/F1 13 Tf');
  p2.push('0 -28 Td');
  p2.push(`(Article 7 - Certificat d'authenticite) Tj`);
  p2.push('/F2 10 Tf');
  p2.push('0 -18 Td');
  p2.push(`(L'oeuvre est accompagnee d'un certificat d'authenticite signe par l'artiste,) Tj`);
  p2.push('0 -14 Td');
  p2.push('(attestant de son caractere original et de sa provenance.) Tj');

  // ARTICLE 8 : GARANTIES
  p2.push('/F1 13 Tf');
  p2.push('0 -28 Td');
  p2.push('(Article 8 - Garanties) Tj');
  p2.push('/F2 10 Tf');
  p2.push('0 -18 Td');
  p2.push(`(L'artiste garantit etre l'unique auteur de l'oeuvre et que celle-ci est) Tj`);
  p2.push('0 -14 Td');
  p2.push('(libre de tout droit de tiers.) Tj');

  // ARTICLE 9 : LOI
  p2.push('/F1 13 Tf');
  p2.push('0 -28 Td');
  p2.push('(Article 9 - Loi applicable) Tj');
  p2.push('/F2 10 Tf');
  p2.push('0 -18 Td');
  p2.push('(Le present contrat est soumis au droit francais.) Tj');
  p2.push('0 -14 Td');
  p2.push('(Tout litige sera porte devant les tribunaux competents de Toulouse.) Tj');

  // SIGNATURES
  p2.push('ET');

  // Ligne separation
  p2.push('q 0.5 w 80 280 m 515 280 l S Q');

  p2.push('BT');
  p2.push('/F1 12 Tf');
  p2.push('80 260 Td');
  p2.push('(Fait en deux exemplaires, a Toulouse) Tj');
  p2.push('/F2 10 Tf');
  p2.push('0 -16 Td');
  p2.push(`(Le ${formatDateFrench(data.date)}) Tj`);
  p2.push('ET');

  // Colonnes signatures
  p2.push('BT');
  p2.push('/F1 11 Tf');
  p2.push('80 215 Td');
  p2.push('(Le Vendeur) Tj');
  p2.push('/F2 10 Tf');
  p2.push('0 -16 Td');
  p2.push('(Guillaume Farre) Tj');
  p2.push('0 -14 Td');
  p2.push('("Lu et approuve") Tj');
  p2.push('ET');

  p2.push('BT');
  p2.push('/F1 11 Tf');
  p2.push(`330 215 Td`);
  p2.push(`(L'Acquereur) Tj`);
  p2.push('/F2 10 Tf');
  p2.push('0 -16 Td');
  p2.push(`(${esc(data.buyer.name)}) Tj`);
  p2.push('0 -14 Td');
  p2.push('("Bon pour accord") Tj');
  p2.push('ET');

  // Footer page 2
  p2.push('BT');
  p2.push('/F2 8 Tf');
  p2.push('80 40 Td');
  p2.push(`(guillaumefarre.com - Contrat ${esc(data.contractNumber)}) Tj`);
  p2.push('250 0 Td');
  p2.push('(Page 2/2) Tj');
  p2.push('ET');

  const p2Stream = p2.join('\n');

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
