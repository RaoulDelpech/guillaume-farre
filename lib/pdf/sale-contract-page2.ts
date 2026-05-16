/**
 * Contrat de vente PDF - Page 2
 * Conditions juridiques + zone signature + footer eIDAS technique.
 * Conforme FLOW_VIP_2026-05.md section 6 (page 2 + footer).
 *
 * Textes verbatim respectes pour :
 *  - qualification arrhes (art. 1590 Code civil)
 *  - frais de gestion forfaitaires 300 EUR post-14j
 *  - mention eIDAS Reglement (UE) 910/2014 + art. 1367 Code civil
 *
 * @author Lalou
 */

import type { SaleContractData } from './types';
import { formatDateFrench, esc } from './types';

const SIGNATURE_IMAGE_NAME = 'SigImg';
const SIG_X = 330;
const SIG_Y = 110;
const SIG_W = 200;
const SIG_H = 80;

const ARRHES_TEXT_LINES = [
  'Les sommes versees a la signature du present contrat constituent',
  'des arrhes au sens de l\'article 1590 du Code civil. Au-dela du delai',
  'legal de retractation de 14 jours, en cas de renonciation de',
  'l\'acheteur, lesdites arrhes resteront acquises au vendeur.',
];

const FRAIS_TEXT_LINES = [
  'En cas de retractation au-dela des 14 jours legaux, une indemnite',
  'forfaitaire de 300 EUR sera retenue au titre des frais de gestion,',
  'frais bancaires non recuperables et preparation du certificat.',
];

const EIDAS_MENTION = [
  'Ce document constitue une signature electronique simple au sens',
  'du Reglement eIDAS (UE) n\\260910/2014 et de l\'article 1367',
  'du Code civil.',
];

