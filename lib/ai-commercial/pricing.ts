/**
 * AI Commercial Analyzer - Pricing, formats et editions
 *
 * @author Lalou
 */

import type { PhotoAnalysis } from './types';
import { analyzeByCategory } from './scoring';

export function calculatePriceRecommendation(
  commercialPotential: number,
  artisticQuality: number,
  rarityScore: number,
  category: string,
  currentPrice?: number
): PhotoAnalysis['priceRecommendation'] {

  const seriesData = analyzeByCategory(category);

  // Prix de base calcule selon potentiel
  const baseCalculation = (
    (commercialPotential * 25) + // 0-2500
    (artisticQuality * 20) +      // 0-2000
    (rarityScore * 15)            // 0-1500
  ) / 3;

  const basePrice = Math.round(baseCalculation * seriesData.priceMultiplier);

  // Fourchette de prix
  const minPrice = Math.round(basePrice * 0.7);
  const maxPrice = Math.round(basePrice * 1.5);

  // Analyse des comparables du marche
  const marketComparables = getMarketComparables(category, basePrice);

  // Raisonnement du prix
  const reasoning = generatePriceReasoning(
    basePrice,
    commercialPotential,
    artisticQuality,
    rarityScore,
    category,
    currentPrice
  );

  return {
    basePrice,
    minPrice,
    maxPrice,
    reasoning,
    marketComparables
  };
}

function getMarketComparables(category: string, price: number): string {
  const ranges = {
    low: { min: 0, max: 1500, market: 'photographies d\'art émergent, tirages standards' },
    medium: { min: 1500, max: 3500, market: 'artistes établis, galeries, éditions limitées' },
    high: { min: 3500, max: 6000, market: 'artistes reconnus, grands formats, éditions très limitées' },
    premium: { min: 6000, max: Infinity, market: 'œuvres majeures, formats monumentaux, collectors' }
  };

  for (const [, range] of Object.entries(ranges)) {
    if (price >= range.min && price < range.max) {
      return `Comparable au marché : ${range.market}. Prix cohérent avec la concurrence.`;
    }
  }

  return 'Prix dans la norme du marché de l\'art automobile contemporain.';
}

function generatePriceReasoning(
  basePrice: number,
  commercial: number,
  artistic: number,
  rarity: number,
  category: string,
  currentPrice?: number
): string {
  let reasons = [];

  if (artistic >= 90) reasons.push('qualité artistique exceptionnelle');
  else if (artistic >= 85) reasons.push('très haute qualité artistique');

  if (commercial >= 90) reasons.push('fort potentiel commercial');
  else if (commercial >= 80) reasons.push('bon potentiel commercial');

  if (rarity >= 90) reasons.push('rareté élevée');

  if (category === 'origins') reasons.push('valeur narrative et émotionnelle');
  if (category === 'empreintes') reasons.push('signature visuelle unique');

  const comparison = currentPrice
    ? currentPrice < basePrice
      ? ` Prix actuel (${currentPrice}€) sous-valorise l'œuvre.`
      : currentPrice > basePrice * 1.3
      ? ` Prix actuel (${currentPrice}€) peut limiter les ventes.`
      : ` Prix actuel (${currentPrice}€) est cohérent.`
    : '';

  return `Prix recommandé de ${basePrice}€ basé sur : ${reasons.join(', ')}.${comparison}`;
}

export function recommendFormats(
  commercial: number,
  category: string,
  filename: string,
  basePrice: number
): PhotoAnalysis['formatRecommendations'] {

  const formats: PhotoAnalysis['formatRecommendations'] = [];

  // A2 (42 x 59.4 cm) - Format premium
  if (commercial >= 80) {
    formats.push({
      priority: 'high',
      format: 'A2',
      size: '42 x 59.4 cm',
      reasoning: 'Format idéal pour cette œuvre - Impact visuel maximal, parfait pour collectionneurs',
      suggestedPrice: Math.round(basePrice * 1.2)
    });
  }

  // A3 (29.7 x 42 cm) - Format intermediaire
  formats.push({
    priority: commercial >= 75 ? 'high' : 'medium',
    format: 'A3',
    size: '29.7 x 42 cm',
    reasoning: 'Format polyvalent - Excellent compromis prix/impact, adapté à la plupart des espaces',
    suggestedPrice: basePrice
  });

  // A4 (21 x 29.7 cm) - Format accessible
  formats.push({
    priority: 'medium',
    format: 'A4',
    size: '21 x 29.7 cm',
    reasoning: 'Format accessible - Point d\'entrée pour nouveaux collectionneurs',
    suggestedPrice: Math.round(basePrice * 0.6)
  });

  return formats;
}

