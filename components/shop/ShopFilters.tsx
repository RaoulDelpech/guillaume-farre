'use client';

import { useState } from 'react';
import type { FilterState, ShopPhoto } from './filters/types';
import { DEFAULT_FILTERS } from './filters/types';
import useShopCounts from './filters/useShopCounts';
import DesktopFilters from './filters/DesktopFilters';
import MobileFilters from './filters/MobileFilters';

export type { FilterState } from './filters/types';

interface ShopFiltersProps {
  photos: ShopPhoto[];
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export default function ShopFilters({ photos, onFilterChange, initialFilters }: ShopFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters || DEFAULT_FILTERS);
  const counts = useShopCounts(photos);

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    onFilterChange(DEFAULT_FILTERS);
  };

  const hasActiveFilters = filters.category !== 'all' ||
                           filters.priceRange !== 'all' ||
                           filters.availability !== 'all';

  return (
    <>
      <DesktopFilters
        filters={filters}
        counts={counts}
        hasActiveFilters={hasActiveFilters}
        onUpdate={updateFilter}
        onReset={resetFilters}
      />
      <MobileFilters
        filters={filters}
        counts={counts}
        hasActiveFilters={hasActiveFilters}
        onUpdate={updateFilter}
        onReset={resetFilters}
      />
    </>
  );
}

// Lalou
