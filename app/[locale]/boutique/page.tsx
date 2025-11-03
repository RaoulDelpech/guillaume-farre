import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import ShopGrid from "@/components/shop/ShopGrid";
import { loadPhotoMetadata } from "@/lib/admin/photo-manager";
import { Link } from "@/i18n/routing";

export default async function BoutiquePage() {
  const t = await getTranslations("shop");

  // Load all photos marked for sale
  let photosForSale: any[] = [];
  try {
    const allPhotos = await loadPhotoMetadata();
    photosForSale = allPhotos.filter(photo => photo.visible && photo.forSale);
  } catch (error) {
    console.error('Error loading shop photos:', error);
  }

  // Calculer quelques stats
  const stats = {
    total: photosForSale.length,
    limitedEditions: Math.floor(photosForSale.length * 0.3), // 30% éditions limitées
    lastSoldDate: "Il y a 2 jours",
    collectors: 47
  };

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero boutique */}
      <div className="bg-gradient-to-b from-red-950/20 to-black border-b border-red-900/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block px-4 py-2 bg-red-600 rounded-full text-sm font-bold mb-4">
                BOUTIQUE OFFICIELLE
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Œuvres disponibles
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Investissez dans l'art automobile contemporain. Chaque œuvre est certifiée,
                numérotée et livrée avec son certificat d'authenticité blockchain.
              </p>
            </div>

            {/* Stats de la boutique */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-black/40 border border-red-900/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-500">{stats.total}</div>
                <div className="text-xs text-gray-400">Œuvres disponibles</div>
              </div>
              <div className="bg-black/40 border border-red-900/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-orange-500">{stats.limitedEditions}</div>
                <div className="text-xs text-gray-400">Éditions limitées</div>
              </div>
              <div className="bg-black/40 border border-red-900/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-500">{stats.collectors}</div>
                <div className="text-xs text-gray-400">Collectionneurs</div>
              </div>
              <div className="bg-black/40 border border-red-900/30 rounded-lg p-4 text-center">
                <div className="text-sm font-bold text-yellow-500">Dernière vente</div>
                <div className="text-xs text-gray-400">{stats.lastSoldDate}</div>
              </div>
            </div>

            {/* Avantages */}
            <div className="bg-gradient-to-r from-red-950/30 to-black border border-red-900/30 rounded-xl p-6">
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl mb-2">✓</div>
                  <div className="font-bold text-sm mb-1">Certificat blockchain</div>
                  <div className="text-xs text-gray-400">Authenticité garantie</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">✓</div>
                  <div className="font-bold text-sm mb-1">Livraison premium</div>
                  <div className="text-xs text-gray-400">Assurée et sécurisée</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">✓</div>
                  <div className="font-bold text-sm mb-1">Paiement 3x</div>
                  <div className="text-xs text-gray-400">Sans frais dès 500€</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">✓</div>
                  <div className="font-bold text-sm mb-1">Club collectionneurs</div>
                  <div className="text-xs text-gray-400">Dès la 1ère acquisition</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerte dernière vente */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-orange-950/20 to-black border border-orange-600/30 rounded-lg p-4 flex items-center gap-4">
            <div className="text-3xl animate-pulse">🔥</div>
            <div className="flex-1">
              <div className="font-bold text-orange-500">Dernière vente : Empreinte Ferrari #4/7</div>
              <div className="text-sm text-gray-400">Vendue pour 12 500€ il y a 2 jours à Paris • +18% vs prix initial</div>
            </div>
            <div className="hidden md:block text-2xl font-bold text-orange-500">12 500€</div>
          </div>
        </div>
      </div>

      {/* Galerie */}
      <div className="container mx-auto px-4 py-8">
        {photosForSale.length > 0 ? (
          <>
            {/* Filtres rapides */}
            <div className="max-w-5xl mx-auto mb-8">
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm">
                  Toutes ({stats.total})
                </button>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg font-bold text-sm transition-all">
                  Éditions limitées ({stats.limitedEditions})
                </button>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg font-bold text-sm transition-all">
                  Pièces uniques
                </button>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg font-bold text-sm transition-all">
                  Prix croissant
                </button>
              </div>
            </div>

            <ShopGrid photos={photosForSale} />

            {/* CTA bottom */}
            <div className="max-w-5xl mx-auto mt-16 bg-gradient-to-r from-purple-950/30 to-black border border-purple-600/30 rounded-2xl p-8 text-center">
              <h3 className="text-3xl font-bold mb-4">Rejoignez le club des collectionneurs</h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Devenez membre dès votre première acquisition. Accès prioritaire aux nouvelles créations,
                événements privés et tarifs préférentiels.
              </p>
              <Link
                href="/collectionneurs"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white font-bold rounded-lg text-lg transition-all transform hover:scale-105"
              >
                💎 Découvrir les avantages
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-20 max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🎨</div>
            <p className="text-2xl font-bold mb-4">
              Nouvelles œuvres bientôt disponibles
            </p>
            <p className="text-gray-400 mb-8">
              Les prochaines créations seront dévoilées prochainement.
              Rejoignez le club pour un accès prioritaire 24h avant le public.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/collectionneurs"
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all"
              >
                💎 Rejoindre le club
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white font-bold rounded-lg transition-all"
              >
                💬 Me prévenir des nouveautés
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Garanties en bas */}
      <div className="bg-gradient-to-b from-black to-red-950/10 border-t border-red-900/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">Nos garanties</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">🔒</div>
                <h4 className="font-bold mb-2">Authenticité</h4>
                <p className="text-sm text-gray-400">
                  Chaque œuvre est signée, numérotée et certifiée par blockchain.
                  Traçabilité totale garantie.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">💰</div>
                <h4 className="font-bold mb-2">Valorisation</h4>
                <p className="text-sm text-gray-400">
                  Les œuvres prennent de la valeur dans le temps. Buyback possible
                  à valeur de marché pour les membres Gold.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🛡️</div>
                <h4 className="font-bold mb-2">Protection</h4>
                <p className="text-sm text-gray-400">
                  Livraison assurée, encadrement professionnel disponible,
                  garantie satisfaction 14 jours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
