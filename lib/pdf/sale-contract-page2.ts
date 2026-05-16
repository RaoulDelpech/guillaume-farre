/**
 * Contrat de vente PDF - Page 2
 * Retractation, livraison, certificat, garanties, signatures
 *
 * @author Lalou
 */

import type { SaleContractData } from './types';
import { formatDateFrench, esc } from './types';

export function generatePage2Content(data: SaleContractData): string {
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

  return p2.join('\n');
}

// Lalou
