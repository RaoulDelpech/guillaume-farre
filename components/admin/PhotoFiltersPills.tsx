'use client';

import { X } from 'lucide-react';

interface PhotoMetadata {
  filename: string;
  path: string;
  category?: string;
  status?: 'trash' | 'to-sort' | null;
  categories?: ('unlimited' | 'limited' | 'xxl' | 'monumental')[];
  seriesName?: string;
  visible: boolean;
  forSale: boolean;
}

interface FilterState {
  status: string;
  mainCategory: string;
  subCategories: string[];
  series: string;
  showGrouped: boolean;
}

interface PhotoFiltersPillsProps {
  photos: PhotoMetadata[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function PhotoFiltersPills({ photos, filters, onFiltersChange }: PhotoFiltersPillsProps) {
  // Labels pour affichage
  const statusLabels: Record<string, string> = {
    'to-sort': '⏳ À trier',
    'trash': '🗑️ Corbeille',
    'all': 'Toutes',
  };

  const subCategoryLabels: Record<string, string> = {
    'unlimited': '♾️ Illimité',
    'limited': '🔢 Limité',
    'xxl': '📐 XXL',
    'monumental': '🏛️ Monumental',
  };

  // Compter filtres actifs
  const activeFiltersCount =
    (filters.status !== 'all' ? 1 : 0) +
    (filters.mainCategory !== 'all' ? 1 : 0) +
    filters.subCategories.length +
    (filters.series !== 'all' ? 1 : 0) +
    (filters.showGrouped ? 1 : 0);

  const hasActiveFilters = activeFiltersCount > 0;

  // Handlers
  const removeStatusFilter = () => {
    onFiltersChange({ ...filters, status: 'all' });
  };

  const removeMainCategoryFilter = () => {
    onFiltersChange({ ...filters, mainCategory: 'all' });
  };

  const removeSubCategoryFilter = (subCat: string) => {
    onFiltersChange({
      ...filters,
      subCategories: filters.subCategories.filter(c => c !== subCat),
    });
  };

  const removeSeriesFilter = () => {
    onFiltersChange({ ...filters, series: 'all' });
  };

  const toggleShowGrouped = () => {
    onFiltersChange({ ...filters, showGrouped: !filters.showGrouped });
  };

  const resetAllFilters = () => {
    onFiltersChange({
      status: 'all',
      mainCategory: 'all',
      subCategories: [],
      series: 'all',
      showGrouped: false,
    });
  };

  // Statistiques
  const totalPhotos = photos.length;
  const filteredCount = photos.filter(p => {
    // Même logique de filtrage que dans admin/page.tsx
    if (!filters.showGrouped && p.seriesName && p.seriesName.trim() !== '') {
      return false;
    }
    if (filters.status !== 'all') {
      const currentStatus = p.status || null;
      if (currentStatus !== filters.status) return false;
    }
    if (filters.mainCategory !== 'all') {
      if (p.category !== filters.mainCategory) return false;
    }
    if (filters.subCategories.length > 0) {
      const hasAnySubCategory = filters.subCategories.some(subCat =>
        p.categories?.includes(subCat as any)
      );
      if (!hasAnySubCategory) return false;
    }
    if (filters.series !== 'all') {
      if (p.seriesName !== filters.series) return false;
    }
    return true;
  }).length;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      {/* Header avec stats */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            Filtres
          </span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {filteredCount} / {totalPhotos} photos
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Tout effacer
            </button>
          )}
        </div>
      </div>

      {/* Pills actives */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {/* Statut */}
          {filters.status !== 'all' && (
            <button
              onClick={removeStatusFilter}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/70 rounded-full text-xs font-medium text-foreground transition-colors group"
            >
              <span>{statusLabels[filters.status]}</span>
              <X className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
            </button>
          )}

          {/* Catégorie principale */}
          {filters.mainCategory !== 'all' && (
            <button
              onClick={removeMainCategoryFilter}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/70 rounded-full text-xs font-medium text-foreground transition-colors group capitalize"
            >
              <span>📁 {filters.mainCategory}</span>
              <X className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
            </button>
          )}

          {/* Sous-catégories */}
          {filters.subCategories.map(subCat => (
            <button
              key={subCat}
              onClick={() => removeSubCategoryFilter(subCat)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/70 rounded-full text-xs font-medium text-foreground transition-colors group"
            >
              <span>{subCategoryLabels[subCat]}</span>
              <X className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
            </button>
          ))}

          {/* Série */}
          {filters.series !== 'all' && (
            <button
              onClick={removeSeriesFilter}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/70 rounded-full text-xs font-medium text-foreground transition-colors group"
            >
              <span>📚 {filters.series}</span>
              <X className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
            </button>
          )}

          {/* Afficher groupées */}
          {filters.showGrouped && (
            <button
              onClick={toggleShowGrouped}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/70 rounded-full text-xs font-medium text-foreground transition-colors group"
            >
              <span>👁️ Groupées affichées</span>
              <X className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
            </button>
          )}
        </div>
      )}

      {/* État vide */}
      {!hasActiveFilters && (
        <p className="text-sm text-muted-foreground">
          Aucun filtre actif. Utilisez les filtres dans la sidebar →
        </p>
      )}
    </div>
  );
}

// Lalou
