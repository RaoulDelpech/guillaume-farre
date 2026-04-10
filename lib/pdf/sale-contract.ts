/**
 * Generateur PDF - Contrat de vente d'oeuvre d'art
 *
 * @author Lalou
 */

import type { SaleContractData } from './types';
import { formatDateFrench, esc } from './types';

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
