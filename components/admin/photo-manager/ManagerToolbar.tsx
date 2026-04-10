"use client";

import { Search, Grid, List, X } from "lucide-react";

interface ManagerToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: "all" | "visible" | "hidden" | "forsale";
  onFilterChange: (status: "all" | "visible" | "hidden" | "forsale") => void;
  sortBy: "name" | "date" | "category";
  onSortChange: (sort: "name" | "date" | "category") => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  selectedCount: number;
  onDeselectAll: () => void;
  totalPhotos: number;
  visibleCount: number;
  forSaleCount: number;
}

export default function ManagerToolbar({
  searchQuery, onSearchChange,
  filterStatus, onFilterChange,
  sortBy, onSortChange,
  viewMode, onViewModeChange,
  selectedCount, onDeselectAll,
  totalPhotos, visibleCount, forSaleCount,
}: ManagerToolbarProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Recherche */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher des photos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Filtres */}
        <select value={filterStatus} onChange={(e) => onFilterChange(e.target.value as "all" | "visible" | "hidden" | "forsale")}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">Toutes</option>
          <option value="visible">Visibles</option>
          <option value="hidden">Masquées</option>
          <option value="forsale">À vendre</option>
        </select>

        {/* Tri */}
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value as "name" | "date" | "category")}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="name">Nom</option>
          <option value="date">Date</option>
          <option value="category">Catégorie</option>
        </select>

        {/* Vue grille/liste */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button onClick={() => onViewModeChange("grid")}
            className={`p-2 rounded ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
            title="Vue grille (G)">
            <Grid className="w-5 h-5" />
          </button>
          <button onClick={() => onViewModeChange("list")}
            className={`p-2 rounded ${viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
            title="Vue liste (G)">
            <List className="w-5 h-5" />
          </button>
        </div>

        {/* Actions de sélection */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-700">
              {selectedCount} sélectionné{selectedCount > 1 ? "s" : ""}
            </span>
            <button onClick={onDeselectAll} className="p-1 hover:bg-blue-100 rounded" title="Désélectionner (Échap)">
              <X className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
        <span>{totalPhotos} photo{totalPhotos > 1 ? "s" : ""}</span>
        <span>•</span>
        <span>{visibleCount} visible{visibleCount > 1 ? "s" : ""}</span>
        <span>•</span>
        <span>{forSaleCount} à vendre</span>
      </div>
    </div>
  );
}

// Lalou
