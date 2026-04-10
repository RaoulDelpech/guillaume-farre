'use client';

import { Filter, X, TrendingUp, TrendingDown } from 'lucide-react';
import type { FilterState } from './types';

interface DesktopFiltersProps {
  filters: FilterState;
  counts: Record<string, number>;
  hasActiveFilters: boolean;
  onUpdate: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
}

function FilterButton({ active, onClick, label, count }: {
  active: boolean; onClick: () => void; label: React.ReactNode; count?: number;
}) {
  return (
    <button onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
        active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/10'
      }`}>
      <span className="flex justify-between items-center">
        <span>{label}</span>
        {count !== undefined && <span className="text-xs opacity-70">{count}</span>}
      </span>
    </button>
  );
}

export default function DesktopFilters({ filters, counts, hasActiveFilters, onUpdate, onReset }: DesktopFiltersProps) {
  return (
    <div className="hidden lg:block bg-card border border-border rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium">Filtrer la collection</h3>
          {hasActiveFilters && (
            <button onClick={onReset}
              className="ml-4 px-3 py-1 bg-accent/10 hover:bg-accent/20 text-accent text-sm rounded-full transition-colors flex items-center gap-1">
              <X className="w-3 h-3" /> Réinitialiser
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
            <FilterButton active={filters.category === 'all'} onClick={() => onUpdate('category', 'all')} label="Toutes" count={counts.total} />
            <FilterButton active={filters.category === 'limited'} onClick={() => onUpdate('category', 'limited')} label="Éditions limitées" count={counts.limited} />
            <FilterButton active={filters.category === 'unlimited'} onClick={() => onUpdate('category', 'unlimited')} label="Tirages illimités" count={counts.unlimited} />
            <FilterButton active={filters.category === 'xxl'} onClick={() => onUpdate('category', 'xxl')} label="Format XXL" count={counts.xxl} />
            <FilterButton active={filters.category === 'monumental'} onClick={() => onUpdate('category', 'monumental')} label="Monumental" count={counts.monumental} />
          </div>
        </div>

        {/* Prix */}
        <div>
          <label className="text-sm font-medium mb-3 block">Gamme de prix</label>
          <div className="space-y-2">
            <FilterButton active={filters.priceRange === 'all'} onClick={() => onUpdate('priceRange', 'all')} label="Tous les prix" count={counts.total} />
            <FilterButton active={filters.priceRange === '0-500'} onClick={() => onUpdate('priceRange', '0-500')} label="Moins de 500€" count={counts.range1} />
            <FilterButton active={filters.priceRange === '500-1000'} onClick={() => onUpdate('priceRange', '500-1000')} label="500€ - 1000€" count={counts.range2} />
            <FilterButton active={filters.priceRange === '1000-2000'} onClick={() => onUpdate('priceRange', '1000-2000')} label="1000€ - 2000€" count={counts.range3} />
            <FilterButton active={filters.priceRange === '2000+'} onClick={() => onUpdate('priceRange', '2000+')} label="Plus de 2000€" count={counts.range4} />
          </div>
        </div>

        {/* Disponibilité */}
        <div>
          <label className="text-sm font-medium mb-3 block">Disponibilité</label>
          <div className="space-y-2">
            <FilterButton active={filters.availability === 'all'} onClick={() => onUpdate('availability', 'all')} label="Toutes" count={counts.total} />
            <FilterButton active={filters.availability === 'available'} onClick={() => onUpdate('availability', 'available')} label="Disponibles" count={counts.available} />
            <FilterButton active={filters.availability === 'low-stock'} onClick={() => onUpdate('availability', 'low-stock')}
              label={<span className="text-orange-500">Derniers exemplaires</span>} count={counts.lowStock} />
            <FilterButton active={filters.availability === 'sold-out'} onClick={() => onUpdate('availability', 'sold-out')}
              label={<span className="text-red-500">Épuisés</span>} count={counts.soldOut} />
          </div>
        </div>

        {/* Tri */}
        <div>
          <label className="text-sm font-medium mb-3 block">Trier par</label>
          <div className="space-y-2">
            <FilterButton active={filters.sortBy === 'newest'} onClick={() => onUpdate('sortBy', 'newest')} label="Plus récentes" />
            <button onClick={() => onUpdate('sortBy', 'price-asc')}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                filters.sortBy === 'price-asc' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/10'
              }`}>
              <span>Prix croissant</span><TrendingUp className="w-4 h-4" />
            </button>
            <button onClick={() => onUpdate('sortBy', 'price-desc')}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                filters.sortBy === 'price-desc' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/10'
              }`}>
              <span>Prix décroissant</span><TrendingDown className="w-4 h-4" />
            </button>
            <FilterButton active={filters.sortBy === 'popular'} onClick={() => onUpdate('sortBy', 'popular')} label="Plus populaires" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Lalou
