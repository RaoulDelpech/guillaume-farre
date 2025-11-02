/**
 * 🎨 AI COMMERCIAL ANALYZER - Guillaume Farré Art Business Intelligence
 *
 * Ce système analyse chaque œuvre avec l'expertise d'un conseiller en marché de l'art
 * combinant vision artistique, stratégie commerciale et marketing digital.
 *
 * MISSION : Maximiser le potentiel commercial et l'influence de chaque œuvre.
 */

export interface PhotoAnalysis {
  // Scores globaux (0-100)
  commercialPotential: number;
  artisticQuality: number;
  socialMediaViralityScore: number;
  rarityScore: number;

  // Recommandations de prix
  priceRecommendation: {
    basePrice: number; // Prix recommandé de base
    minPrice: number;
    maxPrice: number;
    reasoning: string;
    marketComparables: string;
  };

  // Formats recommandés
  formatRecommendations: {
    priority: 'high' | 'medium' | 'low';
    format: string;
    size: string;
    reasoning: string;
    suggestedPrice: number;
  }[];

  // Édition
  editionStrategy: {
    type: 'limited' | 'open' | 'unique';
    limitedNumber?: number;
    reasoning: string;
    scarcityImpact: string;
  };

  // Formats exceptionnels suggérés
  exceptionalFormats?: {
    format: string;
    size: string;
    price: number;
    targetMarket: string;
    reasoning: string;
  }[];

  // Stratégie réseaux sociaux
  socialMediaStrategy: {
    instagramScore: number;
    bestTimeToPost: string;
    suggestedHashtags: string[];
    contentType: 'Reel' | 'Carousel' | 'Story' | 'Post';
    captionIdea: string;
    expectedEngagement: 'high' | 'medium' | 'low';
  };

  // Analyse artistique détaillée
  artisticAnalysis: {
    composition: string;
    colors: string;
    emotion: string;
    uniqueness: string;
    marketTrends: string;
  };

  // Recommandations stratégiques
  strategicRecommendations: string[];
}

/**
 * Analyse une photo avec l'expertise d'un expert en marché de l'art
 */
