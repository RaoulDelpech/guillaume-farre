"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface PhotoEdit {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  blur?: number;
  rotation?: number;
  scale?: number;
  crop?: { x: number; y: number; width: number; height: number };
}

interface PhotoPreviewProps {
  photo: {
    id: string;
    src: string;
    title: string;
    description?: string;
    categories?: string[];
    price?: number;
  };
  onSave?: (edits: PhotoEdit) => void;
  onCancel?: () => void;
}

export default function PhotoPreview({ photo, onSave, onCancel }: PhotoPreviewProps) {
  const [edits, setEdits] = useState<PhotoEdit>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    rotation: 0,
    scale: 100,
  });

  const [isComparing, setIsComparing] = useState(false);
  const [previewMode, setPreviewMode] = useState<"split" | "toggle" | "side">("split");
  const [showGrid, setShowGrid] = useState(false);
  const [autoPreview, setAutoPreview] = useState(true);

  // Style CSS pour les filtres en temps réel
  const filterStyle = {
    filter: `
      brightness(${edits.brightness}%)
      contrast(${edits.contrast}%)
      saturate(${edits.saturation}%)
      blur(${edits.blur}px)
    `,
    transform: `rotate(${edits.rotation}deg) scale(${edits.scale! / 100})`,
  };

  // Reset tous les filtres
  const resetFilters = () => {
    setEdits({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      rotation: 0,
      scale: 100,
    });
  };

  // Vérifier si des modifications ont été faites
  const hasChanges = () => {
    return (
      edits.brightness !== 100 ||
      edits.contrast !== 100 ||
      edits.saturation !== 100 ||
      edits.blur !== 0 ||
      edits.rotation !== 0 ||
      edits.scale !== 100
    );
  };

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Espace pour comparer avant/après
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        setIsComparing(true);
      }

      // R pour reset
      if (e.key === "r" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        resetFilters();
      }

      // G pour grille
      if (e.key === "g") {
        setShowGrid(!showGrid);
      }

      // 1, 2, 3 pour modes de comparaison
      if (e.key === "1") setPreviewMode("split");
      if (e.key === "2") setPreviewMode("toggle");
      if (e.key === "3") setPreviewMode("side");
    };

    const handleKeyRelease = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsComparing(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyRelease);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyRelease);
    };
  }, [showGrid]);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Header avec titre et actions */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-3">
          🎨 Éditeur temps réel - {photo.title}
          {hasChanges() && (
            <span className="text-sm bg-yellow-600 px-2 py-1 rounded">
              Modifications non sauvegardées
            </span>
          )}
        </h2>

        <div className="flex items-center gap-4">
          {/* Mode de comparaison */}
          <div className="flex gap-2">
            <button
              onClick={() => setPreviewMode("split")}
              className={`px-3 py-1 rounded ${
                previewMode === "split" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              Split
            </button>
            <button
              onClick={() => setPreviewMode("toggle")}
              className={`px-3 py-1 rounded ${
                previewMode === "toggle" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              Toggle
            </button>
            <button
              onClick={() => setPreviewMode("side")}
              className={`px-3 py-1 rounded ${
                previewMode === "side" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              Côte à côte
            </button>
          </div>

          {/* Options */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Grille (G)</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoPreview}
              onChange={(e) => setAutoPreview(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Preview auto</span>
          </label>
        </div>
      </div>

      {/* Zone de prévisualisation */}
      <div className="flex-1 flex">
        {/* Preview principale */}
        <div className="flex-1 relative overflow-hidden">
          {previewMode === "split" && (
            <div className="relative w-full h-full">
              {/* Image originale (moitié gauche) */}
              <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
                <div className="relative w-[200%] h-full">
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Image modifiée (moitié droite) */}
              <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
                <div className="relative w-[200%] h-full -translate-x-1/2">
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-contain"
                    style={filterStyle}
                  />
                </div>
              </div>

              {/* Ligne de séparation */}
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/50" />

              {/* Labels */}
              <div className="absolute top-4 left-4 bg-black/50 px-2 py-1 rounded">
                <span className="text-white text-sm">Original</span>
              </div>
              <div className="absolute top-4 right-4 bg-black/50 px-2 py-1 rounded">
                <span className="text-white text-sm">Modifié</span>
              </div>
            </div>
          )}

          {previewMode === "toggle" && (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                className="object-contain"
                style={isComparing ? {} : filterStyle}
              />

              {/* Indicateur de comparaison */}
              <AnimatePresence>
                {isComparing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute bottom-8 bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Original (maintenez Espace)
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {previewMode === "side" && (
            <div className="flex w-full h-full gap-4 p-4">
              <div className="flex-1 relative">
                <Image
                  src={photo.src}
                  alt="Original"
                  fill
                  className="object-contain"
                />
                <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded">
                  <span className="text-white text-sm">Original</span>
                </div>
              </div>
              <div className="flex-1 relative">
                <Image
                  src={photo.src}
                  alt="Modifié"
                  fill
                  className="object-contain"
                  style={filterStyle}
                />
                <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded">
                  <span className="text-white text-sm">Modifié</span>
                </div>
              </div>
            </div>
          )}

          {/* Grille de composition */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-white/20" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Panneau de contrôles */}
        <div className="w-80 bg-gray-900 p-6 overflow-y-auto">
          <h3 className="text-white font-semibold mb-4">Ajustements</h3>

          <div className="space-y-4">
            {/* Luminosité */}
            <div>
              <label className="text-white text-sm flex justify-between mb-2">
                <span>💡 Luminosité</span>
                <span>{edits.brightness}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={edits.brightness}
                onChange={(e) => setEdits({ ...edits, brightness: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Contraste */}
            <div>
              <label className="text-white text-sm flex justify-between mb-2">
                <span>🔲 Contraste</span>
                <span>{edits.contrast}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={edits.contrast}
                onChange={(e) => setEdits({ ...edits, contrast: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Saturation */}
            <div>
              <label className="text-white text-sm flex justify-between mb-2">
                <span>🎨 Saturation</span>
                <span>{edits.saturation}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={edits.saturation}
                onChange={(e) => setEdits({ ...edits, saturation: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Flou */}
            <div>
              <label className="text-white text-sm flex justify-between mb-2">
                <span>💨 Flou</span>
                <span>{edits.blur}px</span>
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={edits.blur}
                onChange={(e) => setEdits({ ...edits, blur: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Rotation */}
            <div>
              <label className="text-white text-sm flex justify-between mb-2">
                <span>🔄 Rotation</span>
                <span>{edits.rotation}°</span>
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                value={edits.rotation}
                onChange={(e) => setEdits({ ...edits, rotation: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Échelle */}
            <div>
              <label className="text-white text-sm flex justify-between mb-2">
                <span>🔍 Échelle</span>
                <span>{edits.scale}%</span>
              </label>
              <input
                type="range"
                min="50"
                max="150"
                value={edits.scale}
                onChange={(e) => setEdits({ ...edits, scale: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>
          </div>

          {/* Presets */}
          <div className="mt-8">
            <h4 className="text-white font-semibold mb-3">Presets rapides</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setEdits({ ...edits, brightness: 110, contrast: 120, saturation: 110 })}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-2 rounded"
              >
                ☀️ Éclaircir
              </button>
              <button
                onClick={() => setEdits({ ...edits, brightness: 90, contrast: 110, saturation: 80 })}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-2 rounded"
              >
                🌙 Assombrir
              </button>
              <button
                onClick={() => setEdits({ ...edits, saturation: 0 })}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-2 rounded"
              >
                🎭 Noir & Blanc
              </button>
              <button
                onClick={() => setEdits({ ...edits, saturation: 80, contrast: 90 })}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-2 rounded"
              >
                📷 Vintage
              </button>
              <button
                onClick={() => setEdits({ ...edits, contrast: 130, saturation: 120 })}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-2 rounded"
              >
                🎨 Vibrant
              </button>
              <button
                onClick={() => setEdits({ ...edits, brightness: 105, blur: 1 })}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-2 rounded"
              >
                💭 Doux
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <button
              onClick={resetFilters}
              disabled={!hasChanges()}
              className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ↩️ Réinitialiser (Cmd+R)
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => onCancel?.()}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={() => onSave?.(edits)}
                disabled={!hasChanges()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
              >
                💾 Sauvegarder
              </button>
            </div>
          </div>

          {/* Raccourcis */}
          <div className="mt-8 text-gray-400 text-xs space-y-1">
            <p>Raccourcis :</p>
            <p>• Espace : Comparer avant/après</p>
            <p>• G : Afficher/masquer grille</p>
            <p>• 1/2/3 : Changer mode preview</p>
            <p>• Cmd+R : Réinitialiser</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Lalou