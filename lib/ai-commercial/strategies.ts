/**
 * AI Commercial Analyzer - Strategies social media, artistique et recommandations
 *
 * @author Lalou
 */

import type { PhotoAnalysis } from './types';

export function createSocialMediaStrategy(
  viralityScore: number,
  category: string,
  filename: string,
  artisticQuality: number
): PhotoAnalysis['socialMediaStrategy'] {

  const strategies = {
    projection: {
      contentType: 'Reel' as const,
      caption: 'La lumière devient sculpture. Découvrez le processus créatif unique de Guillaume Farré #ConceptCarArt',
      hashtags: ['#ConceptCarArt', '#AutomotiveArt', '#LightArt', '#ModernArt', '#CarArtist', '#AbstractArt', '#FrenchArtist']
    },
    atelier: {
      contentType: 'Carousel' as const,
      caption: 'Dans l\'atelier : quand la Ferrari devient pinceau. Le processus créatif révélé',
      hashtags: ['#ArtStudio', '#CreativeProcess', '#AutomotiveArt', '#BehindTheScenes', '#ArtistAtWork', '#ContemporaryArt']
    },
    empreintes: {
      contentType: 'Post' as const,
      caption: 'Empreintes de vitesse. Chaque trace raconte une histoire de mouvement et d\'énergie',
      hashtags: ['#AbstractArt', '#MotionArt', '#ModernArtist', '#ArtCollector', '#LimitedEdition', '#FineArt']
    },
    origins: {
      contentType: 'Story' as const,
      caption: 'Tout commence avec une petite voiture n\u00b020... L\'origine d\'une passion artistique',
      hashtags: ['#ArtistStory', '#Inspiration', '#ChildhoodMemories', '#ArtJourney', '#BehindTheArt']
    }
  };

  const categoryKey = category.toLowerCase() as keyof typeof strategies;
  const strategy = strategies[categoryKey] || strategies.atelier;

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

export function createArtisticAnalysis(
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

  const categoryKey = category.toLowerCase() as keyof typeof analyses;
  return analyses[categoryKey] || analyses.atelier;
}

export function createStrategicRecommendations(
  commercial: number,
  socialScore: number,
  edition: PhotoAnalysis['editionStrategy'],
  category: string
): string[] {

  const recommendations: string[] = [];

  // Recommandations basees sur le potentiel commercial
  if (commercial >= 90) {
    recommendations.push('PRIORITE HAUTE : Cette œuvre a un potentiel exceptionnel. A mettre en avant immédiatement.');
    recommendations.push('Considérer une campagne marketing dédiée avec budget pub Instagram/Facebook.');
    recommendations.push('Contacter les galeries d\'art automobile et les décorateurs d\'intérieur haut de gamme.');
  } else if (commercial >= 80) {
    recommendations.push('BON POTENTIEL : A inclure dans la sélection principale du site et des réseaux sociaux.');
    recommendations.push('Créer du contenu organique régulier autour de cette œuvre.');
  }

  // Recommandations reseaux sociaux
  if (socialScore >= 90) {
    recommendations.push('VIRALITE ELEVEE : Créer un Reel ou TikTok mettant en scène cette œuvre avec musique tendance.');
    recommendations.push('Filmer le processus de création ou l\'histoire derrière l\'œuvre.');
  }

  // Recommandations d'edition
  if (edition.type === 'limited' && edition.limitedNumber && edition.limitedNumber <= 10) {
    recommendations.push('EDITION TRES LIMITEE : Communiquer fortement sur l\'exclusivité. Créer un sentiment d\'urgence.');
    recommendations.push('Informer la liste VIP en premier. Offrir un accès prioritaire.');
  }

  // Recommandations par categorie
  if (category === 'origins') {
    recommendations.push('Raconter l\'histoire : Créer un storytelling fort autour de cette œuvre d\'origine.');
  }

  if (category === 'projection') {
    recommendations.push('Mettre en avant l\'aspect technique et innovant. Intéresser les médias spécialisés.');
  }

  // Recommandations packaging
  if (commercial >= 85) {
    recommendations.push('PACKAGING PREMIUM : Investir dans un encadrement haut de gamme et un packaging soigné.');
    recommendations.push('Inclure un certificat d\'authenticité détaillé et une note personnalisée de l\'artiste.');
  }

  // Recommandations partenariats
  if (commercial >= 90 || category === 'projection') {
    recommendations.push('Contacter des marques automobiles premium (Ferrari, Porsche) pour partenariats ou expositions.');
  }

  return recommendations;
}

// Lalou
