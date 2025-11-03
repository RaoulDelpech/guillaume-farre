"use client";
import { useState } from "react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface SizeVisualizerProps {
  imageUrl: string;
  widthCm: number;
  heightCm: number;
}

export default function SizeVisualizer({
  imageUrl,
  widthCm,
  heightCm,
}: SizeVisualizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [comparisonObject, setComparisonObject] = useState<"person" | "door" | "sofa">("person");
  const { playClick, playWhoosh } = useSoundEffects();

  const handleOpen = () => {
    setIsOpen(true);
    playWhoosh();
  };

  const handleClose = () => {
    setIsOpen(false);
    playClick();
  };

  // Calculate scale factor (assuming viewport width represents ~200cm)
  const scaleFactor = 200 / widthCm;
  const displayWidth = widthCm * scaleFactor;
  const displayHeight = heightCm * scaleFactor;

  // Comparison objects (approximate cm)
  const comparisons = {
    person: { width: 50, height: 175, emoji: "🧍", label: "Personne (1,75m)" },
    door: { width: 80, height: 210, emoji: "🚪", label: "Porte standard" },
    sofa: { width: 200, height: 85, emoji: "🛋️", label: "Canapé" },
  };

  const comparison = comparisons[comparisonObject];

  return (
    <>
      <button
        onClick={handleOpen}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-sm transition-all flex items-center gap-2"
      >
        <span>📏</span>
        <span>Voir en taille réelle</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/30 rounded-full flex items-center justify-center text-2xl transition-all"
          >
            ✕
          </button>

          <div className="max-w-6xl w-full">
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                Visualisation en taille réelle
              </h3>
              <p className="text-gray-400 mb-4">
                Dimensions : {widthCm} × {heightCm} cm
              </p>

              {/* Comparison selector */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-gray-400">Comparer avec :</span>
                <button
                  onClick={() => {
                    setComparisonObject("person");
                    playClick();
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                    comparisonObject === "person"
                      ? "bg-purple-600 text-white"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  🧍 Personne
                </button>
                <button
                  onClick={() => {
                    setComparisonObject("door");
                    playClick();
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                    comparisonObject === "door"
                      ? "bg-purple-600 text-white"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  🚪 Porte
                </button>
                <button
                  onClick={() => {
                    setComparisonObject("sofa");
                    playClick();
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                    comparisonObject === "sofa"
                      ? "bg-purple-600 text-white"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  🛋️ Canapé
                </button>
              </div>
            </div>

            {/* Visualization area */}
            <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-8 overflow-hidden min-h-[400px] flex items-end justify-center border-2 border-white/20">
              {/* Floor line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              {/* Grid background */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                    backgroundSize: "50px 50px",
                  }}
                />
              </div>

              {/* Comparison object */}
              <div
                className="relative flex items-end justify-center"
                style={{
                  width: `${comparison.width * scaleFactor}px`,
                  height: `${comparison.height * scaleFactor}px`,
                  maxHeight: "400px",
                }}
              >
                <div className="text-6xl md:text-8xl opacity-50">
                  {comparison.emoji}
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                  {comparison.label}
                </div>
              </div>

              {/* Artwork */}
              <div
                className="relative ml-8 shadow-2xl border-4 border-white/20"
                style={{
                  width: `${displayWidth}px`,
                  height: `${displayHeight}px`,
                  maxHeight: "400px",
                  maxWidth: "60%",
                }}
              >
                <img
                  src={imageUrl}
                  alt="Artwork"
                  className="w-full h-full object-cover"
                />

                {/* Dimension labels */}
                <div className="absolute -top-8 left-0 right-0 flex items-center justify-center">
                  <div className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {widthCm} cm
                  </div>
                </div>
                <div className="absolute top-0 bottom-0 -right-8 flex items-center justify-center">
                  <div className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded transform -rotate-90 whitespace-nowrap">
                    {heightCm} cm
                  </div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                💡 Cette visualisation est approximative et dépend de la taille de votre écran.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Pour une meilleure estimation, mesurez {widthCm} cm sur un mur avec un mètre.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
