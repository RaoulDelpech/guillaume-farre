/**
 * AI Commercial Analyzer - Fonctions de scoring
 *
 * @author Lalou
 */

export function analyzeByCategory(category: string) {
  const categoryData = {
    'atelier': {
      artisticBase: 85,
      priceMultiplier: 1.2,
      market: 'Très recherché - processus créatif visible',
      trend: 'Forte demande pour l\'authenticité du processus'
    },
    'empreintes': {
      artisticBase: 90,
      priceMultiplier: 1.5,
      market: 'Premium - Signature visuelle unique',
      trend: 'Éditions limitées très prisées'
    },
    'projection': {
      artisticBase: 88,
      priceMultiplier: 1.3,
      market: 'Innovant - Lumière et mouvement',
      trend: 'Forte viralité Instagram/TikTok'
    },
    'origins': {
      artisticBase: 95,
      priceMultiplier: 2.0,
      market: 'Collector - Histoire personnelle',
      trend: 'Valeur émotionnelle et narrative élevée'
    }
  };

  const categoryKey = category.toLowerCase() as keyof typeof categoryData;
  return categoryData[categoryKey] || {
    artisticBase: 80,
    priceMultiplier: 1.0,
    market: 'Général',
    trend: 'Standard'
  };
}

export function analyzeUniqueness(filename: string): number {
  // Analyse du numero de fichier pour determiner la rarete
  const match = filename.match(/(\d+)/);
  if (!match) return 75;

  const number = parseInt(match[1]);

  // Les numeros bas et les numeros ronds sont plus recherches
  if (number <= 5) return 95;
  if (number <= 10) return 90;
  if (number % 10 === 0) return 85;
  if (number <= 20) return 80;
  return 75;
}

export function analyzeComposition(filename: string): number {
  // Analyse basee sur des patterns dans le nom
  const number = parseInt((filename.match(/(\d+)/) || ['0', '0'])[1]);

  // Simulation d'une analyse de composition
  const isPrime = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47].includes(number);

  return isPrime ? 92 : 85;
}

export function calculateCommercialPotential(
  artisticQuality: number,
  seriesAnalysis: any,
  category: string
): number {
  const base = artisticQuality * 0.6;
  const marketDemand = seriesAnalysis.priceMultiplier * 20;
  const categoryBonus = category === 'origins' ? 15 : category === 'empreintes' ? 10 : 5;

  return Math.min(100, Math.round(base + marketDemand + categoryBonus));
}

export function calculateSocialMediaScore(
  category: string,
  filename: string,
  artisticQuality: number
): number {
  const categoryScores = {
    'projection': 95, // Tres visuel, lumiere
    'atelier': 88,    // Processus creatif
    'empreintes': 85, // Abstrait, intrigant
    'origins': 92     // Histoire personnelle
  };

  const categoryKey = category.toLowerCase() as keyof typeof categoryScores;
  const baseScore = categoryScores[categoryKey] || 80;
  const qualityBonus = (artisticQuality - 80) * 0.5;

  return Math.min(100, Math.round(baseScore + qualityBonus));
}

export function calculateRarityScore(category: string, filename: string): number {
  const uniqueness = analyzeUniqueness(filename);
  const categoryRarity = {
    'origins': 95,
    'empreintes': 85,
    'projection': 80,
    'atelier': 75
  };

  const categoryKey = category.toLowerCase() as keyof typeof categoryRarity;
  const base = categoryRarity[categoryKey] || 70;
  return Math.round((base + uniqueness) / 2);
}

// Lalou
