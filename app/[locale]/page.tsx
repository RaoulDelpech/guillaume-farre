import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import HeroCarousel from "@/components/HeroCarousel";
import { Link } from "@/i18n/routing";
import { getWorksFromMetadata } from "@/lib/works";

export default async function HomePage() {
  const t = await getTranslations("home");
  const allWorks = await getWorksFromMetadata();
  // Sélectionner 6 œuvres aléatoires pour l'aperçu
  const featuredWorks = allWorks
    .filter(w => w.visible)
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

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

      {/* Aperçu galerie - Vraies photos */}
      <section className="container py-8 md:py-12 border-t px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-semibold">{t("selectionTitle")}</h2>
          <Link href="/galerie" className="text-sm text-primary hover:underline">
            Voir toute la galerie →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {featuredWorks.map((work) => (
            <Link
              key={work.slug}
              href={`/galerie-item/${work.slug}`}
              className="group block overflow-hidden rounded-lg border hover:border-primary transition-all"
            >
              {work.images[0] && (
                <img
                  src={work.images[0]}
                  alt={work.title}
                  className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="p-3 md:p-4 bg-card">
                <h3 className="text-sm md:text-base font-semibold mb-1 truncate">{work.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {work.year} • {work.type === 'photo' ? 'Photographie' : 'Toile'}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 md:mt-12 grid md:grid-cols-3 gap-4 md:gap-6">
          <Link
            href="/galerie"
            className="p-4 md:p-6 border rounded-lg hover:border-primary transition-colors bg-card/30"
          >
            <h3 className="text-lg md:text-xl font-bold mb-2">🎨 Galerie</h3>
            <p className="text-sm text-muted-foreground">
              Découvrez toutes mes créations automobiles
            </p>
          </Link>
          <Link
            href="/boutique"
            className="p-4 md:p-6 border rounded-lg hover:border-primary transition-colors bg-card/30"
          >
            <h3 className="text-lg md:text-xl font-bold mb-2">🛒 {t("shopTitle")}</h3>
            <p className="text-sm text-muted-foreground">
              Tirages disponibles jusqu'à 3 mètres
            </p>
          </Link>
          <Link
            href="/atelier"
            className="p-4 md:p-6 border rounded-lg hover:border-primary transition-colors bg-card/30"
          >
            <h3 className="text-lg md:text-xl font-bold mb-2">🏭 L&apos;Atelier</h3>
            <p className="text-sm text-muted-foreground">
              Mon espace de création unique
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
