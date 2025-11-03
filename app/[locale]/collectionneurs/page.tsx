import Navigation from "@/components/navigation/Navigation";
import { Link } from "@/i18n/routing";

export default function CollectionneursPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero élégant */}
      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-background"></div>
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'url("/photos/empreintes/empreinte-01.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        <div className="relative z-10 text-center px-6 lg:px-8 max-w-5xl py-28">
          <div className="text-primary text-xs font-light mb-8 tracking-[0.3em] uppercase">
            Communauté
          </div>
          <h1 className="text-6xl md:text-8xl font-light tracking-wide mb-10">
            Collectionneurs
          </h1>
          <p className="text-2xl md:text-3xl font-light text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Rejoignez ceux qui possèdent une trace.
            Accès prioritaire. Expériences uniques.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/contact"
              className="px-12 py-6 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-xl transition-all"
            >
              Nous contacter
            </Link>
            <Link
              href="/boutique"
              className="px-12 py-6 border border-border hover:border-primary text-foreground hover:text-primary font-light tracking-wide rounded-lg text-xl transition-all"
            >
              Voir les œuvres
            </Link>
          </div>
        </div>
      </div>

      {/* Avantages pour les collectionneurs */}
      <section className="container px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-light tracking-wide mb-8">
            Avantages collectionneurs
          </h2>
          <p className="text-xl md:text-2xl font-light text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Bien plus qu'un simple achat, c'est une entrée dans une communauté
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-10">
            <h3 className="text-2xl font-light tracking-wide mb-6">Accès prioritaire</h3>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">—</span>
                <span>Accès anticipé aux nouvelles créations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">—</span>
                <span>Réservation prioritaire pour les performances</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">—</span>
                <span>Information sur les éditions limitées</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-2xl p-10">
            <h3 className="text-2xl font-light tracking-wide mb-6">Accompagnement</h3>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">—</span>
                <span>Conseil personnalisé pour votre collection</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">—</span>
                <span>Certificat d'authenticité inclus</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">—</span>
                <span>Suivi de la valeur de vos œuvres</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-2xl p-10">
            <h3 className="text-2xl font-light tracking-wide mb-6">Expériences</h3>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">—</span>
                <span>Invitations aux vernissages privés</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">—</span>
                <span>Rencontres avec l'artiste</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">—</span>
                <span>Visites de l'atelier</span>
              </li>
            </ul>
          </div>
        </div>
      </section>


      {/* Témoignages */}
      <section className="bg-muted/20 border-y border-border py-20 md:py-28">
        <div className="container px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-6">
              Témoignages de collectionneurs
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center text-lg font-light text-muted-foreground">
                  AL
                </div>
                <div>
                  <div className="font-light tracking-wide text-lg">Antoine L.</div>
                  <div className="text-sm text-muted-foreground font-light">Collectionneur, Genève</div>
                </div>
              </div>
              <p className="text-foreground/80 text-base leading-relaxed font-light">
                "Une œuvre qui ne cesse de m'émerveiller. Chaque détail raconte
                l'intensité du moment de la création. Un véritable coup de cœur."
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center text-lg font-light text-muted-foreground">
                  SM
                </div>
                <div>
                  <div className="font-light tracking-wide text-lg">Sophie M.</div>
                  <div className="text-sm text-muted-foreground font-light">Galeriste, Monaco</div>
                </div>
              </div>
              <p className="text-foreground/80 text-base leading-relaxed font-light">
                "Un concept totalement inédit. Mes clients sont fascinés
                par cette fusion entre art contemporain et culture automobile."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services inclus */}
      <section className="container px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-6">
            Nos garanties
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-8 bg-card border border-border rounded-xl">
            <h3 className="font-light tracking-wide text-lg mb-3">Authenticité</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">Certificat d'authenticité et traçabilité</p>
          </div>

          <div className="text-center p-8 bg-card border border-border rounded-xl">
            <h3 className="font-light tracking-wide text-lg mb-3">Valorisation</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">Suivi de la valeur de votre collection</p>
          </div>

          <div className="text-center p-8 bg-card border border-border rounded-xl">
            <h3 className="font-light tracking-wide text-lg mb-3">Livraison</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">Installation et assurance incluses</p>
          </div>

          <div className="text-center p-8 bg-card border border-border rounded-xl">
            <h3 className="font-light tracking-wide text-lg mb-3">Protection</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">Rachat possible à valeur de marché</p>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-muted/20 border-t border-border py-20 md:py-28">
        <div className="container px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-8">
              Rejoignez la communauté
            </h2>
            <p className="text-xl md:text-2xl font-light text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Découvrez les œuvres disponibles et profitez des avantages collectionneurs.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
              <Link
                href="/boutique"
                className="px-12 py-6 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-xl transition-all"
              >
                Voir les œuvres disponibles
              </Link>
              <Link
                href="/contact"
                className="px-12 py-6 border border-border hover:border-primary text-foreground hover:text-primary font-light tracking-wide rounded-lg text-xl transition-all"
              >
                Nous contacter
              </Link>
            </div>

            <div className="text-sm text-muted-foreground font-light">
              47 collectionneurs font déjà partie de la communauté
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
