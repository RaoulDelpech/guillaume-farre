/**
 * 📱 INSTAGRAM OPTIMIZER - Système Ultra-Optimisé pour Artistes
 *
 * Analyse et génère des posts Instagram parfaitement optimisés basé sur :
 * - Algorithme Instagram 2025 (Reels > Carousel > Posts)
 * - Tendances marché de l'art (#artcollector, #contemporaryart)
 * - Timing optimal (fuseau horaire, audience active)
 * - Hashtags stratégiques (mix viral + niche + géo)
 * - Storytelling engageant + Call-to-action
 *
 * OBJECTIF : Maximiser reach, engagement, et conversion en collectionneurs
 */

// Hashtags stratégiques par catégorie
const HASHTAG_STRATEGY = {
  // TIER 1 - Ultra-populaires (10M+ posts) - Max 3
  viral: [
    '#art',
    '#contemporaryart',
    '#artist',
    '#artwork',
    '#instaart',
  ],

  // TIER 2 - Populaires niche art (1M-10M) - Max 8
  artNiche: [
    '#artcollector',
    '#fineart',
    '#modernart',
    '#artgallery',
    '#artoftheday',
    '#artlovers',
    '#contemporaryartist',
    '#artcurator',
    '#emergingartist',
    '#artbasel',
  ],

  // TIER 3 - Spécifique photographie (100K-1M) - Max 8
  photography: [
    '#photographyart',
    '#fineartphotography',
    '#contemporaryphotography',
    '#artphotography',
    '#photoartist',
    '#limitededition',
    '#artphoto',
    '#photographycollector',
  ],

  // TIER 4 - Ultra-spécifique automobile (10K-100K) - Max 8
  automotive: [
    '#automotiveart',
    '#carart',
    '#ferrariart',
    '#automotivephotography',
    '#carphotography',
    '#motorsportart',
    '#luxurycar',
    '#supercarart',
    '#automotiveartwork',
  ],

  // TIER 5 - Géo-localisés (ciblage régional) - Max 3
  geo: [
    '#parisart',
    '#frenchart',
    '#artparis',
    '#artfrance',
    '#europeancollectors',
  ],

  // TIER 6 - Trending actuels (change selon saison)
  trending: [
    '#artcollecting2025',
    '#investinart',
    '#artinvestment',
    '#collectibleart',
    '#artbasel2025',
  ],
};

// Timing optimal basé sur études Instagram
const OPTIMAL_POSTING_TIMES = {
  // Meilleurs jours de la semaine
  bestDays: ['mardi', 'mercredi', 'jeudi'] as const,
  avoidDays: ['dimanche', 'lundi matin'] as const,

  // Meilleurs créneaux horaires (heure de Paris)
  timeslots: [
    {
      time: '11:00-13:00',
      reason: 'Pause déjeuner - Scroll Instagram',
      engagement: 'très élevé',
      audience: 'Collectionneurs Europe',
    },
    {
      time: '17:00-19:00',
      reason: 'Fin journée travail - Peak usage',
      engagement: 'maximum',
      audience: 'Global (Europe + début USA)',
    },
    {
      time: '20:00-22:00',
      reason: 'Soirée détente - Contenu premium',
      engagement: 'élevé',
      audience: 'Collectionneurs fortunés (temps calme)',
    },
  ],

  // Spécifique pour Reels
  reelsBestTimes: ['18:00-19:00', '21:00-22:00'],

  // À éviter absolument
  worstTimes: ['01:00-07:00', '13:00-14:00 (sieste)'],
};

// Tendances actuelles marché de l'art sur Instagram
const MARKET_TRENDS_2025 = {
  contentTypes: {
    reels: {
      priority: 1,
      reach: '10-50x plus que posts',
      engagement: 'maximum',
      recommendations: [
        'Processus de création (time-lapse)',
        'Behind-the-scenes atelier',
        'Transformation avant/après',
        'Zoom détails œuvre',
      ],
      optimalDuration: '15-30 secondes',
      music: 'Musique trending (vérifier Instagram Audio Library)',
    },
    carousel: {
      priority: 2,
      reach: '2-3x plus que posts simples',
      engagement: 'très élevé',
      recommendations: [
        'Détails progressifs de l\'œuvre',
        'Série complète (1 série = 1 carousel)',
        'Processus pas à pas',
        '10 slides max - Premier slide CRUCIAL',
      ],
    },
    post: {
      priority: 3,
      reach: 'standard',
      engagement: 'moyen',
      recommendations: [
        'Œuvre exceptionnelle seule',
        'Annonce vernissage/vente',
        'Acquisition musée/galerie',
      ],
    },
  },

  audioStrategy: {
    trending: 'Utiliser musiques trending (icône flèche montante)',
    original: 'Audio original = Boost algorithme si viral',
    noAudio: 'Éviter - Pénalisé par algorithme',
  },

  captionBestPractices: {
    hookFirstLine: 'Les 125 premiers caractères apparaissent sans "voir plus"',
    length: '150-250 caractères optimal',
    callToAction: 'Toujours finir par CTA (lien bio, DM, commentaire)',
    storytelling: 'Raconter processus/histoire > Description technique',
    emojis: '3-5 émojis max - Aère le texte',
  },
};

