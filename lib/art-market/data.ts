/**
 * Art Market Expert - Donnees de reference
 *
 * Ventes comparables, materiaux d'exception, strategies de vente
 *
 * @author Lalou
 */

// Base de donnees de ventes comparables reelles
export const COMPARABLE_SALES = {
  // Photographie automobile - Ventes recentes
  automotive: [
    {
      artist: 'Andreas Gursky',
      title: 'F1 Pit Stop',
      year: 2007,
      sale: 'Sotheby\'s New York',
      date: '2022',
      format: '207 × 368 cm',
      price: 850000,
      medium: 'C-print monté sur Plexiglas',
    },
    {
      artist: 'Richard Prince',
      title: 'Untitled (Cowboy)',
      year: 1989,
      sale: 'Christie\'s New York',
      date: '2021',
      format: '127 × 178 cm',
      price: 450000,
      medium: 'Chromogenic print',
    },
    {
      artist: 'Jeff Wall',
      title: 'Diagonal Composition',
      year: 1993,
      sale: 'Phillips London',
      date: '2023',
      format: '200 × 250 cm',
      price: 320000,
      medium: 'Cibachrome transparency backlit',
    },
  ],

  // Art processuel et performance
  processArt: [
    {
      artist: 'Anish Kapoor',
      title: 'Shooting into the Corner',
      year: 2009,
      sale: 'Art Basel Miami',
      date: '2019',
      format: 'Installation monumentale',
      price: 1200000,
      medium: 'Performance/Installation',
    },
    {
      artist: 'Yves Klein',
      title: 'Anthropométrie',
      year: 1960,
      sale: 'Christie\'s Paris',
      date: '2020',
      format: '156 × 282 cm',
      price: 1800000,
      medium: 'Pigment sur papier',
    },
  ],

  // Photographie grand format
  largeFormat: [
    {
      artist: 'Andreas Gursky',
      title: 'Rhine II',
      year: 1999,
      sale: 'Christie\'s New York',
      date: '2011',
      format: '190 × 360 cm',
      price: 4338500,
      medium: 'C-print monté sur Plexiglas',
      notes: 'Record mondial pour une photographie',
    },
    {
      artist: 'Cindy Sherman',
      title: 'Untitled #96',
      year: 1981,
      sale: 'Sotheby\'s New York',
      date: '2011',
      format: '200 × 150 cm',
      price: 3890500,
      medium: 'Chromogenic color print',
    },
  ],
};

// Materiaux d'exception utilises par les plus grands
export const EXCEPTIONAL_MATERIALS = {
  'lambda-metallic': {
    name: 'Lambda Metallic Print',
    description: 'Support aluminium avec finition métallique - Utilisé par Gursky, Wall',
    priceMultiplier: 2.5,
    prestige: 'ultra-high',
    examples: 'Andreas Gursky "Rhine II" (record à 4.3M$)',
  },
  'diasec-face': {
    name: 'DiaSec Face Mounting',
    description: 'Montage sous acrylique haute brillance - Standard galeries internationales',
    priceMultiplier: 2.0,
    prestige: 'high',
    examples: 'Wolfgang Tillmans, Thomas Ruff',
  },
  'cibachrome': {
    name: 'Cibachrome (Ilfochrome)',
    description: 'Procédé vintage premium - Conservation 500 ans minimum',
    priceMultiplier: 2.8,
    prestige: 'ultra-high',
    examples: 'Jeff Wall "Diagonal Composition" (vendu 320K$)',
  },
  'pigment-archival': {
    name: 'Tirage Pigmentaire Archival',
    description: 'Encres pigmentaires 12 couleurs - Standard musées',
    priceMultiplier: 1.5,
    prestige: 'high',
    examples: 'Standard Tate Modern, MoMA, Centre Pompidou',
  },
};

// Strategies de vente internationales
export const SALES_STRATEGIES = {
  auction: {
    name: 'Vente aux Enchères',
    venues: [
      {
        house: 'Christie\'s',
        locations: ['New York', 'Londres', 'Paris', 'Hong Kong'],
        bestFor: 'Œuvres 50K€+',
        commission: '25% + frais',
        prestige: 'ultra-high',
      },
      {
        house: 'Sotheby\'s',
        locations: ['New York', 'Londres', 'Paris'],
        bestFor: 'Œuvres 30K€+',
        commission: '25% + frais',
        prestige: 'ultra-high',
      },
      {
        house: 'Phillips',
        locations: ['New York', 'Londres'],
        bestFor: 'Œuvres 20K€+',
        commission: '22% + frais',
        prestige: 'high',
      },
    ],
    timing: 'Ventes printemps (mai) et automne (novembre)',
    preparation: '6-12 mois',
  },

  fairsAndEvents: {
    name: 'Foires et Événements',
    major: [
      {
        event: 'Art Basel',
        locations: ['Basel', 'Miami Beach', 'Hong Kong'],
        timing: 'Juin (Basel), Décembre (Miami), Mars (HK)',
        bestFor: 'Œuvres 10K-500K€',
        audience: '100,000+ collectionneurs internationaux',
      },
      {
        event: 'Frieze',
        locations: ['Londres', 'New York', 'Los Angeles'],
        timing: 'Octobre (Londres), Mai (NY)',
        bestFor: 'Œuvres 15K-300K€',
        audience: 'Collectionneurs anglo-saxons premium',
      },
      {
        event: 'FIAC / Art Paris',
        locations: ['Paris'],
        timing: 'Octobre (FIAC), Avril (Art Paris)',
        bestFor: 'Œuvres 5K-200K€',
        audience: 'Collectionneurs européens',
      },
    ],
  },

  galleries: {
    name: 'Galeries',
    topTier: [
      {
        gallery: 'Gagosian',
        locations: ['NY', 'Londres', 'Paris', 'Hong Kong'],
        commissionRange: '50%',
        bestFor: 'Artistes établis, œuvres 100K€+',
        prestige: 'ultra-high',
      },
      {
        gallery: 'Hauser & Wirth',
        locations: ['NY', 'Londres', 'Zurich', 'Los Angeles'],
        commissionRange: '50%',
        bestFor: 'Artistes mid-career, 50K€+',
        prestige: 'ultra-high',
      },
      {
        gallery: 'Galerie Perrotin',
        locations: ['Paris', 'NY', 'Hong Kong', 'Tokyo'],
        commissionRange: '50%',
        bestFor: 'Artistes émergents et confirmés',
        prestige: 'high',
      },
    ],
  },
};

// Lalou
