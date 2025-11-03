import Navigation from "@/components/navigation/Navigation";

export default function HistoirePage() {
  return (
    <main>
      <Navigation />

      {/* Hero */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">L&apos;Histoire</h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            D'une petite voiture d'enfance à l'art automobile contemporain
          </p>
        </div>
      </div>

      {/* L'origine - La Ferrari n°20 */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">🏎️ Tout commence avec une petite Ferrari</h2>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-base md:text-lg leading-relaxed">
              Enfant, Guillaume possédait une petite voiture Ferrari n°20. Une simple voiture miniature,
              mais qui allait devenir le point de départ d'une démarche artistique unique.
            </p>

            <p className="text-base md:text-lg leading-relaxed">
              Au lieu de simplement la faire rouler comme les autres enfants, Guillaume avait une idée différente :
              il trempait les roues de sa petite Ferrari dans de la peinture, puis la faisait rouler sur des feuilles de papier,
              créant ainsi des traces, des empreintes automobiles uniques.
            </p>

            <div className="p-6 md:p-8 border-l-4 border-primary bg-card/50 rounded-r-lg my-8">
              <p className="text-lg md:text-xl italic mb-4">
                « Cette petite Ferrari n°20 n'était pas qu'un jouet. C'était mon premier pinceau,
                mon premier outil créateur. Sans le savoir, je posais déjà les bases de tout mon travail futur. »
              </p>
              <p className="text-sm text-muted-foreground">— Guillaume Farré</p>
            </div>

            <p className="text-base md:text-lg leading-relaxed">
              Ces gestes d'enfant, apparemment anodins, contenaient déjà toute la philosophie de son art futur :
              transformer le mouvement automobile en création artistique, faire de la voiture un outil créateur plutôt qu'un simple objet.
            </p>
          </div>
        </div>
      </section>

      {/* Le passage à l'échelle réelle */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">🎨 De la miniature au monumental</h2>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-base md:text-lg leading-relaxed">
              Des années plus tard, devenu adulte, Guillaume n'a jamais oublié cette petite Ferrari n°20.
              Le rêve d'enfant est resté, mais l'ambition a grandi.
            </p>

            <p className="text-base md:text-lg leading-relaxed">
              <strong className="text-foreground">Et si, au lieu d'une voiture miniature, j'utilisais une vraie Ferrari ?</strong>
            </p>

            <p className="text-base md:text-lg leading-relaxed">
              Cette question simple a donné naissance à un concept artistique unique : les <strong className="text-foreground">Ferrari Live Performances</strong>.
              Le principe reste le même qu'enfant - faire rouler une Ferrari dans la peinture pour créer des empreintes -
              mais à l'échelle 1:1, sur des toiles monumentales pouvant atteindre plusieurs mètres.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 border rounded-lg bg-card/30">
              <div className="text-4xl mb-3">👶</div>
              <h3 className="text-lg font-bold mb-2">Enfance</h3>
              <p className="text-sm text-muted-foreground">
                Ferrari miniature n°20
                <br />Feuilles de papier
                <br />Peinture pour enfants
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-card/30">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="text-lg font-bold mb-2">Aujourd'hui</h3>
              <p className="text-sm text-muted-foreground">
                Ferrari authentique (échelle 1:1)
                <br />Toiles monumentales (jusqu'à 6 mètres)
                <br />Peintures acryliques professionnelles
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* La démarche artistique */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">✨ Une démarche artistique unique</h2>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-base md:text-lg leading-relaxed">
              Le travail de Guillaume Farré se situe à la croisée de plusieurs univers :
            </p>

            <div className="grid md:grid-cols-3 gap-6 my-8">
              <div className="p-6 border rounded-lg bg-card/30">
                <h3 className="text-lg font-bold mb-3">🏎️ L'Automobile</h3>
                <p className="text-sm text-muted-foreground">
                  Passion des voitures de prestige, héritage Ferrari, culture automobile
                </p>
              </div>

              <div className="p-6 border rounded-lg bg-card/30">
                <h3 className="text-lg font-bold mb-3">🎨 L'Art Contemporain</h3>
                <p className="text-sm text-muted-foreground">
                  Performance live, action painting, art conceptuel
                </p>
              </div>

              <div className="p-6 border rounded-lg bg-card/30">
                <h3 className="text-lg font-bold mb-3">📸 La Photographie</h3>
                <p className="text-sm text-muted-foreground">
                  Capture de l'instant, documentation du processus créatif
                </p>
              </div>
            </div>

            <p className="text-base md:text-lg leading-relaxed">
              Ses œuvres ne sont pas de simples « peintures automobiles ». Ce sont des <strong className="text-foreground">témoignages d'un instant unique</strong>,
              où une Ferrari devient pinceau géant, où le mouvement mécanique se transforme en geste artistique,
              où la puissance du moteur V12 s'exprime en traces de peinture sur la toile.
            </p>

            <p className="text-base md:text-lg leading-relaxed">
              Chaque œuvre est <strong className="text-foreground">strictement unique</strong> - impossible à reproduire,
              car elle capture un moment précis : la pression des roues, la trajectoire du véhicule,
              la viscosité de la peinture à cet instant T, les conditions de cette performance-là.
            </p>
          </div>
        </div>
      </section>

      {/* Les séries */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">📚 Les Séries</h2>

          <div className="space-y-6">
            <div className="p-6 md:p-8 border-l-4 border-primary rounded-r-lg bg-card/30">
              <h3 className="text-xl font-bold mb-3">L'Atelier - Ferrari Créatrices</h3>
              <p className="text-muted-foreground mb-4">
                Série documentant le processus créatif : la Ferrari en action, les traces qui se forment,
                l'énergie de la performance live. Ces photographies capturent le moment où l'automobile devient artiste.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Tirages disponibles jusqu'à 3 mètres
              </p>
            </div>

            <div className="p-6 md:p-8 border-l-4 border-primary rounded-r-lg bg-card/30">
              <h3 className="text-xl font-bold mb-3">Empreintes - Traces Automobiles</h3>
              <p className="text-muted-foreground mb-4">
                Les œuvres finales : traces laissées par la Ferrari sur la toile. Chaque empreinte est unique,
                témoignage direct du passage du véhicule, captant la puissance et le mouvement dans la matière picturale.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Pièces uniques et éditions très limitées
              </p>
            </div>

            <div className="p-6 md:p-8 border-l-4 border-primary rounded-r-lg bg-card/30">
              <h3 className="text-xl font-bold mb-3">Projection - L'Instant Capturé</h3>
              <p className="text-muted-foreground mb-4">
                Photographies d'art documentant les performances, les installations, les moments clés.
                Vision d'ensemble de la démarche artistique, du rêve d'enfant devenu réalité monumentale.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Éditions limitées numérotées
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* L'héritage Ferrari */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">🏁 L'Héritage Ferrari</h2>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-base md:text-lg leading-relaxed">
              Le choix de Ferrari n'est pas anodin. C'est un <strong className="text-foreground">hommage direct à cette petite voiture n°20</strong> qui
              a tout déclenché. Mais c'est aussi une rencontre avec une philosophie.
            </p>

            <p className="text-base md:text-lg leading-relaxed">
              Ferrari, ce n'est pas qu'une marque automobile. C'est une vision : celle d'Enzo Ferrari qui voyait
              ses voitures comme des <strong className="text-foreground">œuvres d'art roulantes</strong>. Des sculptures en mouvement.
              Des objets où la performance technique et la beauté formelle ne font qu'un.
            </p>

            <p className="text-base md:text-lg leading-relaxed">
              Guillaume prolonge cette vision : <strong className="text-foreground">si la Ferrari est déjà une œuvre d'art,
              pourquoi ne pas en faire aussi un outil créateur ?</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Aujourd'hui */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">🌟 Aujourd'hui</h2>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-base md:text-lg leading-relaxed">
              Guillaume Farré continue d'explorer ce concept unique. Performances live lors d'événements automobiles prestigieux,
              créations monumentales pour collectionneurs, collaborations avec des marques de luxe...
            </p>

            <p className="text-base md:text-lg leading-relaxed">
              Mais l'essence reste la même que dans la chambre d'enfant : <strong className="text-foreground">faire rouler une Ferrari
              dans la peinture pour créer de l'art</strong>.
            </p>

            <div className="p-6 md:p-8 border rounded-lg bg-primary/10 my-8">
              <p className="text-lg font-semibold mb-4">
                De la petite Ferrari n°20 aux performances monumentales, c'est la même histoire qui continue de s'écrire.
              </p>
              <p className="text-sm text-muted-foreground">
                Une histoire où l'enfance rencontre l'art contemporain, où le rêve devient réalité à l'échelle 1:1.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/galerie"
              className="px-6 py-3 border rounded-md font-bold hover:border-primary transition-colors text-center"
            >
              Découvrir les œuvres
            </a>
            <a
              href="/concept-car-art"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-bold hover:bg-primary/90 transition-colors text-center"
            >
              Ferrari Live Performance
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
