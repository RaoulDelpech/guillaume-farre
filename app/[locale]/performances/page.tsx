import Navigation from "@/components/navigation/Navigation";
import { Link } from "@/i18n/routing";

export default function PerformancesPage() {
  // Données de performances (à terme depuis une vraie DB)
  const pastPerformances = [
    {
      id: 1,
      title: "Art Basel Miami 2024",
      date: "Décembre 2024",
      location: "Miami, USA",
      attendees: 250,
      sales: 3,
      image: "/photos/atelier/ferrari-traces.jpg",
      description: "Performance live devant 250 collectionneurs internationaux",
      highlight: "3 œuvres vendues pendant l'événement"
    },
    {
      id: 2,
      title: "Grand Palais Paris",
      date: "Octobre 2024",
      location: "Paris, France",
      attendees: 180,
      sales: 2,
      image: "/photos/atelier/ferrari-roues.jpg",
      description: "Exposition exclusive dans le cadre de la FIAC",
      highlight: "Présence de collectionneurs du monde entier"
    },
    {
      id: 3,
      title: "Monaco Yacht Show",
      date: "Septembre 2024",
      location: "Monaco",
      attendees: 120,
      sales: 4,
      image: "/photos/empreintes/empreinte-01.jpg",
      description: "Performance privée pour collectionneurs VIP",
      highlight: "Record : 4 ventes en une soirée"
    }
  ];

  const upcomingPerformances = [
    {
      id: 1,
      title: "Genève Auto Show 2025",
      date: "Mars 2025",
      location: "Genève, Suisse",
      spots: 12,
      status: "Dernières places",
      type: "Public"
    },
    {
      id: 2,
      title: "Performance Privée Paris",
      date: "Avril 2025",
      location: "Paris, France",
      spots: 5,
      status: "Sur invitation",
      type: "Privé"
    },
    {
      id: 3,
      title: "Art Basel",
      date: "Juin 2025",
      location: "Bâle, Suisse",
      spots: 30,
      status: "Inscriptions ouvertes",
      type: "Public"
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero - Épuré et élégant */}
      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("/photos/atelier/ferrari-action.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        <div className="relative z-10 text-center px-6 lg:px-8 max-w-6xl py-32">
          <div className="text-primary text-xs font-light mb-8 tracking-[0.3em] uppercase">
            Performances Live
          </div>
          <h1 className="text-6xl md:text-8xl font-light tracking-wide mb-10 text-foreground">
            L'art en direct
          </h1>
          <p className="text-2xl md:text-3xl font-light text-muted-foreground max-w-4xl mx-auto mb-16 leading-relaxed">
            Une Ferrari. De la peinture. Une toile monumentale.
            Vous voyez l'œuvre naître. Inoubliable.
          </p>
          <Link
            href="/contact"
            className="inline-block px-12 py-5 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-light tracking-wide rounded text-lg transition-all"
          >
            Réserver une place
          </Link>
        </div>
      </div>

      {/* Stats - Minimaliste */}
      <section className="bg-muted/20 border-y border-border py-20 md:py-28">
        <div className="container px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-5xl md:text-7xl font-light tracking-wide text-primary mb-4">12</div>
              <div className="text-sm text-muted-foreground font-light tracking-wide">Performances réalisées</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-7xl font-light tracking-wide text-primary mb-4">850+</div>
              <div className="text-sm text-muted-foreground font-light tracking-wide">Spectateurs</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-7xl font-light tracking-wide text-primary mb-4">18</div>
              <div className="text-sm text-muted-foreground font-light tracking-wide">Œuvres créées</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-7xl font-light tracking-wide text-primary mb-4">9</div>
              <div className="text-sm text-muted-foreground font-light tracking-wide">Pays visités</div>
            </div>
          </div>
        </div>
      </section>

      {/* Performances à venir - Élégance maximale */}
      <section className="container px-6 lg:px-8 py-28 md:py-36">
        <div className="mb-20">
          <h2 className="text-5xl md:text-6xl font-light tracking-wide mb-6 text-foreground">
            Prochaines performances
          </h2>
          <p className="text-xl font-light text-muted-foreground leading-relaxed">
            Réservez votre place pour assister à la création d'une œuvre unique
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-16 mb-20">
          {upcomingPerformances.map((perf) => (
            <div
              key={perf.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all group"
            >
              <div className="p-10">
                <div className="flex items-start justify-between mb-8">
                  <div className="text-xs font-light tracking-[0.2em] uppercase text-muted-foreground">
                    {perf.status}
                  </div>
                  <div className="text-xs font-light text-muted-foreground tracking-wide">
                    {perf.type}
                  </div>
                </div>

                <h3 className="text-3xl font-light tracking-wide mb-8 text-foreground">{perf.title}</h3>

                <div className="space-y-3 text-muted-foreground font-light mb-10">
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1">—</span>
                    <span>{perf.date}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1">—</span>
                    <span>{perf.location}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1">—</span>
                    <span>{perf.spots} places disponibles</span>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="block w-full px-6 py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-light tracking-wide rounded text-center transition-all"
                >
                  {perf.type === "Privé" ? "Demander une invitation" : "Réserver ma place"}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Performance sur mesure - Sophistiquée */}
        <div className="bg-muted/30 border border-border rounded-lg p-12 md:p-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-light tracking-wide mb-6">Performance privée sur mesure</h3>
                <p className="text-lg font-light text-muted-foreground leading-relaxed">
                  Organisez une performance exclusive pour votre entreprise, événement ou collection privée.
                  Spectacle garanti pour vos invités VIP.
                </p>
              </div>
              <Link
                href="/contact"
                className="px-10 py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded whitespace-nowrap transition-all"
              >
                Demander un devis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Performances passées - Galerie raffinée */}
      <section className="bg-muted/20 py-28 md:py-36 border-t border-border">
        <div className="container px-6 lg:px-8">
          <div className="mb-20">
            <h2 className="text-5xl md:text-6xl font-light tracking-wide mb-6">
              Performances passées
            </h2>
            <p className="text-xl font-light text-muted-foreground">
              Retour sur les moments forts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {pastPerformances.map((perf) => (
              <div
                key={perf.id}
                className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all"
              >
                <div className="relative h-80 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                    style={{ backgroundImage: `url(${perf.image})` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="text-primary text-xs font-light tracking-wide mb-2">{perf.date}</div>
                    <h3 className="text-2xl font-light tracking-wide text-white">{perf.title}</h3>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm font-light mb-6">
                    <span>—</span>
                    <span>{perf.location}</span>
                  </div>

                  <p className="text-foreground/80 font-light leading-relaxed mb-6">{perf.description}</p>

                  <div className="bg-muted/50 border border-border rounded p-6 mb-6">
                    <div className="text-primary font-light text-sm mb-2 tracking-wide uppercase">Highlight</div>
                    <div className="text-foreground text-sm font-light">{perf.highlight}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center py-4 bg-muted/30 rounded">
                      <div className="text-3xl font-light text-primary mb-1">{perf.attendees}</div>
                      <div className="text-xs text-muted-foreground font-light tracking-wide">Spectateurs</div>
                    </div>
                    <div className="text-center py-4 bg-muted/30 rounded">
                      <div className="text-3xl font-light text-primary mb-1">{perf.sales}</div>
                      <div className="text-xs text-muted-foreground font-light tracking-wide">Ventes</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Déroulement - Épuré et élégant */}
      <section className="container px-6 lg:px-8 py-28 md:py-36">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-light tracking-wide text-center mb-28">
            Comment se déroule une performance ?
          </h2>

          <div className="space-y-20">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="md:w-1/4">
                <div className="text-8xl font-light text-primary/20 mb-6">01</div>
                <h3 className="text-2xl font-light tracking-wide text-primary">Préparation</h3>
              </div>
              <div className="md:w-3/4 md:pt-12">
                <p className="text-xl font-light text-muted-foreground leading-relaxed">
                  Installation de la toile monumentale (jusqu'à 6 mètres). Préparation des peintures acryliques.
                  La Ferrari est positionnée. Le public prend place autour de la scène.
                </p>
              </div>
            </div>

            <div className="h-px bg-border"></div>

            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="md:w-1/4">
                <div className="text-8xl font-light text-primary/20 mb-6">02</div>
                <h3 className="text-2xl font-light tracking-wide text-primary">Performance</h3>
              </div>
              <div className="md:w-3/4 md:pt-12">
                <p className="text-xl font-light text-muted-foreground leading-relaxed">
                  J'explique le geste. La Ferrari démarre. Le V12 rugit.
                  Les roues plongent dans la peinture. La voiture roule. Les traces apparaissent.
                  15-20 minutes. Pas de retour en arrière possible.
                </p>
              </div>
            </div>

            <div className="h-px bg-border"></div>

            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="md:w-1/4">
                <div className="text-8xl font-light text-primary/20 mb-6">03</div>
                <h3 className="text-2xl font-light tracking-wide text-primary">Dévoilement</h3>
              </div>
              <div className="md:w-3/4 md:pt-12">
                <p className="text-xl font-light text-muted-foreground leading-relaxed">
                  La toile est levée et présentée au public. L'œuvre unique vient de naître.
                  Chaque trace raconte le passage de la Ferrari. Photos et vidéos immortalisent le moment.
                </p>
              </div>
            </div>

            <div className="h-px bg-border"></div>

            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="md:w-1/4">
                <div className="text-8xl font-light text-primary/20 mb-6">04</div>
                <h3 className="text-2xl font-light tracking-wide text-primary">Rencontre</h3>
              </div>
              <div className="md:w-3/4 md:pt-12">
                <p className="text-xl font-light text-muted-foreground leading-relaxed">
                  Temps d'échange. Vos questions. Je signe l'œuvre.
                  Pour les collectionneurs : l'œuvre unique ou les photographies en édition limitée.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final - Sophistiqué */}
      <section className="container px-6 lg:px-8 py-28 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-16 md:p-20 text-center">
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-8">
              Vivez l'expérience en direct
            </h2>
            <p className="text-2xl font-light text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Vous voyez l'œuvre naître. Artistique. Automobile. Inoubliable.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/contact"
                className="px-12 py-6 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded text-xl transition-all"
              >
                Réserver une place
              </Link>
              <Link
                href="/boutique"
                className="px-12 py-6 border border-border hover:border-primary text-foreground hover:text-primary font-light tracking-wide rounded text-xl transition-all"
              >
                Voir les œuvres disponibles
              </Link>
            </div>

            <div className="mt-12 flex flex-col md:flex-row gap-8 justify-center text-sm text-muted-foreground font-light">
              <div>Spectacle unique</div>
              <div className="hidden md:block">·</div>
              <div>Rencontre avec l'artiste</div>
              <div className="hidden md:block">·</div>
              <div>Photos souvenirs</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
