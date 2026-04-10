/**
 * Commercial Performance - Strategies de distribution
 *
 * @author Lalou
 */

import { FINE_ART_PAPERS } from './papers';

export interface CommercialStrategy {
  name: string;
  description: string;
  edition: {
    type: 'unique' | 'limited' | 'open';
    count?: number;
  };
  pricing: {
    base: number;
    max: number;
    recommendedFormats: string[];
  };
  recommendedPapers: (keyof typeof FINE_ART_PAPERS)[];
  targetMarket: string;
  positioning: string;
  distribution: string[];
  projections: {
    unitsPerYear: number;
    revenueRange: string;
    margin: string;
  };
  pros: string[];
  cons: string[];
}

export const COMMERCIAL_STRATEGIES: Record<string, CommercialStrategy> = {
  masterpiece: {
    name: 'CHEF-D\'OEUVRE - Pièce Unique',
    description: 'Exemplaire unique monumental - Positionnement ultra-premium',
    edition: { type: 'unique', count: 1 },
    pricing: {
      base: 50000,
      max: 300000,
      recommendedFormats: ['200\u00d7133 cm', '250\u00d7167 cm', '300\u00d7200 cm'],
    },
    recommendedPapers: [
      'hahnemuhle_fine_art_baryta',
      'hahnemuhle_photo_rag',
      'epson_hot_press_natural',
    ],
    targetMarket: 'Collectionneurs fortunés, Musées, Galeries internationales',
    positioning: 'Oeuvre d\'art patrimoniale - Investment grade',
    distribution: [
      'Art Basel (Miami, Hong Kong, Bâle)',
      'Frieze (London, New York, Los Angeles)',
      'Vente aux enchères (Christie\'s, Sotheby\'s)',
      'Galeries partenaires haut de gamme',
      'Acquisition musée',
    ],
    projections: { unitsPerYear: 1, revenueRange: '50K\u20ac - 300K\u20ac', margin: '70-85%' },
    pros: [
      'Valorisation maximale de l\'oeuvre',
      'Exclusivité totale',
      'Potentiel d\'appréciation',
      'Prestige artistique',
      'Entrée collections privées/musées',
    ],
    cons: [
      'Temps de vente long (6-24 mois)',
      'Réseau galeries requis',
      'Investissement encadrement/transport',
      'Client ultra-ciblé',
    ],
  },

  premium_limited: {
    name: 'ÉDITION LIMITÉE PREMIUM',
    description: 'Série restreinte (3-15 ex.) - Positionnement galerie haut de gamme',
    edition: { type: 'limited', count: 7 },
    pricing: {
      base: 8000,
      max: 25000,
      recommendedFormats: ['A1', 'A0', '100\u00d770 cm', '120\u00d780 cm'],
    },
    recommendedPapers: [
      'hahnemuhle_photo_rag',
      'canson_infinity_platine',
      'hahnemuhle_fine_art_baryta',
    ],
    targetMarket: 'Collectionneurs avertis, Galeries, Entreprises premium',
    positioning: 'Photographie d\'art collectible - Édition certifiée',
    distribution: [
      'FIAC / Paris Photo',
      'Galeries partenaires',
      'Ventes privées',
      'Site web (galerie virtuelle)',
      'Salons art contemporain',
    ],
    projections: { unitsPerYear: 3, revenueRange: '24K\u20ac - 75K\u20ac', margin: '65-75%' },
    pros: [
      'Équilibre rareté/volume',
      'Prix justifiés par limitation',
      'Construction portfolio solide',
      'Clients fidélisables',
      'Certificat authenticité signé',
    ],
    cons: [
      'Nécessite galeries partenaires',
      'Gestion certificats/numérotation',
      'Stock limité après vente',
    ],
  },

  accessible_series: {
    name: 'SÉRIE ACCESSIBLE - Volume Qualité',
    description: 'Édition ouverte petits formats - Démocratisation de l\'art',
    edition: { type: 'open' },
    pricing: {
      base: 150,
      max: 800,
      recommendedFormats: ['A4', 'A3', 'A2'],
    },
    recommendedPapers: [
      'ilford_gold_fibre_silk',
      'canson_infinity_edition_etching',
      'hahnemuhle_german_etching',
    ],
    targetMarket: 'Grand public éclairé, Décoration intérieure, Jeunes collectionneurs',
    positioning: 'Art accessible - Qualité professionnelle',
    distribution: [
      'Site e-commerce (boutique en ligne)',
      'Marketplaces (Etsy, Saatchi Art)',
      'Showrooms décoration',
      'Réseaux sociaux (Instagram Shopping)',
      'Print-on-demand partenaires',
    ],
    projections: { unitsPerYear: 50, revenueRange: '7.5K\u20ac - 40K\u20ac', margin: '45-60%' },
    pros: [
      'Volume de ventes élevé',
      'Visibilité large audience',
      'Revenus récurrents',
      'Entrée dans collections',
      'Faible investissement stock',
    ],
    cons: [
      'Prix unitaires bas',
      'Gestion logistique volume',
      'Concurrence forte',
      'Moins de prestige',
    ],
  },

  hybrid_tiered: {
    name: 'HYBRIDE PYRAMIDAL',
    description: 'Stratégie multi-niveaux - Tous les segments de marché',
    edition: { type: 'limited', count: 15 },
    pricing: {
      base: 150,
      max: 50000,
      recommendedFormats: ['A4', 'A3', 'A2', 'A0', 'XXL'],
    },
    recommendedPapers: [
      'ilford_gold_fibre_silk',
      'hahnemuhle_photo_rag',
      'hahnemuhle_fine_art_baryta',
      'breathing_color_metallic',
    ],
    targetMarket: 'Tous segments - Du grand public aux collectionneurs',
    positioning: 'Pyramide de valeur - Du volume au prestige',
    distribution: [
      'Site web (tous formats)',
      'Galeries (grands formats uniquement)',
      'Marketplaces (petits formats)',
      'Salons art (moyens et grands)',
      'Direct DM Instagram (sur-mesure)',
    ],
    projections: { unitsPerYear: 30, revenueRange: '25K\u20ac - 150K\u20ac', margin: '50-75% (selon format)' },
    pros: [
      'Diversification risques',
      'Tous segments couverts',
      'Volume + prestige',
      'Revenus optimisés',
      'Flexibilité maximale',
    ],
    cons: [
      'Gestion complexe',
      'Messages marketing multiples',
      'Stock diversifié',
      'Risque dilution image',
    ],
  },

  automotive_spectacular: {
    name: 'SPECTACULAIRE AUTOMOBILE',
    description: 'Tirages monumentaux métalliques - Effet WOW maximum',
    edition: { type: 'limited', count: 3 },
    pricing: {
      base: 15000,
      max: 80000,
      recommendedFormats: ['150\u00d7100 cm', '200\u00d7133 cm', '250\u00d7167 cm'],
    },
    recommendedPapers: [
      'breathing_color_metallic',
      'hahnemuhle_fine_art_baryta',
    ],
    targetMarket: 'Passionnés automobile fortunés, Showrooms, Entreprises automotive',
    positioning: 'Art automobile premium - Pièces décoratives spectaculaires',
    distribution: [
      'Salons automobiles (Rétromobile, Geneva Motor Show)',
      'Showrooms Ferrari/Porsche/McLaren',
      'Clubs automobiles premium',
      'Ventes privées collectionneurs',
      'Partenariats marques luxury',
    ],
    projections: { unitsPerYear: 5, revenueRange: '75K\u20ac - 400K\u20ac', margin: '70-80%' },
    pros: [
      'Marché de niche très solvable',
      'Prix justifiés par le thème',
      'Réseau automotive accessible',
      'Potentiel partenariats marques',
      'Effet visuel unique',
    ],
    cons: [
      'Marché très ciblé',
      'Dépend réseau automotive',
      'Transport/installation complexe',
      'Formats encombrants',
    ],
  },
};

// Lalou