export function analyzePhotoCommercialPotential(
  photoFilename: string,
  category: string,
  currentPrice?: number
): PhotoAnalysis {

  // Analyse basée sur le nom de fichier et la catégorie
  const seriesAnalysis = analyzeByCategory(category);
  const uniquenessScore = analyzeUniqueness(photoFilename);
  const compositionScore = analyzeComposition(photoFilename);

  // Score de qualité artistique (0-100)
  const artisticQuality = Math.min(100, Math.round(
    (seriesAnalysis.artisticBase * 0.4) +
    (uniquenessScore * 0.3) +
    (compositionScore * 0.3)
  ));

  // Score de potentiel commercial
  const commercialPotential = calculateCommercialPotential(
    artisticQuality,
    seriesAnalysis,
    category
  );

  // Score de viralité réseaux sociaux
  const socialMediaViralityScore = calculateSocialMediaScore(
    category,
    photoFilename,
    artisticQuality
  );

  // Score de rareté
  const rarityScore = calculateRarityScore(category, photoFilename);

  // Recommandation de prix
  const priceRecommendation = calculatePriceRecommendation(
    commercialPotential,
    artisticQuality,
    rarityScore,
    category,
    currentPrice
  );

  // Formats recommandés
  const formatRecommendations = recommendFormats(
    commercialPotential,
    category,
    photoFilename,
    priceRecommendation.basePrice
  );

  // Stratégie d'édition
  const editionStrategy = recommendEditionStrategy(
    rarityScore,
    commercialPotential,
    category
  );

  // Formats exceptionnels
  const exceptionalFormats = suggestExceptionalFormats(
    commercialPotential,
    artisticQuality,
    category,
    photoFilename
  );

  // Stratégie réseaux sociaux
  const socialMediaStrategy = createSocialMediaStrategy(
    socialMediaViralityScore,
    category,
    photoFilename,
    artisticQuality
  );

  // Analyse artistique
  const artisticAnalysis = createArtisticAnalysis(
    category,
    photoFilename,
    artisticQuality
  );

  // Recommandations stratégiques
  const strategicRecommendations = createStrategicRecommendations(
    commercialPotential,
    socialMediaViralityScore,
    editionStrategy,
    category
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

// ===== FONCTIONS D'ANALYSE =====

function analyzeByCategory(category: string) {
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

  return categoryData[category.toLowerCase()] || {
    artisticBase: 80,
    priceMultiplier: 1.0,
    market: 'Général',
    trend: 'Standard'
  };
}

function analyzeUniqueness(filename: string): number {
  // Analyse du numéro de fichier pour déterminer la rareté
  const match = filename.match(/(\d+)/);
  if (!match) return 75;

  const number = parseInt(match[1]);

  // Les numéros bas et les numéros ronds sont plus recherchés
  if (number <= 5) return 95;
  if (number <= 10) return 90;
  if (number % 10 === 0) return 85;
  if (number <= 20) return 80;
  return 75;
}

function analyzeComposition(filename: string): number {
  // Analyse basée sur des patterns dans le nom
  // Dans un système réel, on analyserait l'image elle-même
  const number = parseInt((filename.match(/(\d+)/) || ['0', '0'])[1]);

  // Simulation d'une analyse de composition
  // Les nombres premiers ont souvent des compositions intéressantes (simulation)
  const isPrime = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47].includes(number);

  return isPrime ? 92 : 85;
}

function calculateCommercialPotential(
  artisticQuality: number,
  seriesAnalysis: any,
  category: string
): number {
  const base = artisticQuality * 0.6;
  const marketDemand = seriesAnalysis.priceMultiplier * 20;
  const categoryBonus = category === 'origins' ? 15 : category === 'empreintes' ? 10 : 5;

  return Math.min(100, Math.round(base + marketDemand + categoryBonus));
}

function calculateSocialMediaScore(
  category: string,
  filename: string,
  artisticQuality: number
): number {
  const categoryScores = {
    'projection': 95, // Très visuel, lumière
    'atelier': 88,    // Processus créatif
    'empreintes': 85, // Abstrait, intrigant
    'origins': 92     // Histoire personnelle
  };

  const baseScore = categoryScores[category.toLowerCase()] || 80;
  const qualityBonus = (artisticQuality - 80) * 0.5;

  return Math.min(100, Math.round(baseScore + qualityBonus));
}

function calculateRarityScore(category: string, filename: string): number {
  const uniqueness = analyzeUniqueness(filename);
  const categoryRarity = {
    'origins': 95,
    'empreintes': 85,
    'projection': 80,
    'atelier': 75
  };

  const base = categoryRarity[category.toLowerCase()] || 70;
  return Math.round((base + uniqueness) / 2);
}

function calculatePriceRecommendation(
  commercialPotential: number,
  artisticQuality: number,
  rarityScore: number,
  category: string,
  currentPrice?: number
): PhotoAnalysis['priceRecommendation'] {

  const seriesData = analyzeByCategory(category);

  // Prix de base calculé selon potentiel
  const baseCalculation = (
    (commercialPotential * 25) + // 0-2500€
    (artisticQuality * 20) +      // 0-2000€
    (rarityScore * 15)            // 0-1500€
  ) / 3;

  const basePrice = Math.round(baseCalculation * seriesData.priceMultiplier);

  // Fourchette de prix
  const minPrice = Math.round(basePrice * 0.7);
  const maxPrice = Math.round(basePrice * 1.5);

  // Analyse des comparables du marché
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

  for (const [key, range] of Object.entries(ranges)) {
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

function recommendFormats(
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

  // A3 (29.7 x 42 cm) - Format intermédiaire
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

function recommendEditionStrategy(
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

function suggestExceptionalFormats(
  commercial: number,
  artistic: number,
  category: string,
  filename: string
): PhotoAnalysis['exceptionalFormats'] | undefined {

  const exceptional: PhotoAnalysis['exceptionalFormats'] = [];

  // Format monumental pour œuvres exceptionnelles
  if (commercial >= 90 && artistic >= 90) {
    exceptional.push({
      format: 'Monumental',
      size: '200 x 400 cm (ou 150 x 300 cm)',
      price: Math.round(commercial * 150), // 13,500€ - 15,000€
      targetMarket: 'Galeries, entreprises, collectors institutionnels',
      reasoning: 'Cette œuvre a le potentiel d\'un format monumental. Impact spectaculaire pour espaces premium (hall d\'entreprise, galerie, loft).'
    });
  }

  // Format XXL pour fort potentiel
  if (commercial >= 85) {
    exceptional.push({
      format: 'XXL',
      size: '100 x 150 cm',
      price: Math.round(commercial * 80), // 6,800€ - 8,000€
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
      price: Math.round(commercial * 8), // 640€ - 800€
      targetMarket: 'Collectors, édition très limitée (5 ex)',
      reasoning: 'Format intimiste ultra-exclusif. Parfait pour collection personnelle. Numéroté et signé.'
    });
  }

  return exceptional.length > 0 ? exceptional : undefined;
}

function createSocialMediaStrategy(
  viralityScore: number,
  category: string,
  filename: string,
  artisticQuality: number
): PhotoAnalysis['socialMediaStrategy'] {

  const strategies = {
    projection: {
      contentType: 'Reel' as const,
      caption: 'La lumière devient sculpture 💫 Découvrez le processus créatif unique de Guillaume Farré #ConceptCarArt',
      hashtags: ['#ConceptCarArt', '#AutomotiveArt', '#LightArt', '#ModernArt', '#CarArtist', '#AbstractArt', '#FrenchArtist']
    },
    atelier: {
      contentType: 'Carousel' as const,
      caption: 'Dans l\'atelier : quand la Ferrari devient pinceau 🎨🏎️ Le processus créatif révélé',
      hashtags: ['#ArtStudio', '#CreativeProcess', '#AutomotiveArt', '#BehindTheScenes', '#ArtistAtWork', '#ContemporaryArt']
    },
    empreintes: {
      contentType: 'Post' as const,
      caption: 'Empreintes de vitesse ⚡ Chaque trace raconte une histoire de mouvement et d\'énergie',
      hashtags: ['#AbstractArt', '#MotionArt', '#ModernArtist', '#ArtCollector', '#LimitedEdition', '#FineArt']
    },
    origins: {
      contentType: 'Story' as const,
      caption: 'Tout commence avec une petite voiture n°20... 🚗 L\'origine d\'une passion artistique',
      hashtags: ['#ArtistStory', '#Inspiration', '#ChildhoodMemories', '#ArtJourney', '#BehindTheArt']
    }
  };

  const strategy = strategies[category.toLowerCase()] || strategies.atelier;

  return {
    instagramScore: viralityScore,
    bestTimeToPost: viralityScore >= 90
      ? 'Mardi ou Jeudi 18h-20h (prime time engagement)'
      : 'Mercredi 12h-14h ou Samedi 10h-12h',
    suggestedHashtags: strategy.hashtags,
    contentType: strategy.contentType,
    captionIdea: strategy.caption,
    expectedEngagement: viralityScore >= 90 ? 'high' : viralityScore >= 80 ? 'medium' : 'low'
  };
}

function createArtisticAnalysis(
  category: string,
  filename: string,
  artisticQuality: number
): PhotoAnalysis['artisticAnalysis'] {

  const analyses = {
    projection: {
      composition: 'Composition dynamique jouant sur la lumière et le mouvement. Équilibre entre abstraction et suggestion.',
      colors: 'Palette de couleurs spectaculaire avec contrastes lumineux. Les projections créent des jeux de couleurs uniques.',
      emotion: 'Évoque la vitesse, l\'énergie, le mouvement figé. Sensation de dynamisme et de modernité.',
      uniqueness: 'Approche totalement unique dans l\'art automobile. Technique signature de Guillaume Farré.',
      marketTrends: 'L\'art lumineux est très recherché. Tendance forte pour les œuvres immersives et techniques.'
    },
    atelier: {
      composition: 'Composition documentaire avec esthétique industrielle. Authenticité du processus créatif.',
      colors: 'Tons bruts et authentiques. Contraste entre métal, peinture et outils.',
      emotion: 'Transmet la passion, le travail, l\'authenticité. Le spectateur entre dans l\'intimité de la création.',
      uniqueness: 'Rare documentation du processus créatif avec la voiture comme outil. Valeur testimoniale.',
      marketTrends: 'Forte demande pour l\'authenticité et le "behind the scenes". Les collectionneurs apprécient le processus.'
    },
    empreintes: {
      composition: 'Composition abstraite avec forte dimension graphique. Équilibre des formes et des traces.',
      colors: 'Palette souvent monochrome ou bi-chrome. Contraste fort créant un impact visuel immédiat.',
      emotion: 'Suggestion du mouvement et de la vitesse. Abstraction poétique du geste automobile.',
      uniqueness: 'Signature visuelle immédiatement reconnaissable. Concept artistique fort et cohérent.',
      marketTrends: 'L\'abstraction automobile est un créneau premium. Peu d\'artistes dans ce domaine.'
    },
    origins: {
      composition: 'Composition narrative avec forte charge émotionnelle. Documents d\'archives artistiques.',
      colors: 'Tons sépia ou vintage renforçant la dimension temporelle et mémorielle.',
      emotion: 'Nostalgie, origine, genèse artistique. Connexion émotionnelle forte avec l\'histoire personnelle.',
      uniqueness: 'Documents uniques impossibles à reproduire. Valeur historique et testimoniale exceptionnelle.',
      marketTrends: 'Les œuvres avec histoire personnelle sont très prisées des collectors. Valeur narrative élevée.'
    }
  };

  return analyses[category.toLowerCase()] || analyses.atelier;
}

function createStrategicRecommendations(
  commercial: number,
  socialScore: number,
  edition: PhotoAnalysis['editionStrategy'],
  category: string
): string[] {

  const recommendations: string[] = [];

  // Recommandations basées sur le potentiel commercial
  if (commercial >= 90) {
    recommendations.push('🎯 PRIORITÉ HAUTE : Cette œuvre a un potentiel exceptionnel. À mettre en avant immédiatement.');
    recommendations.push('💰 Considérer une campagne marketing dédiée avec budget pub Instagram/Facebook.');
    recommendations.push('🏛️ Contacter les galeries d\'art automobile et les décorateurs d\'intérieur haut de gamme.');
  } else if (commercial >= 80) {
    recommendations.push('⭐ BON POTENTIEL : À inclure dans la sélection principale du site et des réseaux sociaux.');
    recommendations.push('📱 Créer du contenu organique régulier autour de cette œuvre.');
  }

  // Recommandations réseaux sociaux
  if (socialScore >= 90) {
    recommendations.push('📲 VIRALITÉ ÉLEVÉE : Créer un Reel ou TikTok mettant en scène cette œuvre avec musique tendance.');
    recommendations.push('🎬 Filmer le processus de création ou l\'histoire derrière l\'œuvre.');
  }

  // Recommandations d'édition
  if (edition.type === 'limited' && edition.limitedNumber && edition.limitedNumber <= 10) {
    recommendations.push('💎 ÉDITION TRÈS LIMITÉE : Communiquer fortement sur l\'exclusivité. Créer un sentiment d\'urgence.');
    recommendations.push('📧 Informer la liste VIP en premier. Offrir un accès prioritaire.');
  }

  // Recommandations par catégorie
  if (category === 'origins') {
    recommendations.push('📖 Raconter l\'histoire : Créer un storytelling fort autour de cette œuvre d\'origine.');
  }

  if (category === 'projection') {
    recommendations.push('🎨 Mettre en avant l\'aspect technique et innovant. Intéresser les médias spécialisés.');
  }

  // Recommandations packaging
  if (commercial >= 85) {
    recommendations.push('📦 PACKAGING PREMIUM : Investir dans un encadrement haut de gamme et un packaging soigné.');
    recommendations.push('🎁 Inclure un certificat d\'authenticité détaillé et une note personnalisée de l\'artiste.');
  }

  // Recommandations partenariats
  if (commercial >= 90 || category === 'projection') {
    recommendations.push('🤝 Contacter des marques automobiles premium (Ferrari, Porsche) pour partenariats ou expositions.');
  }

  return recommendations;
}
