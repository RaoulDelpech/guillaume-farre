"use client";

import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, DollarSign } from "lucide-react";
import type { PhotoMetadata } from "@/lib/admin/photo-manager";

interface SortablePhotoProps {
  photo: PhotoMetadata;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<PhotoMetadata>) => void;
  viewMode: "grid" | "list";
}

export default function SortablePhoto({ photo, index, isSelected, onSelect, onUpdate, viewMode }: SortablePhotoProps) {
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
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}
        className={`flex items-center gap-4 p-4 bg-white rounded-lg border transition-all hover:shadow-md ${
          isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
        }`}>
        <input type="checkbox" checked={isSelected} onChange={onSelect}
          className="w-5 h-5 rounded border-gray-300" onClick={(e) => e.stopPropagation()} />
        <div className="relative w-16 h-16 flex-shrink-0">
          <Image src={photo.path} alt={photo.filename} fill sizes="64px"
            className="object-cover rounded" unoptimized />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{photo.title || photo.filename}</p>
          <p className="text-sm text-gray-500">{photo.category} • {photo.year || "N/A"}</p>
        </div>
        <div className="flex items-center gap-2">
          {photo.visible ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
          {photo.forSale && <DollarSign className="w-5 h-5 text-blue-500" />}
        </div>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className={`relative group bg-white rounded-lg overflow-hidden border-2 transition-all hover:shadow-lg ${
        isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
      } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}>
      <div className="absolute top-2 left-2 z-10">
        <input type="checkbox" checked={isSelected} onChange={onSelect}
          className="w-5 h-5 rounded border-gray-300 bg-white/80" onClick={(e) => e.stopPropagation()} />
      </div>
      <div className="aspect-square bg-gray-100 relative">
        <Image src={photo.path} alt={photo.filename} fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover" unoptimized />
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 truncate">{photo.title || photo.filename}</p>
        <div className="flex items-center gap-2 mt-1">
          {photo.visible ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
          {photo.forSale && <DollarSign className="w-4 h-4 text-blue-500" />}
          {photo.categories?.includes("limited") && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Limitée</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Lalou
