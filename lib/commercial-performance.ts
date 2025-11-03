/**
 * 💼 SYSTÈME DE PERFORMANCE COMMERCIALE
 *
 * Analyse approfondie du potentiel commercial de chaque œuvre
 * - Stratégies de distribution (unique, édition limitée, série)
 * - Types de papier professionnels
 * - Positionnement marché
 * - Projections de vente
 */

// ============================================
// TYPES DE PAPIER FINE ART PROFESSIONNELS
// ============================================

export const FINE_ART_PAPERS = {
  // PAPIERS COTON 100% - Conservation musée
  hahnemuhle_photo_rag: {
    name: 'Hahnemühle Photo Rag®',
    composition: '100% Cotton Rag, Alpha-Cellulose',
    grammage: '308 g/m²',
    finish: 'Mat lisse',
    conservation: '300+ ans',
    characteristics: 'Référence mondiale - Texture légère, rendu velouté, blancs purs',
    bestFor: ['Fine Art Photography', 'Éditions limitées', 'Musées', 'Galeries haut de gamme'],
    priceCategory: 'premium',
    costPerM2: 35,
    rendering: {
      blacks: 'Noirs profonds',
      colors: 'Reproduction fidèle, gamut étendu',
      texture: 'Surface mate élégante',
    },
    usage: 'Standard galerie internationale',
  },

  hahnemuhle_fine_art_baryta: {
    name: 'Hahnemühle FineArt Baryta®',
    composition: '100% Cotton, baryté traditionnel',
    grammage: '325 g/m²',
    finish: 'Brillant satiné',
    conservation: '300+ ans',
    characteristics: 'Baryte coating - Rendu photographique classique, contraste élevé',
    bestFor: ['Photographie N&B', 'Portraits', 'Œuvres de maître'],
    priceCategory: 'premium-plus',
    costPerM2: 42,
    rendering: {
      blacks: 'Noirs maximum Dmax 2.55',
      colors: 'Richesse exceptionnelle',
      texture: 'Surface brillante douce',
    },
    usage: 'Collectionneurs exigeants',
  },

  canson_infinity_platine: {
    name: 'Canson Infinity Platine Fibre Rag®',
    composition: '100% Cotton Rag',
    grammage: '310 g/m²',
    finish: 'Mat satiné',
    conservation: '100+ ans',
    characteristics: 'Papier français traditionnel, texture subtile',
    bestFor: ['Fine Art', 'Éditions d\'artiste', 'Expositions'],
    priceCategory: 'premium',
    costPerM2: 38,
    rendering: {
      blacks: 'Noirs denses',
      colors: 'Palette riche',
      texture: 'Toucher coton authentique',
    },
    usage: 'Excellent rapport qualité/prix premium',
  },

  // PAPIERS ALPHA-CELLULOSE - Qualité professionnelle
  hahnemuhle_german_etching: {
    name: 'Hahnemühle German Etching®',
    composition: '100% Alpha-Cellulose',
    grammage: '310 g/m²',
    finish: 'Mat texturé',
    conservation: '100+ ans',
    characteristics: 'Texture gravure, surface structurée',
    bestFor: ['Art contemporain', 'Œuvres expressives', 'Tirages artistiques'],
    priceCategory: 'premium',
    costPerM2: 36,
    rendering: {
      blacks: 'Noirs mats',
      colors: 'Tons artistiques',
      texture: 'Relief visible - Style gravure',
    },
    usage: 'Différenciation artistique',
  },

  canson_infinity_edition_etching: {
    name: 'Canson Infinity Edition Etching Rag®',
    composition: '100% Cotton Rag',
    grammage: '310 g/m²',
    finish: 'Mat texturé',
    conservation: '100+ ans',
    characteristics: 'Surface structurée - Aspect artisanal',
    bestFor: ['Séries artistiques', 'Galeries contemporaines'],
    priceCategory: 'mid-premium',
    costPerM2: 32,
    rendering: {
      blacks: 'Noirs profonds',
      colors: 'Palette équilibrée',
      texture: 'Grain papier d\'art',
    },
    usage: 'Éditions limitées abordables',
  },

  // PAPIERS PHOTO PREMIUM - Volume qualité
  ilford_gold_fibre_silk: {
    name: 'Ilford Gold Fibre Silk®',
    composition: 'Alpha-Cellulose + RC base',
    grammage: '310 g/m²',
    finish: 'Satiné perlé',
    conservation: '100 ans',
    characteristics: 'Rendu photographique classique, séchage rapide',
    bestFor: ['Photographie commerciale', 'Séries moyennes', 'Décoration intérieure'],
    priceCategory: 'mid-range',
    costPerM2: 18,
    rendering: {
      blacks: 'Noirs denses',
      colors: 'Reproduction fidèle',
      texture: 'Satiné élégant',
    },
    usage: 'Production série à prix accessible',
  },

  epson_hot_press_natural: {
    name: 'Epson Hot Press Natural®',
    composition: '100% Cotton',
    grammage: '330 g/m²',
    finish: 'Mat lisse',
    conservation: '100+ ans',
    characteristics: 'Blanc naturel, toucher papier aquarelle',
    bestFor: ['Fine Art', 'Tirages artistiques', 'Galeries'],
    priceCategory: 'premium',
    costPerM2: 40,
    rendering: {
      blacks: 'Noirs profonds',
      colors: 'Gamut large',
      texture: 'Surface aquarelle',
    },
    usage: 'Alternative Hahnemühle',
  },

  // PAPIERS MÉTALLIQUES - Wow factor
  breathing_color_metallic: {
    name: 'Breathing Color Metallic Silver®',
    composition: 'RC perlé métallique',
    grammage: '290 g/m²',
    finish: 'Brillant métallique',
    conservation: '75 ans',
    characteristics: 'Reflets métalliques, effet 3D, contraste maximum',
    bestFor: ['Œuvres contemporaines', 'Art automobile', 'Tirages spectaculaires'],
    priceCategory: 'specialty',
    costPerM2: 28,
    rendering: {
      blacks: 'Noirs absolus',
      colors: 'Saturation exceptionnelle',
      texture: 'Effet lumineux unique',
    },
    usage: 'Impact visuel maximum - Séries limitées premium',
  },
} as const;

