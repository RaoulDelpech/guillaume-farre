"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import EditableText from "@/components/admin/EditableText";
import { addRipple } from "@/components/ui/RippleButton";

/**
 * Section séries de la galerie - 2 catégories principales + Atelier
 * Architecture 2+1:
 * - 2 cartes séries principales côte à côte (Empreintes + Projection)
 * - 1 section éditoriale Atelier (full width, lien vers /atelier)
 *
 * @author Lalou
 * @date 2025-01-20
 * @updated 2026-03-30 - Restructuration 2+1 avec section atelier éditoriale
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

  // 2 catégories principales (images avec fallbacks)
  const mainCategories: Salle[] = [
    {
      id: "empreintes",
      image: images?.empreintes || "/images/works/empreintes/empreintes-007.jpg",
      serie: "Empreintes",
      description: "Traces directes du passage de la Dino sur la toile.",
      textKey: "gallery.salles.empreintes",
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
      <div className="container px-4 sm:px-6 lg:px-8">
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
            Deux regards sur la création
          </EditableText>
        </div>

        {/* 2 catégories principales - côte à côte */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {mainCategories.map((salle) => (
            <button
              key={salle.id}
              onClick={(e) => {
                addRipple(e);
                handleSerieClick(salle.id);
              }}
              className="group relative block overflow-hidden rounded-lg aspect-[3/4] md:aspect-[2/3] text-left"
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

        {/* Section Atelier - éditoriale, full width */}
        <div className="mt-12 relative overflow-hidden rounded-lg">
          {/* Image de fond */}
          <div
            className="absolute inset-0 bg-cover bg-center h-[300px] md:h-[400px]"
            style={{
              backgroundImage: `url(${images?.atelier || "/images/works/atelier/atelier-004.jpg"})`,
            }}
          />

          {/* Overlay gradient plus sombre pour effet éditorial */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50 h-[300px] md:h-[400px]" />

          {/* Contenu éditorial */}
          <div className="relative z-10 h-[300px] md:h-[400px] flex flex-col justify-center px-8 md:px-16 max-w-2xl text-white">
            <p className="text-xs md:text-sm uppercase tracking-widest text-white/60 mb-2">
              Dans l'atelier
            </p>
            <h3 className="text-3xl md:text-4xl font-light tracking-wide mb-4">
              Le processus de création
            </h3>
            <EditableText
              textKey="gallery.salles.atelier"
              as="p"
              className="text-sm md:text-base text-white/80 font-light leading-relaxed mb-6"
            >
              La Dino au repos, entre deux sessions. Découvrez l'univers où naissent les œuvres,
              entre mécanique et création, dans l'intimité de l'atelier.
            </EditableText>
            <Link
              href="/atelier"
              className="inline-flex items-center text-sm md:text-base font-light tracking-wide transition-colors hover:text-[rgba(196,165,112)]"
              style={{ color: "rgba(196, 165, 112)" }}
            >
              Découvrir l'atelier
              <span className="ml-2 transition-transform hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
