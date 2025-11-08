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
      <div className="bg-gradient-to-b from-accent/20 to-background border-b border-border py-16 md:py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-6 py-3 bg-primary rounded-full text-sm font-light tracking-widest mb-6">
                {t("heroTag")}
              </div>
              <h1 className="text-6xl md:text-7xl font-light tracking-wide mb-8">
                {t("heroTitle")}
              </h1>
              <p className="text-2xl font-light text-muted-foreground max-w-4xl mx-auto mb-10 leading-relaxed">
                {t("heroDescription")}
              </p>
            </div>

            {/* Stats de la boutique */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12 max-w-4xl mx-auto">
              <div className="bg-card border border-border rounded-lg p-6 md:p-8 text-center hover:border-accent/50 transition-colors">
                <div className="text-4xl md:text-5xl font-light tracking-wide text-primary mb-3">{stats.total}</div>
                <div className="text-sm text-muted-foreground font-light">Œuvres disponibles</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 md:p-8 text-center hover:border-accent/50 transition-colors">
                <div className="text-4xl md:text-5xl font-light tracking-wide text-accent mb-3">{stats.limitedEditions}</div>
                <div className="text-sm text-muted-foreground font-light">Éditions limitées</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 md:p-8 text-center hover:border-accent/50 transition-colors">
                <div className="text-4xl md:text-5xl font-light tracking-wide text-secondary mb-3">{stats.collectors}</div>
                <div className="text-sm text-muted-foreground font-light">Collectionneurs</div>
              </div>
            </div>

            {/* Avantages */}
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="font-light tracking-wide text-base mb-2">Certificat authenticité</div>
                  <div className="text-sm text-muted-foreground font-light">Garantie d'origine</div>
                </div>
                <div>
                  <div className="font-light tracking-wide text-base mb-2">Livraison premium</div>
                  <div className="text-sm text-muted-foreground font-light">Assurée et sécurisée</div>
                </div>
                <div>
                  <div className="font-light tracking-wide text-base mb-2">Paiement 3x</div>
                  <div className="text-sm text-muted-foreground font-light">Sans frais dès 500€</div>
                </div>
                <div>
                  <div className="font-light tracking-wide text-base mb-2">Club collectionneurs</div>
                  <div className="text-sm text-muted-foreground font-light">Dès la 1ère acquisition</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Galerie */}
      <div className="container mx-auto px-6 lg:px-8 py-16 md:py-20">
        {photosForSale.length > 0 ? (
          <ShopFilteredGrid photos={photosForSale} />
        ) : (
          <div className="text-center py-28 max-w-3xl mx-auto">
            <p className="text-3xl md:text-4xl font-light tracking-wide mb-6">
              Nouvelles œuvres bientôt disponibles
            </p>
            <p className="text-xl text-gray-400 font-light mb-10 leading-relaxed">
              Les prochaines créations seront dévoilées prochainement.
              Rejoignez le club pour un accès prioritaire 24h avant le public.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/collectionneurs"
                className="px-10 py-5 bg-primary hover:bg-accent text-primary-foreground font-light tracking-wide rounded-lg transition-all"
              >
                Rejoindre le club
              </Link>
              <Link
                href="/contact"
                className="px-10 py-5 bg-card hover:bg-accent/20 border border-border text-foreground font-light tracking-wide rounded-lg transition-all"
              >
                Me prévenir des nouveautés
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Garanties en bas */}
      <div className="bg-card border-t border-border py-20 md:py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-light tracking-wide text-center mb-16">Nos garanties</h3>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <h4 className="font-light tracking-wide text-xl mb-4">Authenticité</h4>
                <p className="text-base text-muted-foreground font-light leading-relaxed">
                  Chaque œuvre est signée, numérotée et certifiée.
                  Traçabilité totale garantie.
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-light tracking-wide text-xl mb-4">Qualité galerie</h4>
                <p className="text-base text-muted-foreground font-light leading-relaxed">
                  Œuvres uniques créées lors de performances live.
                  Standards muséaux pour chaque pièce.
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-light tracking-wide text-xl mb-4">Protection</h4>
                <p className="text-base text-muted-foreground font-light leading-relaxed">
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