export interface InstagramPost {
  // Contenu visuel
  visual: {
    type: 'reel' | 'carousel' | 'post';
    photoPath: string;
    additionalPhotos?: string[]; // Pour carousel
    coverImageIndex?: number; // Pour carousel
    duration?: string; // Pour reel
    music?: string; // Pour reel
  };

  // Légende optimisée
  caption: {
    hook: string; // Première ligne accrocheuse
    body: string; // Corps de la légende
    callToAction: string; // Appel à l'action
    full: string; // Légende complète assemblée
  };

  // Hashtags stratégiques
  hashtags: {
    primary: string[]; // 3-5 hashtags principaux
    secondary: string[]; // 10-15 hashtags complémentaires
    geo: string[]; // 2-3 hashtags géo
    full: string; // Tous hashtags assemblés
  };

  // Timing
  timing: {
    bestDay: string;
    bestTime: string;
    timezone: string;
    reasoning: string;
  };

  // Métrique prédites
  predictions: {
    estimatedReach: string;
    estimatedEngagement: string;
    targetAudience: string;
    conversionPotential: 'élevé' | 'moyen' | 'faible';
  };

  // Stratégie d'engagement
  engagementStrategy: {
    replyToComments: string; // Template de réponses
    dmStrategy: string; // Comment gérer les DMs
    storyFollowUp: string; // Story à publier après
    crossPromotion: string; // Où partager (Facebook, LinkedIn)
  };

  // Instructions techniques
  technicalSpecs: {
    imageRatio: string; // ex: "4:5 (portrait)" ou "1:1 (carré)"
    resolution: string; // ex: "1080×1350px"
    fileSize: string; // ex: "< 30MB"
    filters: string; // ex: "Contraste +10%, Saturation -5%"
    tips: string[];
  };
}

/**
 * Génère un post Instagram ultra-optimisé pour une œuvre
 */
