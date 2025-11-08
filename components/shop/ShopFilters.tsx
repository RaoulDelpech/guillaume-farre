'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, Filter, X, TrendingUp, TrendingDown } from 'lucide-react';

export interface FilterState {
  category: 'all' | 'limited' | 'unlimited' | 'xxl' | 'monumental';
  priceRange: 'all' | '0-500' | '500-1000' | '1000-2000' | '2000+';
  availability: 'all' | 'available' | 'low-stock' | 'sold-out';
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}

interface ShopFiltersProps {
  photos: any[];
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export default function ShopFilters({ photos, onFilterChange, initialFilters }: ShopFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters || {
    category: 'all',
    priceRange: 'all',
    availability: 'all',
    sortBy: 'newest'
  });

  // Calculer les compteurs en temps réel
  const counts = useMemo(() => {
    return {
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
      // Prix
      range1: photos.filter(p => {
        const price = getLowestPrice(p);
        return price > 0 && price <= 500;
      }).length,
      range2: photos.filter(p => {
        const price = getLowestPrice(p);
        return price > 500 && price <= 1000;
      }).length,
      range3: photos.filter(p => {
        const price = getLowestPrice(p);
        return price > 1000 && price <= 2000;
      }).length,
      range4: photos.filter(p => {
        const price = getLowestPrice(p);
        return price > 2000;
      }).length
    };
  }, [photos]);

  // Helper pour obtenir le prix le plus bas d'une photo
  function getLowestPrice(photo: any): number {
    const prices = [];
    if (photo.prices?.unlimited) {
      prices.push(photo.prices.unlimited.a4 || 150);
    }
    if (photo.prices?.limited) {
      prices.push(photo.prices.limited.a3 || 500);
    }
    return prices.length > 0 ? Math.min(...prices) : 0;
  }

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      category: 'all',
      priceRange: 'all',
      availability: 'all',
      sortBy: 'newest'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = filters.category !== 'all' ||
                           filters.priceRange !== 'all' ||
                           filters.availability !== 'all';

