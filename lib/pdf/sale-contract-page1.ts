/**
 * Contrat de vente PDF - Page 1
 * Parties, oeuvre, prix, propriete intellectuelle
 *
 * @author Lalou
 */

import type { SaleContractData } from './types';
import { formatDateFrench, esc } from './types';

export function generatePage1Content(data: SaleContractData, priceFormatted: string): string {
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

  return p1.join('\n');
}

// Lalou
