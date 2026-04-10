/**
 * Instagram Optimizer - Generateur de posts optimises
 *
 * @author Lalou
 */

import type { InstagramPost } from './types';
import { HASHTAG_STRATEGY } from './data';

/**
 * Genere un post Instagram ultra-optimise pour une oeuvre
 */
export function generateOptimizedInstagramPost(
  photoPath: string,
  photoTitle: string,
  category: string,
  seriesName?: string,
  _artisticAnalysis?: string
): InstagramPost {

  const isProcessWork = category === 'atelier';
  const isTraceWork = category === 'empreintes';

  const visualType: 'reel' | 'carousel' | 'post' = isProcessWork ? 'reel' : 'carousel';

  const hooks = {
    processWork: [
      '🏎️ Une Ferrari de 500 000€ comme pinceau géant... Regardez ce qui se passe.',
      '🎨 J\'utilise une Ferrari pour peindre. Oui, une vraie. Voici le résultat.',
      '⚡ Le son d\'un V12 Ferrari qui crée de l\'art. Jamais vu ça.',
    ],
    traceWork: [
      '🔥 Ces traces noires ? C\'est une Ferrari qui a peint. Unique au monde.',
      '🎯 Quand l\'automobile devient art... Ces empreintes valent 15 000€.',
      '✨ Une Ferrari, de la peinture, une toile géante. Résultat : fascinant.',
    ],
    projection: [
      '📸 Capturer l\'instant exact où une Ferrari crée de l\'art.',
      '🌟 Photographie d\'art automobile. Tirage limité à 15 exemplaires.',
    ],
  };

  const hook = isProcessWork
    ? hooks.processWork[Math.floor(Math.random() * hooks.processWork.length)]
    : isTraceWork
    ? hooks.traceWork[Math.floor(Math.random() * hooks.traceWork.length)]
    : hooks.projection[0];

  const body = isProcessWork
    ? `\n\nMon processus de création est unique : j'utilise une Ferrari comme outil créateur.\n\nPourquoi ? Depuis enfant, je faisais rouler ma petite voiture n°20 dans la peinture. Aujourd'hui, c'est une vraie Ferrari.\n\nLe résultat : des œuvres uniques, impossibles à reproduire.\n`
    : `\n\n${seriesName || photoTitle} - Photographie d'art\n\n${isTraceWork
      ? 'Ces traces sont le résultat direct d\'une Ferrari sur toile. Chaque œuvre capture un instant unique du processus créatif.'
      : 'Capturer l\'instant où le mouvement devient art.'}\n\nTirage limité haute qualité - Formats jusqu'à 3 mètres disponibles.\n`;

  const callToAction = `\n\n💎 Intéressé(e) par cette œuvre ?\n👉 Lien dans ma bio pour voir la collection complète\n📩 DM pour formats monumentaux ou commandes spéciales\n\n#GuillaumeFarré`;

  const primaryHashtags = isProcessWork
    ? ['#artcollector', '#contemporaryart', '#processart', '#ferrariart', '#uniqueart']
    : ['#fineartphotography', '#artcollector', '#contemporaryphotography', '#limitededition'];

  const secondaryHashtags = [
    ...HASHTAG_STRATEGY.artNiche.slice(0, 5),
    ...HASHTAG_STRATEGY.photography.slice(0, 4),
    ...(isProcessWork ? HASHTAG_STRATEGY.automotive.slice(0, 6) : HASHTAG_STRATEGY.photography.slice(4, 8)),
  ];

  const geoHashtags = ['#parisart', '#artfrance', '#europeancollectors'];

  const bestDay = 'mercredi';
  const bestTime = isProcessWork ? '18:00' : '11:30';

  return {
    visual: {
      type: visualType,
      photoPath,
      additionalPhotos: visualType === 'carousel' ? [
        `${photoPath} (plan large)`,
        `${photoPath} (détail 1)`,
        `${photoPath} (détail 2)`,
        `${photoPath} (processus de création)`,
        `${photoPath} (signature)`,
      ] : undefined,
      duration: visualType === 'reel' ? '15-20 secondes' : undefined,
      music: visualType === 'reel'
        ? '🎵 Rechercher "Epic" ou "Cinematic" dans Instagram Audio (trending)'
        : undefined,
    },
    caption: { hook, body, callToAction, full: `${hook}${body}${callToAction}` },
    hashtags: {
      primary: primaryHashtags,
      secondary: secondaryHashtags,
      geo: geoHashtags,
      full: `\n\n${primaryHashtags.join(' ')}\n${secondaryHashtags.join(' ')}\n${geoHashtags.join(' ')}`,
    },
    timing: {
      bestDay,
      bestTime,
      timezone: 'Europe/Paris (CET)',
      reasoning: visualType === 'reel'
        ? `Reels performent mieux en soirée (18h) quand les gens scrollent pour se détendre. Mercredi = milieu de semaine, engagement max.`
        : `Carousel en pause déjeuner (11h30) = temps pour swiper les slides. Mercredi = jour optimal algorithme.`,
    },
    predictions: {
      estimatedReach: isProcessWork ? '10 000 - 50 000 comptes' : '3 000 - 15 000 comptes',
      estimatedEngagement: isProcessWork ? '500-2000 interactions' : '200-800 interactions',
      targetAudience: 'Collectionneurs d\'art 30-55 ans, passionnés automobile, revenus >100K€/an',
      conversionPotential: isProcessWork ? 'élevé' : 'moyen',
    },
    engagementStrategy: {
      replyToComments: `**Templates de réponses aux commentaires** :\n\n"Wow incroyable !" → "Merci ! 🙏 Le processus est vraiment unique. DM si tu veux voir la vidéo complète."\n\n"C'est à vendre ?" → "Oui ! Lien dans ma bio pour voir tous les formats disponibles 👆 Ou DM pour infos."\n\n"Combien ça coûte ?" → "Les prix varient selon le format (A3 à 3 mètres). DM et je t'envoie le détail 📩"\n\n"Tu utilises vraiment une Ferrari ?" → "Oui, une vraie ! 🏎️ C'est mon outil de création depuis des années."`,
      dmStrategy: `**Comment gérer les DMs** :\n\n1. Répondre sous 2h (algorithme favorise réactivité)\n2. Message type : "Salut ! Merci pour ton intérêt 🙏 Tu cherches quel format ?"\n3. Envoyer PDF catalogue si sérieux\n4. Proposer appel Zoom pour commandes >5K€\n5. Toujours finir par question ouverte (relance conversation)`,
      storyFollowUp: `**Story à publier 2-3h après le post** :\n\n- Screenshot du post avec "Merci pour vos 500+ likes 🙏"\n- Sondage : "Quel format préférez-vous ? A2 / 3 mètres"\n- Behind-the-scenes : Vidéo courte du processus\n- "Swipe up" vers lien boutique (si >10K followers)`,
      crossPromotion: `**Où partager aussi** :\n\n✅ Facebook (collectionneurs +45 ans)\n✅ LinkedIn (professionnels, entreprises, acquisitions corporate)\n✅ Pinterest (recherche "art automobile" très active)\n❌ TikTok (audience trop jeune pour prix premium)`,
    },
    technicalSpecs: {
      imageRatio: visualType === 'reel' ? '9:16 (vertical)' : '4:5 (portrait) ou 1:1 (carré)',
      resolution: visualType === 'reel' ? '1080×1920px' : '1080×1350px (4:5) ou 1080×1080px (carré)',
      fileSize: visualType === 'reel' ? '< 650MB' : '< 30MB',
      filters: 'Contraste +15%, Netteté +10%, Saturation -5% (éviter sur-saturation)',
      tips: [
        '📱 Toujours prévisualiser sur mobile avant de publier',
        '✨ Premier slide/frame CRUCIAL - 80% décident en 0.5sec',
        '🎨 Fond sombre pour faire ressortir l\'œuvre',
        '🔥 Si Reel : Hook visuel dans les 3 premières secondes',
        '💡 Légende : Emojis au début de ligne pour aérer',
        '⚡ Publier quand tu peux répondre aux commentaires (2h après)',
      ],
    },
  };
}
