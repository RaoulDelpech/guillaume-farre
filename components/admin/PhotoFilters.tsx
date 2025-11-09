'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

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

interface PhotoFiltersProps {
  photos: PhotoMetadata[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function PhotoFilters({ photos, filters, onFiltersChange }: PhotoFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    status: true,
    mainCategory: false,
    subCategory: false,
    series: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculer stats pour chaque filtre
  const statusCounts = {
    all: photos.length,
    'to-sort': photos.filter(p => p.status === 'to-sort').length,
    trash: photos.filter(p => p.status === 'trash').length,
  };

  // Catégories principales (empreintes, atelier, projection, etc.)
  const mainCategories = [...new Set(photos.map(p => p.category).filter(Boolean))].sort() as string[];
  const mainCategoryCounts: Record<string, number> = {};
  mainCategories.forEach(cat => {
    mainCategoryCounts[cat] = photos.filter(p => p.category === cat).length;
  });

  // Sous-catégories (unlimited, limited, xxl, monumental)
  const subCategoryOptions: ('unlimited' | 'limited' | 'xxl' | 'monumental')[] = ['unlimited', 'limited', 'xxl', 'monumental'];
  const subCategoryCounts: Record<string, number> = {};
  subCategoryOptions.forEach(subCat => {
    subCategoryCounts[subCat] = photos.filter(p =>
      p.categories?.includes(subCat)
    ).length;
  });

  // Séries
  const series = [...new Set(
    photos.map(p => p.seriesName).filter(Boolean)
  )].sort() as string[];
  const seriesCounts: Record<string, number> = {};
  series.forEach(s => {
    seriesCounts[s] = photos.filter(p => p.seriesName === s).length;
  });

  const handleStatusChange = (status: string) => {
    onFiltersChange({ ...filters, status });
  };

  const handleMainCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, mainCategory: category });
  };

  const handleSubCategoryToggle = (subCat: string) => {
    const newSubCats = filters.subCategories.includes(subCat)
      ? filters.subCategories.filter(c => c !== subCat)
      : [...filters.subCategories, subCat];
    onFiltersChange({ ...filters, subCategories: newSubCats });
  };

  const handleSeriesChange = (seriesName: string) => {
    onFiltersChange({ ...filters, series: seriesName });
  };

  const resetFilters = () => {
    onFiltersChange({
      status: 'all',
      mainCategory: 'all',
      subCategories: [],
      series: 'all',
      showGrouped: false,
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
            Filtres
          </h3>
          <button
            onClick={resetFilters}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Statut */}
      <div className="border-b border-border">
        <button
          onClick={() => toggleSection('status')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <span className="text-sm font-medium text-foreground">Statut</span>
          {expandedSections.status ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {expandedSections.status && (
          <div className="px-4 pb-3 space-y-2">
            <label className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-muted/30 px-2 rounded">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="to-sort"
                  checked={filters.status === 'to-sort'}
                  onChange={() => handleStatusChange('to-sort')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">⏳ À trier</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {statusCounts['to-sort']}
              </span>
            </label>
            <label className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-muted/30 px-2 rounded">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="trash"
                  checked={filters.status === 'trash'}
                  onChange={() => handleStatusChange('trash')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">🗑️ Corbeille</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {statusCounts.trash}
              </span>
            </label>
            <label className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-muted/30 px-2 rounded">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="all"
                  checked={filters.status === 'all'}
                  onChange={() => handleStatusChange('all')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">Toutes</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {statusCounts.all}
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Catégorie principale */}
      <div className="border-b border-border">
        <button
          onClick={() => toggleSection('mainCategory')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <span className="text-sm font-medium text-foreground">Catégorie</span>
          {expandedSections.mainCategory ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {expandedSections.mainCategory && (
          <div className="px-4 pb-3 space-y-2">
            <label className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-muted/30 px-2 rounded">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="mainCategory"
                  value="all"
                  checked={filters.mainCategory === 'all'}
                  onChange={() => handleMainCategoryChange('all')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">Toutes</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {statusCounts.all}
              </span>
            </label>
            {mainCategories.map(cat => (
              <label
                key={cat}
                className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-muted/30 px-2 rounded"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mainCategory"
                    value={cat}
                    checked={filters.mainCategory === cat}
                    onChange={() => handleMainCategoryChange(cat)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-foreground capitalize">{cat}</span>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {mainCategoryCounts[cat]}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Sous-catégories (multi-sélection) */}
      <div className="border-b border-border">
        <button
          onClick={() => toggleSection('subCategory')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <span className="text-sm font-medium text-foreground">Type de vente</span>
          {expandedSections.subCategory ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {expandedSections.subCategory && (
          <div className="px-4 pb-3 space-y-2">
            <label className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-muted/30 px-2 rounded">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.subCategories.includes('unlimited')}
                  onChange={() => handleSubCategoryToggle('unlimited')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">Tirage illimité</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {subCategoryCounts.unlimited || 0}
              </span>
            </label>
            <label className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-muted/30 px-2 rounded">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.subCategories.includes('limited')}
                  onChange={() => handleSubCategoryToggle('limited')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">Série limitée (1/7)</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {subCategoryCounts.limited || 0}
              </span>
            </label>
            <label className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-muted/30 px-2 rounded">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.subCategories.includes('xxl')}
                  onChange={() => handleSubCategoryToggle('xxl')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">XXL (80x120cm)</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {subCategoryCounts.xxl || 0}
              </span>
            </label>
            <label className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-muted/30 px-2 rounded">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.subCategories.includes('monumental')}
                  onChange={() => handleSubCategoryToggle('monumental')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">Monumental (120cm+)</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {subCategoryCounts.monumental || 0}
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Séries */}
      {series.length > 0 && (
        <div>
          <button
            onClick={() => toggleSection('series')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm font-medium text-foreground">Série</span>
            {expandedSections.series ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          {expandedSections.series && (
            <div className="px-4 pb-3 space-y-2">
              <label className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-muted/30 px-2 rounded">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="series"
                    value="all"
                    checked={filters.series === 'all'}
                    onChange={() => handleSeriesChange('all')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-foreground">Toutes</span>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {statusCounts.all}
                </span>
              </label>
              {series.map(s => (
                <label
                  key={s}
                  className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-muted/30 px-2 rounded"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="series"
                      value={s}
                      checked={filters.series === s}
                      onChange={() => handleSeriesChange(s)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-foreground">{s}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {seriesCounts[s]}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Lalou