export function recommendEditionStrategy(
  rarity: number,
  commercial: number,
  category: string
): PhotoAnalysis['editionStrategy'] {

  if (rarity >= 90 || category === 'origins') {
    return {
      type: 'limited',
      limitedNumber: rarity >= 95 ? 5 : 10,
      reasoning: 'Édition très limitée recommandée pour maximiser la valeur et créer la rareté. Les collectors recherchent l\'exclusivité.',
      scarcityImpact: 'ÉLEVÉ - La rareté augmente significativement la valeur perçue (+40-60%)'
    };
  }

  if (rarity >= 80 || commercial >= 85) {
    return {
      type: 'limited',
      limitedNumber: 30,
      reasoning: 'Édition limitée recommandée - Équilibre entre accessibilité et exclusivité.',
      scarcityImpact: 'MOYEN - Crée une valeur perçue sans limiter excessivement les ventes (+20-30%)'
    };
  }

  return {
    type: 'open',
    reasoning: 'Édition ouverte recommandée - Maximise le potentiel de ventes tout en maintenant la qualité.',
    scarcityImpact: 'BAS - Focus sur le volume et l\'accessibilité'
  };
}

export function suggestExceptionalFormats(
  commercial: number,
  artistic: number,
  category: string,
  filename: string
): PhotoAnalysis['exceptionalFormats'] | undefined {

  const exceptional: PhotoAnalysis['exceptionalFormats'] = [];

  // Format monumental pour oeuvres exceptionnelles
  if (commercial >= 90 && artistic >= 90) {
    exceptional.push({
      format: 'Monumental',
      size: '200 x 400 cm (ou 150 x 300 cm)',
      price: Math.round(commercial * 150), // 13,500 - 15,000
      targetMarket: 'Galeries, entreprises, collectors institutionnels',
      reasoning: 'Cette œuvre a le potentiel d\'un format monumental. Impact spectaculaire pour espaces premium (hall d\'entreprise, galerie, loft).'
    });
  }

  // Format XXL pour fort potentiel
  if (commercial >= 85) {
    exceptional.push({
      format: 'XXL',
      size: '100 x 150 cm',
      price: Math.round(commercial * 80), // 6,800 - 8,000
      targetMarket: 'Collectionneurs privés, décorateurs d\'intérieur',
      reasoning: 'Format impactant parfait pour murs de grande taille. Crée un point focal spectaculaire.'
    });
  }

  // Diptyque ou Triptyque
  if (category === 'atelier' && commercial >= 80) {
    exceptional.push({
      format: 'Triptyque',
      size: '3 x (40 x 60 cm)',
      price: Math.round(commercial * 65),
      targetMarket: 'Décoration contemporaine, espaces modernes',
      reasoning: 'Série de 3 tirages coordonnés. Très recherché pour décoration murale contemporaine.'
    });
  }

  // Format collector miniature
  if (category === 'origins' || artistic >= 95) {
    exceptional.push({
      format: 'Collector Mini',
      size: '10 x 15 cm (encadré)',
      price: Math.round(commercial * 8), // 640 - 800
      targetMarket: 'Collectors, édition très limitée (5 ex)',
      reasoning: 'Format intimiste ultra-exclusif. Parfait pour collection personnelle. Numéroté et signé.'
    });
  }

  return exceptional.length > 0 ? exceptional : undefined;
}

// Lalou
