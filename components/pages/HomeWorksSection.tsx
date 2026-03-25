"use client";

import EditableText from "@/components/admin/EditableText";
import { Link } from "@/i18n/routing";
import { MotionSection, MotionItem } from "@/components/motion/MotionWrapper";

interface Work {
  slug: string;
  title: string;
  year: number;
  type: string;
  images: string[];
  categories?: string[];
  edition?: { type: string };
  limitedEdition?: { available: number; total: number };
}

interface HomeWorksSectionProps {
  works: Work[];
}

/**
 * Section Dernières œuvres sur la Homepage avec textes éditables
 *
 * @author Lalou
 * @date 2025-12-29
 */
export default function HomeWorksSection({ works }: HomeWorksSectionProps) {
  return (
    <section className="container py-20 md:py-28 border-t px-6 lg:px-8">
      <MotionSection variant="fadeInUp" className="mb-16 text-center">
        <EditableText
          textKey="home.works.title"
          as="h2"
          className="text-3xl md:text-4xl font-light tracking-wide mb-4 text-foreground"
        >
          Dernières œuvres
        </EditableText>
        <EditableText
          textKey="home.works.subtitle"
          as="p"
          className="text-lg text-muted-foreground font-light"
        >
          Toiles. Photographies. Empreintes irréversibles.
        </EditableText>
      </MotionSection>

      {/* Grille 9 oeuvres - Decision audit 2025-01-20 */}
      <MotionSection variant="fadeInUp" stagger={true} className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-10">
        {works.slice(0, 9).map((work) => {
          // VRAIES DONNÉES séries limitées (pas simulées)
          const isLimitedEdition = work.categories?.includes("limited") || work.edition?.type === "limited";
          const available = work.limitedEdition?.available || 0;
          const total = work.limitedEdition?.total || 7;
          const isSold = available === 0;
          const isLastOne = available === 1;

          return (
            <MotionItem key={work.slug} variant="scaleIn">
              <Link
                href={`/galerie-item/${work.slug}`}
                className="group block overflow-hidden border border-border hover:border-foreground/50 hover:scale-102 hover:shadow-xl transition-all duration-300 relative"
              >
              {/* Badge discret édition limitée */}
              {isLimitedEdition && !isSold && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white/80 text-xs font-light tracking-wide">
                    {total - available}/{total}
                  </span>
                </div>
              )}
              {isSold && (
                <div className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center">
                  <span className="text-white/60 text-sm font-light tracking-widest">VENDU</span>
                </div>
              )}

              {work.images[0] && (
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={work.images[0]}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-3 sm:p-4 md:p-6 bg-card">
                <h3 className="text-sm sm:text-base md:text-lg font-light tracking-wide mb-1 sm:mb-2 truncate">{work.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-light">
                  {work.year} • {work.type === "photo" ? "Photographie" : "Toile"}
                </p>
              </div>
              </Link>
            </MotionItem>
          );
        })}
      </MotionSection>

      {/* CTA - Décision audit 2025-01-20 */}
      <MotionSection variant="fadeInUp" delay={0.2} className="mt-16 text-center">
        <Link
          href="/galerie"
          className="inline-block px-10 py-5 border border-foreground/30 hover:border-foreground hover:scale-102 hover:shadow-lg text-foreground font-light tracking-wide text-lg transition-all duration-300 group"
        >
          <EditableText textKey="home.works.cta" as="span">
            Voir toute la galerie
          </EditableText>
          <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
        </Link>
      </MotionSection>
    </section>
  );
}
