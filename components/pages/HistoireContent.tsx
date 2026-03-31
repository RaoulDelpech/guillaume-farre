"use client";

import EditableText from "@/components/admin/EditableText";
import ScrollReveal from "@/components/animations/ScrollReveal";

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
      <ScrollReveal className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <EditableText
            textKey="histoire.hero.title"
            as="h1"
            className="text-3xl sm:text-5xl md:text-7xl font-light tracking-wide mb-4 sm:mb-6"
          >
            L'Histoire
          </EditableText>
          <EditableText
            textKey="histoire.hero.subtitle"
            as="p"
            className="text-base sm:text-xl md:text-2xl text-muted-foreground"
          >
            D'une petite voiture d'enfance à l'art automobile contemporain
          </EditableText>
        </div>
      </ScrollReveal>

      {/* L'origine - La Ferrari n°20 */}
      <ScrollReveal delay={0.1} className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <EditableText
            textKey="histoire.origin.title"
            as="h2"
            className="text-3xl md:text-4xl font-light tracking-wide mb-6"
          >
            Tout commence avec une petite voiture
          </EditableText>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <EditableText
              textKey="histoire.origin.p1"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              Enfant, Guillaume possédait une petite voiture n°20. Une simple voiture miniature, mais qui allait devenir le point de départ d'une démarche artistique unique.
            </EditableText>

            <EditableText
              textKey="histoire.origin.p2"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              Au lieu de simplement la faire rouler comme les autres enfants, Guillaume avait une idée différente : il trempait les roues dans de la peinture, puis la faisait rouler sur des feuilles de papier, créant ainsi des traces, des empreintes uniques.
            </EditableText>

            <div className="p-6 md:p-8 border-l-4 border-primary bg-card/50 rounded-r-lg my-8">
              <EditableText
                textKey="histoire.origin.quote"
                as="p"
                className="text-lg md:text-xl italic mb-4"
                multiline
              >
                « Cette petite voiture n°20 n'était pas qu'un jouet. C'était mon premier outil créateur. Sans le savoir, je posais déjà les bases de tout mon travail futur. »
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
      </ScrollReveal>

      {/* Le passage à l'échelle réelle */}
      <ScrollReveal delay={0.1} className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <EditableText
            textKey="histoire.scale.title"
            as="h2"
            className="text-3xl md:text-4xl font-light tracking-wide mb-6"
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
              Des années plus tard, devenu adulte, Guillaume n'a jamais oublié cette petite voiture n°20. Le rêve d'enfant est resté, mais l'ambition a grandi.
            </EditableText>

            <EditableText
              textKey="histoire.scale.p2"
              as="p"
              className="text-base md:text-lg leading-relaxed font-light text-foreground"
            >
              Et si, au lieu d'une voiture miniature, j'utilisais une vraie Dino ?
            </EditableText>

            <EditableText
              textKey="histoire.scale.p3"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              Cette question simple a donné naissance à un concept artistique unique. Le principe reste le même qu'enfant - faire rouler la Dino dans la peinture pour créer des empreintes - mais à l'échelle 1:1, capturées en photographie.
            </EditableText>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <ScrollReveal delay={0} className="p-6 border rounded-lg bg-card/30">
              <div className="text-4xl mb-3">👶</div>
              <h3 className="text-lg font-light mb-2">Enfance</h3>
              <p className="text-sm text-muted-foreground">
                Ferrari miniature n°20
                <br />Feuilles de papier
                <br />Peinture pour enfants
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1} className="p-6 border rounded-lg bg-card/30">
              <div className="text-4xl mb-3">📸</div>
              <h3 className="text-lg font-light mb-2">Aujourd'hui</h3>
              <p className="text-sm text-muted-foreground">
                Ferrari authentique (échelle 1:1)
                <br />Processus photographié
                <br />Éditions limitées
              </p>
            </ScrollReveal>
          </div>
        </div>
      </ScrollReveal>

      {/* La démarche artistique */}
      <ScrollReveal delay={0.1} className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <EditableText
            textKey="histoire.demarche.title"
            as="h2"
            className="text-3xl md:text-4xl font-light tracking-wide mb-6"
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 my-6 sm:my-8">
              <ScrollReveal delay={0} className="p-6 border rounded-lg bg-card/30">
                <h3 className="text-lg font-light mb-3">L'Automobile</h3>
                <EditableText
                  textKey="histoire.demarche.auto"
                  as="p"
                  className="text-sm text-muted-foreground"
                >
                  Passion des voitures de prestige, culture automobile
                </EditableText>
              </ScrollReveal>

              <ScrollReveal delay={0.1} className="p-6 border rounded-lg bg-card/30">
                <h3 className="text-lg font-light mb-3">L'Art Contemporain</h3>
                <EditableText
                  textKey="histoire.demarche.art"
                  as="p"
                  className="text-sm text-muted-foreground"
                >
                  Action painting, art conceptuel, automobile
                </EditableText>
              </ScrollReveal>

              <ScrollReveal delay={0.2} className="p-6 border rounded-lg bg-card/30">
                <h3 className="text-lg font-light mb-3">La Photographie</h3>
                <EditableText
                  textKey="histoire.demarche.photo"
                  as="p"
                  className="text-sm text-muted-foreground"
                >
                  Capture de l'instant, documentation du processus créatif
                </EditableText>
              </ScrollReveal>
            </div>

            <EditableText
              textKey="histoire.demarche.p1"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              Ses oeuvres ne sont pas de simples « peintures automobiles ». Ce sont des témoignages d'un instant unique, où le mouvement mécanique se transforme en geste artistique, où la puissance du moteur s'exprime en traces sur la toile.
            </EditableText>

            <EditableText
              textKey="histoire.demarche.p2"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              Chaque oeuvre est strictement unique - impossible à reproduire, car elle capture un moment précis : la pression des roues, la trajectoire du véhicule, la viscosité de la peinture à cet instant T, les conditions de cette création.
            </EditableText>
          </div>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal delay={0.1} className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="/galerie"
              className="px-8 sm:px-10 py-4 sm:py-5 border border-foreground/30 hover:border-foreground hover:scale-102 hover:shadow-lg font-light tracking-wide transition-all duration-300 text-center min-h-[48px] flex items-center justify-center"
            >
              Decouvrir les oeuvres
            </a>
          </div>
        </div>
      </ScrollReveal>
    </>
  );
}
