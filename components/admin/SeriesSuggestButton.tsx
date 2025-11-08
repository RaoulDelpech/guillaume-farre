"use client";
import { useState } from 'react';
import type { SeriesSuggestion } from '@/app/api/admin/suggest-series/route';

interface SeriesSuggestButtonProps {
  photos: Array<{ path: string; filename: string }>;
  onSuggestionsReady: (suggestions: SeriesSuggestion[]) => void;
}

/**
 * Bouton pour analyser les photos affichées et suggérer des regroupements en séries
 * Utilise Claude Vision pour détecter les similitudes visuelles
 *
 * Lalou
 */
export default function SeriesSuggestButton({
  photos,
  onSuggestionsReady,
}: SeriesSuggestButtonProps) {
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (photos.length < 2) {
      alert('⚠️ Il faut au moins 2 photos pour suggérer des séries');
      return;
    }

    if (photos.length > 20) {
      const confirmed = confirm(
        `⚠️ Vous avez ${photos.length} photos affichées.\n\nL'analyse IA peut prendre plusieurs minutes et coûter quelques centimes.\n\nVoulez-vous continuer ?`
      );
      if (!confirmed) return;
    }

    setAnalyzing(true);

    try {
      const photoPaths = photos.map((p) => p.path);

      const response = await fetch('/api/admin/suggest-series', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photos: photoPaths }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }

      if (data.suggestions && data.suggestions.length > 0) {
        onSuggestionsReady(data.suggestions);
      } else {
        alert('ℹ️ L\'IA n\'a détecté aucune série cohérente.\n\nLes photos sont trop différentes pour être regroupées.');
      }
    } catch (error: any) {
      console.error('Erreur analyse IA:', error);
      alert(`❌ Erreur lors de l'analyse IA:\n\n${error.message || error}`);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <button
      onClick={handleAnalyze}
      disabled={analyzing || photos.length < 2}
      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2"
      title={
        photos.length < 2
          ? 'Il faut au moins 2 photos visibles'
          : 'Analyser les photos avec IA pour suggérer des séries'
      }
    >
      {analyzing ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Analyse IA en cours...
        </>
      ) : (
        <>
          <span>🎨</span>
          Suggérer séries IA ({photos.length} photos)
        </>
      )}
    </button>
  );
}

// Lalou
