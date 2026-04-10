/**
 * Art Market Expert - Analyseur d'oeuvres (orchestrateur)
 *
 * @author Lalou
 */

import type { ExpertAnalysis } from './types';
import { getComparables, getArtisticReferences } from './comparables';
import { getExceptionalFormats, getSalesStrategy, getEditionStrategy } from './formats-strategy';

function getMarketPositioning(isProcessArt: boolean): ExpertAnalysis['marketPositioning'] {
  return {
    primaryMarket: isProcessArt
      ? 'Collectionneurs automobiles haut de gamme + Art contemporain (USA, Suisse, Moyen-Orient)'
      : 'Collectionneurs photographie d\'art (Europe, USA)',
    secondaryMarket: 'Musées automobiles, Fondations d\'art contemporain',
    internationalAppeal: isProcessArt ? 95 : 75,
    regions: [
      {
        region: 'USA (New York, Los Angeles, Miami)',
        appeal: 'high',
        reasoning: 'Marché automobile de luxe le plus dynamique. Collectionneurs payant 500K$+ pour art automobile (Richard Prince). Art Basel Miami = hub mondial.',
      },
      {
        region: 'Suisse (Genève, Zurich)',
        appeal: 'high',
        reasoning: 'Concentration mondiale de collectionneurs Ferrari. Art Basel historique. Prix records photographie (Gursky, Wall).',
      },
      {
        region: 'Moyen-Orient (Dubai, Abu Dhabi)',
        appeal: isProcessArt ? 'high' : 'medium',
        reasoning: 'Passion Ferrari extrême. Budgets illimités pour pièces uniques. Louvre Abu Dhabi acquiert art contemporain.',
      },
      {
        region: 'Asie (Hong Kong, Shanghai, Tokyo)',
        appeal: 'medium',
        reasoning: 'Marché automobile de luxe en explosion. Art Basel Hong Kong. Préférence pour art conceptuel.',
      },
    ],
  };
}

/**
 * Analyse experte ultra-detaillee d'une oeuvre
 */
export function analyzeArtworkExpert(
  photoFilename: string,
  category: string,
  currentPrice?: number
): ExpertAnalysis {
  const isProcessArt = category === 'atelier';
  const isTraceWork = category === 'empreintes';

  const comparables = getComparables(isProcessArt, isTraceWork);
  const exceptionalFormats = getExceptionalFormats(isProcessArt);
  const salesStrategy = getSalesStrategy(isProcessArt);
  const editionStrategy = getEditionStrategy(isProcessArt);
  const marketPositioning = getMarketPositioning(isProcessArt);
  const artisticReferences = getArtisticReferences(isProcessArt);

  return {
    overallAssessment: {
      artisticMerit: isProcessArt ? 95 : 80,
      marketPotential: isProcessArt ? 90 : 75,
      investmentGrade: isProcessArt ? 'A+' : 'A',
      summary: `
        Cette œuvre présente un potentiel exceptionnel sur le marché de l'art contemporain.

        **Analyse artistique** : Le processus créatif unique (utilisation d'une Ferrari comme outil de création) s'inscrit dans la lignée de Yves Klein et l'Action Painting, tout en créant une signature visuelle contemporaine absolument distinctive.

        **Potentiel commercial** : Les ventes comparables (Gursky 850K$, Klein 1.8M€, Prince 450K$) démontrent qu'il existe un marché établi pour ce type d'œuvres. Le positionnement automobile + art contemporain ouvre un double marché de collectionneurs fortunés.

        **Recommandation stratégique** : Positionnement premium immédiat avec éditions ultra-limitées, puis préparation pour marché international (galeries tier-1, foires majeures, ventes aux enchères) dans les 18-24 mois.
      `,
    },
    comparables,
    formatRecommendations: {
      standard: {
        formats: ['A3', 'A2', 'A1', 'A0'],
        prices: [
          { format: 'A3', price: 2500, reasoning: 'Format découverte, entrée de gamme collectionneurs' },
          { format: 'A2', price: 4500, reasoning: 'Format standard galeries, optimal visibilité/prix' },
          { format: 'A1', price: 7500, reasoning: 'Grand format, début positionnement premium' },
        ],
        targetMarket: 'Collectionneurs émergents et confirmés (Europe)',
      },
      exceptional: exceptionalFormats,
    },
    salesStrategy,
    editionStrategy,
    marketPositioning,
    artisticReferences,
    expertRecommendations: {
      immediate: [
        'Créer portfolio professionnel haute résolution',
        'Photographier le processus de création (vidéo 4K)',
        'Établir certificats d\'authenticité museum-grade',
        'Lancer éditions limitées (3-15 ex) formats A2-A0',
      ],
      midTerm: [
        'Contacter galeries spécialisées (Perrotin, Pace Photography)',
        'Participer à Paris Photo (Novembre)',
        'Soumettre pour Art Basel Miami (secteur Nova ou Meridians)',
        'Préparer exposition solo',
      ],
      longTerm: [
        'Cibler acquisition musée (1 pièce de série pour crédibilité)',
        'Préparer formats monumentaux (4-6m) pour enchères',
        'Contacter Christie\'s/Sotheby\'s département Contemporary',
        'Viser vente Evening Sale (estimation 100-300K€)',
      ],
      criticalFactors: [
        'FORMAT : Aller vers le monumental (2-6m) - C\'est là que sont les prix records',
        'ÉDITION : Maximum 3-5 exemplaires grands formats - Rareté = Valeur',
        'STORYTELLING : Documenter processus création - L\'histoire vend autant que l\'image',
        'MUSÉE : Acquisition musée = Validation institutionnelle = Explosion prix marché',
        'QUALITÉ : Matériaux exceptionnels (Lambda, DiaSec) - Justifie prix premium',
      ],
    },
  };
}

// Lalou
