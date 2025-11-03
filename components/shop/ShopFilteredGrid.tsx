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
      {/* Filtres élégants */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-6 py-3 rounded-lg font-light text-sm tracking-wide transition-all ${
              activeFilter === "all"
                ? "border border-primary text-primary bg-primary/5"
                : "border border-border text-foreground hover:border-primary hover:text-primary"
            }`}
          >
            Toutes ({stats.total})
          </button>
          <button
            onClick={() => setActiveFilter("limited")}
            className={`px-6 py-3 rounded-lg font-light text-sm tracking-wide transition-all ${
              activeFilter === "limited"
                ? "border border-primary text-primary bg-primary/5"
                : "border border-border text-foreground hover:border-primary hover:text-primary"
            }`}
          >
            Éditions limitées ({stats.limitedEditions})
          </button>
          <button
            onClick={() => setActiveFilter("unique")}
            className={`px-6 py-3 rounded-lg font-light text-sm tracking-wide transition-all ${
              activeFilter === "unique"
                ? "border border-primary text-primary bg-primary/5"
                : "border border-border text-foreground hover:border-primary hover:text-primary"
            }`}
          >
            Pièces uniques ({stats.unique})
          </button>

          {/* Favorites filter */}
          {favorites.length > 0 && (
            <button
              onClick={() => setActiveFilter("favorites")}
              className={`px-6 py-3 rounded-lg font-light text-sm tracking-wide transition-all ${
                activeFilter === "favorites"
                  ? "border border-primary text-primary bg-primary/5"
                  : "border border-border text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              Mes favoris ({favorites.length})
            </button>
          )}

          {/* Separator */}
          <div className="w-px bg-border mx-2"></div>

          {/* Sorting */}
          <button
            onClick={() =>
              setActiveSort((prev) =>
                prev === "price_asc" ? "price_desc" : "price_asc"
              )
            }
            className={`px-6 py-3 rounded-lg font-light text-sm tracking-wide transition-all ${
              activeSort === "price_asc" || activeSort === "price_desc"
                ? "border border-primary text-primary bg-primary/5"
                : "border border-border text-foreground hover:border-primary hover:text-primary"
            }`}
          >
            Prix {activeSort === "price_desc" ? "↓" : "↑"}
          </button>
          <button
            onClick={() =>
              setActiveSort((prev) => (prev === "newest" ? "default" : "newest"))
            }
            className={`px-6 py-3 rounded-lg font-light text-sm tracking-wide transition-all ${
              activeSort === "newest"
                ? "border border-primary text-primary bg-primary/5"
                : "border border-border text-foreground hover:border-primary hover:text-primary"
            }`}
          >
            Plus récentes
          </button>
        </div>

        {/* Results count */}
        {processedPhotos.length !== photos.length && (
          <div className="mt-6 text-sm text-muted-foreground font-light">
            {processedPhotos.length} œuvre{processedPhotos.length > 1 ? "s" : ""}{" "}
            trouvée{processedPhotos.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Grid with filtered/sorted photos */}
      <ShopGrid photos={processedPhotos} />

      {processedPhotos.length === 0 && (
        <div className="text-center py-28 max-w-3xl mx-auto">
          <p className="text-3xl md:text-4xl font-light tracking-wide mb-6">
            Aucune œuvre trouvée
          </p>
          <p className="text-xl text-muted-foreground font-light mb-10 leading-relaxed">
            Essayez un autre filtre pour découvrir nos créations disponibles.
          </p>
          <button
            onClick={() => {
              setActiveFilter("all");
              setActiveSort("default");
            }}
            className="px-10 py-5 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-light tracking-wide rounded-lg transition-all"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
