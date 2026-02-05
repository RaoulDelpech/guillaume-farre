"use client";

import EditableText from "@/components/admin/EditableText";
import { Link } from "@/i18n/routing";

interface OrigineContentProps {
  /** Images configurables depuis data/page-images.json */
  images?: {
    heroBackground?: string;
    childhoodPhoto?: string;
    gallery?: string[];
  };
}

/**
 * Contenu de la page Origine - Version simplifiée
 * Décision audit 2025-01-20 : texte raccourci, plus d'images, émotionnel
 *
 * @author Lalou
 * @date 2025-01-20
 */
export default function OrigineContent({ images }: OrigineContentProps) {
  // Images avec fallbacks
  const heroBackground = images?.heroBackground || "/images/origins/childhood-noir-blanc-1.jpg";
  const childhoodPhoto = images?.childhoodPhoto || "/images/origins/childhood-noir-blanc-1.jpg";
  const galleryImages = images?.gallery || [
    "/images/works/atelier/atelier-004.jpg",
    "/images/works/atelier/atelier-020.jpg",
    "/images/works/empreintes/empreintes-007.jpg",
    "/images/works/atelier/atelier-063.jpg",
    "/images/origins/atelier-deux-voitures-grises.jpg",
    "/images/works/projection/projection-001.jpg"
  ];
  return (
    <>
      {/* Hero épuré */}
      <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url("${heroBackground}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-10 text-center px-6 lg:px-8 max-w-4xl py-32">
          <EditableText
            textKey="origine.hero.title"
            as="h1"
            className="text-5xl md:text-7xl font-light tracking-wide mb-8 text-foreground leading-tight"
          >
            J'avais 4 ans quand j'ai vu ma première voiture de course.
          </EditableText>
          <EditableText
            textKey="origine.hero.subtitle"
            as="p"
            className="text-xl md:text-2xl font-light text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Quarante ans plus tard, j'ai une Dino dans mon atelier.
          </EditableText>
        </div>
      </div>

      {/* Section centrale - L'essentiel */}
      <section className="py-24 md:py-32">
        <div className="container px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Image d'enfance si disponible */}
            <div className="mb-16 aspect-[4/3] bg-muted/30 rounded-lg overflow-hidden">
              <img
                src={childhoodPhoto}
                alt="L'enfance"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>

            <div className="space-y-8 text-lg md:text-xl font-light text-muted-foreground leading-relaxed">
              <EditableText textKey="origine.text1" as="p" multiline>
                Une petite voiture rouge. Des roues trempées dans la peinture. Des traces sur le papier.
              </EditableText>

              <EditableText
                textKey="origine.quote"
                as="blockquote"
                className="text-2xl md:text-3xl font-light text-foreground border-l-2 border-primary pl-8 my-12"
              >
                Elle ne décore pas mon garage. Elle peint.
              </EditableText>

              <EditableText textKey="origine.text2" as="p" multiline>
                Le geste n'a jamais changé. Seule l'échelle a grandi. Les toiles font maintenant plusieurs mètres. La Dino pèse plus d'une tonne. Mais le principe reste identique.
              </EditableText>

              <EditableText
                textKey="origine.essence"
                as="p"
                className="text-xl md:text-2xl text-foreground"
              >
                Tremper. Rouler. Laisser la trace.
              </EditableText>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie d'images */}
      <section className="py-16 md:py-24 bg-muted/10">
        <div className="container px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {galleryImages.map((img, index) => (
              <div key={index} className="aspect-square bg-muted/30 rounded-lg overflow-hidden">
                <img
                  src={img}
                  alt={`Œuvre ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA simple */}
      <section className="py-24 md:py-32">
        <div className="container px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <EditableText
              textKey="origine.cta.title"
              as="h2"
              className="text-3xl md:text-4xl font-light tracking-wide mb-8"
            >
              Découvrez le résultat
            </EditableText>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/galerie"
                className="px-10 py-5 border border-foreground/30 hover:border-foreground text-foreground font-light tracking-wide transition-all group"
              >
                Voir les créations
                <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">
                  →
                </span>
              </Link>
              <Link
                href="/atelier"
                className="px-10 py-5 border border-foreground/30 hover:border-foreground text-foreground font-light tracking-wide transition-all group"
              >
                Visiter l'atelier
                <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
