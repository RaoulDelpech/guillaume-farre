import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import HeroCarousel from "@/components/HeroCarousel";
import { Link } from "@/i18n/routing";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <main className="min-h-[80vh]">
      <Navigation />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Bandeau info */}
      <section className="container py-4 md:py-6 mb-8 md:mb-12 px-4">
        <Link
          href="/concept-car-art"
          className="block p-4 md:p-6 rounded-md border bg-card/50 hover:bg-card transition-all"
        >
          <p className="text-xs md:text-sm text-muted-foreground text-center">
            {t("nextEvent")} <strong className="text-foreground">{t("conceptCarArt")}</strong> — {t("livePerformance")} →
          </p>
        </Link>
      </section>

      {/* Aperçu galerie */}
      <section className="container py-8 md:py-12 border-t px-4">
        <h2 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8">{t("selectionTitle")}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/galerie"
            className="p-6 border rounded-lg hover:border-primary transition-colors"
          >
            <h3 className="text-2xl font-bold mb-2">Galerie</h3>
            <p className="text-muted-foreground">
              Découvrez mes créations automobiles
            </p>
          </Link>
          <Link
            href="/boutique"
            className="p-6 border rounded-lg hover:border-primary transition-colors"
          >
            <h3 className="text-2xl font-bold mb-2">{t("shopTitle")}</h3>
            <p className="text-muted-foreground">
              Explorez les œuvres disponibles
            </p>
          </Link>
          <Link
            href="/atelier"
            className="p-6 border rounded-lg hover:border-primary transition-colors"
          >
            <h3 className="text-2xl font-bold mb-2">L&apos;Atelier</h3>
            <p className="text-muted-foreground">
              Découvrez mon espace de création
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
