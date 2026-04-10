'use client';

import type { FilterState, FilterPhoto } from './filters/types';
import { SUB_CATEGORY_OPTIONS, SUB_CATEGORY_LABELS } from './filters/types';
import useFilterCounts from './filters/useFilterCounts';
import CollapsibleSection from './filters/CollapsibleSection';

interface PhotoFiltersProps {
  photos: FilterPhoto[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

function RadioOption({ name, value, checked, onChange, label, count }: {
  name: string; value: string; checked: boolean;
  onChange: () => void; label: string; count: number;
}) {
  return (
    <label className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-muted/30 px-2 rounded">
      <div className="flex items-center gap-2">
        <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="w-4 h-4" />
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <span className="text-xs text-muted-foreground font-medium">{count}</span>
    </label>
  );
}

function CheckboxOption({ checked, onChange, label, count }: {
  checked: boolean; onChange: () => void; label: string; count: number;
}) {
  return (
    <label className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-muted/30 px-2 rounded">
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={checked} onChange={onChange} className="w-4 h-4" />
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <span className="text-xs text-muted-foreground font-medium">{count}</span>
    </label>
  );
}

export default function PhotoFilters({ photos, filters, onFiltersChange }: PhotoFiltersProps) {
  const { statusCounts, mainCategories, mainCategoryCounts, subCategoryCounts, series, seriesCounts } = useFilterCounts(photos);

  const update = (partial: Partial<FilterState>) => onFiltersChange({ ...filters, ...partial });

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Filtres</h3>
          <button onClick={() => update({ status: 'all', mainCategory: 'all', subCategories: [], series: 'all', showGrouped: false })}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Groupées */}
      <div className="px-4 py-3 border-b border-border bg-muted/10">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={filters.showGrouped}
            onChange={(e) => update({ showGrouped: e.target.checked })}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
          <span className="text-sm text-foreground font-medium">Voir toutes les photos (groupées incluses)</span>
        </label>
        <p className="text-xs text-muted-foreground mt-1 ml-6">Par défaut, les photos avec un nom de série sont masquées</p>
      </div>

      {/* Statut */}
      <CollapsibleSection title="Statut" defaultOpen>
        <RadioOption name="status" value="to-sort" checked={filters.status === 'to-sort'}
          onChange={() => update({ status: 'to-sort' })} label="⏳ À trier" count={statusCounts['to-sort']} />
        <RadioOption name="status" value="trash" checked={filters.status === 'trash'}
          onChange={() => update({ status: 'trash' })} label="🗑️ Corbeille" count={statusCounts.trash} />
        <RadioOption name="status" value="all" checked={filters.status === 'all'}
          onChange={() => update({ status: 'all' })} label="Toutes" count={statusCounts.all} />
      </CollapsibleSection>

      {/* Catégorie principale */}
      <CollapsibleSection title="Catégorie">
        <RadioOption name="mainCategory" value="all" checked={filters.mainCategory === 'all'}
          onChange={() => update({ mainCategory: 'all' })} label="Toutes" count={statusCounts.all} />
        {mainCategories.map(cat => (
          <RadioOption key={cat} name="mainCategory" value={cat} checked={filters.mainCategory === cat}
            onChange={() => update({ mainCategory: cat })} label={cat} count={mainCategoryCounts[cat]} />
        ))}
      </CollapsibleSection>

      {/* Type de vente */}
      <CollapsibleSection title="Type de vente">
        {SUB_CATEGORY_OPTIONS.map(subCat => (
          <CheckboxOption key={subCat} checked={filters.subCategories.includes(subCat)}
            onChange={() => {
              const subs = filters.subCategories.includes(subCat)
                ? filters.subCategories.filter(c => c !== subCat)
                : [...filters.subCategories, subCat];
              update({ subCategories: subs });
            }}
            label={SUB_CATEGORY_LABELS[subCat]} count={subCategoryCounts[subCat] || 0} />
        ))}
      </CollapsibleSection>

      {/* Séries */}
      {series.length > 0 && (
        <CollapsibleSection title="Série">
          <RadioOption name="series" value="all" checked={filters.series === 'all'}
            onChange={() => update({ series: 'all' })} label="Toutes" count={statusCounts.all} />
          {series.map(s => (
            <RadioOption key={s} name="series" value={s} checked={filters.series === s}
              onChange={() => update({ series: s })} label={s} count={seriesCounts[s]} />
          ))}
        </CollapsibleSection>
      )}
    </div>
  );
}

// Lalou
