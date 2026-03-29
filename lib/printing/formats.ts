/**
 * Formats d'impression et matériaux disponibles
 * @author Lalou
 */

export const PRINT_FORMATS = {
  A4: { width: 21, height: 29.7, label: 'A4 (21 x 29.7 cm)', price: 150 },
  A3: { width: 29.7, height: 42, label: 'A3 (29.7 x 42 cm)', price: 250 },
  A2: { width: 42, height: 59.4, label: 'A2 (42 x 59.4 cm)', price: 400 },
  A1: { width: 59.4, height: 84.1, label: 'A1 (59.4 x 84.1 cm)', price: 650 },
  A0: { width: 84.1, height: 118.9, label: 'A0 (84.1 x 118.9 cm)', price: 950 },
  XXL_100: { width: 100, height: 70, label: '100 x 70 cm', price: 1200 },
  XXL_120: { width: 120, height: 80, label: '120 x 80 cm', price: 1500 },
  XXL_150: { width: 150, height: 100, label: '150 x 100 cm', price: 2200 },
  MEGA_200: { width: 200, height: 133, label: '200 x 133 cm (2 metres)', price: 3500 },
  MEGA_250: { width: 250, height: 167, label: '250 x 167 cm (2.5 metres)', price: 4800 },
  MEGA_300: { width: 300, height: 200, label: '300 x 200 cm (3 metres)', price: 6500 },
} as const;

export const PRINT_MATERIALS = {
  'fine-art': {
    label: 'Papier Fine Art',
    description: 'Papier premium mat 300g/m2 - Conservation 100+ ans',
    recommended: true,
  },
  'alu-dibond': {
    label: 'Alu-Dibond',
    description: 'Support aluminium rigide - Effet moderne et lumineux',
    recommended: false,
  },
  acrylic: {
    label: 'Acrylique',
    description: 'Impression derriere acrylique - Effet galerie premium',
    recommended: false,
  },
  canvas: {
    label: 'Toile Canvas',
    description: 'Impression sur toile tendue - Rendu artistique',
    recommended: false,
  },
} as const;

// Aliases pour rétrocompatibilité
export const WHITEWALL_FORMATS = PRINT_FORMATS;
export const WHITEWALL_MATERIALS = PRINT_MATERIALS;
