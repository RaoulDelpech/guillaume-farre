/**
 * AI COMMERCIAL ANALYZER - Guillaume Farré Art Business Intelligence
 *
 * Orchestrateur — logique dans ./ai-commercial/
 *
 * @author Lalou
 */

export type { PhotoAnalysis } from './ai-commercial/types';
export {
  analyzeByCategory,
  analyzeUniqueness,
  analyzeComposition,
  calculateCommercialPotential,
  calculateSocialMediaScore,
  calculateRarityScore,
} from './ai-commercial/scoring';
export {
  calculatePriceRecommendation,
  recommendFormats,
  recommendEditionStrategy,
  suggestExceptionalFormats,
} from './ai-commercial/pricing';
export {
  createSocialMediaStrategy,
  createArtisticAnalysis,
  createStrategicRecommendations,
} from './ai-commercial/strategies';

import type { PhotoAnalysis } from './ai-commercial/types';
import {
  analyzeByCategory,
  analyzeUniqueness,
  analyzeComposition,
  calculateCommercialPotential,
  calculateSocialMediaScore,
  calculateRarityScore,
} from './ai-commercial/scoring';
import {
  calculatePriceRecommendation,
  recommendFormats,
  recommendEditionStrategy,
  suggestExceptionalFormats,
} from './ai-commercial/pricing';
import {
  createSocialMediaStrategy,
  createArtisticAnalysis,
  createStrategicRecommendations,
} from './ai-commercial/strategies';

/**
 * Analyse une photo avec l'expertise d'un expert en marché de l'art
 */
export function analyzePhotoCommercialPotential(
  photoFilename: string,
  category: string,
  currentPrice?: number
): PhotoAnalysis {

  const seriesAnalysis = analyzeByCategory(category);
  const uniquenessScore = analyzeUniqueness(photoFilename);
  const compositionScore = analyzeComposition(photoFilename);

  const artisticQuality = Math.min(100, Math.round(
    (seriesAnalysis.artisticBase * 0.4) +
    (uniquenessScore * 0.3) +
    (compositionScore * 0.3)
  ));

  const commercialPotential = calculateCommercialPotential(
    artisticQuality, seriesAnalysis, category
  );

  const socialMediaViralityScore = calculateSocialMediaScore(
    category, photoFilename, artisticQuality
  );

  const rarityScore = calculateRarityScore(category, photoFilename);

  const priceRecommendation = calculatePriceRecommendation(
    commercialPotential, artisticQuality, rarityScore, category, currentPrice
  );

  const formatRecommendations = recommendFormats(
    commercialPotential, category, photoFilename, priceRecommendation.basePrice
  );

  const editionStrategy = recommendEditionStrategy(
    rarityScore, commercialPotential, category
  );

  const exceptionalFormats = suggestExceptionalFormats(
    commercialPotential, artisticQuality, category, photoFilename
  );

  const socialMediaStrategy = createSocialMediaStrategy(
    socialMediaViralityScore, category, photoFilename, artisticQuality
  );

  const artisticAnalysis = createArtisticAnalysis(
    category, photoFilename, artisticQuality
  );

  const strategicRecommendations = createStrategicRecommendations(
    commercialPotential, socialMediaViralityScore, editionStrategy, category
  );

  return {
    commercialPotential,
    artisticQuality,
    socialMediaViralityScore,
    rarityScore,
    priceRecommendation,
    formatRecommendations,
    editionStrategy,
    exceptionalFormats,
    socialMediaStrategy,
    artisticAnalysis,
    strategicRecommendations
  };
}

// Lalou
