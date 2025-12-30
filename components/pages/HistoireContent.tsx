"use client";

import EditableText from "@/components/admin/EditableText";

/**
 * Contenu de la page Histoire avec textes éditables
 *
 * @author Lalou
 * @date 2025-11-30
 */
export default function HistoireContent() {
  return (
    <>
      {/* Hero */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <EditableText
            textKey="histoire.hero.title"
            as="h1"
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            L'Histoire
          </EditableText>
          <EditableText
            textKey="histoire.hero.subtitle"
            as="p"
            className="text-xl md:text-2xl text-muted-foreground"
          >
            D'une petite voiture d'enfance à l'art automobile contemporain
          </EditableText>
        </div>
      </div>

      {/* L'origine - La Ferrari n°20 */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <EditableText
            textKey="histoire.origin.title"
            as="h2"
            className="text-2xl md:text-3xl font-bold mb-6"
          >
            Tout commence avec une petite Ferrari
          </EditableText>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <EditableText
              textKey="histoire.origin.p1"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              Enfant, Guillaume possédait une petite voiture Ferrari n°20. Une simple voiture miniature, mais qui allait devenir le point de départ d'une démarche artistique unique.
            </EditableText>

            <EditableText
              textKey="histoire.origin.p2"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              Au lieu de simplement la faire rouler comme les autres enfants, Guillaume avait une idée différente : il trempait les roues de sa petite Ferrari dans de la peinture, puis la faisait rouler sur des feuilles de papier, créant ainsi des traces, des empreintes automobiles uniques.
            </EditableText>

            <div className="p-6 md:p-8 border-l-4 border-primary bg-card/50 rounded-r-lg my-8">
              <EditableText
                textKey="histoire.origin.quote"
                as="p"
                className="text-lg md:text-xl italic mb-4"
                multiline
              >
                « Cette petite Ferrari n°20 n'était pas qu'un jouet. C'était mon premier pinceau, mon premier outil créateur. Sans le savoir, je posais déjà les bases de tout mon travail futur. »
              </EditableText>
              <p className="text-sm text-muted-foreground">— Guillaume Farré</p>
            </div>

            <EditableText
              textKey="histoire.origin.p3"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              Ces gestes d'enfant, apparemment anodins, contenaient déjà toute la philosophie de son art futur : transformer le mouvement automobile en création artistique, faire de la voiture un outil créateur plutôt qu'un simple objet.
            </EditableText>
          </div>
        </div>
      </section>

      {/* Le passage à l'échelle réelle */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <EditableText
            textKey="histoire.scale.title"
            as="h2"
            className="text-2xl md:text-3xl font-bold mb-6"
          >
            De la miniature au monumental
          </EditableText>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <EditableText
              textKey="histoire.scale.p1"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              Des années plus tard, devenu adulte, Guillaume n'a jamais oublié cette petite Ferrari n°20. Le rêve d'enfant est resté, mais l'ambition a grandi.
            </EditableText>

            <EditableText
              textKey="histoire.scale.p2"
              as="p"
              className="text-base md:text-lg leading-relaxed font-semibold text-foreground"
            >
              Et si, au lieu d'une voiture miniature, j'utilisais une vraie Ferrari ?
            </EditableText>

            <EditableText
              textKey="histoire.scale.p3"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              Cette question simple a donné naissance à un concept artistique unique. Le principe reste le même qu'enfant - faire rouler une Ferrari dans la peinture pour créer des empreintes - mais à l'échelle 1:1, capturées en photographie.
            </EditableText>
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
              <div className="text-4xl mb-3">📸</div>
              <h3 className="text-lg font-bold mb-2">Aujourd'hui</h3>
              <p className="text-sm text-muted-foreground">
                Ferrari authentique (échelle 1:1)
                <br />Processus photographié
                <br />Éditions limitées
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* La démarche artistique */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <EditableText
            textKey="histoire.demarche.title"
            as="h2"
            className="text-2xl md:text-3xl font-bold mb-6"
          >
            Une démarche artistique unique
          </EditableText>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <EditableText
              textKey="histoire.demarche.intro"
              as="p"
              className="text-base md:text-lg leading-relaxed"
            >
              Le travail de Guillaume Farré se situe à la croisée de plusieurs univers :
            </EditableText>

            <div className="grid md:grid-cols-3 gap-6 my-8">
              <div className="p-6 border rounded-lg bg-card/30">
                <h3 className="text-lg font-bold mb-3">L'Automobile</h3>
                <EditableText
                  textKey="histoire.demarche.auto"
                  as="p"
                  className="text-sm text-muted-foreground"
                >
                  Passion des voitures de prestige, héritage Ferrari, culture automobile
                </EditableText>
              </div>

              <div className="p-6 border rounded-lg bg-card/30">
                <h3 className="text-lg font-bold mb-3">L'Art Contemporain</h3>
                <EditableText
                  textKey="histoire.demarche.art"
                  as="p"
                  className="text-sm text-muted-foreground"
                >
                  Action painting, art conceptuel, automobile
                </EditableText>
              </div>

              <div className="p-6 border rounded-lg bg-card/30">
                <h3 className="text-lg font-bold mb-3">La Photographie</h3>
                <EditableText
                  textKey="histoire.demarche.photo"
                  as="p"
                  className="text-sm text-muted-foreground"
                >
                  Capture de l'instant, documentation du processus créatif
                </EditableText>
              </div>
            </div>

            <EditableText
              textKey="histoire.demarche.p1"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              Ses œuvres ne sont pas de simples « peintures automobiles ». Ce sont des témoignages d'un instant unique, où une Ferrari devient pinceau géant, où le mouvement mécanique se transforme en geste artistique, où la puissance du moteur V12 s'exprime en traces de peinture sur la toile.
            </EditableText>

            <EditableText
              textKey="histoire.demarche.p2"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              Chaque œuvre est strictement unique - impossible à reproduire, car elle capture un moment précis : la pression des roues, la trajectoire du véhicule, la viscosité de la peinture à cet instant T, les conditions de cette création.
            </EditableText>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/galerie"
              className="px-6 py-3 border rounded-md font-bold hover:border-primary transition-colors text-center"
            >
              Découvrir les œuvres
            </a>
            <a
              href="/boutique"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-bold hover:bg-primary/90 transition-colors text-center"
            >
              Acquérir une œuvre
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
