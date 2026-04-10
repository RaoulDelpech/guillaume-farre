"use client";

import EditableText from "@/components/admin/EditableText";
import { Link } from "@/i18n/routing";
import { OriginSection, SpecsSection, CreativeSection, GallerySection, DinoCtaSection } from './dino/DinoSections';

interface DinoContentProps {
  translations: {
    tag: string;
    title: string;
    subtitle: string;
    origin: { label: string; title: string; text1: string; text2: string };
    specs: {
      label: string; title: string;
      model: string; modelValue: string; year: string; yearValue: string;
      color: string; colorValue: string; engine: string; engineValue: string;
      power: string; powerValue: string; weight: string; weightValue: string;
    };
    creative: { label: string; title: string; text1: string; text2: string };
    gallery: { label: string; title: string };
    cta: { title: string; text: string; button1: string; button2: string };
  };
  images?: {
    heroBackground?: string;
    originPhoto?: string;
    creativePhoto?: string;
    gallery?: string[];
  };
}

export default function DinoContent({ translations: t, images }: DinoContentProps) {
  const heroBackground = images?.heroBackground || "/images/origins/atelier-deux-voitures-grises.jpg";
  const originPhoto = images?.originPhoto || "/images/origins/atelier-deux-voitures.jpg";
  const creativePhoto = images?.creativePhoto || "/images/works/atelier/atelier-030.jpg";
  const galleryImages = images?.gallery || [
    "/images/works/empreintes/empreintes-001.jpg",
    "/images/works/atelier/atelier-010.jpg",
    "/images/works/projection/projection-001.jpg"
  ];

  return (
    <>
      {/* Hero avec image Dino */}
      <div className="relative min-h-[60vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${heroBackground}")` }}>
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl">
          <EditableText textKey="dino.tag" as="div" className="text-white/60 text-xs mb-8 tracking-[0.4em] uppercase">{t.tag}</EditableText>
          <EditableText textKey="dino.title" as="h1" className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-retro tracking-wide mb-6 sm:mb-8 text-white">{t.title}</EditableText>
          <EditableText textKey="dino.subtitle" as="p" className="text-base sm:text-xl md:text-2xl font-light text-white/80 leading-relaxed max-w-2xl mx-auto">{t.subtitle}</EditableText>
        </div>
      </div>

      {/* Lien vers l'histoire de la Dino */}
      <section className="py-12 bg-muted/10 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-lg font-light text-foreground">Découvrez l'histoire fascinante de la Ferrari Dino dans le monde automobile</p>
              <p className="text-muted-foreground font-light">De Alfredo Ferrari au mythe intemporel</p>
            </div>
            <Link href="/dino-histoire" className="px-6 sm:px-8 py-3.5 sm:py-4 border border-foreground/30 hover:border-foreground text-foreground font-light tracking-wide transition-all whitespace-nowrap min-h-[44px]">
              L'histoire de la Dino →
            </Link>
          </div>
        </div>
      </section>

      <OriginSection t={t.origin} image={originPhoto} />
      <SpecsSection t={t.specs} />
      <CreativeSection t={t.creative} image={creativePhoto} />
      <GallerySection t={t.gallery} images={galleryImages} />
      <DinoCtaSection t={t.cta} />
    </>
  );
}

// Lalou
