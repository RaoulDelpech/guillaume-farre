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
      excerpt: "Découvrez les coulisses de ma dernière performance devant 250 collectionneurs internationaux. Un moment intense où la Dino et la toile ne font qu'un.",
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
      title: "La technique de l'empreinte expliquée",
      slug: "technique-empreinte-dino",
      date: "20 Décembre 2024",
      category: "Processus créatif",
      image: "/photos/atelier/ferrari-roues.jpg",
      excerpt: "Plongée dans le processus créatif unique. Peinture, vitesse, précision.",
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
      title: "La voiture n°20 : De mon enfance à l'art monumental",
      slug: "histoire-voiture-numero-20",
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
      excerpt: "Découvrez en avant-première la nouvelle série sur laquelle je travaille. Projections lumineuses et traces pour des œuvres encore plus immersives.",
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
      <div className="bg-gradient-to-b from-accent/20 to-background border-b border-border py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-primary text-xs font-light mb-8 tracking-[0.3em] uppercase">
              Actualités
            </div>
            <h1 className="text-6xl md:text-7xl font-light tracking-wide mb-8">
              Journal de bord
            </h1>
            <p className="text-xl md:text-2xl font-light text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Coulisses. Réflexions. Traces de création.
              L'aventure se raconte ici.
            </p>
          </div>
        </div>
      </div>

      {/* Article à la une */}
      {featuredArticle && (
        <section className="container mx-auto px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="text-primary text-xs font-light tracking-[0.2em] uppercase">
                À la une
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 bg-card border border-border rounded-2xl overflow-hidden hover:border-primary transition-all">
              <div className="relative h-64 md:h-full">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${featuredArticle.image})` }}
                ></div>
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-light tracking-wide text-primary uppercase">
                    {featuredArticle.category}
                  </span>
                  <span className="text-xs text-muted-foreground font-light">{featuredArticle.date}</span>
                  <span className="text-xs text-muted-foreground font-light">• {featuredArticle.readTime}</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-6">
                  {featuredArticle.title}
                </h2>

                <p className="text-lg font-light text-muted-foreground mb-8 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>

                <Link
                  href={`/actualites/${featuredArticle.slug}`}
                  className="inline-block px-10 py-5 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-light tracking-wide rounded-lg transition-all"
                >
                  Lire l'article →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filtres par catégorie */}
      <section className="container mx-auto px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-4 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                className="px-6 py-3 border border-border hover:border-primary text-foreground hover:text-primary rounded-lg font-light text-sm tracking-wide transition-all"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grille d'articles */}
      <section className="container mx-auto px-6 lg:px-8 pb-28">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
            {regularArticles.map((article) => (
              <Link
                key={article.id}
                href={`/actualites/${article.slug}`}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary transition-all"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url(${article.image})` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                  {/* Catégorie badge */}
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-light tracking-wide text-white/90 uppercase">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-8">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-light mb-4">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="text-xl font-light tracking-wide mb-4 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
                    {article.excerpt}
                  </p>

                  <div className="text-primary font-light text-sm group-hover:translate-x-2 transition-transform inline-block">
                    Lire la suite →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="container mx-auto px-6 lg:px-8 pb-28">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-12 md:p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-6">
              Ne manquez aucune actualité
            </h2>
            <p className="text-xl font-light text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Recevez les nouvelles créations, invitations aux performances et articles
              directement dans votre boîte mail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 px-6 py-4 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground font-light focus:outline-none focus:border-primary"
              />
              <button className="px-10 py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-light tracking-wide rounded-lg transition-all whitespace-nowrap">
                S'abonner
              </button>
            </div>
            <p className="text-xs text-muted-foreground font-light mt-6">
              Pas de spam. Désinscription en un clic. ~2 emails par mois maximum.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
