"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import EditableText from "@/components/admin/EditableText";

/**
 * Section "3 salles" de la galerie - Décision audit 2025-01-20
 * 3 grandes images cliquables vers chaque série
 * Scroll vers la galerie quand on clique (pas vers le haut)
 *
 * @author Lalou
 * @date 2025-01-20
 */

interface Salle {
  id: string;
  image: string;
  serie: string;
  description: string;
  textKey: string;
}

interface GalerieSallesProps {
  /** Images configurables depuis data/page-images.json */
  images?: {
    empreintes?: string;
    atelier?: string;
    projections?: string;
  };
}

export default function GalerieSalles({ images }: GalerieSallesProps) {
  const router = useRouter();
  const locale = useLocale();

  // Images avec fallbacks
  const salles: Salle[] = [
    {
      id: "empreintes",
      image: images?.empreintes || "/images/works/empreintes/empreintes-007.jpg",
      serie: "Empreintes",
      description: "Traces directes du passage de la Dino sur la toile.",
      textKey: "gallery.salles.empreintes",
    },
    {
      id: "atelier",
      image: images?.atelier || "/images/works/atelier/atelier-004.jpg",
      serie: "Atelier",
      description: "La Dino au repos, entre deux sessions.",
      textKey: "gallery.salles.atelier",
    },
    {
      id: "projections",
      image: images?.projections || "/images/works/projection/projection-001.jpg",
      serie: "Projections",
      description: "Quand la lumière révèle l'invisible.",
      textKey: "gallery.salles.projections",
    },
  ];

  const handleSerieClick = (serieId: string) => {
    // Scroll vers la section galerie au lieu du haut de page
    const galerieSection = document.getElementById("galerie-grid");
    if (galerieSection) {
      galerieSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // Mise à jour URL avec le filtre (sans reload)
    router.push(`/${locale}/galerie?serie=${serieId}`, { scroll: false });
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-6 lg:px-8">
        {/* Titre section */}
        <div className="text-center mb-12 md:mb-16">
          <EditableText
            textKey="gallery.salles.title"
            as="h2"
            className="text-3xl md:text-4xl font-light tracking-wide mb-4"
          >
            Explorez les séries
          </EditableText>
          <EditableText
            textKey="gallery.salles.subtitle"
            as="p"
            className="text-lg text-muted-foreground font-light"
          >
            Trois univers, une même passion
          </EditableText>
        </div>

        {/* Grille des 3 salles */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {salles.map((salle) => (
            <button
              key={salle.id}
              onClick={() => handleSerieClick(salle.id)}
              className="group relative block overflow-hidden rounded-lg aspect-[3/4] md:aspect-[4/5] text-left"
            >
              {/* Image de fond */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${salle.image})` }}
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Contenu */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <h3 className="text-2xl md:text-3xl font-light tracking-wide mb-2">
                  {salle.serie}
                </h3>
                <EditableText
                  textKey={salle.textKey}
                  as="p"
                  className="text-sm md:text-base text-white/80 font-light leading-relaxed"
                >
                  {salle.description}
                </EditableText>

                {/* Flèche hover */}
                <div className="mt-4 flex items-center text-white/60 group-hover:text-white transition-colors">
                  <span className="text-sm font-light tracking-wide">Découvrir</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
