/**
 * Tests d'integration du contrat de vente PDF (Sprint 4.5).
 *
 * Verifie le contenu legal genere :
 *  - Article 10 mentionne Toulouse (et plus Paris) + rappel R631-3.
 *  - Mention TVA franchise art. 293 B CGI apres Article 3.
 *  - Mode de paiement dynamique (Sprint 4 : integral via Stripe).
 *  - Absence de l'ancien placebo "A definir (CB integral / ...".
 *
 * Utilise pdftotext (Poppler) via spawnSync en mode arr d'args (jamais
 * shell=true) pour extraire le texte du PDF genere en memoire — le
 * fichier n'est jamais ecrit sur disque par le test.
 *
 * @author Lalou
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { spawnSync } from 'child_process';
import { generateSaleContractPDF } from '../sale-contract';
import { getPaymentMethodLabel } from '../../payment-method-label';
import type { SaleContractData } from '../types';

function makeContractData(
  paymentMethod: string,
  overrides: Partial<SaleContractData> = {},
): SaleContractData {
  return {
    contractNumber: 'GF-TEST1234',
    date: '2026-05-17T10:00:00.000Z',
    buyer: {
      name: 'Alice Martin',
      address: '1 rue de la Paix, 75001 Paris, France',
      email: 'alice@example.org',
      phone: '+33612345678',
      buyerType: 'particulier',
    },
    artwork: {
      title: 'Toile Test',
      dimensions: '50 x 70 cm',
      technique: 'Acrylique sur toile',
      year: 2025,
      price: 1500,
    },
    paymentMethod,
    ...overrides,
  };
}

function extractPdfText(pdfBuffer: Buffer): string {
  // pdftotext -layout - -  → lit stdin, ecrit stdout, preserve la mise
  // en page (utile pour les checks multi-articles). Arr d'args + shell:false
  // → pas d'injection possible meme si pdfBuffer contient des bytes hostiles.
  const result = spawnSync('pdftotext', ['-layout', '-', '-'], {
    input: pdfBuffer,
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(
      `pdftotext failed (code=${result.status}): ${result.stderr || '(no stderr)'}`,
    );
  }
  return result.stdout;
}

describe('getPaymentMethodLabel', () => {
  it('retourne le libelle CB integral pour paymentMode "integral"', () => {
    expect(getPaymentMethodLabel('integral')).toBe('Carte bancaire integral via Stripe');
  });

  it('retourne le libelle acompte+solde pour paymentMode "deposit_balance"', () => {
    expect(getPaymentMethodLabel('deposit_balance')).toBe(
      'Acompte 30% + solde sous 14 jours',
    );
  });

  it('retourne le libelle facture email pour paymentMode "invoice_email"', () => {
    expect(getPaymentMethodLabel('invoice_email')).toBe('Facture envoyee par email');
  });

  it('retourne le fallback "A convenir" si paymentMode absent', () => {
    expect(getPaymentMethodLabel(undefined)).toBe("A convenir avec l'artiste");
    expect(getPaymentMethodLabel(null)).toBe("A convenir avec l'artiste");
  });

  it("ne contient JAMAIS l'ancien placebo 'A definir'", () => {
    // Anti-regression : le placebo Sprint 3 doit etre eradique.
    const allLabels = [
      getPaymentMethodLabel('integral'),
      getPaymentMethodLabel('deposit_balance'),
      getPaymentMethodLabel('invoice_email'),
      getPaymentMethodLabel(undefined),
    ];
    for (const label of allLabels) {
      expect(label).not.toMatch(/A definir/i);
      expect(label).not.toMatch(/CB integral \/ acompte/);
    }
  });
});

describe('generateSaleContractPDF — contenu legal Sprint 4.5', () => {
  let pdfText: string;

  beforeAll(() => {
    const data = makeContractData(getPaymentMethodLabel('integral'));
    const pdfBuffer = generateSaleContractPDF(data);
    pdfText = extractPdfText(pdfBuffer);
  });

  it('Article 10 cite Toulouse (et non Paris)', () => {
    // L'article 10 doit nommer Toulouse explicitement.
    expect(pdfText).toMatch(/Article 10[^]*Toulouse/);
    // Et ne plus referencer Paris dans la juridiction (Paris peut encore
    // apparaitre dans l'adresse acquereur, donc on scope l'assertion).
    const article10Section = pdfText.split('Article 10')[1] ?? '';
    expect(article10Section).not.toMatch(/tribunal competent de Paris/);
  });

  it('Article 10 contient le rappel R631-3 + droit consommateur', () => {
    expect(pdfText).toMatch(/R631-3/);
    expect(pdfText).toMatch(/consommateur/);
    expect(pdfText).toMatch(/lieu de residence|lieu d.execution/);
  });

  it('Article 3 contient la mention TVA art. 293 B du CGI', () => {
    expect(pdfText).toMatch(/TVA non applicable[^]*293 B[^]*CGI/);
  });

  it('Article 3 affiche le mode de paiement dynamique (CB Stripe)', () => {
    expect(pdfText).toMatch(/Mode de paiement convenu[^]*Carte bancaire integral via Stripe/);
  });

  it("ne contient PAS l'ancien placebo 'A definir (CB integral'", () => {
    // Anti-regression critique : ce placebo Sprint 3 ne doit JAMAIS reapparaitre
    // dans un contrat signe.
    expect(pdfText).not.toMatch(/A definir \(CB integral/);
    expect(pdfText).not.toMatch(/acompte \+ solde \/ facture par email/);
  });

  it('produit un PDF dont la taille est plausible (entete + 2 pages)', () => {
    const data = makeContractData(getPaymentMethodLabel('integral'));
    const pdfBuffer = generateSaleContractPDF(data);
    expect(pdfBuffer.length).toBeGreaterThan(3000);
    expect(pdfBuffer.slice(0, 5).toString()).toBe('%PDF-');
  });
});

describe('generateSaleContractPDF — fallback paymentMode absent', () => {
  it('utilise "A convenir avec l\'artiste" si aucun paymentMode fourni', () => {
    const data = makeContractData(getPaymentMethodLabel(undefined));
    const pdfBuffer = generateSaleContractPDF(data);
    const text = extractPdfText(pdfBuffer);
    expect(text).toMatch(/A convenir avec l.artiste/);
    expect(text).not.toMatch(/A definir \(CB integral/);
  });
});

// Lalou
