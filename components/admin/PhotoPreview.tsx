"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ZoomIn, ZoomOut, RotateCw, Download, Sliders, Grid3x3, Eye, EyeOff, Sun, Contrast, Droplets, Palette, Move, Maximize } from "lucide-react";
import type { PhotoMetadata } from "@/lib/admin/photo-manager";

interface PhotoPreviewProps {
  photo: PhotoMetadata;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (edits: PhotoEdits) => void;
}

interface PhotoEdits {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  rotation: number;
  flip: { horizontal: boolean; vertical: boolean };
}

const defaultEdits: PhotoEdits = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  rotation: 0,
  flip: { horizontal: false, vertical: false }
};

const presets = [
  { name: "Original", edits: defaultEdits },
  {
    name: "Noir & Blanc",
    edits: { ...defaultEdits, saturation: 0 }
  },
  {
    name: "Vintage",
    edits: { brightness: 110, contrast: 90, saturation: 70, blur: 0, rotation: 0, flip: { horizontal: false, vertical: false } }
  },
  {
    name: "Vibrant",
    edits: { brightness: 105, contrast: 110, saturation: 130, blur: 0, rotation: 0, flip: { horizontal: false, vertical: false } }
  },
  {
    name: "Dramatique",
    edits: { brightness: 90, contrast: 130, saturation: 110, blur: 0, rotation: 0, flip: { horizontal: false, vertical: false } }
  },
  {
    name: "Doux",
    edits: { brightness: 105, contrast: 95, saturation: 90, blur: 1, rotation: 0, flip: { horizontal: false, vertical: false } }
  }
];

