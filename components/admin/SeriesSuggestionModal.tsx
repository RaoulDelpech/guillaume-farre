"use client";
import { useState } from "react";
import type { SeriesSuggestion } from "@/app/api/admin/suggest-series/route";

interface SeriesSuggestionModalProps {
  suggestions: SeriesSuggestion[];
  onApply: (seriesName: string, photos: string[]) => void;
  onClose: () => void;
}

export default function SeriesSuggestionModal({
  suggestions,
  onApply,
  onClose,
}: SeriesSuggestionModalProps) {
  const [editedSuggestions, setEditedSuggestions] = useState(suggestions);

  const handleSeriesNameChange = (index: number, newName: string) => {
    const updated = [...editedSuggestions];
    updated[index] = { ...updated[index], seriesName: newName };
    setEditedSuggestions(updated);
  };

  const handleApply = (suggestion: SeriesSuggestion) => {
    onApply(suggestion.seriesName, suggestion.photos);
  };

  const handleApplyAll = () => {
    editedSuggestions.forEach((suggestion) => {
      onApply(suggestion.seriesName, suggestion.photos);
    });
  };

  const getConfidenceBadgeColor = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "low":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getConfidenceLabel = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "Forte confiance";
      case "medium":
        return "Confiance modérée";
      case "low":
        return "Faible confiance";
      default:
        return confidence;
    }
  };

  if (suggestions.length === 0) {
    return (
      <div
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-card border border-border rounded-lg p-8 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-light mb-4 text-foreground">
            Aucune série suggérée
          </h2>
          <p className="text-muted-foreground mb-6">
            L'IA n'a pas identifié de similitudes suffisamment fortes entre ces
            photos pour suggérer des regroupements en séries.
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-primary hover:bg-accent text-primary-foreground rounded-md transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-lg p-8 max-w-5xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-light mb-2 text-foreground">
              Suggestions de séries
            </h2>
            <p className="text-muted-foreground">
              {suggestions.length} série{suggestions.length > 1 ? "s" : ""}{" "}
              suggérée{suggestions.length > 1 ? "s" : ""} par l'IA
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-muted hover:bg-muted/70 rounded-full flex items-center justify-center text-foreground text-xl transition-colors"
          >
            ×
          </button>
        </div>

        {/* Suggestions List */}
        <div className="space-y-6 mb-8">
          {editedSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-lg p-6"
            >
              {/* Confidence Badge */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs border ${getConfidenceBadgeColor(
                    suggestion.confidence
                  )}`}
                >
                  {getConfidenceLabel(suggestion.confidence)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {suggestion.photos.length} photo
                  {suggestion.photos.length > 1 ? "s" : ""}
                </span>
              </div>

              {/* Series Name Input */}
              <div className="mb-4">
                <label className="block text-sm text-muted-foreground mb-2 uppercase tracking-wide">
                  Nom de la série
                </label>
                <input
                  type="text"
                  value={suggestion.seriesName}
                  onChange={(e) =>
                    handleSeriesNameChange(index, e.target.value)
                  }
                  className="w-full px-4 py-3 bg-card border border-border rounded-md text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Reasoning */}
              <div className="mb-4">
                <label className="block text-sm text-muted-foreground mb-2 uppercase tracking-wide">
                  Analyse de l'IA
                </label>
                <p className="text-sm text-foreground/80 italic">
                  {suggestion.reasoning}
                </p>
              </div>

              {/* Photo Thumbnails */}
              <div className="mb-4">
                <label className="block text-sm text-muted-foreground mb-2 uppercase tracking-wide">
                  Photos concernées
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {suggestion.photos.map((photo, photoIdx) => (
                    <div
                      key={photoIdx}
                      className="aspect-square bg-muted rounded-lg overflow-hidden"
                    >
                      <img
                        src={photo}
                        alt={`Photo ${photoIdx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => handleApply(suggestion)}
                className="w-full px-6 py-3 bg-primary hover:bg-accent text-primary-foreground rounded-md transition-colors font-medium"
              >
                Appliquer cette série
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-muted hover:bg-muted/70 text-foreground rounded-md transition-colors"
          >
            Ignorer tout
          </button>
          {suggestions.length > 1 && (
            <button
              onClick={handleApplyAll}
              className="flex-1 px-6 py-3 bg-primary hover:bg-accent text-primary-foreground rounded-md transition-colors font-medium"
            >
              Appliquer toutes les séries
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
