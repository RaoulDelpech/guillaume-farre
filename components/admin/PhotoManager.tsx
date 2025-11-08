"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Photo {
  id: string;
  filename: string;
  path: string;
  title?: string;
  status: "published" | "draft" | "trash";
  categories: string[];
  price?: number;
  limitedEdition?: {
    sold: number;
    total: number;
  };
  selected?: boolean;
}

// Composant pour une photo déplaçable
function SortablePhoto({ photo, isSelected, onSelect, onQuickAction }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      whileHover={{ scale: 1.02 }}
      className={`relative group cursor-move ${isSelected ? "ring-4 ring-blue-500" : ""}`}
    >
      <div className="relative bg-white rounded-lg shadow-sm overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-all">
        {/* Checkbox de sélection */}
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(photo.id);
            }}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Badge de statut */}
        <div className="absolute top-2 right-2 z-10">
          {photo.status === "published" && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Publié</span>
          )}
          {photo.status === "draft" && (
            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">Brouillon</span>
          )}
          {photo.status === "trash" && (
            <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Corbeille</span>
          )}
        </div>

        {/* Image */}
        <div className="aspect-square relative">
          <Image
            src={photo.path}
            alt={photo.title || photo.filename}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Infos */}
        <div className="p-3">
          <p className="font-medium text-sm truncate">{photo.title || photo.filename}</p>
          <div className="flex items-center justify-between mt-2">
            {photo.price && <span className="text-sm text-gray-600">{photo.price}€</span>}
            {photo.limitedEdition && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {photo.limitedEdition.sold}/{photo.limitedEdition.total} vendus
              </span>
            )}
          </div>
        </div>

        {/* Actions rapides au hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAction(photo.id, "edit");
              }}
              className="bg-white text-gray-900 px-3 py-1 rounded-lg text-sm hover:bg-gray-100"
            >
              ✏️ Éditer
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAction(photo.id, "preview");
              }}
              className="bg-white text-gray-900 px-3 py-1 rounded-lg text-sm hover:bg-gray-100"
            >
              👁️ Voir
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PhotoManager() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "trash">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [batchMode, setBatchMode] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Charger les photos
  useEffect(() => {
    loadPhotos();
  }, []);

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + A : Tout sélectionner
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        selectAll();
      }
      // Ctrl/Cmd + S : Sauvegarder
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveChanges();
      }
      // Delete : Supprimer sélection
      if (e.key === "Delete" && selectedPhotos.size > 0) {
        e.preventDefault();
        batchAction("trash");
      }
      // Escape : Déselectionner tout
      if (e.key === "Escape") {
        setSelectedPhotos(new Set());
        setBatchMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhotos]);

  // Auto-save
  useEffect(() => {
    if (autoSaveEnabled && photos.length > 0) {
      const timer = setTimeout(() => {
        saveChanges(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [photos, autoSaveEnabled]);

  const loadPhotos = async () => {
    // Simuler le chargement
    setTimeout(() => {
      setPhotos([
        {
          id: "1",
          filename: "ferrari-noir-01.jpg",
          path: "/images/works/empreintes/ferrari-noir-01.jpg",
          title: "Ferrari Noire #01",
          status: "published",
          categories: ["limited", "empreintes"],
          price: 500,
          limitedEdition: { sold: 3, total: 7 }
        },
        {
          id: "2",
          filename: "atelier-02.jpg",
          path: "/images/works/atelier/atelier-02.jpg",
          title: "Atelier 2024",
          status: "draft",
          categories: ["unlimited", "atelier"],
          price: 250
        },
        // Ajouter plus de photos ici
      ]);
    }, 500);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPhotos((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });

      toast.success("Ordre modifié", {
        description: "Les photos ont été réorganisées"
      });
    }
  };

  const selectPhoto = (photoId: string) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
    setBatchMode(newSelected.size > 0);
  };

  const selectAll = () => {
    const filtered = getFilteredPhotos();
    setSelectedPhotos(new Set(filtered.map(p => p.id)));
    setBatchMode(true);
    toast.info(`${filtered.length} photos sélectionnées`);
  };

  const batchAction = (action: string) => {
    const count = selectedPhotos.size;

    switch (action) {
      case "publish":
        setPhotos(photos.map(p =>
          selectedPhotos.has(p.id) ? { ...p, status: "published" } : p
        ));
        toast.success(`${count} photos publiées`);
        break;
      case "draft":
        setPhotos(photos.map(p =>
          selectedPhotos.has(p.id) ? { ...p, status: "draft" } : p
        ));
        toast.info(`${count} photos mises en brouillon`);
        break;
      case "trash":
        setPhotos(photos.map(p =>
          selectedPhotos.has(p.id) ? { ...p, status: "trash" } : p
        ));
        toast.warning(`${count} photos mises à la corbeille`);
        break;
      case "delete":
        setPhotos(photos.filter(p => !selectedPhotos.has(p.id)));
        toast.error(`${count} photos supprimées définitivement`);
        break;
      case "price":
        // Ouvrir modal de modification de prix
        break;
    }

    setSelectedPhotos(new Set());
    setBatchMode(false);
  };

  const quickAction = (photoId: string, action: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;

    switch (action) {
      case "edit":
        toast.info(`Édition de ${photo.title}`);
        // Ouvrir modal d'édition
        break;
      case "preview":
        toast.info(`Prévisualisation de ${photo.title}`);
        // Ouvrir prévisualisation
        break;
    }
  };

  const saveChanges = (auto = false) => {
    setLastSaved(new Date());

    if (!auto) {
      toast.success("Modifications sauvegardées", {
        description: "Toutes les modifications ont été enregistrées"
      });
    }
  };

  const getFilteredPhotos = () => {
    let filtered = photos;

    if (filter !== "all") {
      filtered = filtered.filter(p => p.status === filter);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.filename.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredPhotos = getFilteredPhotos();

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header avec actions */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Gestion des photos</h2>

          <div className="flex items-center gap-4">
            {/* Indicateur de sauvegarde */}
            <div className="flex items-center gap-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSaveEnabled}
                  onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm">Auto-save</span>
              </label>

              {lastSaved && (
                <span className="text-xs text-gray-500">
                  Sauvegardé {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>

            {/* Boutons vue */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
              >
                🔲 Grille
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
              >
                📋 Liste
              </button>
            </div>
          </div>
        </div>

        {/* Barre d'outils */}
        <div className="flex items-center gap-4">
          {/* Recherche */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="🔍 Rechercher des photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtres */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-gray-900 text-white" : "bg-gray-100"}`}
            >
              Toutes ({photos.length})
            </button>
            <button
              onClick={() => setFilter("published")}
              className={`px-4 py-2 rounded-lg ${filter === "published" ? "bg-green-600 text-white" : "bg-gray-100"}`}
            >
              Publiées ({photos.filter(p => p.status === "published").length})
            </button>
            <button
              onClick={() => setFilter("draft")}
              className={`px-4 py-2 rounded-lg ${filter === "draft" ? "bg-yellow-600 text-white" : "bg-gray-100"}`}
            >
              Brouillons ({photos.filter(p => p.status === "draft").length})
            </button>
            <button
              onClick={() => setFilter("trash")}
              className={`px-4 py-2 rounded-lg ${filter === "trash" ? "bg-red-600 text-white" : "bg-gray-100"}`}
            >
              Corbeille ({photos.filter(p => p.status === "trash").length})
            </button>
          </div>
        </div>

        {/* Actions en masse */}
        <AnimatePresence>
          {batchMode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-blue-700 font-medium">
                    {selectedPhotos.size} photo{selectedPhotos.size > 1 ? "s" : ""} sélectionnée{selectedPhotos.size > 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={selectAll}
                    className="text-blue-600 text-sm underline"
                  >
                    Tout sélectionner
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => batchAction("publish")}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700"
                  >
                    ✅ Publier
                  </button>
                  <button
                    onClick={() => batchAction("draft")}
                    className="bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-700"
                  >
                    📝 Brouillon
                  </button>
                  <button
                    onClick={() => batchAction("price")}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
                  >
                    💶 Modifier prix
                  </button>
                  <button
                    onClick={() => batchAction("trash")}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700"
                  >
                    🗑️ Corbeille
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grille de photos avec drag & drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={filteredPhotos.map(p => p.id)} strategy={rectSortingStrategy}>
          <div className={`grid ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"} gap-4`}>
            {filteredPhotos.map((photo) => (
              <SortablePhoto
                key={photo.id}
                photo={photo}
                isSelected={selectedPhotos.has(photo.id)}
                onSelect={selectPhoto}
                onQuickAction={quickAction}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Message si aucune photo */}
      {filteredPhotos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune photo trouvée</p>
        </div>
      )}

      {/* Raccourcis clavier */}
      <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs space-y-1 opacity-50 hover:opacity-100 transition-opacity">
        <p className="font-semibold mb-2">Raccourcis:</p>
        <p>⌘A - Tout sélectionner</p>
        <p>⌘S - Sauvegarder</p>
        <p>Delete - Supprimer</p>
        <p>Esc - Déselectionner</p>
      </div>
    </div>
  );
}

// Lalou