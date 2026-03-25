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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <EditableText
            textKey="atelier.hero.title"
            as="h1"
            className="text-3xl sm:text-5xl md:text-7xl font-light tracking-wide mb-4 sm:mb-6"
          >
            L'Atelier
          </EditableText>
          <EditableText
            textKey="atelier.hero.subtitle"
            as="p"
            className="text-base sm:text-xl md:text-2xl text-muted-foreground"
          >
            La Dino. 1020 kilos d'instrument de création.
          </EditableText>
        </div>
      </div>

      {/* Introduction */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 md:py-20 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6 text-muted-foreground">
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
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 md:py-20 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <EditableText
            textKey="atelier.ferrari.title"
            as="h2"
            className="text-2xl md:text-3xl font-light tracking-wide mb-6"
          >
            Ma Dino
          </EditableText>

          <div className="space-y-6 text-muted-foreground">
            <EditableText
              textKey="atelier.ferrari.p1"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              Ma Dino a sa personnalité, sa façon de répondre aux sollicitations, sa manière unique de déposer la peinture sur la toile.
            </EditableText>


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
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 md:py-20 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <EditableText
            textKey="atelier.espace.title"
            as="h2"
            className="text-2xl md:text-3xl font-light tracking-wide mb-6"
          >
            L'espace de création
          </EditableText>

          <div className="space-y-6 text-muted-foreground">
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
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 md:py-20 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <EditableText
            textKey="atelier.processus.title"
            as="h2"
            className="text-2xl md:text-3xl font-light tracking-wide mb-6"
          >
            Le processus créatif
          </EditableText>

          <div className="space-y-6 text-muted-foreground">
            <EditableText
              textKey="atelier.processus.p1"
              as="p"
              className="text-base md:text-lg leading-relaxed"
              multiline
            >
              Chaque session commence par la préparation de la toile et de la peinture industrielle. Je choisis les couleurs en fonction de l'émotion que je veux capturer. Ensuite, la Dino entre en scène.
            </EditableText>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
              <div className="p-4 border rounded-lg bg-card/30 text-center">
                <div className="text-xl font-light mb-2">1</div>
                <h4 className="font-light mb-1">Préparation</h4>
                <p className="text-xs text-muted-foreground">Toile, peinture, trajectoire</p>
              </div>
              <div className="p-4 border rounded-lg bg-card/30 text-center">
                <div className="text-xl font-light mb-2">2</div>
                <h4 className="font-light mb-1">Action</h4>
                <p className="text-xs text-muted-foreground">La Dino en mouvement</p>
              </div>
              <div className="p-4 border rounded-lg bg-card/30 text-center">
                <div className="text-xl font-light mb-2">3</div>
                <h4 className="font-light mb-1">Capture</h4>
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

      {/* Galerie photos de l'atelier */}
      <section className="py-8 sm:py-16 md:py-24 bg-muted/10 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <EditableText
              textKey="atelier.galerie.title"
              as="h2"
              className="text-2xl md:text-3xl font-light tracking-wide mb-4"
            >
              L'atelier en images
            </EditableText>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              "/images/works/atelier/atelier-063.jpg",
              "/images/works/atelier/atelier-004.jpg",
              "/images/works/atelier/atelier-020.jpg",
              "/images/works/atelier/atelier-030.jpg",
              "/images/works/atelier/atelier-010.jpg",
              "/images/works/atelier/atelier-001.jpg",
            ].map((img, index) => (
              <div key={index} className="aspect-square bg-muted/30 rounded-lg overflow-hidden">
                <img
                  src={img}
                  alt={`L'atelier ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Visiter l'atelier - Décision audit 2025-01-20 */}
      <section className="py-12 sm:py-24 md:py-32 bg-muted/10 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <EditableText
              textKey="atelier.visite.title"
              as="h2"
              className="text-3xl md:text-4xl font-light tracking-wide mb-6"
            >
              Visiter l'atelier
            </EditableText>

            <EditableText
              textKey="atelier.visite.description"
              as="p"
              className="text-lg text-muted-foreground font-light leading-relaxed mb-4"
              multiline
            >
              L'atelier se visite sur rendez-vous uniquement. Venez découvrir la Dino, les toiles en cours, et l'espace où naissent les œuvres.
            </EditableText>

            <EditableText
              textKey="atelier.visite.location"
              as="p"
              className="text-base text-muted-foreground/80 font-light mb-10"
            >
              Toulouse, France
            </EditableText>

            <a
              href="/contact?sujet=visite"
              className="inline-block px-8 sm:px-10 py-4 sm:py-5 border border-foreground/30 hover:border-foreground text-foreground font-light tracking-wide transition-all group min-h-[48px]"
            >
              <EditableText textKey="atelier.visite.cta" as="span">
                Prendre rendez-vous
              </EditableText>
              <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/galerie"
              className="px-8 sm:px-10 py-4 sm:py-5 border border-foreground/30 hover:border-foreground text-foreground font-light tracking-wide transition-all text-center group min-h-[48px] flex items-center justify-center"
            >
              Voir les créations
              <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
            </a>
            <a
              href="/contact"
              className="px-8 sm:px-10 py-4 sm:py-5 border border-foreground/30 hover:border-foreground text-foreground font-light tracking-wide transition-all text-center group min-h-[48px] flex items-center justify-center"
            >
              Contacter Guillaume
              <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
