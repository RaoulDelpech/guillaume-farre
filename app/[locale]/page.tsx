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

      {/* Œuvres en vedette avec badges de rareté */}
      <section className="container py-20 md:py-28 border-t px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-3">Œuvres disponibles</h2>
            <p className="text-lg text-gray-400 font-light">Éditions limitées et pièces uniques</p>
          </div>
          <Link href="/boutique" className="text-amber-500 hover:text-amber-400 font-light tracking-wide">
            Voir tout →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
          {featuredWorks.slice(0, 6).map((work, idx) => {
            // Simuler des badges de rareté (à remplacer par vraies données)
            const isLimited = idx % 3 === 0;
            const isLastOne = idx % 5 === 0;
            const isSold = idx % 7 === 0;

            return (
              <Link
                key={work.slug}
                href={`/galerie-item/${work.slug}`}
                className="group block overflow-hidden rounded-lg border hover:border-amber-500 transition-all relative"
              >
                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {isLimited && !isSold && (
                    <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white/90 text-xs font-light tracking-wide rounded border border-white/20">
                      Édition 3/7
                    </span>
                  )}
                  {isLastOne && !isSold && (
                    <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white/90 text-xs font-light tracking-wide rounded border border-white/20">
                      Dernière disponible
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
            href="/boutique"
            className="inline-block px-10 py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-lg transition-all transform hover:scale-105"
          >
            Voir toutes les œuvres disponibles
          </Link>
        </div>
      </section>

      {/* Témoignages de collectionneurs */}
      <section className="bg-gradient-to-b from-background to-muted/20 py-20 md:py-28 border-t border-border">
        <div className="container px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-light tracking-wide text-center mb-16">Ce que disent les collectionneurs</h2>

          <div className="grid md:grid-cols-3 gap-10 md:gap-12 max-w-6xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center text-xl font-light text-muted-foreground">
                  JP
                </div>
                <div>
                  <div className="font-light tracking-wide text-lg">Jean-Pierre M.</div>
                  <div className="text-sm text-muted-foreground font-light">Collectionneur, Paris</div>
                </div>
              </div>
              <p className="text-foreground/80 text-base leading-relaxed mb-4 font-light">
                "J'ai acheté ma première empreinte il y a 2 ans. Aujourd'hui,
                j'en possède 4. Chaque pièce raconte une histoire unique."
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center text-xl font-light text-muted-foreground">
                  SM
                </div>
                <div>
                  <div className="font-light tracking-wide text-lg">Sophie M.</div>
                  <div className="text-sm text-muted-foreground font-light">Galeriste, Monaco</div>
                </div>
              </div>
              <p className="text-foreground/80 text-base leading-relaxed mb-4 font-light">
                "Un concept totalement inédit. Mes clients sont fascinés
                par cette fusion entre art contemporain et culture automobile."
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center text-xl font-light text-muted-foreground">
                  AL
                </div>
                <div>
                  <div className="font-light tracking-wide text-lg">Antoine L.</div>
                  <div className="text-sm text-muted-foreground font-light">Collectionneur, Genève</div>
                </div>
              </div>
              <p className="text-foreground/80 text-base leading-relaxed mb-4 font-light">
                "Une œuvre qui ne cesse de m'émerveiller. Chaque détail raconte
                l'intensité du moment de la création. Un véritable coup de cœur."
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* CTA final puissant */}
      <section className="container py-24 md:py-32 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-light tracking-wide mb-8">
            Rejoignez la communauté
          </h2>
          <p className="text-2xl text-gray-400 font-light mb-12 leading-relaxed">
            Des Ferrari qui deviennent pinceaux. Des traces qui deviennent art.<br />
            Éditions limitées. Pièces uniques.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/boutique"
              className="px-12 py-6 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-xl transition-all"
            >
              Réserver une œuvre
            </Link>
            <Link
              href="/contact"
              className="px-12 py-6 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-light tracking-wide rounded-lg text-xl transition-all border-2 border-white/30"
            >
              Contacter l'artiste
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-base text-muted-foreground font-light">
            <div>Certificat d'authenticité</div>
            <div className="w-px h-5 bg-border"></div>
            <div>Livraison sécurisée</div>
            <div className="w-px h-5 bg-border"></div>
            <div>Paiement en 3x</div>
          </div>
        </div>
      </section>
    </main>
  );
}
