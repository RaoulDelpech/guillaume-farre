/**
 * Instagram Optimizer - Hashtags, timing, et tendances
 *
 * @author Lalou
 */

export const HASHTAG_STRATEGY = {
  viral: [
    '#art',
    '#contemporaryart',
    '#artist',
    '#artwork',
    '#instaart',
  ],

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

  geo: [
    '#parisart',
    '#frenchart',
    '#artparis',
    '#artfrance',
    '#europeancollectors',
  ],

  trending: [
    '#artcollecting2025',
    '#investinart',
    '#artinvestment',
    '#collectibleart',
    '#artbasel2025',
  ],
};

export const OPTIMAL_POSTING_TIMES = {
  bestDays: ['mardi', 'mercredi', 'jeudi'] as const,
  avoidDays: ['dimanche', 'lundi matin'] as const,

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

  reelsBestTimes: ['18:00-19:00', '21:00-22:00'],
  worstTimes: ['01:00-07:00', '13:00-14:00 (sieste)'],
};

export const MARKET_TRENDS_2025 = {
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
