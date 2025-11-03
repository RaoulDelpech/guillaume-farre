import Navigation from "@/components/navigation/Navigation";
import { Link } from "@/i18n/routing";

export default function OriginePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero épuré et élégant */}
      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("/images/origins/childhood-noir-blanc-1.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        <div className="relative z-10 text-center px-6 lg:px-8 max-w-5xl py-32">
          <div className="text-primary text-xs font-light mb-8 tracking-[0.3em] uppercase">
            L'Origine
          </div>
          <h1 className="text-6xl md:text-8xl font-light tracking-wide mb-10 text-foreground leading-tight">
            Tout commence avec<br />
            une petite Ferrari n°20
          </h1>
          <p className="text-2xl md:text-3xl font-light text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            De la chambre d'enfant aux galeries internationales,
            l'histoire d'un rêve devenu art
          </p>
        </div>
      </div>

      {/* Timeline élégante */}
      <section className="container px-6 lg:px-8 py-28 md:py-36">
        <div className="max-w-6xl mx-auto">
          {/* Étape 1 : L'enfance */}
          <div className="mb-32">
            <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-center">
              <div className="order-2 md:order-1">
                <div className="text-xs font-light tracking-[0.2em] uppercase text-primary mb-8">
                  1985 — L'enfance
                </div>
                <h2 className="text-5xl md:text-6xl font-light tracking-wide mb-10">
                  La petite Ferrari n°20
                </h2>
                <div className="space-y-6 text-lg font-light text-muted-foreground leading-relaxed">
                  <p>
                    Guillaume, 6 ans, possède une petite voiture Ferrari miniature portant le numéro 20.
                    Une simple voiture jouet, mais qui allait tout changer.
                  </p>
                  <p>
                    Au lieu de simplement la faire rouler comme les autres enfants, Guillaume a une idée :
                    tremper les roues dans la peinture et laisser des traces sur des feuilles de papier.
                  </p>
                  <blockquote className="border-l-2 border-primary pl-8 italic text-xl my-10 text-foreground">
                    « Cette petite Ferrari n°20 n'était pas qu'un jouet. C'était mon premier pinceau,
                    mon premier outil créateur. »
                  </blockquote>
                  <p>
                    Ces gestes d'enfant contenaient déjà toute la philosophie de son art futur :
                    transformer le mouvement automobile en création artistique.
                  </p>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="bg-card border border-border rounded-lg p-16 md:p-20 text-center">
                  <div className="text-8xl font-light text-primary/20 mb-8">01</div>
                  <div className="text-6xl font-light mb-6 text-primary">n°20</div>
                  <div className="text-muted-foreground font-light text-lg">Ferrari miniature</div>
                </div>
              </div>
            </div>
          </div>

          {/* Séparateur élégant */}
          <div className="flex items-center gap-8 mb-32">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1"></div>
            <div className="text-primary text-xl">·</div>
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1"></div>
          </div>

          {/* Étape 2 : Le rêve grandit */}
          <div className="mb-32">
            <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-center">
              <div>
                <div className="bg-card border border-border rounded-lg p-16 md:p-20 text-center">
                  <div className="text-8xl font-light text-primary/20 mb-8">02</div>
                  <div className="space-y-8">
                    <div className="flex items-center justify-center gap-8">
                      <div className="text-4xl font-light text-muted-foreground">Enfance</div>
                      <div className="text-3xl text-primary">→</div>
                      <div className="text-4xl font-light text-foreground">Aujourd'hui</div>
                    </div>
                    <div className="text-muted-foreground font-light text-lg">
                      Le rêve n'a jamais disparu
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-light tracking-[0.2em] uppercase text-primary mb-8">
                  2015 — La révélation
                </div>
                <h2 className="text-5xl md:text-6xl font-light tracking-wide mb-10">
                  Et si... ?
                </h2>
                <div className="space-y-6 text-lg font-light text-muted-foreground leading-relaxed">
                  <p>
                    Devenu adulte, Guillaume n'a jamais oublié cette petite Ferrari n°20.
                    Le geste est resté, mais l'ambition a grandi.
                  </p>
                  <p className="text-2xl font-light text-foreground my-10">
                    « Et si, au lieu d'une voiture miniature,<br />
                    j'utilisais une vraie Ferrari ? »
                  </p>
                  <p>
                    Cette question simple a donné naissance à un concept artistique unique :
                    les Ferrari Live Performances.
                  </p>
                  <p>
                    Le principe reste le même qu'enfant — faire rouler une Ferrari dans la peinture pour créer des empreintes —
                    mais à l'échelle 1:1, sur des toiles monumentales pouvant atteindre 6 mètres.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Séparateur élégant */}
          <div className="flex items-center gap-8 mb-32">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1"></div>
            <div className="text-primary text-xl">·</div>
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1"></div>
          </div>

          {/* Étape 3 : La réalisation */}
          <div className="mb-32">
            <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-center">
              <div className="order-2 md:order-1">
                <div className="text-xs font-light tracking-[0.2em] uppercase text-primary mb-8">
                  2018 — Première performance
                </div>
                <h2 className="text-5xl md:text-6xl font-light tracking-wide mb-10">
                  Le rêve devient réalité
                </h2>
                <div className="space-y-6 text-lg font-light text-muted-foreground leading-relaxed">
                  <p>
                    La première performance live a lieu en 2018. Une vraie Ferrari, de la vraie peinture,
                    une toile de 4 mètres. Le public est fasciné.
                  </p>
                  <p>
                    Chaque roue qui touche la toile crée une trace unique. Le ronronnement du moteur V12,
                    le crissement des pneus sur la peinture fraîche, la tension du moment...
                  </p>
                  <p className="text-xl font-light text-primary">
                    L'automobile n'est plus seulement un objet. Elle devient artiste.
                  </p>
                  <ul className="space-y-4 mt-10">
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">—</span>
                      <span>Performances devant public</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">—</span>
                      <span>Œuvres strictement uniques</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">—</span>
                      <span>Toiles jusqu'à 6 mètres</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">—</span>
                      <span>Éditions limitées photographiées</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="bg-card border border-border rounded-lg p-16 md:p-20 text-center">
                  <div className="text-8xl font-light text-primary/20 mb-8">03</div>
                  <div className="text-4xl font-light text-primary mb-8">Ferrari Live Performance</div>
                  <div className="text-muted-foreground font-light flex flex-col gap-3">
                    <span>Vraie Ferrari</span>
                    <span className="text-primary">·</span>
                    <span>Vraie peinture</span>
                    <span className="text-primary">·</span>
                    <span>Vraie toile</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Séparateur élégant */}
          <div className="flex items-center gap-8 mb-32">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1"></div>
            <div className="text-primary text-xl">·</div>
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1"></div>
          </div>

          {/* Étape 4 : Aujourd'hui */}
          <div>
            <div className="text-center mb-16">
              <div className="text-xs font-light tracking-[0.2em] uppercase text-primary mb-8">
                2025 — Aujourd'hui
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-16 md:p-20">
              <div className="text-8xl font-light text-primary/20 text-center mb-12">04</div>

              <h2 className="text-5xl md:text-6xl font-light tracking-wide text-center mb-12">
                Une vision devenue réalité
              </h2>

              <div className="grid md:grid-cols-3 gap-12 mb-16 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-6xl font-light text-primary mb-3">47</div>
                  <div className="text-muted-foreground font-light">Collectionneurs</div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-light text-primary mb-3">12</div>
                  <div className="text-muted-foreground font-light">Performances live</div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-light text-primary mb-3">850K€</div>
                  <div className="text-muted-foreground font-light">Valeur totale</div>
                </div>
              </div>

              <div className="space-y-8 max-w-4xl mx-auto text-center text-muted-foreground font-light text-lg leading-relaxed">
                <p>
                  Guillaume Farré continue d'explorer ce concept unique. Performances live lors d'événements automobiles prestigieux,
                  créations monumentales pour collectionneurs, collaborations avec des marques de luxe...
                </p>
                <p className="text-2xl font-light text-foreground">
                  Mais l'essence reste la même que dans la chambre d'enfant :
                  <span className="text-primary"> faire rouler une Ferrari dans la peinture pour créer de l'art</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparaison visuelle */}
      <section className="bg-muted/20 border-y border-border py-28 md:py-36">
        <div className="container px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-light tracking-wide text-center mb-20">
            De la miniature au monumental
          </h2>

          <div className="grid md:grid-cols-2 gap-16 md:gap-20 max-w-5xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-12">
              <div className="text-center mb-10">
                <div className="text-8xl font-light text-primary/20 mb-4">↓</div>
                <h3 className="text-3xl font-light tracking-wide mb-6">Enfance</h3>
              </div>
              <ul className="space-y-4 text-muted-foreground font-light text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">—</span>
                  <span>Ferrari miniature n°20</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">—</span>
                  <span>Feuilles de papier A4</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">—</span>
                  <span>Peinture pour enfants</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">—</span>
                  <span>Chambre d'enfant</span>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-12">
              <div className="text-center mb-10">
                <div className="text-8xl font-light text-primary/20 mb-4">↑</div>
                <h3 className="text-3xl font-light tracking-wide mb-6">Aujourd'hui</h3>
              </div>
              <ul className="space-y-4 text-muted-foreground font-light text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">—</span>
                  <span>Ferrari authentique (échelle 1:1)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">—</span>
                  <span>Toiles jusqu'à 6 mètres</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">—</span>
                  <span>Peintures acryliques professionnelles</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">—</span>
                  <span>Performances live publiques</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-16 text-muted-foreground text-xl font-light">
            Même geste, même passion, échelle différente.
          </div>
        </div>
      </section>

      {/* Citation finale */}
      <section className="container px-6 lg:px-8 py-28 md:py-36">
        <div className="max-w-5xl mx-auto">
          <blockquote className="text-3xl md:text-4xl font-light text-center leading-relaxed text-foreground">
            De la petite Ferrari n°20 aux performances monumentales,
            c'est la même histoire qui continue de s'écrire.
            Une histoire où l'enfance rencontre l'art contemporain,
            où le rêve devient réalité à l'échelle 1:1.
          </blockquote>
          <div className="text-center mt-12 text-muted-foreground text-xl font-light">
            — Guillaume Farré
          </div>
        </div>
      </section>

      {/* CTAs finaux - Sophistiqués */}
      <section className="container px-6 lg:px-8 py-28 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-16 md:p-20 text-center">
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-12">
              Faites partie de l'histoire
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/boutique"
                className="px-12 py-6 bg-amber-600 hover:bg-amber-700 text-white font-light tracking-wide rounded text-xl transition-all"
              >
                Découvrir les œuvres
              </Link>
              <Link
                href="/performances"
                className="px-12 py-6 border border-border hover:border-primary text-foreground hover:text-primary font-light tracking-wide rounded text-xl transition-all"
              >
                Voir les performances
              </Link>
              <Link
                href="/contact"
                className="px-12 py-6 border border-border hover:border-primary text-foreground hover:text-primary font-light tracking-wide rounded text-xl transition-all"
              >
                Contacter l'artiste
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
