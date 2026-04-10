import { useMemo } from "react";
import type { FilterPhoto } from "./types";
import { SUB_CATEGORY_OPTIONS } from "./types";

export default function useFilterCounts(photos: FilterPhoto[]) {
  return useMemo(() => {
    const statusCounts = {
      all: photos.length,
      'to-sort': photos.filter(p => p.status === 'to-sort').length,
      trash: photos.filter(p => p.status === 'trash').length,
    };

    const mainCategories = [...new Set(photos.map(p => p.category).filter(Boolean))].sort() as string[];
    const mainCategoryCounts: Record<string, number> = {};
    mainCategories.forEach(cat => {
      mainCategoryCounts[cat] = photos.filter(p => p.category === cat).length;
    });

    const subCategoryCounts: Record<string, number> = {};
    SUB_CATEGORY_OPTIONS.forEach(subCat => {
      subCategoryCounts[subCat] = photos.filter(p => p.categories?.includes(subCat)).length;
    });

    const series = [...new Set(photos.map(p => p.seriesName).filter(Boolean))].sort() as string[];
    const seriesCounts: Record<string, number> = {};
    series.forEach(s => {
      seriesCounts[s] = photos.filter(p => p.seriesName === s).length;
    });

    return { statusCounts, mainCategories, mainCategoryCounts, subCategoryCounts, series, seriesCounts };
  }, [photos]);
}

// Lalou
