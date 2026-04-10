"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ZoomIn, ZoomOut, Grid3x3 } from "lucide-react";
import type { PhotoMetadata } from "@/lib/admin/photo-manager";
import type { PhotoEdits } from "./preview/types";
import { defaultEdits } from "./preview/types";
import EditSidebar from "./preview/EditSidebar";

interface PhotoPreviewProps {
  photo: PhotoMetadata;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (edits: PhotoEdits) => void;
}

export default function PhotoPreview({ photo, isOpen, onClose, onSave }: PhotoPreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [edits, setEdits] = useState<PhotoEdits>(defaultEdits);
  const [showGrid, setShowGrid] = useState(false);
  const [compareMode, setCompareMode] = useState<"none" | "split" | "toggle" | "side">("none");
  const [showOriginal, setShowOriginal] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case "Escape": onClose(); break;
        case " ": e.preventDefault(); setShowOriginal(!showOriginal); break;
        case "g": setShowGrid(!showGrid); break;
        case "1": setCompareMode("none"); break;
        case "2": setCompareMode("split"); break;
        case "3": setCompareMode("side"); break;
        case "r":
          if (e.metaKey || e.ctrlKey) { e.preventDefault(); setEdits(defaultEdits); }
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, showOriginal, showGrid]);

  if (!isOpen) return null;

  const handleZoom = (direction: "in" | "out") => {
    setZoom(prev => direction === "in" ? Math.min(prev + 0.25, 3) : Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setEdits(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
  };

  const handleFlip = (direction: "horizontal" | "vertical") => {
    setEdits(prev => ({ ...prev, flip: { ...prev.flip, [direction]: !prev.flip[direction] } }));
  };

  const getFilterStyle = () => {
    const filters = [
      `brightness(${edits.brightness}%)`, `contrast(${edits.contrast}%)`,
      `saturate(${edits.saturation}%)`, edits.blur > 0 ? `blur(${edits.blur}px)` : ""
    ].filter(Boolean).join(" ");
    const transform = [
      `rotate(${edits.rotation}deg)`, `scale(${zoom})`,
      edits.flip.horizontal ? "scaleX(-1)" : "", edits.flip.vertical ? "scaleY(-1)" : ""
    ].filter(Boolean).join(" ");
    return { filter: filters, transform };
  };

  const renderImage = (showEdits = true) => {
    const style = showEdits ? getFilterStyle() : { transform: `scale(${zoom})` };
    return (
      <div className="relative w-full h-full">
        <Image ref={imageRef} src={photo.path} alt={photo.filename}
          fill sizes="100vw" className="object-contain transition-all duration-300"
          style={style} draggable={false} unoptimized />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-black/50 backdrop-blur-sm flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <h3 className="text-white font-medium">{photo.title || photo.filename}</h3>
          <span className="text-gray-400 text-sm">{photo.category} • {photo.year || "N/A"}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1">
            <button onClick={() => handleZoom("out")} className="p-1 hover:bg-white/20 rounded" title="Zoom -">
              <ZoomOut className="w-4 h-4 text-white" />
            </button>
            <span className="text-white text-sm min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => handleZoom("in")} className="p-1 hover:bg-white/20 rounded" title="Zoom +">
              <ZoomIn className="w-4 h-4 text-white" />
            </button>
          </div>
          <button onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg transition-colors ${showGrid ? "bg-white/20 text-white" : "bg-white/10 text-gray-400 hover:text-white"}`}
            title="Grille de composition (G)">
            <Grid3x3 className="w-5 h-5" />
          </button>
          <div className="flex gap-1 bg-white/10 rounded-lg p-1">
            {(["none", "split", "side"] as const).map(mode => (
              <button key={mode} onClick={() => setCompareMode(mode)}
                className={`px-3 py-1 rounded text-sm ${compareMode === mode ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"}`}>
                {mode === "none" ? "Édité" : mode === "split" ? "Split" : "Côte à côte"}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-white" title="Fermer (Échap)">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex">
        <div className="flex-1 relative flex items-center justify-center p-8 pt-24">
          {compareMode === "none" && (
            <div className="relative">
              {renderImage(!showOriginal)}
              {showGrid && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                    {[...Array(9)].map((_, i) => <div key={i} className="border border-white/20" />)}
                  </div>
                </div>
              )}
            </div>
          )}
          {compareMode === "split" && (
            <div className="relative overflow-hidden">
              <div className="relative">{renderImage(true)}</div>
              <div className="absolute inset-0 w-1/2 overflow-hidden border-r-2 border-white">{renderImage(false)}</div>
            </div>
          )}
          {compareMode === "side" && (
            <div className="flex gap-4">
              <div className="flex-1"><p className="text-white text-center mb-2">Original</p>{renderImage(false)}</div>
              <div className="flex-1"><p className="text-white text-center mb-2">Édité</p>{renderImage(true)}</div>
            </div>
          )}
          {showOriginal && compareMode === "none" && (
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded">
              Original (maintenez Espace)
            </div>
          )}
        </div>

        <EditSidebar edits={edits} onEditsChange={setEdits}
          onRotate={handleRotate} onFlip={handleFlip} onSave={onSave} />
      </div>
    </div>
  );
}

// Lalou
