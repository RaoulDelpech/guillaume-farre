import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import HeroCarousel from "@/components/HeroCarousel";
import HomeClient from "@/components/HomeClient";
import PerformanceCountdown from "@/components/PerformanceCountdown";
import CollectionTracker from "@/components/CollectionTracker";
import { Link } from "@/i18n/routing";
import { getWorksFromMetadata } from "@/lib/works";

export default async function HomePage() {
  const t = await getTranslations("home");
  const allWorks = await getWorksFromMetadata();

  // Sélectionner 6 œuvres aléatoires pour l'aperçu
  const featuredWorks = allWorks
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  // Statistiques dynamiques
  const stats = {
    totalWorks: allWorks.length,
    collectors: 47, // À ajuster avec vraies données
    performances: 12,
  };

  return (
    <main className="min-h-[80vh]">
      <Navigation />
      <HomeClient />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Stats Live - Impact immédiat */}
      <section className="bg-gradient-to-br from-accent/20 to-black/95 border-y border-accent/20 py-8 md:py-12">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-bold text-primary mb-2">{stats.totalWorks}</div>
              <div className="text-sm md:text-base text-muted-foreground">Œuvres créées</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-bold text-primary mb-2">{stats.collectors}</div>
              <div className="text-sm md:text-base text-muted-foreground">Collectionneurs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-bold text-primary mb-2">{stats.performances}</div>
              <div className="text-sm md:text-base text-muted-foreground">Performances live</div>
            </div>
          </div>
        </div>
      </section>

      {/* Le concept en 3 étapes */}
      <section className="container py-12 md:py-16 px-4 border-t">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Comment ça marche ?</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="text-6xl mb-4">👶</div>
            <div className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors">
              <h3 className="text-xl font-bold mb-3">1. Enfant</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tout commence avec une petite Ferrari n°20. Guillaume trempe ses roues dans la peinture
                et crée ses premières traces sur papier.
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="text-6xl mb-4">🏎️</div>
            <div className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors">
              <h3 className="text-xl font-bold mb-3">2. Vision</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Des années plus tard, le rêve devient réalité :
                une vraie Ferrari remplace la miniature. Échelle 1:1.
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="text-6xl mb-4">🎨</div>
            <div className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors">
              <h3 className="text-xl font-bold mb-3">3. Œuvre unique</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Chaque performance live crée une œuvre strictement unique,
                impossible à reproduire. Un instant capturé pour toujours.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/origine"
            className="inline-block px-8 py-4 bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-lg text-lg transition-all"
          >
            L'histoire complète
          </Link>
        </div>
      </section>

      {/* Œuvres en vedette avec badges de rareté */}
      <section className="container py-12 md:py-16 border-t px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Œuvres disponibles</h2>
            <p className="text-gray-400">Éditions limitées et pièces uniques</p>
          </div>
          <Link href="/boutique" className="text-red-500 hover:text-red-400 font-bold">
            Voir tout →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {featuredWorks.slice(0, 6).map((work, idx) => {
            // Simuler des badges de rareté (à remplacer par vraies données)
            const isLimited = idx % 3 === 0;
            const isLastOne = idx % 5 === 0;
            const isSold = idx % 7 === 0;

            return (
              <Link
                key={work.slug}
                href={`/galerie-item/${work.slug}`}
                className="group block overflow-hidden rounded-lg border hover:border-red-500 transition-all relative"
              >
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                  {isLimited && !isSold && (
                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                      Édition 3/7
                    </span>
                  )}
                  {isLastOne && !isSold && (
                    <span className="px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full animate-pulse">
                      Dernière !
                    </span>
                  )}
                  {isSold && (
                    <span className="px-3 py-1 bg-gray-800 text-gray-400 text-xs font-bold rounded-full">
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
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">VENDU</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-3 md:p-4 bg-card">
                  <h3 className="text-sm md:text-base font-semibold mb-1 truncate">{work.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {work.year} • {work.type === 'photo' ? 'Photographie' : 'Toile'}
                  </p>
                  {!isSold && (
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-gray-400">À partir de</span>
                      <span className="text-lg font-bold text-red-500">
                        {isLimited ? '8 500€' : '2 800€'}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/boutique"
            className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-lg transition-all transform hover:scale-105"
          >
            🛒 Voir toutes les œuvres disponibles
          </Link>
        </div>
      </section>

      {/* Témoignages de collectionneurs */}
      <section className="bg-gradient-to-b from-black to-red-950/10 py-12 md:py-16 border-t">
        <div className="container px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Ce que disent les collectionneurs</h2>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="bg-black/40 border border-red-900/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center text-xl">
                  JP
                </div>
                <div>
                  <div className="font-bold">Jean-Pierre M.</div>
                  <div className="text-xs text-gray-400">Collectionneur, Paris</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                "J'ai acheté ma première empreinte il y a 2 ans. Aujourd'hui,
                j'en possède 4. Chaque pièce raconte une histoire unique."
              </p>
              <div className="text-yellow-500 text-sm">⭐⭐⭐⭐⭐</div>
            </div>

            <div className="bg-black/40 border border-red-900/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center text-xl">
                  SM
                </div>
                <div>
                  <div className="font-bold">Sophie M.</div>
                  <div className="text-xs text-gray-400">Galeriste, Monaco</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                "Un concept totalement inédit. Mes clients sont fascinés
                par cette fusion entre art contemporain et culture automobile."
              </p>
              <div className="text-yellow-500 text-sm">⭐⭐⭐⭐⭐</div>
            </div>

            <div className="bg-black/40 border border-red-900/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center text-xl">
                  AL
                </div>
                <div>
                  <div className="font-bold">Antoine L.</div>
                  <div className="text-xs text-gray-400">Investisseur, Genève</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                "Un excellent investissement. Les éditions limitées prennent
                de la valeur. Ma pièce a pris 18% en 8 mois."
              </p>
              <div className="text-yellow-500 text-sm">⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Countdown */}
      <section className="container py-12 md:py-16 px-4 border-t">
        <PerformanceCountdown />
      </section>

      {/* Collection Tracker */}
      <section className="container py-12 md:py-16 px-4 border-t">
        <div className="max-w-4xl mx-auto">
          <CollectionTracker />
        </div>
      </section>

      {/* CTA final puissant */}
      <section className="container py-16 md:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Rejoignez les {stats.collectors} collectionneurs
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Découvrez l'art automobile contemporain. Éditions limitées et pièces uniques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/boutique"
              className="px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xl transition-all transform hover:scale-105 shadow-2xl"
            >
              🏎️ Réserver une œuvre
            </Link>
            <Link
              href="/contact"
              className="px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-lg text-xl transition-all border-2 border-white/30"
            >
              💬 Discuter avec l'artiste
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Certificat d'authenticité
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Livraison sécurisée
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Paiement en 3x
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
