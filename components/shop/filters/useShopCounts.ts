import { useMemo } from 'react';
import type { ShopPhoto } from './types';
import { getLowestPrice } from './types';

export default function useShopCounts(photos: ShopPhoto[]) {
  return useMemo(() => ({
    total: photos.length,
    limited: photos.filter(p => p.categories?.includes('limited')).length,
    unlimited: photos.filter(p => p.categories?.includes('unlimited')).length,
    xxl: photos.filter(p => p.categories?.includes('xxl')).length,
    monumental: photos.filter(p => p.categories?.includes('monumental')).length,
    available: photos.filter(p => {
      const avail = p.limitedEdition?.available;
      return avail === undefined || avail > 0;
    }).length,
    lowStock: photos.filter(p => {
      const avail = p.limitedEdition?.available;
      return avail !== undefined && avail > 0 && avail <= 2;
    }).length,
    soldOut: photos.filter(p => p.limitedEdition?.available === 0).length,
    range1: photos.filter(p => { const pr = getLowestPrice(p); return pr > 0 && pr <= 500; }).length,
    range2: photos.filter(p => { const pr = getLowestPrice(p); return pr > 500 && pr <= 1000; }).length,
    range3: photos.filter(p => { const pr = getLowestPrice(p); return pr > 1000 && pr <= 2000; }).length,
    range4: photos.filter(p => { const pr = getLowestPrice(p); return pr > 2000; }).length,
  }), [photos]);
}

// Lalou
