"use client";

import EditableText from "@/components/admin/EditableText";
import { Link } from "@/i18n/routing";

interface HomePageContentProps {
  translations: {
    artist: {
      label: string;
      name: string;
      bio: string;
      cta: string;
    };
  };
}

/**
 * Contenu de la section Artiste sur la Homepage avec textes éditables
 *
 * @author Lalou
 * @date 2025-12-29
 */
export default function HomePageContent({ translations: t }: HomePageContentProps) {
  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="container px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Image artiste */}
          <div className="order-2 md:order-1">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="/images/origins/atelier-deux-voitures-grises.jpg"
                alt="Guillaume Farré dans son atelier"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Texte artiste */}
          <div className="order-1 md:order-2">
            <EditableText
              textKey="home.artist.label"
              as="div"
              className="text-sm uppercase tracking-widest text-muted-foreground mb-4 font-light"
            >
              {t.artist.label}
            </EditableText>
            <EditableText
              textKey="home.artist.name"
              as="h2"
              className="text-4xl md:text-5xl font-light tracking-wide mb-6 text-foreground"
            >
              {t.artist.name}
            </EditableText>
            <EditableText
              textKey="home.artist.bio"
              as="p"
              className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-8"
              multiline
            >
              {t.artist.bio}
            </EditableText>
            <Link
              href="/histoire"
              className="inline-flex items-center text-lg font-light tracking-wide hover:text-foreground/80 transition-colors group"
            >
              <span className="border-b border-current pb-1">{t.artist.cta}</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
