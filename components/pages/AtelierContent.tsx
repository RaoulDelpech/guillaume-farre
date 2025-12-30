"use client";

import EditableText from "@/components/admin/EditableText";
import Image from "next/image";

/**
 * Contenu de la page Atelier avec textes éditables
 *
 * @author Lalou
 * @date 2025-12-29
 */
export default function AtelierContent() {
  return (
    <>
      {/* Hero */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <EditableText
            textKey="atelier.hero.title"
            as="h1"
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            L'Atelier
          </EditableText>
          <EditableText
            textKey="atelier.hero.subtitle"
            as="p"
            className="text-xl md:text-2xl text-muted-foreground"
          >
            Quatre Ferrari. Des outils de 1200 kilos.
          </EditableText>
        </div>
      </div>

      {/* Introduction */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <EditableText
              textKey="atelier.intro.p1"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              Dans mon atelier, ces voitures sont des instruments. 1200 kilos de métal qui laissent des empreintes sur la toile. Une accélération brusque, un freinage violent, un dérapage calculé : aucune main ne pourrait reproduire ces gestes.
            </EditableText>

            <EditableText
              textKey="atelier.intro.p2"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              C'est précisément ce que je cherche. L'intervention de la machine dans le processus créatif, là où l'humain atteint ses limites.
            </EditableText>
          </div>
        </div>
      </section>

      {/* Les Ferrari */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <EditableText
            textKey="atelier.ferrari.title"
            as="h2"
            className="text-2xl md:text-3xl font-bold mb-6"
          >
            Mes quatre Ferrari
          </EditableText>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <EditableText
              textKey="atelier.ferrari.p1"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              Je possède quatre Dino : une noire, deux grises, une rouge. Chacune a sa personnalité, sa façon de répondre aux sollicitations, sa manière unique de déposer la peinture sur la toile.
            </EditableText>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="p-6 border rounded-lg bg-card/30">
                <div className="text-4xl mb-3">⚫</div>
                <h3 className="text-lg font-bold mb-2">La Noire</h3>
                <EditableText
                  textKey="atelier.ferrari.noire"
                  as="p"
                  className="text-sm text-muted-foreground"
                >
                  Élégante et discrète, elle produit des traces fines et précises.
                </EditableText>
              </div>

              <div className="p-6 border rounded-lg bg-card/30">
                <div className="text-4xl mb-3">⚪</div>
                <h3 className="text-lg font-bold mb-2">Les Grises</h3>
                <EditableText
                  textKey="atelier.ferrari.grises"
                  as="p"
                  className="text-sm text-muted-foreground"
                >
                  Polyvalentes, elles s'adaptent à tous les types de créations.
                </EditableText>
              </div>
            </div>

            <EditableText
              textKey="atelier.ferrari.p2"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              La Dino n'a jamais porté le badge Ferrari. Enzo l'avait dédiée à son fils Alfredo, décédé prématurément. C'est une voiture à part, entre hommage filial et chef-d'œuvre d'ingénierie.
            </EditableText>
          </div>
        </div>
      </section>

      {/* L'espace de création */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <EditableText
            textKey="atelier.espace.title"
            as="h2"
            className="text-2xl md:text-3xl font-bold mb-6"
          >
            L'espace de création
          </EditableText>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <EditableText
              textKey="atelier.espace.p1"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              Mon atelier n'est pas un garage. C'est un studio où cohabitent l'odeur de l'huile moteur et celle de la peinture fraîche. Les murs gardent les traces des sessions précédentes, comme une mémoire visuelle de chaque création.
            </EditableText>

            <div className="p-6 md:p-8 border-l-4 border-primary bg-card/50 rounded-r-lg my-8">
              <EditableText
                textKey="atelier.espace.quote"
                as="p"
                className="text-lg md:text-xl italic mb-4"
                multiline
              >
                « Ici, le temps s'arrête. Il n'y a que la voiture, la toile, et l'instant où tout se joue. »
              </EditableText>
              <p className="text-sm text-muted-foreground">— Guillaume Farré</p>
            </div>

            <EditableText
              textKey="atelier.espace.p2"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              Les sièges d'époque sont présents, témoins silencieux de l'histoire de ces machines. Chaque élément a sa place, chaque outil attend son moment.
            </EditableText>
          </div>
        </div>
      </section>

      {/* Le processus */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <EditableText
            textKey="atelier.processus.title"
            as="h2"
            className="text-2xl md:text-3xl font-bold mb-6"
          >
            Le processus créatif
          </EditableText>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <EditableText
              textKey="atelier.processus.p1"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              Chaque session commence par la préparation de la toile et de la peinture industrielle. Je choisis les couleurs en fonction de l'émotion que je veux capturer. Ensuite, la Dino entre en scène.
            </EditableText>

            <div className="grid md:grid-cols-3 gap-4 my-8">
              <div className="p-4 border rounded-lg bg-card/30 text-center">
                <div className="text-3xl mb-2">1</div>
                <h4 className="font-bold mb-1">Préparation</h4>
                <p className="text-xs text-muted-foreground">Toile, peinture, trajectoire</p>
              </div>
              <div className="p-4 border rounded-lg bg-card/30 text-center">
                <div className="text-3xl mb-2">2</div>
                <h4 className="font-bold mb-1">Action</h4>
                <p className="text-xs text-muted-foreground">La Dino en mouvement</p>
              </div>
              <div className="p-4 border rounded-lg bg-card/30 text-center">
                <div className="text-3xl mb-2">3</div>
                <h4 className="font-bold mb-1">Capture</h4>
                <p className="text-xs text-muted-foreground">Photographie de l'instant</p>
              </div>
            </div>

            <EditableText
              textKey="atelier.processus.p2"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              Le résultat est toujours une surprise. Je contrôle les paramètres, mais la voiture a le dernier mot. C'est cette tension entre maîtrise et lâcher-prise qui donne à chaque œuvre son caractère unique.
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
              Voir les œuvres
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
