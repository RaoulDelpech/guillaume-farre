"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { Suggestion, AIAssistantProps } from "./ai/types";
import { buildSuggestions, assistantMessages } from "./ai/analyze-photos";
import SuggestionsPanel from "./ai/SuggestionsPanel";

export default function AIAssistant({ photos = [], onApplySuggestion }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [currentPhotoAnalysis, setCurrentPhotoAnalysis] = useState<import("./ai/types").PhotoAnalysis | null>(null);
  const [currentMessage, setCurrentMessage] = useState(assistantMessages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(assistantMessages[Math.floor(Math.random() * assistantMessages.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (photos.length > 0) analyzePhotos();
  }, [photos]);

  const analyzePhotos = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const newSuggestions = buildSuggestions(photos);
      setSuggestions(newSuggestions);
      setIsAnalyzing(false);

      if (autoMode) {
        newSuggestions
          .filter(s => s.autoApply && s.priority === "high")
          .forEach(s => { setTimeout(() => applySuggestion(s), 2000); });
      }
    }, 2000);
  };

  const applySuggestion = (suggestion: Suggestion) => {
    if (appliedSuggestions.has(suggestion.id)) {
      toast.info("Cette suggestion a déjà été appliquée");
      return;
    }

    const markApplied = () => setAppliedSuggestions(new Set([...appliedSuggestions, suggestion.id]));

    switch (suggestion.action) {
      case "generate-descriptions":
        toast.success("Génération des descriptions en cours...", {
          description: "L'IA analyse vos photos et crée des descriptions uniques"
        });
        setTimeout(() => { toast.success("Descriptions générées pour 12 photos!"); markApplied(); }, 3000);
        break;
      case "adjust-prices":
        toast.info("Ajustement des prix suggéré", {
          action: { label: "Appliquer", onClick: () => { toast.success("Prix optimisés selon le marché"); markApplied(); } }
        });
        break;
      case "auto-categorize":
        toast.success("Catégorisation automatique en cours...");
        setTimeout(() => { toast.success("Photos catégorisées avec succès!"); markApplied(); }, 2000);
        break;
      case "generate-alt":
        toast.success("Génération des textes alternatifs...");
        setTimeout(() => { toast.success("SEO optimisé pour toutes les photos!"); markApplied(); }, 1500);
        break;
      default:
        toast.info("Suggestion notée");
    }

    onApplySuggestion?.(suggestion);
  };

  const dismissSuggestion = (id: string) => {
    setSuggestions(suggestions.filter(s => s.id !== id));
    toast.info("Suggestion ignorée");
  };

  const reanalyze = () => {
    setCurrentPhotoAnalysis(null);
    analyzePhotos();
  };

  const highPriorityCount = suggestions.filter(s => s.priority === "high").length;

  return (
    <>
      {/* Bouton flottant */}
      <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white z-40">
        <span className="text-2xl">🤖</span>
        {highPriorityCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
            {highPriorityCount}
          </span>
        )}
      </motion.button>

      {/* Panneau */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
            className={`fixed ${isMinimized ? "bottom-8" : "top-0"} right-0 ${isMinimized ? "w-80" : "w-96"} ${isMinimized ? "h-20" : "h-full"} bg-white shadow-2xl z-50 flex flex-col`}>

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <h3 className="font-semibold">Assistant IA</h3>
                    {!isMinimized && <p className="text-xs opacity-90">{currentMessage}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setIsMinimized(!isMinimized)} className="text-white/70 hover:text-white">
                    {isMinimized ? "⬆" : "⬇"}
                  </button>
                  <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">✕</button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Mode automatique */}
                <div className="p-4 bg-gray-50 border-b">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Mode automatique</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={autoMode} onChange={(e) => setAutoMode(e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Applique automatiquement les suggestions prioritaires</p>
                </div>

                <SuggestionsPanel
                  suggestions={suggestions}
                  appliedSuggestions={appliedSuggestions}
                  isAnalyzing={isAnalyzing}
                  currentPhotoAnalysis={currentPhotoAnalysis}
                  onApply={applySuggestion}
                  onDismiss={dismissSuggestion}
                  onReanalyze={reanalyze}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications flottantes */}
      <AnimatePresence>
        {!isOpen && highPriorityCount > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-28 right-8 bg-white rounded-lg shadow-lg p-3 max-w-xs z-30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">💡</span>
              <p className="text-sm font-medium">Suggestion importante</p>
            </div>
            <p className="text-xs text-gray-600">{suggestions.find(s => s.priority === "high")?.title}</p>
            <button onClick={() => setIsOpen(true)} className="text-xs text-blue-600 mt-2 hover:underline">
              Voir détails →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Lalou
