"use client";

import { Search } from "lucide-react";
import { ReservationsExportButton } from "./ReservationsExportButton";
import {
  ALL_MODES,
  ALL_STATUSES,
  MODE_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
  ToileLite,
} from "./types";

/**
 * Bloc filtres : recherche texte + statuts multi + modes paiement multi
 * + toile select + boutons reset / export.
 *
 * @author Lalou
 */
export interface ReservationsFiltersProps {
  search: string;
  selectedStatuses: string[];
  selectedModes: string[];
  selectedCanvasId: string;
  toiles: ToileLite[];
  exportUrl: string;
  onSearchChange: (value: string) => void;
  onToggleStatus: (status: string) => void;
  onToggleMode: (mode: string) => void;
  onCanvasChange: (canvasId: string) => void;
  onClear: () => void;
}

export function ReservationsFilters({
  search,
  selectedStatuses,
  selectedModes,
  selectedCanvasId,
  toiles,
  exportUrl,
  onSearchChange,
  onToggleStatus,
  onToggleMode,
  onCanvasChange,
  onClear,
}: ReservationsFiltersProps) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded p-5 mb-6 space-y-4">
      {/* Recherche */}
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher : nom, email, n° commande, ID, titre…"
          className="flex-1 bg-transparent border-b border-zinc-700 focus:border-[#C4A570] py-2 text-sm outline-none"
        />
      </div>

      {/* Statuts */}
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Statut</p>
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map((s) => {
            const active = selectedStatuses.includes(s);
            return (
              <button
                key={s}
                onClick={() => onToggleStatus(s)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  active
                    ? STATUS_COLORS[s]
                    : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modes */}
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
          Mode paiement
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_MODES.map((m) => {
            const active = selectedModes.includes(m);
            return (
              <button
                key={m}
                onClick={() => onToggleMode(m)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  active
                    ? "bg-[#C4A570]/20 text-[#C4A570] border-[#C4A570]/50"
                    : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                {MODE_LABELS[m]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toile + actions */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedCanvasId}
          onChange={(e) => onCanvasChange(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 rounded text-zinc-200 focus:border-[#C4A570] outline-none"
        >
          <option value="">Toutes les toiles</option>
          {toiles.map((t) => (
            <option key={String(t.id)} value={String(t.id)}>
              {t.name}
            </option>
          ))}
        </select>
        <button
          onClick={onClear}
          className="text-xs px-3 py-2 text-zinc-400 hover:text-white border border-zinc-700 rounded transition-colors"
        >
          Réinitialiser
        </button>
        <ReservationsExportButton exportUrl={exportUrl} />
      </div>
    </div>
  );
}

// Lalou
