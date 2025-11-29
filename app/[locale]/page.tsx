import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import HeroCarousel from "@/components/HeroCarousel";
import HomeClient from "@/components/HomeClient";
import { Link } from "@/i18n/routing";
import { getWorksFromMetadata } from "@/lib/works";

export default async function HomePage() {
  const t = await getTranslations("home");
  const allWorks = await getWorksFromMetadata();

  // Sélectionner 6 œuvres aléatoires pour l'aperçu
  const featuredWorks = allWorks
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  return (
    <main className="min-h-[80vh]">
      <Navigation />
      <HomeClient />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Section Artiste en vedette - World-class 50/50 split */}
      <section className="py-24 md:py-32 bg-muted/30">
        <div className="container px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Image artiste */}
            <div className="order-2 md:order-1">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src="/images/origins/atelier-deux-voitures-grises.jpg"
                  alt="Guillaume Farré dans son atelier"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Texte artiste */}
            <div className="order-1 md:order-2">
              <div className="text-sm uppercase tracking-widest text-muted-foreground mb-4 font-light">
                {t("artist.label")}
              </div>
              <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-6 text-foreground">
                {t("artist.name")}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-8">
                {t("artist.bio")}
              </p>
              <Link
                href="/histoire"
                className="inline-flex items-center text-lg font-light tracking-wide hover:text-foreground/80 transition-colors group"
              >
                <span className="border-b border-current pb-1">{t("artist.cta")}</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dernières œuvres */}
      <section className="container py-20 md:py-28 border-t px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-3 text-foreground">Dernières œuvres</h2>
            <p className="text-lg text-muted-foreground font-light">Toiles. Photographies. Empreintes irréversibles.</p>
          </div>
          <Link href="/galerie" className="text-foreground/70 hover:text-foreground font-light tracking-wide border-b border-current pb-1">
            Voir la galerie →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
          {featuredWorks.slice(0, 6).map((work) => {
            // VRAIES DONNÉES séries limitées (pas simulées)
            const isLimitedEdition = work.categories?.includes('limited') || work.edition?.type === 'limited';
            const available = work.limitedEdition?.available || 0;
            const total = work.limitedEdition?.total || 7;
            const isSold = available === 0;
            const isLastOne = available === 1;

            return (
              <Link
                key={work.slug}
                href={`/galerie-item/${work.slug}`}
                className="group block overflow-hidden rounded-lg border hover:border-amber-500 transition-all relative"
              >
                {/* Badges RÉELS */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {isLimitedEdition && !isSold && (
                    <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white/90 text-xs font-light tracking-wide rounded border border-white/20">
                      Édition {total - available}/{total}
                    </span>
                  )}
                  {isLastOne && !isSold && (
                    <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white/90 text-xs font-light tracking-wide rounded border border-amber-500/50">
                      ⚠️ Dernière disponible
                    </span>
                  )}
                  {isSold && (
                    <span className="px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white/50 text-xs font-light tracking-wide rounded border border-white/10">
                      VENDU
                    </span>
                  )}
                </div>

                {work.images[0] && (
                  <div className="relative overflow-hidden">
                    <img
                      src={work.images[0]}
                      alt={work.title}
                      className="w-full h-48 md:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {isSold && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-2xl font-light tracking-widest text-white/80">VENDU</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-4 md:p-6 bg-card">
                  <h3 className="text-base md:text-lg font-light tracking-wide mb-2 truncate">{work.title}</h3>
                  <p className="text-sm text-muted-foreground font-light">
                    {work.year} • {work.type === 'photo' ? 'Photographie' : 'Toile'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/galerie"
            className="inline-block px-10 py-5 border border-foreground/30 hover:border-foreground text-foreground font-light tracking-wide rounded-sm text-lg transition-all"
          >
            Voir toute la galerie
          </Link>
        </div>
      </section>

    </main>
  );
}