export function generatePage2Content(data: SaleContractData): string {
  const p: string[] = [];
  const hasSignature = !!data.signature;

  // Article 5 - Garantie authenticite
  p.push('BT');
  p.push('/F1 13 Tf');
  p.push('80 780 Td');
  p.push(`(Article 5 - Garantie d'authenticite) Tj`);
  p.push('/F2 10 Tf');
  p.push('0 -18 Td');
  p.push(`(L'artiste garantit etre l'unique auteur de l'oeuvre et qu'elle est libre) Tj`);
  p.push('0 -14 Td');
  p.push(`(de tout droit de tiers. Un certificat d'authenticite distinct sera) Tj`);
  p.push('0 -14 Td');
  p.push(`(remis apres paiement integral du prix.) Tj`);

  // Article 6 - Droit de retractation
  p.push('/F1 13 Tf');
  p.push('0 -26 Td');
  p.push('(Article 6 - Droit de retractation \\(14 jours\\)) Tj');
  p.push('/F2 10 Tf');
  p.push('0 -18 Td');
  p.push(`(Conformement aux articles L221-18 et suivants du Code de la consommation,) Tj`);
  p.push('0 -14 Td');
  p.push(`(l'acquereur consommateur dispose d'un delai de 14 jours pour exercer son) Tj`);
  p.push('0 -14 Td');
  p.push(`(droit de retractation. Le present article s'applique aux acheteurs) Tj`);
  p.push('0 -14 Td');
  p.push(`(particuliers uniquement et non aux professionnels.) Tj`);

  // Article 7 - Arrhes (TEXTE VERBATIM)
  p.push('/F1 13 Tf');
  p.push('0 -26 Td');
  p.push('(Article 7 - Qualification des sommes versees \\(arrhes\\)) Tj');
  p.push('/F2 10 Tf');
  for (const line of ARRHES_TEXT_LINES) {
    p.push('0 -14 Td');
    p.push(`(${esc(line)}) Tj`);
  }

  // Article 8 - Frais 300 EUR (TEXTE VERBATIM)
  p.push('/F1 13 Tf');
  p.push('0 -22 Td');
  p.push('(Article 8 - Frais de gestion forfaitaires post-14j) Tj');
  p.push('/F2 10 Tf');
  for (const line of FRAIS_TEXT_LINES) {
    p.push('0 -14 Td');
    p.push(`(${esc(line)}) Tj`);
  }

  // Article 9 - Retrait et transport
  p.push('/F1 13 Tf');
  p.push('0 -22 Td');
  p.push('(Article 9 - Mode de retrait et risque transport) Tj');
  p.push('/F2 10 Tf');
  p.push('0 -16 Td');
  p.push(`(Mode de retrait : a l'atelier de l'artiste \\(Toulouse\\) ou livraison) Tj`);
  p.push('0 -14 Td');
  p.push(`(professionnelle sur devis distinct. Les risques liees au transport sont) Tj`);
  p.push('0 -14 Td');
  p.push(`(a la charge de l'acquereur des sortie de l'atelier.) Tj`);

  // Article 10 - Loi & Juridiction
  p.push('/F1 13 Tf');
  p.push('0 -22 Td');
  p.push('(Article 10 - Loi applicable et juridiction) Tj');
  p.push('/F2 10 Tf');
  p.push('0 -16 Td');
  p.push(`(Le present contrat est soumis au droit francais. Tout litige sera) Tj`);
  p.push('0 -14 Td');
  p.push(`(porte devant le tribunal competent de Paris.) Tj`);

  p.push('ET');

  // Ligne separation signatures
  p.push('q 0.5 w 80 220 m 515 220 l S Q');

  p.push('BT');
  p.push('/F1 11 Tf');
  p.push('80 200 Td');
  p.push(`(Fait a Toulouse, le ${formatDateFrench(data.date)}) Tj`);
  p.push('ET');

  // Colonne signature vendeur
  p.push('BT');
  p.push('/F1 11 Tf');
  p.push('80 170 Td');
  p.push('(Le Vendeur) Tj');
  p.push('/F2 9 Tf');
  p.push('0 -14 Td');
  p.push(`(${esc('Guillaume Farre')}) Tj`);
  p.push('0 -12 Td');
  p.push('(\\(Lu et approuve\\)) Tj');
  p.push('ET');

  // Colonne signature acheteur
  p.push('BT');
  p.push('/F1 11 Tf');
  p.push('330 170 Td');
  p.push(`(L'Acquereur) Tj`);
  p.push('/F2 9 Tf');
  p.push('0 -14 Td');
  if (hasSignature && data.signature) {
    p.push(`(${esc(data.signature.fullName)}) Tj`);
  } else {
    p.push(`(${esc(data.buyer.name)}) Tj`);
  }
  p.push('0 -12 Td');
  p.push('(\\(Bon pour accord\\)) Tj');
  p.push('ET');

  // Image signature embarquee (si presente)
  if (hasSignature) {
    p.push('q');
    p.push(`${SIG_W} 0 0 ${SIG_H} ${SIG_X} ${SIG_Y} cm`);
    p.push(`/${SIGNATURE_IMAGE_NAME} Do`);
    p.push('Q');
  }

  // Footer eIDAS technique
  if (hasSignature && data.signature) {
    const sig = data.signature;
    const ua = sig.userAgent.slice(0, 80);

    p.push('q 0.3 w 80 90 m 515 90 l S Q');

    p.push('BT');
    p.push('/F1 8 Tf');
    p.push('80 80 Td');
    p.push('(SIGNATURE ELECTRONIQUE - METADONNEES TECHNIQUES) Tj');
    p.push('/F2 7 Tf');
    p.push('0 -10 Td');
    p.push(`(IP : ${esc(sig.ip)}  -  Horodatage UTC : ${esc(sig.timestamp)}) Tj`);
    p.push('0 -9 Td');
    p.push(`(User-Agent : ${esc(ua)}) Tj`);
    p.push('0 -9 Td');
    p.push(`(SHA256 : ${esc(sig.contractHash)}) Tj`);
    p.push('0 -9 Td');
    p.push(`(HMAC : ${esc(sig.contractHmac)}) Tj`);
    p.push('0 -10 Td');
    p.push(`(${esc(EIDAS_MENTION[0])}) Tj`);
    p.push('0 -9 Td');
    p.push(`(${EIDAS_MENTION[1]}) Tj`);
    p.push('0 -9 Td');
    p.push(`(${esc(EIDAS_MENTION[2])}) Tj`);
    p.push('ET');
  } else {
    p.push('BT');
    p.push('/F2 8 Tf');
    p.push('80 40 Td');
    p.push(`(guillaumefarre.com - Contrat ${esc(data.contractNumber)}) Tj`);
    p.push('250 0 Td');
    p.push('(Page 2/2) Tj');
    p.push('ET');
  }

  return p.join('\n');
}

// Lalou