export default function PhotoPreview({ photo, isOpen, onClose, onSave }: PhotoPreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [edits, setEdits] = useState<PhotoEdits>(defaultEdits);
  const [showGrid, setShowGrid] = useState(false);
  const [compareMode, setCompareMode] = useState<"none" | "split" | "toggle" | "side">("none");
  const [showOriginal, setShowOriginal] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Raccourcis clavier
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case "Escape":
          onClose();
          break;
        case " ":
          e.preventDefault();
          setShowOriginal(!showOriginal);
          break;
        case "g":
          setShowGrid(!showGrid);
          break;
        case "1":
          setCompareMode("none");
          break;
        case "2":
          setCompareMode("split");
          break;
        case "3":
          setCompareMode("side");
          break;
        case "r":
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            setEdits(defaultEdits);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, showOriginal, showGrid]);

  if (!isOpen) return null;

  const handleZoom = (direction: "in" | "out") => {
    setZoom(prev => {
      if (direction === "in") return Math.min(prev + 0.25, 3);
      return Math.max(prev - 0.25, 0.5);
    });
  };

  const handleRotate = () => {
    setEdits(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }));
  };

  const handleFlip = (direction: "horizontal" | "vertical") => {
    setEdits(prev => ({
      ...prev,
      flip: {
        ...prev.flip,
        [direction]: !prev.flip[direction]
      }
    }));
  };

  const getFilterStyle = () => {
    const filters = [
      `brightness(${edits.brightness}%)`,
      `contrast(${edits.contrast}%)`,
      `saturate(${edits.saturation}%)`,
      edits.blur > 0 ? `blur(${edits.blur}px)` : ""
    ].filter(Boolean).join(" ");

    const transform = [
      `rotate(${edits.rotation}deg)`,
      `scale(${zoom})`,
      edits.flip.horizontal ? "scaleX(-1)" : "",
      edits.flip.vertical ? "scaleY(-1)" : ""
    ].filter(Boolean).join(" ");

    return { filter: filters, transform };
  };

  const renderImage = (showEdits = true) => {
    const style = showEdits ? getFilterStyle() : { transform: `scale(${zoom})` };
    return (
      <div className="relative w-full h-full">
        <Image
          ref={imageRef}
          src={photo.path}
          alt={photo.filename}
          fill
          sizes="100vw"
          className="object-contain transition-all duration-300"
          style={style}
          draggable={false}
          unoptimized
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-black/50 backdrop-blur-sm flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <h3 className="text-white font-medium">{photo.title || photo.filename}</h3>
          <span className="text-gray-400 text-sm">
            {photo.category} • {photo.year || "N/A"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom */}
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1">
            <button
              onClick={() => handleZoom("out")}
              className="p-1 hover:bg-white/20 rounded"
              title="Zoom -"
            >
              <ZoomOut className="w-4 h-4 text-white" />
            </button>
            <span className="text-white text-sm min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => handleZoom("in")}
              className="p-1 hover:bg-white/20 rounded"
              title="Zoom +"
            >
              <ZoomIn className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Grille */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg transition-colors ${
              showGrid ? "bg-white/20 text-white" : "bg-white/10 text-gray-400 hover:text-white"
            }`}
            title="Grille de composition (G)"
          >
            <Grid3x3 className="w-5 h-5" />
          </button>

          {/* Mode comparaison */}
          <div className="flex gap-1 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setCompareMode("none")}
              className={`px-3 py-1 rounded text-sm ${
                compareMode === "none" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"
              }`}
              title="Pas de comparaison (1)"
            >
              Édité
            </button>
            <button
              onClick={() => setCompareMode("split")}
              className={`px-3 py-1 rounded text-sm ${
                compareMode === "split" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"
              }`}
              title="Comparaison split (2)"
            >
              Split
            </button>
            <button
              onClick={() => setCompareMode("side")}
              className={`px-3 py-1 rounded text-sm ${
                compareMode === "side" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"
              }`}
              title="Côte à côte (3)"
            >
              Côte à côte
            </button>
          </div>

          {/* Fermer */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg text-white"
            title="Fermer (Échap)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Image preview */}
        <div className="flex-1 relative flex items-center justify-center p-8 pt-24">
          {compareMode === "none" && (
            <div className="relative">
              {renderImage(!showOriginal)}
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
          )}

          {compareMode === "split" && (
            <div className="relative overflow-hidden">
              <div className="relative">
                {renderImage(true)}
              </div>
              <div className="absolute inset-0 w-1/2 overflow-hidden border-r-2 border-white">
                {renderImage(false)}
              </div>
            </div>
          )}

          {compareMode === "side" && (
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-white text-center mb-2">Original</p>
                {renderImage(false)}
              </div>
              <div className="flex-1">
                <p className="text-white text-center mb-2">Édité</p>
                {renderImage(true)}
              </div>
            </div>
          )}

          {/* Indicateur comparaison */}
          {showOriginal && compareMode === "none" && (
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded">
              Original (maintenez Espace)
            </div>
          )}
        </div>

        {/* Sidebar controls */}
        <div className="w-80 bg-gray-900 p-6 pt-24 overflow-y-auto">
          {/* Presets */}
          <div className="mb-6">
            <h4 className="text-white text-sm font-medium mb-3">Presets rapides</h4>
            <div className="grid grid-cols-2 gap-2">
              {presets.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => setEdits(preset.edits)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    JSON.stringify(edits) === JSON.stringify(preset.edits)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Ajustements */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-medium">Ajustements</h4>

            {/* Luminosité */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-300 text-sm flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  Luminosité
                </label>
                <span className="text-gray-400 text-xs">{edits.brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={edits.brightness}
                onChange={(e) => setEdits(prev => ({ ...prev, brightness: Number(e.target.value) }))}
                className="w-full"
              />
            </div>

            {/* Contraste */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-300 text-sm flex items-center gap-2">
                  <Contrast className="w-4 h-4" />
                  Contraste
                </label>
                <span className="text-gray-400 text-xs">{edits.contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={edits.contrast}
                onChange={(e) => setEdits(prev => ({ ...prev, contrast: Number(e.target.value) }))}
                className="w-full"
              />
            </div>

            {/* Saturation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-300 text-sm flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Saturation
                </label>
                <span className="text-gray-400 text-xs">{edits.saturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={edits.saturation}
                onChange={(e) => setEdits(prev => ({ ...prev, saturation: Number(e.target.value) }))}
                className="w-full"
              />
            </div>

            {/* Flou */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-300 text-sm flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Flou
                </label>
                <span className="text-gray-400 text-xs">{edits.blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={edits.blur}
                onChange={(e) => setEdits(prev => ({ ...prev, blur: Number(e.target.value) }))}
                className="w-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleRotate}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
            >
              <RotateCw className="w-4 h-4" />
              Rotation 90°
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleFlip("horizontal")}
                className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
                  edits.flip.horizontal
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                }`}
              >
                <Move className="w-4 h-4 rotate-90" />
                Flip H
              </button>
              <button
                onClick={() => handleFlip("vertical")}
                className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
                  edits.flip.vertical
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                }`}
              >
                <Move className="w-4 h-4" />
                Flip V
              </button>
            </div>

            <button
              onClick={() => setEdits(defaultEdits)}
              className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
              title="Reset (Cmd+R)"
            >
              Réinitialiser
            </button>

            {onSave && (
              <button
                onClick={() => onSave(edits)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Appliquer les modifications
              </button>
            )}
          </div>

          {/* Raccourcis */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <h4 className="text-white text-sm font-medium mb-3">Raccourcis</h4>
            <div className="space-y-1 text-xs text-gray-400">
              <div>Espace : Comparer avec original</div>
              <div>G : Afficher/masquer grille</div>
              <div>1/2/3 : Modes de comparaison</div>
              <div>Cmd+R : Réinitialiser</div>
              <div>Échap : Fermer</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Lalou