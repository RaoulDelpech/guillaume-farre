import Navigation from "@/components/navigation/Navigation";
import { Link } from "@/i18n/routing";

export default function ActualitesPage() {
  // Articles de blog (à terme depuis une DB ou CMS)
  const articles = [
    {
      id: 1,
      title: "Retour sur la performance live à Art Basel Miami",
      slug: "performance-art-basel-miami-2024",
      date: "3 Janvier 2025",
      category: "Événements",
      image: "/photos/atelier/ferrari-action.jpg",
      excerpt: "Découvrez les coulisses de ma dernière performance devant 250 collectionneurs internationaux. Un moment intense où la Ferrari et la toile ne font qu'un.",
      readTime: "5 min",
      featured: true
    },
    {
      id: 2,
      title: "Pourquoi collectionner l'art automobile en 2025 ?",
      slug: "investir-art-automobile-2025",
      date: "28 Décembre 2024",
      category: "Marché de l'art",
      image: "/photos/empreintes/empreinte-01.jpg",
      excerpt: "L'art automobile connaît une croissance exceptionnelle. Analyse du marché, valorisation moyenne et conseils pour les nouveaux collectionneurs.",
      readTime: "8 min",
      featured: false
    },
    {
      id: 3,
      title: "La technique de l'empreinte Ferrari expliquée",
      slug: "technique-empreinte-ferrari",
      date: "20 Décembre 2024",
      category: "Processus créatif",
      image: "/photos/atelier/ferrari-roues.jpg",
      excerpt: "Plongée dans le processus créatif unique qui transforme les roues d'une Ferrari en pinceau géant. Peinture, vitesse, précision.",
      readTime: "6 min",
      featured: false
    },
    {
      id: 4,
      title: "Portrait : Jean-Michel, collectionneur Gold depuis 2022",
      slug: "portrait-collectionneur-jean-michel",
      date: "15 Décembre 2024",
      category: "Collectionneurs",
      image: "/photos/atelier/ferrari-traces.jpg",
      excerpt: "Rencontre avec Jean-Michel qui possède 8 œuvres de la collection. Son parcours, sa passion, et comment l'art automobile a changé sa vision de l'investissement.",
      readTime: "7 min",
      featured: false
    },
    {
      id: 5,
      title: "La Ferrari n°20 : De mon enfance à l'art monumental",
      slug: "histoire-ferrari-numero-20",
      date: "8 Décembre 2024",
      category: "Inspiration",
      image: "/photos/empreintes/empreinte-02.jpg",
      excerpt: "Comment une petite voiture à pédales d'enfance est devenue le symbole d'une démarche artistique unique. L'histoire derrière l'œuvre.",
      readTime: "10 min",
      featured: false
    },
    {
      id: 6,
      title: "Nouvelle série \"Projections\" : Teaser exclusif",
      slug: "nouvelle-serie-projections",
      date: "1 Décembre 2024",
      category: "Nouveautés",
      image: "/photos/projection/projection-01.jpg",
      excerpt: "Découvrez en avant-première la nouvelle série sur laquelle je travaille. Projections lumineuses et traces de Ferrari pour des œuvres encore plus immersives.",
      readTime: "4 min",
      featured: false
    }
  ];

  const featuredArticle = articles.find(a => a.featured);
  const regularArticles = articles.filter(a => !a.featured);

  const categories = ["Tous", "Événements", "Marché de l'art", "Processus créatif", "Collectionneurs", "Inspiration", "Nouveautés"];

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <div className="bg-gradient-to-b from-purple-950/20 to-black border-b border-purple-900/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-purple-600 rounded-full text-sm font-bold mb-6">
              ACTUALITÉS
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Journal de bord
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Coulisses des performances, réflexions sur l'art automobile, portraits de collectionneurs.
              Suivez l'aventure au quotidien.
            </p>
          </div>
        </div>
      </div>

      {/* Article à la une */}
      {featuredArticle && (
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <div className="inline-block px-3 py-1 bg-red-600 rounded-full text-xs font-bold mb-4">
                ⭐ À LA UNE
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 bg-gradient-to-br from-purple-950/20 to-black border-2 border-purple-900/30 rounded-3xl overflow-hidden hover:border-purple-600 transition-all">
              <div className="relative h-64 md:h-full">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${featuredArticle.image})` }}
                ></div>
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-purple-600/30 rounded-full text-xs font-bold text-purple-400">
                    {featuredArticle.category}
                  </span>
                  <span className="text-sm text-gray-400">{featuredArticle.date}</span>
                  <span className="text-sm text-gray-400">• {featuredArticle.readTime}</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {featuredArticle.title}
                </h2>

                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>

                <Link
                  href={`/actualites/${featuredArticle.slug}`}
                  className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all transform hover:scale-105"
                >
                  Lire l'article →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filtres par catégorie */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg font-bold text-sm transition-all"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grille d'articles */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {regularArticles.map((article) => (
              <Link
                key={article.id}
                href={`/actualites/${article.slug}`}
                className="group bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-600 transition-all shadow-lg"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url(${article.image})` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                  {/* Catégorie badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-purple-600/90 backdrop-blur-sm rounded-full text-xs font-bold">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-purple-500 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-sm text-gray-400 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>

                  <div className="text-purple-500 font-bold text-sm group-hover:translate-x-2 transition-transform inline-block">
                    Lire la suite →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-950/30 to-black border-2 border-purple-600/30 rounded-3xl p-8 md:p-12 text-center">
            <div className="text-6xl mb-6">📬</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ne manquez aucune actualité
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Recevez les nouvelles créations, invitations aux performances et articles
              directement dans votre boîte mail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 px-6 py-4 bg-black/40 border-2 border-purple-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-600"
              />
              <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all whitespace-nowrap">
                S'abonner
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Pas de spam. Désinscription en un clic. ~2 emails par mois maximum.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
