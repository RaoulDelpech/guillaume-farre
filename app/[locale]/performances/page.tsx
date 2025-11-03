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
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/50 via-black to-black"></div>
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url("/photos/atelier/ferrari-action.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="text-red-500 text-sm md:text-base font-bold mb-4 tracking-widest">
            PERFORMANCES LIVE
          </div>
          <h1 className="text-4xl md:text-7xl font-bold mb-6">
            L'art en direct
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Assistez à la création d'une œuvre unique. Une Ferrari, de la peinture, une toile monumentale.
            Un spectacle inoubliable.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-lg transition-all transform hover:scale-105"
          >
            🎟️ Réserver une place
          </Link>
        </div>
      </div>

      {/* Stats performances */}
      <section className="bg-gradient-to-r from-red-950 to-black border-y border-red-900/30 py-8 md:py-12">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-bold text-red-500 mb-2">12</div>
              <div className="text-sm md:text-base text-gray-400">Performances réalisées</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-bold text-red-500 mb-2">850+</div>
              <div className="text-sm md:text-base text-gray-400">Spectateurs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-bold text-red-500 mb-2">18</div>
              <div className="text-sm md:text-base text-gray-400">Œuvres créées en live</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-bold text-red-500 mb-2">9</div>
              <div className="text-sm md:text-base text-gray-400">Pays visités</div>
            </div>
          </div>
        </div>
      </section>

      {/* Performances à venir */}
      <section className="container px-4 py-16 md:py-24">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Prochaines performances
          </h2>
          <p className="text-xl text-gray-400">
            Réservez votre place pour assister à la création d'une œuvre unique
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {upcomingPerformances.map((perf) => (
            <div
              key={perf.id}
              className="bg-gradient-to-br from-red-950/30 to-black border-2 border-red-900/30 rounded-2xl overflow-hidden hover:border-red-600 transition-all"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      perf.status === "Dernières places"
                        ? "bg-orange-600 text-white animate-pulse"
                        : perf.status === "Sur invitation"
                        ? "bg-purple-600 text-white"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {perf.status}
                  </div>
                  <div className="text-xs text-gray-400 bg-black/40 px-2 py-1 rounded">
                    {perf.type}
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3">{perf.title}</h3>

                <div className="space-y-2 text-gray-300 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">📅</span>
                    <span>{perf.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">📍</span>
                    <span>{perf.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">👥</span>
                    <span>{perf.spots} places disponibles</span>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="block w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-center transition-all"
                >
                  {perf.type === "Privé" ? "Demander une invitation" : "Réserver ma place"}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-yellow-950/20 to-black border border-yellow-900/30 rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-6xl">🏢</div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Performance privée sur mesure</h3>
              <p className="text-gray-400">
                Organisez une performance exclusive pour votre entreprise, événement ou collection privée.
                Spectacle garanti pour vos invités VIP.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg whitespace-nowrap transition-all"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </section>

      {/* Performances passées - Galerie */}
      <section className="bg-gradient-to-b from-black via-red-950/10 to-black py-16 md:py-24 border-t border-red-900/30">
        <div className="container px-4">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Performances passées
            </h2>
            <p className="text-xl text-gray-400">
              Retour sur les moments forts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {pastPerformances.map((perf) => (
              <div
                key={perf.id}
                className="group bg-black border border-red-900/30 rounded-2xl overflow-hidden hover:border-red-600 transition-all"
              >
                <div className="relative h-64 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url(${perf.image})` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-red-500 text-sm font-bold mb-1">{perf.date}</div>
                    <h3 className="text-2xl font-bold">{perf.title}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <span>📍</span>
                    <span>{perf.location}</span>
                  </div>

                  <p className="text-gray-300 mb-4">{perf.description}</p>

                  <div className="bg-red-950/30 border border-red-900/30 rounded-lg p-4 mb-4">
                    <div className="text-red-500 font-bold text-sm mb-1">🌟 Highlight</div>
                    <div className="text-white text-sm">{perf.highlight}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center py-3 bg-black/40 rounded-lg">
                      <div className="text-2xl font-bold text-red-500">{perf.attendees}</div>
                      <div className="text-xs text-gray-400">Spectateurs</div>
                    </div>
                    <div className="text-center py-3 bg-black/40 rounded-lg">
                      <div className="text-2xl font-bold text-green-500">{perf.sales}</div>
                      <div className="text-xs text-gray-400">Ventes</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Déroulement d'une performance */}
      <section className="container px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Comment se déroule une performance ?
          </h2>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <div className="text-6xl mb-4">1️⃣</div>
                <h3 className="text-2xl font-bold mb-3 text-red-500">Préparation</h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-lg text-gray-300 leading-relaxed">
                  Installation de la toile monumentale (jusqu'à 6 mètres). Préparation des peintures acryliques.
                  La Ferrari est positionnée. Le public prend place autour de la scène.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <div className="text-6xl mb-4">2️⃣</div>
                <h3 className="text-2xl font-bold mb-3 text-red-500">Performance</h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-lg text-gray-300 leading-relaxed">
                  Guillaume explique le concept. La Ferrari démarre (le son du V12 est unique).
                  Les roues sont trempées dans la peinture. La voiture roule sur la toile, créant des traces uniques.
                  Durée : 15-20 minutes de création pure.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <div className="text-6xl mb-4">3️⃣</div>
                <h3 className="text-2xl font-bold mb-3 text-red-500">Dévoilement</h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-lg text-gray-300 leading-relaxed">
                  La toile est levée et présentée au public. L'œuvre unique vient de naître.
                  Chaque trace raconte le passage de la Ferrari. Photos et vidéos immortalisent le moment.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <div className="text-6xl mb-4">4️⃣</div>
                <h3 className="text-2xl font-bold mb-3 text-red-500">Rencontre</h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-lg text-gray-300 leading-relaxed">
                  Temps d'échange avec Guillaume. Questions du public. Signature de l'œuvre.
                  Pour les collectionneurs : possibilité d'acquérir l'œuvre créée ou des tirages photographiques limités.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="container px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-red-950/30 to-black border-2 border-red-900/30 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Vivez l'expérience en direct
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Assistez à la naissance d'une œuvre unique. Un spectacle artistique et automobile inoubliable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xl transition-all transform hover:scale-105"
              >
                🎟️ Réserver une place
              </Link>
              <Link
                href="/boutique"
                className="px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-lg text-xl transition-all border-2 border-white/30"
              >
                🛒 Voir les œuvres disponibles
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto text-sm text-gray-400">
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-500">✓</span>
                Spectacle unique
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-500">✓</span>
                Rencontre avec l'artiste
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-500">✓</span>
                Photos souvenirs
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
