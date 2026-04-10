"use client";

import { useState, useEffect, useMemo } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable";
import { Image as ImageIcon } from "lucide-react";
import type { PhotoMetadata } from "@/lib/admin/photo-manager";
import SortablePhoto from "./photo-manager/SortablePhoto";
import ManagerToolbar from "./photo-manager/ManagerToolbar";

interface PhotoManagerProps {
  photos: PhotoMetadata[];
  onPhotosReorder: (photos: PhotoMetadata[]) => void;
  onPhotoUpdate: (index: number, updates: Partial<PhotoMetadata>) => void;
  onPhotoDelete: (index: number) => void;
  onBatchOperation: (operation: string, selectedPhotos: number[]) => void;
}

export default function PhotoManager({
  photos, onPhotosReorder, onPhotoUpdate, onPhotoDelete, onBatchOperation
}: PhotoManagerProps) {
  const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterStatus, setFilterStatus] = useState<"all" | "visible" | "hidden" | "forsale">("all");
  const [sortBy, setSortBy] = useState<"name" | "date" | "category">("name");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredAndSortedPhotos = useMemo(() => {
    let filtered = [...photos];

    if (searchQuery) {
      filtered = filtered.filter(photo =>
        photo.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (filterStatus) {
      case "visible": filtered = filtered.filter(p => p.visible); break;
      case "hidden": filtered = filtered.filter(p => !p.visible); break;
      case "forsale": filtered = filtered.filter(p => p.forSale); break;
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name": return (a.title || a.filename).localeCompare(b.title || b.filename);
        case "date": return (b.year || 0) - (a.year || 0);
        case "category": return (a.category || "").localeCompare(b.category || "");
        default: return 0;
      }
    });

    return filtered;
  }, [photos, searchQuery, filterStatus, sortBy]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = photos.findIndex(p => p.path === active.id);
      const newIndex = photos.findIndex(p => p.path === over.id);
      onPhotosReorder(arrayMove(photos, oldIndex, newIndex));
    }
  };

  const selectAll = () => setSelectedPhotos(new Set(filteredAndSortedPhotos.map((_, i) => i)));
  const deselectAll = () => setSelectedPhotos(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "a") { e.preventDefault(); selectAll(); }
      if (e.key === "Escape") deselectAll();
      if (e.key === "Delete" && selectedPhotos.size > 0) {
        if (confirm(`Supprimer ${selectedPhotos.size} photo(s) ?`)) {
          onBatchOperation("delete", Array.from(selectedPhotos));
          deselectAll();
        }
      }
      if (e.key === "g" && !e.metaKey && !e.ctrlKey) setViewMode(prev => prev === "grid" ? "list" : "grid");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhotos, onBatchOperation]);

  return (
    <div className="space-y-4">
      <ManagerToolbar
        searchQuery={searchQuery} onSearchChange={setSearchQuery}
        filterStatus={filterStatus} onFilterChange={setFilterStatus}
        sortBy={sortBy} onSortChange={setSortBy}
        viewMode={viewMode} onViewModeChange={setViewMode}
        selectedCount={selectedPhotos.size} onDeselectAll={deselectAll}
        totalPhotos={filteredAndSortedPhotos.length}
        visibleCount={photos.filter(p => p.visible).length}
        forSaleCount={photos.filter(p => p.forSale).length}
      />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredAndSortedPhotos.map(p => p.path)} strategy={rectSortingStrategy}>
          <div className={viewMode === "grid"
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            : "space-y-2"
          }>
            {filteredAndSortedPhotos.map((photo, index) => {
              const globalIndex = photos.findIndex(p => p.path === photo.path);
              return (
                <SortablePhoto key={photo.path} photo={photo} index={globalIndex}
                  isSelected={selectedPhotos.has(index)}
                  onSelect={() => {
                    const s = new Set(selectedPhotos);
                    s.has(index) ? s.delete(index) : s.add(index);
                    setSelectedPhotos(s);
                  }}
                  onUpdate={(updates) => onPhotoUpdate(globalIndex, updates)}
                  viewMode={viewMode} />
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
