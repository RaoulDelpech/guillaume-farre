'use client';

/**
 * Apercu HTML du contrat de vente d'oeuvre d'art avant signature.
 *
 * Le contenu doit refleter EXACTEMENT le PDF qui sera genere cote serveur
 * (cf. lib/pdf/sale-contract-page1.ts + page2.ts), pour que le signataire
 * voit ce qu'il signe. Les clauses verbatim (articles 5-10 + footer eIDAS)
 * sont dans ContractClauses, ce composant gere uniquement les champs
 * variables (parties, oeuvre, prix, paiement, date).
 *
 * Pas de state, pas de fetch : purement presentationnel.
 *
 * @author Lalou
 */

import { useMemo } from 'react';
import ContractClauses from './ContractClauses';

const SELLER = {
  name: 'Guillaume Farré',
  title: 'Artiste plasticien',
  address: 'Atelier : Toulouse, France',
  siret: 'SIRET : 985 296 412 00012',
  email: 'contact@guillaumefarre.com',
};

export interface ContractPreviewProps {
  reservationId: string;
  buyer: {
    name: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
    buyerType: 'particulier' | 'professionnel';
    siret?: string;
    companyName?: string;
  };
  artwork: {
    title: string;
    dimensions: string;
    technique: string;
    year: number;
    price: number;
  };
  paymentMethod?: string;
}

function formatPriceEUR(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatToday(): string {
  return new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ContractPreview({
  reservationId,
  buyer,
  artwork,
  paymentMethod = 'À définir (CB intégral / acompte + solde / facture par email)',
}: ContractPreviewProps) {
  const today = useMemo(() => formatToday(), []);
  const contractNumber = `GF-${reservationId.slice(0, 8).toUpperCase()}`;
  const fullAddress = [
    buyer.addressLine1,
    buyer.addressLine2,
    `${buyer.postalCode} ${buyer.city}`,
    buyer.country,
  ]
    .filter(Boolean)
    .join(', ');

  const qualite =
    buyer.buyerType === 'professionnel'
      ? `Professionnel${buyer.companyName ? ` (${buyer.companyName})` : ''}${buyer.siret ? ` — SIRET : ${buyer.siret}` : ''}`
      : 'Particulier';

  return (
    <article
      aria-label="Aperçu du contrat de vente"
      className="bg-white text-[#1a1a1a] border border-neutral-300 max-h-[55vh] overflow-y-auto"
    >
      <div className="px-6 py-5 space-y-5 text-[12.5px] leading-relaxed font-light">
        <header className="border-b border-neutral-300 pb-3">
          <h3 className="text-lg font-extralight tracking-[0.1em] uppercase">
            Contrat de vente d&apos;œuvre d&apos;art
          </h3>
          <p className="text-xs text-neutral-600 mt-1">
            Contrat n° {contractNumber} — {today}
          </p>
        </header>

        <section>
          <h4 className="text-sm font-medium uppercase tracking-wider mb-2">
            Article 1 — Identification des parties
          </h4>
          <p className="font-medium">Le vendeur :</p>
          <p>
            {SELLER.name}, {SELLER.title}
            <br />
            {SELLER.address}
            <br />
            {SELLER.siret}
            <br />
            Email : {SELLER.email}
          </p>
          <p className="font-medium mt-2">L&apos;acquéreur :</p>
          <p>
            {buyer.name}
            <br />
            {fullAddress}
            <br />
            Email : {buyer.email} — Téléphone : {buyer.phone}
            <br />
            Qualité : {qualite}
          </p>
        </section>

        <section>
          <h4 className="text-sm font-medium uppercase tracking-wider mb-2">
            Article 2 — Description de l&apos;œuvre
          </h4>
          <p>
            Titre : {artwork.title}
            <br />
            Dimensions : {artwork.dimensions}
            <br />
            Technique : {artwork.technique}
            <br />
            Année de création : {artwork.year}
            <br />
            Nature : Pièce unique (œuvre originale).
          </p>
        </section>

        <section>
          <h4 className="text-sm font-medium uppercase tracking-wider mb-2">
            Article 3 — Prix et conditions de paiement
          </h4>
          <p>
            Prix de vente TTC : <strong>{formatPriceEUR(artwork.price)}</strong>
            <br />
            Mode de paiement convenu : {paymentMethod}
            <br />
            Lieu de signature : Toulouse — Date : {today}
          </p>
        </section>

        <section>
          <h4 className="text-sm font-medium uppercase tracking-wider mb-2">
            Article 4 — Propriété intellectuelle
          </h4>
          <p>
            L&apos;acquisition de l&apos;œuvre confère à l&apos;acquéreur la propriété du support
            matériel uniquement. Les droits d&apos;auteur restent la propriété exclusive de
            l&apos;artiste (art. L111-1 CPI).
          </p>
        </section>

        <ContractClauses />
      </div>
    </article>
  );
}
