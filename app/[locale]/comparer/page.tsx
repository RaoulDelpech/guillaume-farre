"use client";
import Navigation from "@/components/navigation/Navigation";
import { useFavorites } from "@/hooks/useFavorites";
import { useEffect, useState } from "react";
import type { PhotoMetadata } from "@/lib/admin/photo-manager";
import { Link } from "@/i18n/routing";

export default function ComparerPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<PhotoMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavoritePhotos = async () => {
      try {
        // Utiliser l'API route au lieu d'importer directement
        const response = await fetch('/api/admin/photos');
        const allPhotos: PhotoMetadata[] = await response.json();
        const favoritePhotos = allPhotos.filter((p) =>
          favorites.includes(p.path)
        );
        setPhotos(favoritePhotos);
      } catch (error) {
        console.error("Error loading photos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavoritePhotos();
  }, [favorites]);

  const toggleSelection = (photo: PhotoMetadata) => {
    if (selectedPhotos.find((p) => p.path === photo.path)) {
      setSelectedPhotos(selectedPhotos.filter((p) => p.path !== photo.path));
    } else if (selectedPhotos.length < 3) {
      setSelectedPhotos([...selectedPhotos, photo]);
    }
  };

  const clearComparison = () => {
    setSelectedPhotos([]);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4 animate-pulse">⏳</div>
          <p className="text-xl text-gray-400">Chargement...</p>
        </div>
      </main>
    );
  }

  if (photos.length === 0) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6">💔</div>
            <h1 className="text-4xl font-bold mb-4">
              Aucun favori à comparer
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Ajoutez d'abord des œuvres à vos favoris depuis la boutique, puis revenez ici pour les comparer.
            </p>
            <Link
              href="/boutique"
              className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all"
            >
              🛒 Aller à la boutique
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <div className="bg-gradient-to-b from-orange-950/20 to-black border-b border-orange-900/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-orange-600 rounded-full text-sm font-bold mb-6">
              COMPARATEUR
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Comparez vos favoris
            </h1>
            <p className="text-xl text-gray-400">
              Sélectionnez jusqu'à 3 œuvres pour les comparer côte à côte
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Selection area */}
        {photos.length > 0 && selectedPhotos.length < 3 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              Sélectionnez des œuvres ({selectedPhotos.length}/3)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {photos.map((photo) => {
                const isSelected = selectedPhotos.find(
                  (p) => p.path === photo.path
                );
                return (
                  <button
                    key={photo.path}
                    onClick={() => toggleSelection(photo)}
                    className={`relative group rounded-xl overflow-hidden border-4 transition-all ${
                      isSelected
                        ? "border-orange-600 scale-105"
                        : "border-transparent hover:border-orange-600/50"
                    }`}
                  >
                    <div className="aspect-square bg-gray-900">
                      <img
                        src={photo.path}
                        alt={photo.title || "Photo"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                        ✓
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-sm font-bold">
                        {isSelected ? "Désélectionner" : "Sélectionner"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Comparison */}
        {selectedPhotos.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Comparaison ({selectedPhotos.length})
              </h2>
              <button
                onClick={clearComparison}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg font-bold text-sm transition-all"
              >
                Effacer
              </button>
            </div>

            <div className={`grid gap-6 ${selectedPhotos.length === 1 ? "md:grid-cols-1 max-w-2xl mx-auto" : selectedPhotos.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
              {selectedPhotos.map((photo) => (
                <div
                  key={photo.path}
                  className="bg-gradient-to-br from-gray-900 to-black border-2 border-orange-900/30 rounded-2xl overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3]">
                    <img
                      src={photo.path}
                      alt={photo.title || "Photo"}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => toggleSelection(photo)}
                      className="absolute top-3 right-3 w-10 h-10 bg-black/80 hover:bg-black rounded-full flex items-center justify-center text-white font-bold transition-all"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-4">
                      {photo.title || "Sans titre"}
                    </h3>

                    {/* Comparison table */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Prix</span>
                        <span className="font-bold text-red-500">
                          {photo.price ? `${photo.price}€` : "Sur demande"}
                        </span>
                      </div>

                      {photo.year && (
                        <div className="flex justify-between py-2 border-b border-white/10">
                          <span className="text-gray-400">Année</span>
                          <span className="font-semibold">{photo.year}</span>
                        </div>
                      )}

                      {photo.category && (
                        <div className="flex justify-between py-2 border-b border-white/10">
                          <span className="text-gray-400">Collection</span>
                          <span className="font-semibold capitalize">
                            {photo.category}
                          </span>
                        </div>
                      )}

                      {photo.edition && (
                        <div className="flex justify-between py-2 border-b border-white/10">
                          <span className="text-gray-400">Édition</span>
                          <span className="font-semibold">
                            {photo.edition.type === "limited"
                              ? `Limitée (${photo.edition.count})`
                              : "Ouverte"}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Disponibilité</span>
                        <span
                          className={`font-semibold ${
                            photo.forSale
                              ? "text-green-500"
                              : "text-orange-500"
                          }`}
                        >
                          {photo.forSale ? "En vente" : "Réservée"}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/boutique`}
                      className="block w-full text-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all"
                    >
                      Voir les détails
                    </Link>
                  </div>
                </div>
              ))}

              {/* Placeholder cards pour guider l'utilisateur */}
              {selectedPhotos.length < 3 &&
                Array.from({ length: 3 - selectedPhotos.length }).map(
                  (_, index) => (
                    <div
                      key={`placeholder-${index}`}
                      className="bg-gradient-to-br from-gray-900/30 to-black/30 border-2 border-dashed border-orange-900/30 rounded-2xl p-12 flex items-center justify-center text-center"
                    >
                      <div>
                        <div className="text-6xl mb-4">➕</div>
                        <p className="text-gray-500">
                          Sélectionnez une œuvre supplémentaire
                        </p>
                      </div>
                    </div>
                  )
                )}
            </div>

            {/* Winner suggestion */}
            {selectedPhotos.length >= 2 && (
              <div className="mt-12 bg-gradient-to-r from-orange-950/30 to-black border-2 border-orange-600/30 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold mb-3">
                  Besoin d'aide pour choisir ?
                </h3>
                <p className="text-gray-400 mb-6">
                  Contactez-moi pour un conseil personnalisé ou découvrez quelle
                  œuvre correspond le mieux à votre personnalité.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/quiz"
                    className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all"
                  >
                    🎯 Faire le quiz
                  </Link>
                  <Link
                    href="/contact"
                    className="px-8 py-4 bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white font-bold rounded-lg transition-all"
                  >
                    💬 Demander conseil
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
