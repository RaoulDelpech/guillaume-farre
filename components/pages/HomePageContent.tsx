"use client";

import EditableText from "@/components/admin/EditableText";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ImageReveal from "@/components/animations/ImageReveal";

interface HomePageContentProps {
  translations: {
    artist: {
      label: string;
      name: string;
      bio: string;
      cta: string;
    };
  };
  artistPhoto?: string;
}

/**
 * Section Artiste sur la Homepage
 * @author Lalou
 */
export default function HomePageContent({ translations: t, artistPhoto }: HomePageContentProps) {
  const photoUrl = artistPhoto || "/images/origins/atelier-deux-voitures-grises.jpg";
  return (
    <section className="py-24 md:py-36 bg-muted/10">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image artiste */}
          <ImageReveal className="order-2 md:order-1">
            <div className="relative overflow-hidden aspect-[4/3]">
              <Image
                src={photoUrl}
                alt="Guillaume Farré"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          </ImageReveal>

          {/* Texte artiste */}
          <div className="order-1 md:order-2">
            <ScrollReveal>
              <EditableText
                textKey="home.artist.label"
                as="div"
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 font-light"
              >
                {t.artist.label}
              </EditableText>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <EditableText
                textKey="home.artist.name"
                as="h2"
                className="text-4xl md:text-5xl font-extralight tracking-wide mb-6 text-foreground"
              >
                {t.artist.name}
              </EditableText>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <EditableText
                textKey="home.artist.bio"
                as="p"
                className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-10"
                multiline
              >
                {t.artist.bio}
              </EditableText>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <Link
                href="/galerie"
                className="inline-block px-8 py-4 border border-foreground/20 hover:border-foreground/60 text-foreground font-light tracking-wide transition-all duration-500"
              >
                Voir les créations →
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
