import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import ShopGrid from "@/components/shop/ShopGrid";
import { loadPhotoMetadata } from "@/lib/admin/photo-manager";

export default async function BoutiquePage() {
  const t = await getTranslations("shop");

  // Load all photos marked as for sale
  let photosForSale = [];
  try {
    const allPhotos = await loadPhotoMetadata();
    photosForSale = allPhotos.filter(photo => photo.visible && photo.forSale);
  } catch (error) {
    console.error('Error loading shop photos:', error);
  }

  return (
    <main>
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Découvrez les photographies disponibles à l'achat.
            Chaque tirage est réalisé sur papier d'art premium avec encres pigmentaires,
            garantissant une conservation optimale.
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>📦 Livraison internationale</p>
            <p>🎨 Encadrement professionnel disponible</p>
            <p>✍️ Certificat d'authenticité signé</p>
          </div>
        </div>

        {photosForSale.length > 0 ? (
          <ShopGrid photos={photosForSale} />
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-4">
              Aucune œuvre n'est actuellement disponible à la vente.
            </p>
            <p className="text-muted-foreground">
              Revenez bientôt ou contactez-nous pour des commandes spéciales.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