export function generateOptimizedInstagramPost(
  photoPath: string,
  photoTitle: string,
  category: string,
  seriesName?: string,
  artisticAnalysis?: string
): InstagramPost {

  const isProcessWork = category === 'atelier';
  const isTraceWork = category === 'empreintes';

  // Déterminer type de contenu optimal
  const visualType: 'reel' | 'carousel' | 'post' = isProcessWork ? 'reel' : 'carousel';

  // HOOK ultra-accrocheur (125 caractères max - visible sans "voir plus")
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

  // BODY - Storytelling engageant
  const body = isProcessWork
    ? `

Mon processus de création est unique : j'utilise une Ferrari comme outil créateur.

Pourquoi ? Depuis enfant, je faisais rouler ma petite voiture n°20 dans la peinture. Aujourd'hui, c'est une vraie Ferrari.

Le résultat : des œuvres uniques, impossibles à reproduire.
`
    : `

${seriesName || photoTitle} - Photographie d'art

${isTraceWork
  ? 'Ces traces sont le résultat direct d\'une Ferrari sur toile. Chaque œuvre capture un instant unique du processus créatif.'
  : 'Capturer l\'instant où le mouvement devient art.'}

Tirage limité haute qualité - Formats jusqu'à 3 mètres disponibles.
`;

  // CALL TO ACTION stratégique
  const callToAction = `

💎 Intéressé(e) par cette œuvre ?
👉 Lien dans ma bio pour voir la collection complète
📩 DM pour formats monumentaux ou commandes spéciales

#GuillaumeFarré`;

  // HASHTAGS STRATÉGIQUES optimisés
  const primaryHashtags = isProcessWork
    ? ['#artcollector', '#contemporaryart', '#processart', '#ferrariart', '#uniqueart']
    : ['#fineartphotography', '#artcollector', '#contemporaryphotography', '#limitededition'];

  const secondaryHashtags = [
    ...HASHTAG_STRATEGY.artNiche.slice(0, 5),
    ...HASHTAG_STRATEGY.photography.slice(0, 4),
    ...(isProcessWork ? HASHTAG_STRATEGY.automotive.slice(0, 6) : HASHTAG_STRATEGY.photography.slice(4, 8)),
  ];

  const geoHashtags = ['#parisart', '#artfrance', '#europeancollectors'];

  // TIMING OPTIMAL
  const bestDay = 'mercredi';
  const bestTime = isProcessWork ? '18:00' : '11:30'; // Reel = soirée, Carousel = midi
  const timezone = 'Europe/Paris (CET)';

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

    caption: {
      hook,
      body,
      callToAction,
      full: `${hook}${body}${callToAction}`,
    },

    hashtags: {
      primary: primaryHashtags,
      secondary: secondaryHashtags,
      geo: geoHashtags,
      full: `

${primaryHashtags.join(' ')}
${secondaryHashtags.join(' ')}
${geoHashtags.join(' ')}`,
    },

    timing: {
      bestDay,
      bestTime,
      timezone,
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
      replyToComments: `
**Templates de réponses aux commentaires** :

"Wow incroyable !" → "Merci ! 🙏 Le processus est vraiment unique. DM si tu veux voir la vidéo complète."

"C'est à vendre ?" → "Oui ! Lien dans ma bio pour voir tous les formats disponibles 👆 Ou DM pour infos."

"Combien ça coûte ?" → "Les prix varient selon le format (A3 à 3 mètres). DM et je t'envoie le détail 📩"

"Tu utilises vraiment une Ferrari ?" → "Oui, une vraie ! 🏎️ C'est mon outil de création depuis des années."
      `,

      dmStrategy: `
**Comment gérer les DMs** :

1. Répondre sous 2h (algorithme favorise réactivité)
2. Message type : "Salut ! Merci pour ton intérêt 🙏 Tu cherches quel format ?"
3. Envoyer PDF catalogue si sérieux
4. Proposer appel Zoom pour commandes >5K€
5. Toujours finir par question ouverte (relance conversation)
      `,

      storyFollowUp: `
**Story à publier 2-3h après le post** :

- Screenshot du post avec "Merci pour vos 500+ likes 🙏"
- Sondage : "Quel format préférez-vous ? A2 / 3 mètres"
- Behind-the-scenes : Vidéo courte du processus
- "Swipe up" vers lien boutique (si >10K followers)
      `,

      crossPromotion: `
**Où partager aussi** :

✅ Facebook (collectionneurs +45 ans)
✅ LinkedIn (professionnels, entreprises, acquisitions corporate)
✅ Pinterest (recherche "art automobile" très active)
❌ TikTok (audience trop jeune pour prix premium)
      `,
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

/**
 * Génère une stratégie Instagram complète sur 30 jours
 */
export function generate30DayInstagramStrategy(photos: Array<{path: string; title: string; category: string}>) {
  return {
    overview: `
**Stratégie Instagram 30 jours - Guillaume Farré**

🎯 OBJECTIF :
- +2000 followers qualifiés (collectionneurs)
- 10-15% engagement rate
- 5-10 leads qualifiés (DMs sérieux)
- 2-3 ventes directes

📅 FRÉQUENCE :
- 3-4 posts / semaine
- Mix : 60% Reels, 30% Carousel, 10% Posts

🎨 CONTENUS :
Semaine 1 : Processus création (Reels behind-the-scenes)
Semaine 2 : Série "Empreintes" (Carousels détails)
Semaine 3 : Formats monumentaux (Reels wow-factor)
Semaine 4 : Collectionneurs testimonials + Rétrospective mois
    `,

    weeklyPlan: [
      {
        week: 1,
        theme: 'Découverte du processus',
        posts: [
          { day: 'mardi', type: 'reel', topic: 'Ferrari en action (time-lapse)' },
          { day: 'jeudi', type: 'carousel', topic: 'Série Atelier (5 œuvres)' },
          { day: 'samedi', type: 'reel', topic: 'Zoom détails peinture' },
        ],
      },
      // ... 3 autres semaines
    ],

    hashtagRotation: 'Varier les hashtags chaque post (éviter spam Instagram)',

    metrics: {
      trackDaily: ['Reach', 'Engagement rate', 'Profile visits', 'Website clicks'],
      trackWeekly: ['Follower growth', 'DMs received', 'Top performing posts'],
      trackMonthly: ['Revenue generated', 'Collector conversions', 'International reach'],
    },
  };
}
