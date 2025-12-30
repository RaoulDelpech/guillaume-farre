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
            Tout a commencé avec<br />
            une petite Ferrari n°20
          </h1>
          <p className="text-2xl md:text-3xl font-light text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            De ma chambre d'enfant à aujourd'hui.<br />
            L'histoire d'un rêve devenu réalité.
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
                    J'avais 6 ans. Une petite Ferrari n°20. Rouge, bien sûr.
                  </p>
                  <p>
                    Je ne voulais pas la faire rouler comme les autres. Trop simple.
                    J'ai trempé les roues dans la peinture. Les traces sur le papier...
                    c'était autre chose. Quelque chose de différent.
                  </p>
                  <blockquote className="border-l-2 border-primary pl-8 italic text-xl my-10 text-foreground">
                    « Cette Ferrari n°20 n'était pas un jouet.
                    C'était mon premier pinceau. »
                  </blockquote>
                  <p>
                    Ces gestes d'enfant contenaient déjà tout. Le mouvement qui devient création.
                    L'automobile qui se transforme en art. C'était là, depuis le début.
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
                    Des années ont passé. La Ferrari n°20 est toujours là, quelque part.
                    Le geste, lui, n'a jamais disparu. Il a juste grandi.
                  </p>
                  <p className="text-2xl font-light text-foreground my-10">
                    « Et si j'utilisais une vraie Ferrari ? »
                  </p>
                  <p>
                    Cette question a tout changé. Le même geste, mais à l'échelle 1:1.
                    Les toiles font 6 mètres. La Ferrari pèse des tonnes.
                    Le moteur rugit. Mais le principe reste identique.
                  </p>
                  <p>
                    Tremper les roues. Rouler. Laisser la trace.
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
                  2018 — Première création
                </div>
                <h2 className="text-5xl md:text-6xl font-light tracking-wide mb-10">
                  Le rêve devient réalité
                </h2>
                <div className="space-y-6 text-lg font-light text-muted-foreground leading-relaxed">
                  <p>
                    2018. La première fois devant public.
                    Une vraie Ferrari. 4 mètres de toile. La peinture fraîche qui attend.
                  </p>
                  <p>
                    Les roues touchent la toile. La trace apparaît. Unique. Irréversible.
                    Le moteur rugit. Les pneus glissent sur la matière.
                  </p>
                  <p className="text-xl font-light text-primary">
                    La Ferrari n'est plus un objet. Elle devient l'artiste.
                  </p>
                  <ul className="space-y-4 mt-10">
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">—</span>
                      <span>Action painting automobile</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">—</span>
                      <span>Œuvre unique</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">—</span>
                      <span>Toile monumentale</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">—</span>
                      <span>Instant capturé en photographie</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="bg-card border border-border rounded-lg p-16 md:p-20 text-center">
                  <div className="text-8xl font-light text-primary/20 mb-8">03</div>
                  <div className="text-4xl font-light text-primary mb-8">Le processus créatif</div>
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

              <div className="space-y-8 max-w-4xl mx-auto text-center text-muted-foreground font-light text-lg leading-relaxed">
                <p>
                  Je continue. Photographies. Événements automobiles. Collaborations.
                  Le concept évolue mais reste le même.
                </p>
                <p className="text-2xl font-light text-foreground">
                  L'essence n'a pas changé depuis la chambre d'enfant.
                  <span className="text-primary"> Une Ferrari. De la peinture. Une trace.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Citation finale */}
      <section className="container px-6 lg:px-8 py-28 md:py-36">
        <div className="max-w-5xl mx-auto">
          <blockquote className="text-3xl md:text-4xl font-light text-center leading-relaxed text-foreground">
            De la Ferrari n°20 à aujourd'hui.
            La même histoire. Le même geste.
            L'enfance qui rencontre l'art.
          </blockquote>
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
                className="px-12 py-6 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded text-xl transition-all"
              >
                Découvrir les œuvres
              </Link>
              <Link
                href="/galerie"
                className="px-12 py-6 border border-border hover:border-primary text-foreground hover:text-primary font-light tracking-wide rounded text-xl transition-all"
              >
                Voir la galerie
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
