/**
 * Contrat de vente PDF - Page 1
 * Identification parties + objet + prix.
 * Conforme FLOW_VIP_2026-05.md section 6 (page 1).
 *
 * @author Lalou
 */

import type { SaleContractData } from './types';
import { formatDateFrench, esc, numberToWordsFr } from './types';

const SELLER_NAME = 'Guillaume Farre';
const SELLER_TITLE = 'Artiste plasticien';
const SELLER_ADDRESS = 'Atelier : Toulouse, France';
const SELLER_SIRET = 'SIRET : 985 296 412 00012';
const SELLER_EMAIL = 'Email : contact@guillaumefarre.com';

export function generatePage1Content(data: SaleContractData, priceFormatted: string): string {
  const p: string[] = [];

  p.push('BT');
  p.push('/F1 22 Tf');
  p.push('80 780 Td');
  p.push(`(CONTRAT DE VENTE D'OEUVRE D'ART) Tj`);
  p.push('/F2 10 Tf');
  p.push('0 -18 Td');
  p.push('(Art Sale Agreement) Tj');
  p.push('ET');

  p.push('q 0.5 w 80 750 m 515 750 l S Q');

  p.push('BT');
  p.push('/F2 10 Tf');
  p.push('80 735 Td');
  p.push(`(Contrat n\\260 ${esc(data.contractNumber)} - Date : ${formatDateFrench(data.date)}) Tj`);
  p.push('ET');

  // Article 1 - Parties
  p.push('BT');
  p.push('/F1 13 Tf');
  p.push('80 700 Td');
  p.push('(Article 1 - Identification des parties) Tj');

  p.push('/F1 11 Tf');
  p.push('0 -22 Td');
  p.push('(LE VENDEUR :) Tj');
  p.push('/F2 10 Tf');
  p.push('0 -16 Td');
  p.push(`(${esc(SELLER_NAME)}, ${esc(SELLER_TITLE)}) Tj`);
  p.push('0 -14 Td');
  p.push(`(${esc(SELLER_ADDRESS)}) Tj`);
  p.push('0 -14 Td');
  p.push(`(${esc(SELLER_SIRET)}) Tj`);
  p.push('0 -14 Td');
  p.push(`(${esc(SELLER_EMAIL)}) Tj`);

  p.push('/F1 11 Tf');
  p.push('0 -22 Td');
  p.push(`(L'ACQUEREUR :) Tj`);
  p.push('/F2 10 Tf');
  p.push('0 -16 Td');
  p.push(`(Nom : ${esc(data.buyer.name)}) Tj`);
  if (data.buyer.address) {
    p.push('0 -14 Td');
    p.push(`(Adresse : ${esc(data.buyer.address)}) Tj`);
  }
  p.push('0 -14 Td');
  p.push(`(Email : ${esc(data.buyer.email)}) Tj`);
  if (data.buyer.phone) {
    p.push('0 -14 Td');
    p.push(`(Telephone : ${esc(data.buyer.phone)}) Tj`);
  }
  const qualite =
    data.buyer.buyerType === 'professionnel'
      ? `Qualite : Professionnel${data.buyer.companyName ? ` (${esc(data.buyer.companyName)})` : ''}${data.buyer.siret ? ` - SIRET : ${esc(data.buyer.siret)}` : ''}`
      : 'Qualite : Particulier';
  p.push('0 -14 Td');
  p.push(`(${qualite}) Tj`);

  // Article 2 - Oeuvre
  p.push('/F1 13 Tf');
  p.push('0 -28 Td');
  p.push(`(Article 2 - Description de l'oeuvre) Tj`);
  p.push('/F2 10 Tf');
  p.push('0 -18 Td');
  p.push(`(Titre : ${esc(data.artwork.title)}) Tj`);
  p.push('0 -14 Td');
  p.push(`(Dimensions : ${esc(data.artwork.dimensions)}) Tj`);
  p.push('0 -14 Td');
  p.push(`(Technique : ${esc(data.artwork.technique)}) Tj`);
  p.push('0 -14 Td');
  p.push(`(Annee de creation : ${data.artwork.year}) Tj`);
  p.push('0 -14 Td');
  p.push(`(Nature : Piece unique \\(oeuvre originale\\)) Tj`);

  // Article 3 - Prix
  p.push('/F1 13 Tf');
  p.push('0 -28 Td');
  p.push('(Article 3 - Prix et conditions de paiement) Tj');
  p.push('/F2 10 Tf');
  p.push('0 -18 Td');
  p.push(`(Prix de vente TTC : ${esc(priceFormatted)}) Tj`);
  p.push('0 -14 Td');
  p.push(`(Soit, en lettres : ${esc(numberToWordsFr(data.artwork.price))}) Tj`);
  p.push('0 -14 Td');
  p.push(`(Mode de paiement convenu : ${esc(data.paymentMethod)}) Tj`);
  if (data.depositAmount) {
    const depositFormatted = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(data.depositAmount);
    const remaining = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(data.artwork.price - data.depositAmount);
    p.push('0 -14 Td');
    p.push(`(Acompte : ${esc(depositFormatted)} - Solde restant : ${esc(remaining)}) Tj`);
  }
  p.push('0 -14 Td');
  p.push(`(Lieu de signature : Toulouse) Tj`);
  p.push('0 -14 Td');
  p.push(`(Date de signature : ${formatDateFrench(data.date)}) Tj`);

  // Article 4 - Propriete intellectuelle
  p.push('/F1 13 Tf');
  p.push('0 -28 Td');
  p.push('(Article 4 - Propriete intellectuelle) Tj');
  p.push('/F2 10 Tf');
  p.push('0 -18 Td');
  p.push(`(L'acquisition de l'oeuvre confere a l'acquereur la propriete du support) Tj`);
  p.push('0 -14 Td');
  p.push(`(materiel uniquement. Les droits d'auteur \\(moral et patrimonial\\)) Tj`);
  p.push('0 -14 Td');
  p.push(`(restent la propriete exclusive de l'artiste \\(art. L111-1 CPI\\).) Tj`);
  p.push('0 -14 Td');
  p.push(`(Toute reproduction est interdite sans autorisation ecrite prealable.) Tj`);

  p.push('/F2 8 Tf');
  p.push('250 -640 Td');
  p.push('(Page 1/2) Tj');
  p.push('ET');

  return p.join('\n');
}

// Lalou
