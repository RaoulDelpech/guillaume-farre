import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import { Link } from "@/i18n/routing";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <main>
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">Guillaume Farré</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Artiste sculpteur - Concept car art
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/galerie"
            className="p-6 border rounded-lg hover:border-primary transition-colors"
          >
            <h2 className="text-2xl font-bold mb-2">{t("selectionTitle")}</h2>
            <p className="text-muted-foreground">
              Découvrez mes créations automobiles
            </p>
          </Link>
          <Link
            href="/boutique"
            className="p-6 border rounded-lg hover:border-primary transition-colors"
          >
            <h2 className="text-2xl font-bold mb-2">{t("shopTitle")}</h2>
            <p className="text-muted-foreground">
              Explorez les œuvres disponibles
            </p>
          </Link>
          <Link
            href="/atelier"
            className="p-6 border rounded-lg hover:border-primary transition-colors"
          >
            <h2 className="text-2xl font-bold mb-2">L&apos;Atelier</h2>
            <p className="text-muted-foreground">
              Découvrez mon espace de création
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
