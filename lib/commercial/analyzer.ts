/**
 * Commercial Performance - Analyse commerciale
 *
 * @author Lalou
 */

import { FINE_ART_PAPERS } from './papers';
import { COMMERCIAL_STRATEGIES, type CommercialStrategy } from './strategies';

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
    shortTerm: string[];
    longTerm: string[];
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

  // Determiner les strategies recommandees
  let primaryStrategy: CommercialStrategy;
  let alternatives: CommercialStrategy[] = [];

  if (isProcessWork) {
    primaryStrategy = COMMERCIAL_STRATEGIES.premium_limited;
    alternatives = [
      COMMERCIAL_STRATEGIES.masterpiece,
      COMMERCIAL_STRATEGIES.hybrid_tiered,
    ];
  } else if (isTraceWork) {
    primaryStrategy = COMMERCIAL_STRATEGIES.automotive_spectacular;
    alternatives = [
      COMMERCIAL_STRATEGIES.masterpiece,
      COMMERCIAL_STRATEGIES.premium_limited,
    ];
  } else {
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
      format: 'A3 (29.7\u00d742 cm)',
      paper: 'Ilford Gold Silk',
      strategy: 'Accessible',
      price: 250,
      margin: 150,
      breakeven: 50,
    },
    {
      format: 'A0 (84\u00d7118 cm)',
      paper: 'Hahnemühle Photo Rag',
      strategy: 'Premium Limité',
      price: 1800,
      margin: 1200,
      breakeven: 250,
    },
    {
      format: '150\u00d7100 cm',
      paper: 'Metallic Silver',
      strategy: 'Spectaculaire',
      price: 5500,
      margin: 3800,
      breakeven: 800,
    },
    {
      format: '250\u00d7167 cm',
      paper: 'FineArt Baryta',
      strategy: 'Chef-d\'oeuvre',
      price: 45000,
      margin: 38000,
      breakeven: 3500,
    },
  ];

  // Positionnement marche
  const marketPositioning = {
    uniqueness: (isProcessWork || isTraceWork ? 'très élevée' : 'élevée') as 'très élevée' | 'élevée',
    demandLevel: (isTraceWork ? 'très forte' : 'forte') as 'très forte' | 'forte',
    competitionLevel: (isProjection ? 'moyenne' : 'faible') as 'moyenne' | 'faible',
    priceElasticity: (isProcessWork ? 'rigide' : 'semi-rigide') as 'rigide' | 'semi-rigide',
  };

  // Plan d'action
  const actionPlan = {
    immediate: [
      `Identifier ${primaryStrategy.edition.count || 1} exemplaire(s) pour impression test`,
      `Commander échantillons papier (${optimalPaper.name})`,
      'Photographier haute résolution (minimum 300 DPI pour grands formats)',
      'Créer certificat d\'authenticité numéroté',
    ],
    shortTerm: [
      `Contacter ${primaryStrategy.distribution.slice(0, 2).join(', ')}`,
      'Tester pricing avec 2-3 clients cibles',
      'Lancer campagne Instagram ciblée',
      'Organiser exposition privée pour collectionneurs',
    ],
    longTerm: [
      `Positionner oeuvre pour ${primaryStrategy.distribution[0]}`,
      'Établir partenariat galerie stable',
      'Analyser données ventes et ajuster stratégie',
      'Créer série cohérente pour portfolio',
    ],
  };

  return {
    photoCategory: category,
    recommendedStrategies: { primary: primaryStrategy, alternatives },
    paperRecommendations: { optimal: optimalPaper, alternatives: alternativePapers, reasoning: paperReasoning },
    pricingMatrix,
    marketPositioning,
    actionPlan,
  };
}

// Lalou
