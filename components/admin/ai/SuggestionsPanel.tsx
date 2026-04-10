"use client";

import { motion } from "framer-motion";
import type { Suggestion, PhotoAnalysis } from "./types";

interface SuggestionsPanelProps {
  suggestions: Suggestion[];
  appliedSuggestions: Set<string>;
  isAnalyzing: boolean;
  currentPhotoAnalysis: PhotoAnalysis | null;
  onApply: (suggestion: Suggestion) => void;
  onDismiss: (id: string) => void;
  onReanalyze: () => void;
}

export default function SuggestionsPanel({
  suggestions,
  appliedSuggestions,
  isAnalyzing,
  currentPhotoAnalysis,
  onApply,
  onDismiss,
  onReanalyze
}: SuggestionsPanelProps) {
  return (
    <>
      {/* Suggestions */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isAnalyzing ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
            <p className="text-sm text-gray-600">Analyse en cours...</p>
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((suggestion) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg border ${
                suggestion.priority === "high"
                  ? "border-red-200 bg-red-50"
                  : suggestion.priority === "medium"
                  ? "border-yellow-200 bg-yellow-50"
                  : "border-gray-200 bg-gray-50"
              } ${appliedSuggestions.has(suggestion.id) ? "opacity-50" : ""}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{suggestion.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{suggestion.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>

                  {!appliedSuggestions.has(suggestion.id) && (
                    <div className="flex gap-2 mt-2">
                      {suggestion.action && (
                        <button onClick={() => onApply(suggestion)}
                          className="text-xs bg-white px-3 py-1 rounded border hover:bg-gray-50">
                          Appliquer
                        </button>
                      )}
                      <button onClick={() => onDismiss(suggestion.id)}
                        className="text-xs text-gray-500 hover:text-gray-700">
                        Ignorer
                      </button>
                    </div>
                  )}

                  {appliedSuggestions.has(suggestion.id) && (
                    <p className="text-xs text-green-600 mt-2">✓ Appliqué</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl">✨</span>
            <p className="mt-3 text-sm">Tout est optimisé!</p>
            <p className="text-xs mt-1">Je continue à surveiller vos photos</p>
          </div>
        )}
      </div>

      {/* Analyse photo individuelle */}
      {currentPhotoAnalysis && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-t">
          <h4 className="font-medium text-sm mb-3">Analyse de la photo</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Qualité</span>
              <span className="font-medium">{currentPhotoAnalysis.quality}/100</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Valeur estimée</span>
              <span className="font-medium">{currentPhotoAnalysis.marketValue}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Potentiel de vente</span>
              <span className="font-medium text-green-600">{currentPhotoAnalysis.salesPotential}</span>
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-600 mb-1">Tags suggérés:</p>
              <div className="flex flex-wrap gap-1">
                {currentPhotoAnalysis.suggestedTags.map((tag: string) => (
                  <span key={tag} className="text-xs bg-white px-2 py-1 rounded">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onReanalyze}
            className="bg-white border rounded-lg p-2 text-xs hover:bg-gray-50 flex items-center justify-center gap-1">
            🔄 Réanalyser
          </button>
          <button className="bg-white border rounded-lg p-2 text-xs hover:bg-gray-50 flex items-center justify-center gap-1">
            📊 Rapport
          </button>
        </div>
      </div>
    </>
  );
}

// Lalou
