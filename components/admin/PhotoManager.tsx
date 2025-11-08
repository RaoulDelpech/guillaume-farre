"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Search, Filter, Grid, List, Check, X, Image as ImageIcon, Trash2, Eye, EyeOff, Tag, DollarSign, Calendar, Download, Upload } from "lucide-react";
import type { PhotoMetadata } from "@/lib/admin/photo-manager";

interface PhotoManagerProps {
  photos: PhotoMetadata[];
  onPhotosReorder: (photos: PhotoMetadata[]) => void;
  onPhotoUpdate: (index: number, updates: Partial<PhotoMetadata>) => void;
  onPhotoDelete: (index: number) => void;
  onBatchOperation: (operation: string, selectedPhotos: number[]) => void;
}

function SortablePhoto({ photo, index, isSelected, onSelect, onUpdate, viewMode }: {
  photo: PhotoMetadata;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<PhotoMetadata>) => void;
  viewMode: "grid" | "list";
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: photo.path });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (viewMode === "list") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`flex items-center gap-4 p-4 bg-white rounded-lg border transition-all hover:shadow-md ${
          isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
        }`}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-5 h-5 rounded border-gray-300"
          onClick={(e) => e.stopPropagation()}
        />
        <img
          src={photo.path}
          alt={photo.filename}
          className="w-16 h-16 object-cover rounded"
        />
        <div className="flex-1">
          <p className="font-medium text-gray-900">{photo.title || photo.filename}</p>
          <p className="text-sm text-gray-500">
            {photo.category} • {photo.year || "N/A"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {photo.visible ? (
            <Eye className="w-5 h-5 text-green-500" />
          ) : (
            <EyeOff className="w-5 h-5 text-gray-400" />
          )}
          {photo.forSale && <DollarSign className="w-5 h-5 text-blue-500" />}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative group bg-white rounded-lg overflow-hidden border-2 transition-all hover:shadow-lg ${
        isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
      } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
    >
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-5 h-5 rounded border-gray-300 bg-white/80"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <div className="aspect-square bg-gray-100">
        <img
          src={photo.path}
          alt={photo.filename}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 truncate">
          {photo.title || photo.filename}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {photo.visible ? (
            <Eye className="w-4 h-4 text-green-500" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-400" />
          )}
          {photo.forSale && <DollarSign className="w-4 h-4 text-blue-500" />}
          {photo.categories?.includes("limited") && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
              Limitée
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PhotoManager({
  photos,
  onPhotosReorder,
  onPhotoUpdate,
  onPhotoDelete,
  onBatchOperation
}: PhotoManagerProps) {
  const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterStatus, setFilterStatus] = useState<"all" | "visible" | "hidden" | "forsale">("all");
  const [sortBy, setSortBy] = useState<"name" | "date" | "category">("name");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filtrage et tri des photos
  const filteredAndSortedPhotos = useMemo(() => {
    let filtered = [...photos];

    // Recherche
    if (searchQuery) {
      filtered = filtered.filter(photo =>
        photo.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre statut
    switch (filterStatus) {
      case "visible":
        filtered = filtered.filter(p => p.visible);
        break;
      case "hidden":
        filtered = filtered.filter(p => !p.visible);
        break;
      case "forsale":
        filtered = filtered.filter(p => p.forSale);
        break;
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.title || a.filename).localeCompare(b.title || b.filename);
        case "date":
          return (b.year || 0) - (a.year || 0);
        case "category":
          return (a.category || "").localeCompare(b.category || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [photos, searchQuery, filterStatus, sortBy]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = photos.findIndex(p => p.path === active.id);
      const newIndex = photos.findIndex(p => p.path === over.id);
      const reorderedPhotos = arrayMove(photos, oldIndex, newIndex);
      onPhotosReorder(reorderedPhotos);
    }
  };

  const togglePhotoSelection = (index: number) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedPhotos(newSelected);
  };

  const selectAll = () => {
    const allIndexes = new Set(filteredAndSortedPhotos.map((_, i) => i));
    setSelectedPhotos(allIndexes);
  };

  const deselectAll = () => {
    setSelectedPhotos(new Set());
  };

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + A : Tout sélectionner
      if ((e.metaKey || e.ctrlKey) && e.key === "a") {
        e.preventDefault();
        selectAll();
      }

      // Échap : Désélectionner tout
      if (e.key === "Escape") {
        deselectAll();
      }

      // Delete : Supprimer sélection
      if (e.key === "Delete" && selectedPhotos.size > 0) {
        if (confirm(`Supprimer ${selectedPhotos.size} photo(s) ?`)) {
          onBatchOperation("delete", Array.from(selectedPhotos));
          deselectAll();
        }
      }

      // G : Toggle grille/liste
      if (e.key === "g" && !e.metaKey && !e.ctrlKey) {
        setViewMode(prev => prev === "grid" ? "list" : "grid");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhotos, onBatchOperation]);

  return (
    <div className="space-y-4">
      {/* Barre d'outils */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Recherche */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des photos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filtres */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes</option>
            <option value="visible">Visibles</option>
            <option value="hidden">Masquées</option>
            <option value="forsale">À vendre</option>
          </select>

          {/* Tri */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Nom</option>
            <option value="date">Date</option>
            <option value="category">Catégorie</option>
          </select>

          {/* Vue grille/liste */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title="Vue grille (G)"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${
                viewMode === "list"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title="Vue liste (G)"
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Actions de sélection */}
          {selectedPhotos.size > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-700">
                {selectedPhotos.size} sélectionné{selectedPhotos.size > 1 ? "s" : ""}
              </span>
              <button
                onClick={deselectAll}
                className="p-1 hover:bg-blue-100 rounded"
                title="Désélectionner (Échap)"
              >
                <X className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          )}
        </div>

        {/* Statistiques */}
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
          <span>{filteredAndSortedPhotos.length} photo{filteredAndSortedPhotos.length > 1 ? "s" : ""}</span>
          <span>•</span>
          <span>{photos.filter(p => p.visible).length} visible{photos.filter(p => p.visible).length > 1 ? "s" : ""}</span>
          <span>•</span>
          <span>{photos.filter(p => p.forSale).length} à vendre</span>
        </div>
      </div>

      {/* Grille/Liste de photos avec drag & drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredAndSortedPhotos.map(p => p.path)}
          strategy={rectSortingStrategy}
        >
          <div className={viewMode === "grid"
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            : "space-y-2"
          }>
            {filteredAndSortedPhotos.map((photo, index) => {
              const globalIndex = photos.findIndex(p => p.path === photo.path);
              return (
                <SortablePhoto
                  key={photo.path}
                  photo={photo}
                  index={globalIndex}
                  isSelected={selectedPhotos.has(index)}
                  onSelect={() => togglePhotoSelection(index)}
                  onUpdate={(updates) => onPhotoUpdate(globalIndex, updates)}
                  viewMode={viewMode}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {filteredAndSortedPhotos.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucune photo trouvée</p>
        </div>
      )}
    </div>
  );
}

// Lalou