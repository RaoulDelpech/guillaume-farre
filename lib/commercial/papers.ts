/**
 * Commercial Performance - Types de papier Fine Art professionnels
 *
 * @author Lalou
 */

export const FINE_ART_PAPERS = {
  // PAPIERS COTON 100% - Conservation musee
  hahnemuhle_photo_rag: {
    name: 'Hahnemühle Photo Rag\u00ae',
    composition: '100% Cotton Rag, Alpha-Cellulose',
    grammage: '308 g/m\u00b2',
    finish: 'Mat lisse',
    conservation: '300+ ans',
    characteristics: 'Référence mondiale - Texture légère, rendu velouté, blancs purs',
    bestFor: ['Fine Art Photography', 'Éditions limitées', 'Musées', 'Galeries haut de gamme'],
    priceCategory: 'premium',
    costPerM2: 35,
    rendering: {
      blacks: 'Noirs profonds',
      colors: 'Reproduction fidèle, gamut étendu',
      texture: 'Surface mate élégante',
    },
    usage: 'Standard galerie internationale',
  },

  hahnemuhle_fine_art_baryta: {
    name: 'Hahnemühle FineArt Baryta\u00ae',
    composition: '100% Cotton, baryté traditionnel',
    grammage: '325 g/m\u00b2',
    finish: 'Brillant satiné',
    conservation: '300+ ans',
    characteristics: 'Baryte coating - Rendu photographique classique, contraste élevé',
    bestFor: ['Photographie N&B', 'Portraits', 'Œuvres de maître'],
    priceCategory: 'premium-plus',
    costPerM2: 42,
    rendering: {
      blacks: 'Noirs maximum Dmax 2.55',
      colors: 'Richesse exceptionnelle',
      texture: 'Surface brillante douce',
    },
    usage: 'Collectionneurs exigeants',
  },

  canson_infinity_platine: {
    name: 'Canson Infinity Platine Fibre Rag\u00ae',
    composition: '100% Cotton Rag',
    grammage: '310 g/m\u00b2',
    finish: 'Mat satiné',
    conservation: '100+ ans',
    characteristics: 'Papier français traditionnel, texture subtile',
    bestFor: ['Fine Art', 'Éditions d\'artiste', 'Expositions'],
    priceCategory: 'premium',
    costPerM2: 38,
    rendering: {
      blacks: 'Noirs denses',
      colors: 'Palette riche',
      texture: 'Toucher coton authentique',
    },
    usage: 'Excellent rapport qualité/prix premium',
  },

  // PAPIERS ALPHA-CELLULOSE - Qualite professionnelle
  hahnemuhle_german_etching: {
    name: 'Hahnemühle German Etching\u00ae',
    composition: '100% Alpha-Cellulose',
    grammage: '310 g/m\u00b2',
    finish: 'Mat texturé',
    conservation: '100+ ans',
    characteristics: 'Texture gravure, surface structurée',
    bestFor: ['Art contemporain', 'Œuvres expressives', 'Tirages artistiques'],
    priceCategory: 'premium',
    costPerM2: 36,
    rendering: {
      blacks: 'Noirs mats',
      colors: 'Tons artistiques',
      texture: 'Relief visible - Style gravure',
    },
    usage: 'Différenciation artistique',
  },

  canson_infinity_edition_etching: {
    name: 'Canson Infinity Edition Etching Rag\u00ae',
    composition: '100% Cotton Rag',
    grammage: '310 g/m\u00b2',
    finish: 'Mat texturé',
    conservation: '100+ ans',
    characteristics: 'Surface structurée - Aspect artisanal',
    bestFor: ['Séries artistiques', 'Galeries contemporaines'],
    priceCategory: 'mid-premium',
    costPerM2: 32,
    rendering: {
      blacks: 'Noirs profonds',
      colors: 'Palette équilibrée',
      texture: 'Grain papier d\'art',
    },
    usage: 'Éditions limitées abordables',
  },

  // PAPIERS PHOTO PREMIUM - Volume qualite
  ilford_gold_fibre_silk: {
    name: 'Ilford Gold Fibre Silk\u00ae',
    composition: 'Alpha-Cellulose + RC base',
    grammage: '310 g/m\u00b2',
    finish: 'Satiné perlé',
    conservation: '100 ans',
    characteristics: 'Rendu photographique classique, séchage rapide',
    bestFor: ['Photographie commerciale', 'Séries moyennes', 'Décoration intérieure'],
    priceCategory: 'mid-range',
    costPerM2: 18,
    rendering: {
      blacks: 'Noirs denses',
      colors: 'Reproduction fidèle',
      texture: 'Satiné élégant',
    },
    usage: 'Production série à prix accessible',
  },

  epson_hot_press_natural: {
    name: 'Epson Hot Press Natural\u00ae',
    composition: '100% Cotton',
    grammage: '330 g/m\u00b2',
    finish: 'Mat lisse',
    conservation: '100+ ans',
    characteristics: 'Blanc naturel, toucher papier aquarelle',
    bestFor: ['Fine Art', 'Tirages artistiques', 'Galeries'],
    priceCategory: 'premium',
    costPerM2: 40,
    rendering: {
      blacks: 'Noirs profonds',
      colors: 'Gamut large',
      texture: 'Surface aquarelle',
    },
    usage: 'Alternative Hahnemühle',
  },

  // PAPIERS METALLIQUES - Wow factor
  breathing_color_metallic: {
    name: 'Breathing Color Metallic Silver\u00ae',
    composition: 'RC perlé métallique',
    grammage: '290 g/m\u00b2',
    finish: 'Brillant métallique',
    conservation: '75 ans',
    characteristics: 'Reflets métalliques, effet 3D, contraste maximum',
    bestFor: ['Œuvres contemporaines', 'Art automobile', 'Tirages spectaculaires'],
    priceCategory: 'specialty',
    costPerM2: 28,
    rendering: {
      blacks: 'Noirs absolus',
      colors: 'Saturation exceptionnelle',
      texture: 'Effet lumineux unique',
    },
    usage: 'Impact visuel maximum - Séries limitées premium',
  },
} as const;

// Lalou
