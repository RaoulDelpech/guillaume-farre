'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';

export interface FilterState {
  priceRange: [number, number];
  formats: string[];
  series: string[];
  editions: ('limited' | 'unlimited')[];
  availability: ('available' | 'few-left' | 'sold-out')[];
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  minPrice: number;
  maxPrice: number;
  totalResults: number;
}

const FORMATS = [
  { value: 'A4', label: 'A4 (21×29.7 cm)' },
  { value: 'A3', label: 'A3 (29.7×42 cm)' },
  { value: 'A2', label: 'A2 (42×59.4 cm)' },
  { value: 'A1', label: 'A1 (59.4×84.1 cm)' },
];

const SERIES = [
  { value: 'empreintes', label: 'Empreintes', icon: '🎨' },
  { value: 'atelier', label: 'Atelier', icon: '🏭' },
  { value: 'projection', label: 'Projection', icon: '📽️' },
];

const EDITIONS = [
  { value: 'limited', label: 'Éditions limitées (1-7/7)', icon: '⭐' },
  { value: 'unlimited', label: 'Tirages illimités', icon: '∞' },
];

const AVAILABILITY = [
  { value: 'available', label: 'En stock (3+)', color: 'green' },
  { value: 'few-left', label: 'Derniers exemplaires (1-2)', color: 'orange' },
  { value: 'sold-out', label: 'Épuisé', color: 'red' },
];

export default function ProductFilters({
  filters,
  onFiltersChange,
  minPrice,
  maxPrice,
  totalResults,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]],
    });
  };

  const toggleFormat = (format: string) => {
    const newFormats = filters.formats.includes(format)
      ? filters.formats.filter(f => f !== format)
      : [...filters.formats, format];
    onFiltersChange({ ...filters, formats: newFormats });
  };

  const toggleSeries = (series: string) => {
    const newSeries = filters.series.includes(series)
      ? filters.series.filter(s => s !== series)
      : [...filters.series, series];
    onFiltersChange({ ...filters, series: newSeries });
  };

  const toggleEdition = (edition: 'limited' | 'unlimited') => {
    const newEditions = filters.editions.includes(edition)
      ? filters.editions.filter(e => e !== edition)
      : [...filters.editions, edition];
    onFiltersChange({ ...filters, editions: newEditions });
  };

  const toggleAvailability = (availability: 'available' | 'few-left' | 'sold-out') => {
    const newAvailability = filters.availability.includes(availability)
      ? filters.availability.filter(a => a !== availability)
      : [...filters.availability, availability];
    onFiltersChange({ ...filters, availability: newAvailability });
  };

  const resetFilters = () => {
    onFiltersChange({
      priceRange: [minPrice, maxPrice],
      formats: [],
      series: [],
      editions: [],
      availability: [],
    });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice) count++;
    if (filters.formats.length > 0) count += filters.formats.length;
    if (filters.series.length > 0) count += filters.series.length;
    if (filters.editions.length > 0) count += filters.editions.length;
    if (filters.availability.length > 0) count += filters.availability.length;
    return count;
  }, [filters, minPrice, maxPrice]);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-muted transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔍</span>
          <div className="text-left">
            <h3 className="text-lg font-medium">Filtres</h3>
            <p className="text-sm text-muted-foreground">
              {totalResults} œuvre{totalResults > 1 ? 's' : ''} trouvée{totalResults > 1 ? 's' : ''}
              {activeFiltersCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {activeFiltersCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetFilters();
              }}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Réinitialiser
            </button>
          )}
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Filters body */}
      {isOpen && (
        <div className="border-t border-border p-6 space-y-8">
          {/* Prix */}
          <div>
            <label className="text-sm font-medium mb-4 block">
              Prix : {filters.priceRange[0]}€ - {filters.priceRange[1]}€
            </label>
            <Slider
              min={minPrice}
              max={maxPrice}
              step={50}
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{minPrice}€</span>
              <span>{maxPrice}€</span>
            </div>
          </div>

          {/* Formats */}
          <div>
            <label className="text-sm font-medium mb-3 block">Format</label>
            <div className="grid grid-cols-2 gap-2">
              {FORMATS.map((format) => (
                <button
                  key={format.value}
                  onClick={() => toggleFormat(format.value)}
                  className={`p-3 rounded-lg border text-sm transition-all ${
                    filters.formats.includes(format.value)
                      ? 'border-primary bg-primary/5 font-medium'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {format.label}
                </button>
              ))}
            </div>
          </div>

          {/* Séries */}
          <div>
            <label className="text-sm font-medium mb-3 block">Série</label>
            <div className="space-y-2">
              {SERIES.map((series) => (
                <button
                  key={series.value}
                  onClick={() => toggleSeries(series.value)}
                  className={`w-full p-3 rounded-lg border text-sm text-left flex items-center gap-2 transition-all ${
                    filters.series.includes(series.value)
                      ? 'border-primary bg-primary/5 font-medium'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-lg">{series.icon}</span>
                  {series.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type d'édition */}
          <div>
            <label className="text-sm font-medium mb-3 block">Type d'édition</label>
            <div className="space-y-2">
              {EDITIONS.map((edition) => (
                <button
                  key={edition.value}
                  onClick={() => toggleEdition(edition.value as 'limited' | 'unlimited')}
                  className={`w-full p-3 rounded-lg border text-sm text-left flex items-center gap-2 transition-all ${
                    filters.editions.includes(edition.value as 'limited' | 'unlimited')
                      ? 'border-primary bg-primary/5 font-medium'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-lg">{edition.icon}</span>
                  {edition.label}
                </button>
              ))}
            </div>
          </div>

          {/* Disponibilité */}
          <div>
            <label className="text-sm font-medium mb-3 block">Disponibilité</label>
            <div className="space-y-2">
              {AVAILABILITY.map((avail) => (
                <button
                  key={avail.value}
                  onClick={() => toggleAvailability(avail.value as any)}
                  className={`w-full p-3 rounded-lg border text-sm text-left flex items-center gap-2 transition-all ${
                    filters.availability.includes(avail.value as any)
                      ? 'border-primary bg-primary/5 font-medium'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      avail.color === 'green'
                        ? 'bg-green-500'
                        : avail.color === 'orange'
                        ? 'bg-orange-500'
                        : 'bg-red-500'
                    }`}
                  />
                  {avail.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Lalou