  return (
    <>
      {/* Barre de filtres desktop */}
      <div className="hidden lg:block bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-medium">Filtrer la collection</h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="ml-4 px-3 py-1 bg-accent/10 hover:bg-accent/20 text-accent text-sm rounded-full transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Réinitialiser
              </button>
            )}
          </div>
          <span className="text-sm text-muted-foreground">{counts.total} œuvres</span>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Catégorie */}
          <div>
            <label className="text-sm font-medium mb-3 block">Catégorie</label>
            <div className="space-y-2">
              <button
                onClick={() => updateFilter('category', 'all')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filters.category === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent/10'
                }`}
              >
                <span className="flex justify-between items-center">
                  <span>Toutes</span>
                  <span className="text-xs opacity-70">{counts.total}</span>
                </span>
              </button>
              <button
                onClick={() => updateFilter('category', 'limited')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filters.category === 'limited'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent/10'
                }`}
              >
                <span className="flex justify-between items-center">
                  <span>Éditions limitées</span>
                  <span className="text-xs opacity-70">{counts.limited}</span>
                </span>
              </button>
              <button
                onClick={() => updateFilter('category', 'unlimited')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filters.category === 'unlimited'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent/10'
                }`}
              >
                <span className="flex justify-between items-center">
                  <span>Tirages illimités</span>
                  <span className="text-xs opacity-70">{counts.unlimited}</span>
                </span>
              </button>
              <button
                onClick={() => updateFilter('category', 'xxl')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filters.category === 'xxl'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent/10'
                }`}
              >
                <span className="flex justify-between items-center">
                  <span>Format XXL</span>
                  <span className="text-xs opacity-70">{counts.xxl}</span>
                </span>
              </button>
              <button
                onClick={() => updateFilter('category', 'monumental')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filters.category === 'monumental'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent/10'
                }`}
              >
                <span className="flex justify-between items-center">
                  <span>Monumental</span>
                  <span className="text-xs opacity-70">{counts.monumental}</span>
                </span>
              </button>
            </div>
          </div>

          {/* Prix */}
          <div>
            <label className="text-sm font-medium mb-3 block">Gamme de prix</label>
            <div className="space-y-2">
              <button
                onClick={() => updateFilter('priceRange', 'all')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filters.priceRange === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent/10'
                }`}
              >
                <span className="flex justify-between items-center">
                  <span>Tous les prix</span>
                  <span className="text-xs opacity-70">{counts.total}</span>
                </span>
              </button>
              <button
                onClick={() => updateFilter('priceRange', '0-500')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filters.priceRange === '0-500'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent/10'
                }`}
              >
                <span className="flex justify-between items-center">
                  <span>Moins de 500€</span>
                  <span className="text-xs opacity-70">{counts.range1}</span>
                </span>
              </button>
              <button
                onClick={() => updateFilter('priceRange', '500-1000')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filters.priceRange === '500-1000'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent/10'
                }`}
              >
                <span className="flex justify-between items-center">
                  <span>500€ - 1000€</span>
                  <span className="text-xs opacity-70">{counts.range2}</span>
                </span>
              </button>
              <button
                onClick={() => updateFilter('priceRange', '1000-2000')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filters.priceRange === '1000-2000'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent/10'
                }`}
              >
                <span className="flex justify-between items-center">
                  <span>1000€ - 2000€</span>
                  <span className="text-xs opacity-70">{counts.range3}</span>
                </span>
              </button>
              <button
                onClick={() => updateFilter('priceRange', '2000+')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filters.priceRange === '2000+'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent/10'
                }`}
              >
                <span className="flex justify-between items-center">
                  <span>Plus de 2000€</span>
                  <span className="text-xs opacity-70">{counts.range4}</span>
                </span>
              </button>
            </div>
          </div>

          {/* Disponibilité */}
          <div>
            <label className="text-sm font-medium mb-3 block">Disponibilité</label>
            <div className="space-y-2">
              <button
                onClick={() => updateFilter('availability', 'all')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filters.availability === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent/10'
                }`}
              >
                <span className="flex justify-between items-center">
                  <span>Toutes</span>
                  <span className="text-xs opacity-70">{counts.total}</span>
                </span>
              </button>
              <button
                onClick={() => updateFilter('availability', 'available')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filters.availability === 'available'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent/10'
                }`}
              >
                <span className="flex justify-between items-center">
                  <span>Disponibles</span>
                  <span className="text-xs opacity-70">{counts.available}</span>
                </span>
              </button>
              <button
                onClick={() => updateFilter('availability', 'low-stock')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filters.availability === 'low-stock'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent/10'
                }`}
              >
                <span className="flex justify-between items-center">
                  <span className="text-orange-500">Derniers exemplaires</span>
                  <span className="text-xs opacity-70">{counts.lowStock}</span>
                </span>
              </button>
              <button
                onClick={() => updateFilter('availability', 'sold-out')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filters.availability === 'sold-out'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent/10'
                }`}
              >
                <span className="flex justify-between items-center">
                  <span className="text-red-500">Épuisés</span>
                  <span className="text-xs opacity-70">{counts.soldOut}</span>
                </span>
              </button>
            </div>
          </div>

          {/* Tri */}
          <div>
            <label className="text-sm font-medium mb-3 block">Trier par</label>
            <div className="space-y-2">
              <button
                onClick={() => updateFilter('sortBy', 'newest')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filters.sortBy === 'newest'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent/10'
                }`}
              >
                Plus récentes
              </button>
              <button
                onClick={() => updateFilter('sortBy', 'price-asc')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                  filters.sortBy === 'price-asc'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent/10'
                }`}
              >
                <span>Prix croissant</span>
                <TrendingUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => updateFilter('sortBy', 'price-desc')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                  filters.sortBy === 'price-desc'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent/10'
                }`}
              >
                <span>Prix décroissant</span>
                <TrendingDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => updateFilter('sortBy', 'popular')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filters.sortBy === 'popular'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent/10'
                }`}
              >
                Plus populaires
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Version mobile */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <span className="font-medium">Filtres</span>
            {hasActiveFilters && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                Actifs
              </span>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="mt-4 bg-card border border-border rounded-lg p-4 space-y-4">
            {/* Contenu mobile similaire mais en accordéon */}
            <div className="space-y-3">
              <select
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              >
                <option value="all">Toutes catégories ({counts.total})</option>
                <option value="limited">Éditions limitées ({counts.limited})</option>
                <option value="unlimited">Tirages illimités ({counts.unlimited})</option>
                <option value="xxl">Format XXL ({counts.xxl})</option>
                <option value="monumental">Monumental ({counts.monumental})</option>
              </select>

              <select
                value={filters.priceRange}
                onChange={(e) => updateFilter('priceRange', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              >
                <option value="all">Tous les prix</option>
                <option value="0-500">Moins de 500€ ({counts.range1})</option>
                <option value="500-1000">500€ - 1000€ ({counts.range2})</option>
                <option value="1000-2000">1000€ - 2000€ ({counts.range3})</option>
                <option value="2000+">Plus de 2000€ ({counts.range4})</option>
              </select>

              <select
                value={filters.availability}
                onChange={(e) => updateFilter('availability', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              >
                <option value="all">Toutes disponibilités</option>
                <option value="available">Disponibles ({counts.available})</option>
                <option value="low-stock">Derniers exemplaires ({counts.lowStock})</option>
                <option value="sold-out">Épuisés ({counts.soldOut})</option>
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value as FilterState['sortBy'])}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              >
                <option value="newest">Plus récentes</option>
                <option value="price-asc">Prix croissant ↑</option>
                <option value="price-desc">Prix décroissant ↓</option>
                <option value="popular">Plus populaires</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// Lalou