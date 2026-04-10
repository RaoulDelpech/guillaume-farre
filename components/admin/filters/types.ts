export interface FilterPhoto {
  filename: string;
  path: string;
  category?: string;
  status?: 'trash' | 'to-sort' | null;
  categories?: ('unlimited' | 'limited' | 'xxl' | 'monumental')[];
  seriesName?: string;
  visible: boolean;
  forSale: boolean;
}

export interface FilterState {
  status: string;
  mainCategory: string;
  subCategories: string[];
  series: string;
  showGrouped: boolean;
}

export const SUB_CATEGORY_OPTIONS: ('unlimited' | 'limited' | 'xxl' | 'monumental')[] = [
  'unlimited', 'limited', 'xxl', 'monumental'
];

export const SUB_CATEGORY_LABELS: Record<string, string> = {
  unlimited: 'Tirage illimité',
  limited: 'Série limitée (1/7)',
  xxl: 'XXL (80x120cm)',
  monumental: 'Monumental (120cm+)',
};

// Lalou
