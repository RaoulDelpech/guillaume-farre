/**
 * AI Commercial Analyzer - Types
 *
 * @author Lalou
 */

export interface PhotoAnalysis {
  // Scores globaux (0-100)
  commercialPotential: number;
  artisticQuality: number;
  socialMediaViralityScore: number;
  rarityScore: number;

  // Recommandations de prix
  priceRecommendation: {
    basePrice: number; // Prix recommande de base
    minPrice: number;
    maxPrice: number;
    reasoning: string;
    marketComparables: string;
  };

  // Formats recommandes
  formatRecommendations: {
    priority: 'high' | 'medium' | 'low';
    format: string;
    size: string;
    reasoning: string;
    suggestedPrice: number;
  }[];

  // Edition
  editionStrategy: {
    type: 'limited' | 'open' | 'unique';
    limitedNumber?: number;
    reasoning: string;
    scarcityImpact: string;
  };

  // Formats exceptionnels suggeres
  exceptionalFormats?: {
    format: string;
    size: string;
    price: number;
    targetMarket: string;
    reasoning: string;
  }[];

  // Strategie reseaux sociaux
  socialMediaStrategy: {
    instagramScore: number;
    bestTimeToPost: string;
    suggestedHashtags: string[];
    contentType: 'Reel' | 'Carousel' | 'Story' | 'Post';
    captionIdea: string;
    expectedEngagement: 'high' | 'medium' | 'low';
  };

  // Analyse artistique detaillee
  artisticAnalysis: {
    composition: string;
    colors: string;
    emotion: string;
    uniqueness: string;
    marketTrends: string;
  };

  // Recommandations strategiques
  strategicRecommendations: string[];
}

// Lalou
