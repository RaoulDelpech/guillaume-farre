/**
 * Art Market Expert - Types
 *
 * @author Lalou
 */

export interface ExpertAnalysis {
  // Analyse globale
  overallAssessment: {
    artisticMerit: number; // 0-100
    marketPotential: number; // 0-100
    investmentGrade: 'A+' | 'A' | 'B+' | 'B' | 'C';
    summary: string; // 2-3 paragraphes detailles
  };

  // Oeuvres comparables vendues
  comparables: {
    artist: string;
    title: string;
    saleDetails: string;
    price: number;
    format: string;
    relevance: string; // Pourquoi cette vente est pertinente
  }[];

  // Recommandations de formats
  formatRecommendations: {
    standard: {
      formats: string[];
      prices: { format: string; price: number; reasoning: string }[];
      targetMarket: string;
    };
    exceptional: {
      format: string;
      size: string; // ex: "400 x 600 cm (4m x 6m)"
      material: string;
      estimatedValue: number;
      targetVenue: string; // ex: "Christie's New York Contemporary Art Evening Sale"
      reasoning: string; // Analyse detaillee
      examples: string; // Exemples de ventes similaires
    }[];
  };

  // Strategie de vente detaillee
  salesStrategy: {
    immediate: {
      approach: string;
      venues: string[];
      pricing: { min: number; target: number; max: number };
      timeline: string;
    };
    premium: {
      approach: string;
      venues: string[];
      preparation: string;
      estimatedValue: number;
      timeline: string;
      rationale: string; // Explication detaillee
    };
  };

  // Edition et rarete
  editionStrategy: {
    type: 'unique' | 'ultra-limited' | 'limited' | 'open';
    reasoning: string;
    editionSize?: number;
    numberingFormat?: string; // ex: "1/5 + 2 AP (Artist Proofs)"
    certificat: {
      type: 'museum-grade' | 'gallery-standard' | 'artist-signed';
      includes: string[];
    };
  };

  // Positionnement marche
  marketPositioning: {
    primaryMarket: string; // ex: "Collectionneurs europeens haut de gamme"
    secondaryMarket: string;
    internationalAppeal: number; // 0-100
    regions: {
      region: string;
      appeal: 'high' | 'medium' | 'low';
      reasoning: string;
    }[];
  };

  // References artistiques
  artisticReferences: {
    influences: string[]; // Artistes comparables
    movements: string[]; // Mouvements artistiques
    marketComparisons: string; // Analyse comparative detaillee
  };

  // Recommandations strategiques expertes
  expertRecommendations: {
    immediate: string[];
    midTerm: string[];
    longTerm: string[];
    criticalFactors: string[];
  };
}

// Lalou