// ============================================
// STRATÉGIES DE DISTRIBUTION
// ============================================

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
    name: '🏆 CHEF-D\'ŒUVRE - Pièce Unique',
    description: 'Exemplaire unique monumental - Positionnement ultra-premium',
    edition: {
      type: 'unique',
      count: 1,
    },
    pricing: {
      base: 50000,
      max: 300000,
      recommendedFormats: ['200×133 cm', '250×167 cm', '300×200 cm'],
    },
    recommendedPapers: [
      'hahnemuhle_fine_art_baryta',
      'hahnemuhle_photo_rag',
      'epson_hot_press_natural',
    ],
    targetMarket: 'Collectionneurs fortunés, Musées, Galeries internationales',
    positioning: 'Œuvre d\'art patrimoniale - Investment grade',
    distribution: [
      'Art Basel (Miami, Hong Kong, Bâle)',
      'Frieze (London, New York, Los Angeles)',
      'Vente aux enchères (Christie\'s, Sotheby\'s)',
      'Galeries partenaires haut de gamme',
      'Acquisition musée',
    ],
    projections: {
      unitsPerYear: 1,
      revenueRange: '50K€ - 300K€',
      margin: '70-85%',
    },
    pros: [
      'Valorisation maximale de l\'œuvre',
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
    name: '💎 ÉDITION LIMITÉE PREMIUM',
    description: 'Série restreinte (3-15 ex.) - Positionnement galerie haut de gamme',
    edition: {
      type: 'limited',
      count: 7,
    },
    pricing: {
      base: 8000,
      max: 25000,
      recommendedFormats: ['A1', 'A0', '100×70 cm', '120×80 cm'],
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
    projections: {
      unitsPerYear: 3,
      revenueRange: '24K€ - 75K€',
      margin: '65-75%',
    },
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
    name: '🎨 SÉRIE ACCESSIBLE - Volume Qualité',
    description: 'Édition ouverte petits formats - Démocratisation de l\'art',
    edition: {
      type: 'open',
    },
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
    projections: {
      unitsPerYear: 50,
      revenueRange: '7.5K€ - 40K€',
      margin: '45-60%',
    },
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
    name: '⚡ HYBRIDE PYRAMIDAL',
    description: 'Stratégie multi-niveaux - Tous les segments de marché',
    edition: {
      type: 'limited',
      count: 15,
    },
    pricing: {
      base: 150,
      max: 50000,
      recommendedFormats: ['A4', 'A3', 'A2', 'A0', 'XXL'],
    },
    recommendedPapers: [
      'ilford_gold_fibre_silk', // Petits formats
      'hahnemuhle_photo_rag', // Moyens formats
      'hahnemuhle_fine_art_baryta', // Grands formats
      'breathing_color_metallic', // Option spectaculaire
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
    projections: {
      unitsPerYear: 30,
      revenueRange: '25K€ - 150K€',
      margin: '50-75% (selon format)',
    },
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
    name: '🏎️ SPECTACULAIRE AUTOMOBILE',
    description: 'Tirages monumentaux métalliques - Effet WOW maximum',
    edition: {
      type: 'limited',
      count: 3,
    },
    pricing: {
      base: 15000,
      max: 80000,
      recommendedFormats: ['150×100 cm', '200×133 cm', '250×167 cm'],
    },
    recommendedPapers: [
      'breathing_color_metallic',
      'hahnemuhle_fine_art_baryta',
      'acrylic_diasec', // Montage sous acrylique
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
    projections: {
      unitsPerYear: 5,
      revenueRange: '75K€ - 400K€',
      margin: '70-80%',
    },
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

// ============================================
// ANALYSE COMMERCIALE
// ============================================

export interface CommercialAnalysis {
  photoCategory: string;
  recommendedStrategies: {
    primary: CommercialStrategy;
    alternatives: CommercialStrategy[];
  };
  paperRecommendations: {
    optimal: typeof FINE_ART_PAPERS[keyof typeof FINE_ART_PAPERS];
    alternatives: (typeof FINE_ART_PAPERS[keyof typeof FINE_ART_PAPERS])[];
    reasoning: string;
  };
  pricingMatrix: {
    format: string;
    paper: string;
    strategy: string;
    price: number;
    margin: number;
    breakeven: number;
  }[];
  marketPositioning: {
    uniqueness: 'très élevée' | 'élevée' | 'moyenne' | 'standard';
    demandLevel: 'très forte' | 'forte' | 'moyenne' | 'faible';
    competitionLevel: 'faible' | 'moyenne' | 'forte' | 'très forte';
    priceElasticity: 'rigide' | 'semi-rigide' | 'élastique';
  };
  actionPlan: {
    immediate: string[];
    shortTerm: string[]; // 3 mois
    longTerm: string[]; // 1 an
  };
}

/**
 * Analyse approfondie du potentiel commercial d'une photo
 */
export function analyzeCommercialPerformance(
  category: string,
  photoTitle: string,
  currentPrice?: number
): CommercialAnalysis {
  const isProcessWork = category === 'atelier';
  const isTraceWork = category === 'empreintes';
  const isProjection = category === 'projection';

  // Déterminer les stratégies recommandées
  let primaryStrategy: CommercialStrategy;
  let alternatives: CommercialStrategy[] = [];

  if (isProcessWork) {
    // Processus de création = valeur artistique forte
    primaryStrategy = COMMERCIAL_STRATEGIES.premium_limited;
    alternatives = [
      COMMERCIAL_STRATEGIES.masterpiece,
      COMMERCIAL_STRATEGIES.hybrid_tiered,
    ];
  } else if (isTraceWork) {
    // Empreintes = pièces uniques potentielles
    primaryStrategy = COMMERCIAL_STRATEGIES.automotive_spectacular;
    alternatives = [
      COMMERCIAL_STRATEGIES.masterpiece,
      COMMERCIAL_STRATEGIES.premium_limited,
    ];
  } else {
    // Projection = accessible + volume
    primaryStrategy = COMMERCIAL_STRATEGIES.hybrid_tiered;
    alternatives = [
      COMMERCIAL_STRATEGIES.accessible_series,
      COMMERCIAL_STRATEGIES.premium_limited,
    ];
  }

  // Recommandations papier
  let optimalPaper: typeof FINE_ART_PAPERS[keyof typeof FINE_ART_PAPERS];
  let alternativePapers: (typeof FINE_ART_PAPERS[keyof typeof FINE_ART_PAPERS])[] = [];
  let paperReasoning: string;

  if (isProcessWork || isTraceWork) {
    optimalPaper = FINE_ART_PAPERS.hahnemuhle_photo_rag;
    alternativePapers = [
      FINE_ART_PAPERS.hahnemuhle_fine_art_baryta,
      FINE_ART_PAPERS.breathing_color_metallic,
    ];
    paperReasoning =
      'Photo Rag = standard galerie internationale. Alternative Baryta pour noirs denses, ou Metallic pour impact visuel spectaculaire (automotive).';
  } else {
    optimalPaper = FINE_ART_PAPERS.canson_infinity_platine;
    alternativePapers = [
      FINE_ART_PAPERS.hahnemuhle_german_etching,
      FINE_ART_PAPERS.ilford_gold_fibre_silk,
    ];
    paperReasoning =
      'Platine = excellent rapport qualité/prix. Alternative German Etching pour texture artistique, ou Ilford pour série volume.';
  }

  // Matrice de pricing
  const pricingMatrix = [
    {
      format: 'A3 (29.7×42 cm)',
      paper: 'Ilford Gold Silk',
      strategy: 'Accessible',
      price: 250,
      margin: 150,
      breakeven: 50,
    },
    {
      format: 'A0 (84×118 cm)',
      paper: 'Hahnemühle Photo Rag',
      strategy: 'Premium Limité',
      price: 1800,
      margin: 1200,
      breakeven: 250,
    },
    {
      format: '150×100 cm',
      paper: 'Metallic Silver',
      strategy: 'Spectaculaire',
      price: 5500,
      margin: 3800,
      breakeven: 800,
    },
    {
      format: '250×167 cm',
      paper: 'FineArt Baryta',
      strategy: 'Chef-d\'œuvre',
      price: 45000,
      margin: 38000,
      breakeven: 3500,
    },
  ];

  // Positionnement marché
  const marketPositioning = {
    uniqueness: (isProcessWork || isTraceWork ? 'très élevée' : 'élevée') as 'très élevée' | 'élevée',
    demandLevel: (isTraceWork ? 'très forte' : 'forte') as 'très forte' | 'forte',
    competitionLevel: (isProjection ? 'moyenne' : 'faible') as 'moyenne' | 'faible',
    priceElasticity: (isProcessWork ? 'rigide' : 'semi-rigide') as 'rigide' | 'semi-rigide',
  };

  // Plan d'action
  const actionPlan = {
    immediate: [
      `✅ Identifier ${primaryStrategy.edition.count || 1} exemplaire(s) pour impression test`,
      `📐 Commander échantillons papier (${optimalPaper.name})`,
      '📸 Photographier haute résolution (minimum 300 DPI pour grands formats)',
      '📋 Créer certificat d\'authenticité numéroté',
    ],
    shortTerm: [
      `🎯 Contacter ${primaryStrategy.distribution.slice(0, 2).join(', ')}`,
      '💰 Tester pricing avec 2-3 clients cibles',
      '📱 Lancer campagne Instagram ciblée',
      '🖼️ Organiser exposition privée pour collectionneurs',
    ],
    longTerm: [
      `🏛️ Positionner œuvre pour ${primaryStrategy.distribution[0]}`,
      '🤝 Établir partenariat galerie stable',
      '📊 Analyser données ventes et ajuster stratégie',
      '🎨 Créer série cohérente pour portfolio',
    ],
  };

  return {
    photoCategory: category,
    recommendedStrategies: {
      primary: primaryStrategy,
      alternatives,
    },
    paperRecommendations: {
      optimal: optimalPaper,
      alternatives: alternativePapers,
      reasoning: paperReasoning,
    },
    pricingMatrix,
    marketPositioning,
    actionPlan,
  };
}
