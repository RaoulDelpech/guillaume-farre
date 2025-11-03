"use client";
import { useState, useMemo } from "react";
import { PhotoMetadata } from "@/lib/admin/photo-manager";
import ShopGrid from "./ShopGrid";
import { useFavorites } from "@/hooks/useFavorites";

interface ShopFilteredGridProps {
  photos: PhotoMetadata[];
}

type FilterType = "all" | "limited" | "unique" | "favorites";
type SortType = "default" | "price_asc" | "price_desc" | "newest";

export default function ShopFilteredGrid({ photos }: ShopFilteredGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeSort, setActiveSort] = useState<SortType>("default");
  const { favorites } = useFavorites();

  // Calculate stats
  const stats = useMemo(() => {
    const limitedEditions = photos.filter(
      (p) => p.edition?.type === "limited"
    ).length;
    const unique = photos.filter(
      (p) => !p.edition || p.edition.type === "open"
    ).length;

    return {
      total: photos.length,
      limitedEditions,
      unique,
    };
  }, [photos]);

  // Filtered and sorted photos
  const processedPhotos = useMemo(() => {
    // 1. Filter
    let filtered = [...photos];

    if (activeFilter === "limited") {
      filtered = filtered.filter((p) => p.edition?.type === "limited");
    } else if (activeFilter === "unique") {
      filtered = filtered.filter(
        (p) => !p.edition || p.edition.type === "open"
      );
    } else if (activeFilter === "favorites") {
      filtered = filtered.filter((p) => favorites.includes(p.path));
    }

    // 2. Sort
    if (activeSort === "price_asc") {
      filtered.sort((a, b) => (a.price || 2000) - (b.price || 2000));
    } else if (activeSort === "price_desc") {
      filtered.sort((a, b) => (b.price || 2000) - (a.price || 2000));
    } else if (activeSort === "newest") {
      filtered.sort((a, b) => {
        const yearA = typeof a.year === "number" ? a.year : parseInt(a.year || "2024");
        const yearB = typeof b.year === "number" ? b.year : parseInt(b.year || "2024");
        return yearB - yearA;
      });
    }

    return filtered;
  }, [photos, activeFilter, activeSort, favorites]);

  return (
    <div>
      {/* Filtres rapides */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              activeFilter === "all"
                ? "bg-red-600 text-white"
                : "bg-white/10 hover:bg-white/20 border border-white/30 text-white"
            }`}
          >
            Toutes ({stats.total})
          </button>
          <button
            onClick={() => setActiveFilter("limited")}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              activeFilter === "limited"
                ? "bg-red-600 text-white"
                : "bg-white/10 hover:bg-white/20 border border-white/30 text-white"
            }`}
          >
            Éditions limitées ({stats.limitedEditions})
          </button>
          <button
            onClick={() => setActiveFilter("unique")}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              activeFilter === "unique"
                ? "bg-red-600 text-white"
                : "bg-white/10 hover:bg-white/20 border border-white/30 text-white"
            }`}
          >
            Pièces uniques ({stats.unique})
          </button>

          {/* Favorites filter */}
          {favorites.length > 0 && (
            <button
              onClick={() => setActiveFilter("favorites")}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                activeFilter === "favorites"
                  ? "bg-pink-600 text-white"
                  : "bg-white/10 hover:bg-white/20 border border-white/30 text-white"
              }`}
            >
              <span>❤️</span> Mes favoris ({favorites.length})
            </button>
          )}

          {/* Separator */}
          <div className="w-px bg-white/20 mx-2"></div>

          {/* Sorting */}
          <button
            onClick={() =>
              setActiveSort((prev) =>
                prev === "price_asc" ? "price_desc" : "price_asc"
              )
            }
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              activeSort === "price_asc" || activeSort === "price_desc"
                ? "bg-blue-600 text-white"
                : "bg-white/10 hover:bg-white/20 border border-white/30 text-white"
            }`}
          >
            Prix {activeSort === "price_desc" ? "↓" : "↑"}
          </button>
          <button
            onClick={() =>
              setActiveSort((prev) => (prev === "newest" ? "default" : "newest"))
            }
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              activeSort === "newest"
                ? "bg-blue-600 text-white"
                : "bg-white/10 hover:bg-white/20 border border-white/30 text-white"
            }`}
          >
            Plus récentes
          </button>
        </div>

        {/* Results count */}
        {processedPhotos.length !== photos.length && (
          <div className="mt-4 text-sm text-gray-400">
            {processedPhotos.length} œuvre{processedPhotos.length > 1 ? "s" : ""}{" "}
            trouvée{processedPhotos.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Grid with filtered/sorted photos */}
      <ShopGrid photos={processedPhotos} />

      {processedPhotos.length === 0 && (
        <div className="text-center py-20 max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🔍</div>
          <p className="text-2xl font-bold mb-4">Aucune œuvre trouvée</p>
          <p className="text-gray-400 mb-8">
            Essayez un autre filtre pour découvrir nos créations disponibles.
          </p>
          <button
            onClick={() => {
              setActiveFilter("all");
              setActiveSort("default");
            }}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
