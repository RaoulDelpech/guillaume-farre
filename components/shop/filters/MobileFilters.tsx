'use client';

import { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import type { FilterState } from './types';

interface MobileFiltersProps {
  filters: FilterState;
  counts: Record<string, number>;
  hasActiveFilters: boolean;
  onUpdate: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
}

export default function MobileFilters({ filters, counts, hasActiveFilters, onUpdate, onReset }: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden mb-6">
      <button onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border rounded-lg">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <span className="font-medium">Filtres</span>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">Actifs</span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="mt-4 bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="space-y-3">
            <select value={filters.category} onChange={(e) => onUpdate('category', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg">
              <option value="all">Toutes catégories ({counts.total})</option>
              <option value="limited">Éditions limitées ({counts.limited})</option>
              <option value="unlimited">Tirages illimités ({counts.unlimited})</option>
              <option value="xxl">Format XXL ({counts.xxl})</option>
              <option value="monumental">Monumental ({counts.monumental})</option>
            </select>

            <select value={filters.priceRange} onChange={(e) => onUpdate('priceRange', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg">
              <option value="all">Tous les prix</option>
              <option value="0-500">Moins de 500€ ({counts.range1})</option>
              <option value="500-1000">500€ - 1000€ ({counts.range2})</option>
              <option value="1000-2000">1000€ - 2000€ ({counts.range3})</option>
              <option value="2000+">Plus de 2000€ ({counts.range4})</option>
            </select>

            <select value={filters.availability} onChange={(e) => onUpdate('availability', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg">
              <option value="all">Toutes disponibilités</option>
              <option value="available">Disponibles ({counts.available})</option>
              <option value="low-stock">Derniers exemplaires ({counts.lowStock})</option>
              <option value="sold-out">Épuisés ({counts.soldOut})</option>
            </select>

            <select value={filters.sortBy} onChange={(e) => onUpdate('sortBy', e.target.value as FilterState['sortBy'])}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg">
              <option value="newest">Plus récentes</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="popular">Plus populaires</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button onClick={onReset}
              className="w-full px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors">
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Lalou
