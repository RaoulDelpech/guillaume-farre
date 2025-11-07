"use client";
import { useState } from 'react';

interface PhotoDescriptionAIProps {
  photoPath: string;
  photoFilename: string;
  category: string;
  seriesName?: string;
  currentDescription?: string;
  aiGenerated?: boolean;
  onApplyDescription?: (description: string) => void;
}

export default function PhotoDescriptionAI({
  photoPath,
  photoFilename,
  category,
  seriesName,
  currentDescription,
  aiGenerated,
  onApplyDescription
}: PhotoDescriptionAIProps) {
  const [description, setDescription] = useState<string>(currentDescription || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const generateDescription = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoPath,
          photoFilename,
          category,
          seriesName
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la génération');
      }

      setDescription(data.description);
      setIsOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsGenerating(false);
    }
  };

  const applyDescription = () => {
    if (onApplyDescription && description) {
      onApplyDescription(description);
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Bouton génération */}
      <button
        onClick={generateDescription}
        disabled={isGenerating}
        className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm">Génération IA en cours...</span>
          </>
        ) : (
          <>
            <span className="text-lg">✨</span>
            <span className="text-sm font-medium">Générer description IA</span>
          </>
        )}
      </button>

      {/* Description actuelle */}
      {currentDescription && (
        <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-600 uppercase">
              Description actuelle
            </span>
            {aiGenerated && (
              <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                ✨ IA
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {currentDescription}
          </p>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">
            ⚠️ {error}
          </p>
        </div>
      )}

      {/* Modal description générée */}
      {isOpen && description && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                ✨ Description générée par IA
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {photoFilename}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Zone texte éditable */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (éditable)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Vous pouvez modifier la description avant de l'appliquer
                </p>
              </div>

              {/* Métadonnées */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                  Catégorie: {category}
                </span>
                {seriesName && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    Série: {seriesName}
                  </span>
                )}
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                  ✨ Générée par IA
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={applyDescription}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
              >
                Appliquer cette description
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Lalou
