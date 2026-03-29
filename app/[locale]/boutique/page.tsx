import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import ShopFilteredGrid from "@/components/shop/ShopFilteredGrid";
import BoutiqueContent from "@/components/pages/BoutiqueContent";
import BoutiqueGarantiesContent from "@/components/pages/BoutiqueGarantiesContent";
import { loadPhotoMetadata, PhotoMetadata } from "@/lib/admin/photo-manager";
import { Link } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Acquérez une photographie d'art de Guillaume Farré. Éditions limitées numérotées, impression Fine Art Giclée, certificat d'authenticité. Formats A4 à A1.",
  openGraph: {
    title: "Boutique | Guillaume Farré",
    description: "Photographies d'art en éditions limitées. Qualité musée, livraison assurée, paiement en 3x sans frais.",
  },
};

export default async function BoutiquePage() {
  const t = await getTranslations("shop");

  // Load all photos marked for sale
  let photosForSale: PhotoMetadata[] = [];
  try {
    const allPhotos = await loadPhotoMetadata();
    photosForSale = allPhotos.filter(photo =>
      photo.visible &&
      photo.forSale &&
      photo.status !== 'trash' &&
      photo.status !== 'to-sort' // Exclure corbeille ET à trier
    );
  } catch (error) {
    console.error('Error loading shop photos:', error);
  }

  const translations = {
    heroTag: t("heroTag"),
    heroTitle: t("heroTitle"),
    heroDescription: t("heroDescription"),
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      <BoutiqueContent translations={translations} />

      {/* Galerie */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 md:py-20">
        {photosForSale.length > 0 ? (
          <ShopFilteredGrid photos={photosForSale} />
        ) : (
          <div className="text-center py-28 max-w-3xl mx-auto">
            <p className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide mb-6">
              Nouvelles œuvres bientôt disponibles
            </p>
            <p className="text-xl text-gray-400 font-light mb-10 leading-relaxed">
              Les prochaines créations seront dévoilées prochainement.
              Rejoignez le club pour un accès prioritaire 24h avant le public.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/collectionneurs"
                className="px-8 sm:px-10 py-4 sm:py-5 bg-primary hover:bg-accent text-primary-foreground font-light tracking-wide rounded-lg transition-all min-h-[48px] flex items-center justify-center"
              >
                Rejoindre le club
              </Link>
              <Link
                href="/contact"
                className="px-8 sm:px-10 py-4 sm:py-5 bg-card hover:bg-accent/20 border border-border text-foreground font-light tracking-wide rounded-lg transition-all min-h-[48px] flex items-center justify-center"
              >
                Me prévenir des nouveautés
              </Link>
            </div>
          </div>
        )}
      </div>

      <BoutiqueGarantiesContent />
    </main>
  );
}
