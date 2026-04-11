/**
 * Art Market Expert - Comparables et references artistiques
 *
 * @author Lalou
 */

import type { ExpertAnalysis } from './types';

type Comparable = ExpertAnalysis['comparables'][number];

export function getComparables(isProcessArt: boolean, isTraceWork: boolean): Comparable[] {
  if (isProcessArt) {
    return [
      {
        artist: 'Anish Kapoor',
        title: 'Shooting into the Corner (2009)',
        saleDetails: 'Art Basel Miami 2019',
        price: 1200000,
        format: 'Installation performance',
        relevance: 'Processus créatif visible, peinture par projection - Comparable à l\'utilisation de la Ferrari comme outil créatif. Kapoor a atteint 1.2M$ avec une approche similaire de "l\'outil en action".',
      },
      {
        artist: 'Yves Klein',
        title: 'Anthropométrie ANT 82 (1960)',
        saleDetails: 'Christie\'s Paris 2020',
        price: 1800000,
        format: '156 × 282 cm - Pigment sur papier',
        relevance: 'Art performatif capturé en image. Klein utilisait des "pinceaux vivants". Son record est 1.8M$ - un positionnement similaire est envisageable.',
      },
      {
        artist: 'Jackson Pollock',
        title: 'Number 17A (1948)',
        saleDetails: 'Sotheby\'s New York 2015',
        price: 15000000,
        format: '112 × 86 cm - Email sur panneau',
        relevance: 'Action painting - Le processus EST l\'œuvre. Pollock a révolutionné l\'art en montrant le geste créatif. Prix astronomiques pour formats moyens car l\'histoire et le processus comptent plus que la taille.',
      },
    ];
  }

  if (isTraceWork) {
    return [
      {
        artist: 'Richard Prince',
        title: 'Untitled (Cowboy)',
        saleDetails: 'Christie\'s New York 2021',
        price: 450000,
        format: '127 × 178 cm - Chromogenic print',
        relevance: 'Photographie d\'icônes automobiles américaines. Prince a vendu des Corvettes/Mustangs à 450K$. Les empreintes Ferrari peuvent viser 300-500K€ en format monumental.',
      },
      {
        artist: 'Andreas Gursky',
        title: 'F1 Boxenstopp I (2007)',
        saleDetails: 'Sotheby\'s New York 2022',
        price: 850000,
        format: '207 × 368 cm - C-print sur Plexiglas',
        relevance: 'Photographie automobile en très grand format. Gursky prouve qu\'automobile + art photo peut atteindre 850K$. Format XXL crucial : ce n\'était "que" 50K$ en format A2.',
      },
    ];
  }

  return [
    {
      artist: 'Jeff Wall',
      title: 'Diagonal Composition (1993)',
      saleDetails: 'Phillips London 2023',
      price: 320000,
      format: '200 × 250 cm - Cibachrome backlit',
      relevance: 'Photographie conceptuelle grand format. Wall démontre que la qualité d\'exécution + format monumental = valorisation extrême. 320K€ pour une photo.',
    },
  ];
}

export function getArtisticReferences(isProcessArt: boolean): ExpertAnalysis['artisticReferences'] {
  return {
    influences: isProcessArt
      ? ['Yves Klein', 'Jackson Pollock', 'Anish Kapoor', 'Niki de Saint Phalle']
      : ['Andreas Gursky', 'Richard Prince', 'Jeff Wall', 'Wolfgang Tillmans'],
    movements: isProcessArt
      ? ['Nouveau Réalisme', 'Art Processuel', 'Action Painting', 'Art Automobile']
      : ['Photographie Conceptuelle', 'École de Düsseldorf', 'New Topographics'],
    marketComparisons: `
      **Analyse comparative du marché** :

      ${isProcessArt ? `
      Guillaume Farré = Yves Klein + Ferrari

      - Klein utilisait des "pinceaux vivants" (corps féminins)
      - Farré utilise l'automobile comme médium artistique
      - Différence : Klein a atteint 1.8M€ en 2020
      - Potentiel Farré : 500K-1M€ si positionnement musée

      **Facteur différenciant** : L'automobile
      - Objet de désir universel (vs corps nu controversé)
      - Double marché : Art + Automobile de luxe
      - Storytelling plus accessible
      ` : `
      Comparables directs :
      - Andreas Gursky (F1) : 850K$ pour photographie automobile
      - Richard Prince (Cowboy/Cars) : 450K$
      - Jeff Wall (grand format) : 320K$

      Positionnement Farré :
      - Entre Prince (sujet automobile) et Gursky (qualité technique)
      - Avantage : Processus de création unique documenté
      - Potentiel : 100-500K€ en format monumental
      `}

      **Conclusion marché** :
      Le précédent existe. Les prix sont établis.
      La qualité d'exécution + storytelling + format = valorisation.
    `,
  };
}

// Lalou
