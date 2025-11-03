import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import ShopFilteredGrid from "@/components/shop/ShopFilteredGrid";
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
      <div className="bg-gradient-to-b from-accent/20 to-background border-b border-border py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block px-4 py-2 bg-primary rounded-full text-sm font-semibold mb-4">
                BOUTIQUE OFFICIELLE
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Œuvres disponibles
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Découvrez l'art automobile contemporain. Chaque œuvre est certifiée,
                numérotée et livrée avec son certificat d'authenticité.
              </p>
            </div>

            {/* Stats de la boutique */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 max-w-3xl mx-auto">
              <div className="bg-card border border-border rounded-lg p-4 text-center hover:border-accent/50 transition-colors">
                <div className="text-3xl font-bold text-primary mb-1">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Œuvres disponibles</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center hover:border-accent/50 transition-colors">
                <div className="text-3xl font-bold text-accent mb-1">{stats.limitedEditions}</div>
                <div className="text-xs text-muted-foreground">Éditions limitées</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center hover:border-accent/50 transition-colors">
                <div className="text-3xl font-bold text-secondary mb-1">{stats.collectors}</div>
                <div className="text-xs text-muted-foreground">Collectionneurs</div>
              </div>
            </div>

            {/* Avantages */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="font-semibold text-sm mb-1">Certificat authenticité</div>
                  <div className="text-xs text-muted-foreground">Garantie d'origine</div>
                </div>
                <div>
                  <div className="font-semibold text-sm mb-1">Livraison premium</div>
                  <div className="text-xs text-muted-foreground">Assurée et sécurisée</div>
                </div>
                <div>
                  <div className="font-semibold text-sm mb-1">Paiement 3x</div>
                  <div className="text-xs text-muted-foreground">Sans frais dès 500€</div>
                </div>
                <div>
                  <div className="font-semibold text-sm mb-1">Club collectionneurs</div>
                  <div className="text-xs text-muted-foreground">Dès la 1ère acquisition</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Galerie */}
      <div className="container mx-auto px-4 py-8">
        {photosForSale.length > 0 ? (
          <>
            <ShopFilteredGrid photos={photosForSale} />

            {/* CTA bottom */}
            <div className="max-w-5xl mx-auto mt-16 bg-card border border-border rounded-2xl p-8 text-center">
              <h3 className="text-3xl font-bold mb-4">Rejoignez le club des collectionneurs</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Devenez membre dès votre première acquisition. Accès prioritaire aux nouvelles créations,
                événements privés et expériences exclusives.
              </p>
              <Link
                href="/collectionneurs"
                className="inline-block px-8 py-4 bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-lg text-lg transition-all"
              >
                Découvrir les avantages
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-20 max-w-2xl mx-auto">
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
                className="px-8 py-4 bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-lg transition-all"
              >
                Rejoindre le club
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-card hover:bg-accent/20 border-2 border-border text-foreground font-semibold rounded-lg transition-all"
              >
                Me prévenir des nouveautés
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Garanties en bas */}
      <div className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">Nos garanties</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h4 className="font-semibold mb-2">Authenticité</h4>
                <p className="text-sm text-muted-foreground">
                  Chaque œuvre est signée, numérotée et certifiée.
                  Traçabilité totale garantie.
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2">Qualité galerie</h4>
                <p className="text-sm text-muted-foreground">
                  Œuvres uniques créées lors de performances live.
                  Standards muséaux pour chaque pièce.
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2">Protection</h4>
                <p className="text-sm text-muted-foreground">
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
