'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SimilarImageGroup {
  images: string[];
  similarity: number;
  count: number;
}

interface SimilarImagesPanelProps {
  token: string;
  onStatusChange?: (filename: string, status: 'active' | 'trash' | 'to-sort') => void;
}

export default function SimilarImagesPanel({ token, onStatusChange }: SimilarImagesPanelProps) {
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<SimilarImageGroup[]>([]);
  const [threshold, setThreshold] = useState(85);
  const [totalAnalyzed, setTotalAnalyzed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const detectSimilar = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/similar-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ threshold }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la détection');
      }

      setGroups(data.groups);
      setTotalAnalyzed(data.totalPhotosAnalyzed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (filename: string, status: 'active' | 'trash' | 'to-sort') => {
    if (onStatusChange) {
      onStatusChange(filename, status);
    }
  };

  return (
    <div className="space-y-6">
      {/* Panel de contrôle */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Détecter les photos similaires</h3>
            <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-md border border-border">
              {totalAnalyzed} photos actives
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-600 mb-2 block">
                Seuil de similarité: {threshold}%
              </label>
              <input
                type="range"
                min="70"
                max="95"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full"
                disabled={loading}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>70% (plus de groupes)</span>
                <span>95% (quasi-identiques)</span>
              </div>
            </div>

            <button
              onClick={detectSimilar}
              disabled={loading}
              className="min-w-[200px] px-6 py-3 bg-primary hover:bg-accent text-primary-foreground rounded-md font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Analyse en cours...' : 'Détecter les similitudes'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Résultats */}
      {groups.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {groups.length} groupe{groups.length > 1 ? 's' : ''} de photos similaires trouvé{groups.length > 1 ? 's' : ''}
            </h3>
            <span className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-md">
              {groups.reduce((sum, g) => sum + g.count, 0)} photos au total
            </span>
          </div>

          {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="bg-card border border-border rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">
                    Groupe {groupIndex + 1}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-md">
                      {group.count} photos
                    </span>
                    <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-md border border-border">
                      {group.similarity}% similarité
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {group.images.map((imagePath) => (
                    <div
                      key={imagePath}
                      className="space-y-2 border rounded-lg p-3 hover:border-blue-400 transition-colors"
                    >
                      {/* Miniature cliquable */}
                      <div
                        className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() => setSelectedImage(imagePath)}
                      >
                        <Image
                          src={imagePath}
                          alt={imagePath}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>

                      {/* Nom fichier */}
                      <p className="text-xs text-gray-600 truncate" title={imagePath}>
                        {imagePath.split('/').pop()}
                      </p>

                      {/* Sélecteur de statut */}
                      <select
                        defaultValue="active"
                        onChange={(e) =>
                          handleStatusChange(imagePath.split('/').pop() || imagePath, e.target.value as 'active' | 'trash' | 'to-sort')
                        }
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                      >
                        <option value="active">✅ Active</option>
                        <option value="to-sort">⏳ À trier</option>
                        <option value="trash">🗑️ Corbeille</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {groups.length === 0 && !loading && totalAnalyzed > 0 && (
        <div className="bg-card border border-border rounded-lg p-8 text-center text-gray-600">
          <p>Aucun groupe de photos similaires trouvé avec un seuil de {threshold}%.</p>
          <p className="text-sm mt-2">
            Essayez de réduire le seuil de similarité pour trouver plus de correspondances.
          </p>
        </div>
      )}

      {/* Lightbox pour image agrandie */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
            <Image
              src={selectedImage}
              alt={selectedImage}
              fill
              className="object-contain"
              sizes="90vw"
            />
            <button
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg"
              onClick={() => setSelectedImage(null)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Lalou
