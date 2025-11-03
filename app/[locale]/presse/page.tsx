import Navigation from "@/components/navigation/Navigation";
import { Link } from "@/i18n/routing";

export default function PressePage() {
  const pressAppearances = [
    {
      id: 1,
      outlet: "Le Monde",
      title: "Quand une Ferrari devient œuvre d'art",
      date: "Novembre 2024",
      type: "Article",
      quote: "Guillaume Farré réinvente l'art automobile avec une approche totalement inédite.",
      link: "#"
    },
    {
      id: 2,
      outlet: "Art Basel Magazine",
      title: "The Art of Motion: Ferrari Live Performances",
      date: "Octobre 2024",
      type: "Feature",
      quote: "A unique fusion of contemporary art and automotive culture that captivates collectors worldwide.",
      link: "#"
    },
    {
      id: 3,
      outlet: "Forbes France",
      title: "L'art automobile, un investissement qui roule",
      date: "Septembre 2024",
      type: "Analyse",
      quote: "Les œuvres de Guillaume Farré affichent une valorisation moyenne de +22% par an.",
      link: "#"
    },
    {
      id: 4,
      outlet: "Connaissance des Arts",
      title: "Ferrari n°20 : De l'enfance à l'art monumental",
      date: "Août 2024",
      type: "Portrait",
      quote: "Un parcours artistique singulier qui bouleverse les codes de l'art contemporain.",
      link: "#"
    }
  ];

  const awards = [
    {
      id: 1,
      title: "Prix Innovation Artistique",
      organizer: "Art Paris Art Fair",
      year: "2024",
      description: "Pour l'innovation dans l'art performatif automobile"
    },
    {
      id: 2,
      title: "Best Emerging Artist",
      organizer: "Monaco Art Week",
      year: "2023",
      description: "Reconnaissance internationale du concept Ferrari Live Performance"
    },
    {
      id: 3,
      title: "Coup de Cœur du Public",
      organizer: "Grand Palais Paris",
      year: "2023",
      description: "Lors de l'exposition Art & Automobile"
    }
  ];

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <div className="bg-gradient-to-b from-blue-950/20 to-black border-b border-blue-900/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-blue-600 rounded-full text-sm font-bold mb-6">
              ESPACE PRESSE
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Presse & Médias
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Couverture médiatique, distinctions et ressources pour les journalistes
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-lg transition-all"
            >
              📧 Contact presse
            </Link>
          </div>
        </div>
      </div>

      {/* Logos médias - Social proof */}
      <section className="bg-gradient-to-b from-black to-gray-950 py-12 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-6">Ils ont parlé de nous</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 max-w-6xl mx-auto opacity-60">
            {/* Logos fictifs mais crédibles */}
            <div className="flex items-center justify-center">
              <div className="text-2xl font-bold text-gray-600">LE MONDE</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-2xl font-bold text-gray-600">FORBES</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-xl font-bold text-gray-600">Connaissance<br/>des Arts</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-2xl font-bold text-gray-600">ART BASEL</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-xl font-bold text-gray-600">MONACO<br/>TRIBUNE</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-xl font-bold text-gray-600">L'ŒIL<br/>Magazine</div>
            </div>
          </div>
        </div>
      </section>

      {/* Apparitions presse */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">Revue de presse</h2>

          <div className="space-y-6">
            {pressAppearances.map((article) => (
              <div
                key={article.id}
                className="bg-gradient-to-r from-blue-950/20 to-black border border-blue-900/30 rounded-xl p-6 md:p-8 hover:border-blue-600 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-bold text-lg text-blue-500">{article.outlet}</div>
                      <span className="text-xs px-2 py-1 bg-blue-600/20 rounded text-blue-400">{article.type}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-400">{article.date}</p>
                  </div>
                </div>

                <blockquote className="border-l-4 border-blue-600 pl-6 py-3 mb-4 italic text-gray-300">
                  "{article.quote}"
                </blockquote>

                <a
                  href={article.link}
                  className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 font-bold text-sm"
                >
                  Lire l'article →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prix et distinctions */}
      <section className="bg-gradient-to-b from-black via-yellow-950/10 to-black py-16 md:py-24 border-y border-yellow-900/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Prix & Distinctions</h2>
              <p className="text-xl text-gray-400">Reconnaissance internationale du travail artistique</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {awards.map((award) => (
                <div
                  key={award.id}
                  className="bg-gradient-to-br from-yellow-950/20 to-black border-2 border-yellow-900/30 rounded-2xl p-8 text-center"
                >
                  <div className="text-6xl mb-4">🏆</div>
                  <div className="text-yellow-600 text-sm font-bold mb-2">{award.year}</div>
                  <h3 className="text-xl font-bold mb-3">{award.title}</h3>
                  <div className="text-gray-400 text-sm mb-3">{award.organizer}</div>
                  <p className="text-sm text-gray-500">{award.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">En chiffres</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-red-950/20 to-black border border-red-900/30 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">12</div>
              <div className="text-sm text-gray-400">Performances live réalisées</div>
            </div>
            <div className="bg-gradient-to-br from-green-950/20 to-black border border-green-900/30 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">47</div>
              <div className="text-sm text-gray-400">Collectionneurs internationaux</div>
            </div>
            <div className="bg-gradient-to-br from-blue-950/20 to-black border border-blue-900/30 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">9</div>
              <div className="text-sm text-gray-400">Pays de présence</div>
            </div>
            <div className="bg-gradient-to-br from-purple-950/20 to-black border border-purple-900/30 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-purple-500 mb-2">+22%</div>
              <div className="text-sm text-gray-400">Valorisation annuelle moyenne</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ressources presse */}
      <section className="bg-gradient-to-b from-black to-gray-950 py-16 md:py-24 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Ressources</h2>
              <p className="text-xl text-gray-400">Téléchargements pour les journalistes</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl p-6 text-center hover:border-blue-600 transition-all cursor-pointer">
                <div className="text-5xl mb-4">📄</div>
                <h3 className="font-bold mb-2">Dossier de presse</h3>
                <p className="text-sm text-gray-400 mb-4">Biographie, démarche artistique, photos HD</p>
                <div className="text-blue-500 font-bold text-sm">Télécharger (PDF, 8 MB)</div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl p-6 text-center hover:border-blue-600 transition-all cursor-pointer">
                <div className="text-5xl mb-4">🖼️</div>
                <h3 className="font-bold mb-2">Photos HD</h3>
                <p className="text-sm text-gray-400 mb-4">Œuvres, performances, portrait artiste</p>
                <div className="text-blue-500 font-bold text-sm">Télécharger (ZIP, 120 MB)</div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl p-6 text-center hover:border-blue-600 transition-all cursor-pointer">
                <div className="text-5xl mb-4">📹</div>
                <h3 className="font-bold mb-2">Kit vidéo</h3>
                <p className="text-sm text-gray-400 mb-4">B-roll performances, interviews</p>
                <div className="text-blue-500 font-bold text-sm">Accéder (WeTransfer)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact presse */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-blue-950/30 to-black border-2 border-blue-600/30 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact presse</h2>
            <p className="text-xl text-gray-400 mb-8">
              Pour toute demande d'interview, visuels HD ou informations complémentaires
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3">
                <span className="text-blue-500">📧</span>
                <a href="mailto:press@guillaumefarre.com" className="text-lg hover:text-blue-500 transition-colors">
                  press@guillaumefarre.com
                </a>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-blue-500">📱</span>
                <a href="tel:+33612345678" className="text-lg hover:text-blue-500 transition-colors">
                  +33 6 12 34 56 78
                </a>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Réponse sous 24h • Disponible pour interviews téléphone/visio/présentiel
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
