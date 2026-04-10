export interface FilterState {
  category: 'all' | 'limited' | 'unlimited' | 'xxl' | 'monumental';
  priceRange: 'all' | '0-500' | '500-1000' | '1000-2000' | '2000+';
  availability: 'all' | 'available' | 'low-stock' | 'sold-out';
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}

export interface ShopPhoto {
  categories?: string[];
  limitedEdition?: { available?: number };
  prices?: {
    unlimited?: { a4?: number };
    limited?: { a3?: number };
  };
}

export function getLowestPrice(photo: ShopPhoto): number {
  const prices = [];
  if (photo.prices?.unlimited) prices.push(photo.prices.unlimited.a4 || 150);
  if (photo.prices?.limited) prices.push(photo.prices.limited.a3 || 500);
  return prices.length > 0 ? Math.min(...prices) : 0;
}

export const DEFAULT_FILTERS: FilterState = {
  category: 'all',
  priceRange: 'all',
  availability: 'all',
  sortBy: 'newest',
};

// Lalou
