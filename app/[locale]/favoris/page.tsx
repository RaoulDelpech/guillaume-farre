'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Navigation from '@/components/navigation/Navigation';
import { Link } from '@/i18n/routing';
import { useWishlist } from '@/hooks/useWishlist';
import { Heart, Trash2, ShoppingCart, Share2 } from 'lucide-react';

export default function FavorisPage() {
  const { wishlist, isLoaded, removeFromWishlist, clearWishlist, sortedWishlist } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </main>
    );
  }

  const sortedItems = sortedWishlist();

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-10 h-10 text-primary fill-primary" />
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-wide">
              Mes favoris
            </h1>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xl text-muted-foreground">
              {wishlist.length} œuvre{wishlist.length > 1 ? 's' : ''} sauvegardée{wishlist.length > 1 ? 's' : ''}
            </p>
            {wishlist.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Êtes-vous sûr de vouloir vider vos favoris ?')) {
                    clearWishlist();
                  }
                }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Tout supprimer
              </button>
            )}
          </div>
        </div>

        {/* Empty state */}
        {wishlist.length === 0 && (
          <div className="text-center py-28 max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-4xl font-light mb-6">Aucun favori pour le moment</h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Parcourez notre boutique et cliquez sur le cœur ♡ pour sauvegarder vos œuvres préférées
            </p>
            <Link
              href="/boutique"
              className="inline-block px-12 py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-lg transition-all"
            >
              Découvrir la boutique
            </Link>
          </div>
        )}

        {/* Grid favoris */}
        {wishlist.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedItems.map((item) => (
              <div
                key={item.photoPath}
                className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-all shadow-lg group"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-muted">
                  {item.thumbnailUrl ? (
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.title || 'Œuvre'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromWishlist(item.photoPath)}
                    className="absolute top-3 right-3 bg-black/60 hover:bg-destructive/80 backdrop-blur-sm text-white p-2.5 rounded-full transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                    title="Retirer des favoris"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  {/* Date ajout */}
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
                    Ajouté {formatRelativeDate(item.addedAt)}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-xl font-light tracking-wide mb-2 line-clamp-2">
                    {item.title || 'Œuvre sans titre'}
                  </h3>

                  {item.price && (
                    <p className="text-2xl font-light text-amber-600 mb-4">
                      {item.price.toLocaleString('fr-FR')}€
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href="/boutique"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black hover:bg-gray-900 text-white rounded-lg font-light text-sm transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Voir détails
                    </Link>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: item.title || 'Œuvre Guillaume Farré',
                            text: 'Découvrez cette œuvre',
                            url: window.location.origin + '/boutique',
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.origin + '/boutique');
                          alert('Lien copié !');
                        }
                      }}
                      className="px-4 py-3 border border-border hover:border-primary rounded-lg transition-colors"
                      title="Partager"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA bas de page */}
        {wishlist.length > 0 && (
          <div className="mt-16 bg-card border border-border rounded-xl p-8 text-center">
            <h3 className="text-2xl font-light mb-4">Prêt à passer commande ?</h3>
            <p className="text-muted-foreground mb-8">
              Découvrez plus d'œuvres ou contactez-nous pour une sélection personnalisée
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/boutique"
                className="inline-block px-12 py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-lg transition-all"
              >
                Continuer mes achats
              </Link>
              <Link
                href="/contact"
                className="inline-block px-12 py-5 border-2 border-border hover:border-primary text-foreground font-light tracking-wide rounded-lg text-lg transition-all"
              >
                Demander conseil
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// Helper pour formater date relative
function formatRelativeDate(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'à l\'instant';
  if (minutes < 60) return `il y a ${minutes} min`;
  if (hours < 24) return `il y a ${hours}h`;
  if (days === 1) return 'hier';
  if (days < 7) return `il y a ${days}j`;
  if (days < 30) return `il y a ${Math.floor(days / 7)} semaine${Math.floor(days / 7) > 1 ? 's' : ''}`;
  return `il y a ${Math.floor(days / 30)} mois`;
}

// Lalou
