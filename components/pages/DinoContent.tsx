"use client";

import EditableText from "@/components/admin/EditableText";
import { Link } from "@/i18n/routing";

interface DinoContentProps {
  translations: {
    tag: string;
    title: string;
    subtitle: string;
    origin: {
      label: string;
      title: string;
      text1: string;
      text2: string;
    };
    specs: {
      label: string;
      title: string;
      model: string;
      modelValue: string;
      year: string;
      yearValue: string;
      color: string;
      colorValue: string;
      engine: string;
      engineValue: string;
      power: string;
      powerValue: string;
      weight: string;
      weightValue: string;
    };
    creative: {
      label: string;
      title: string;
      text1: string;
      text2: string;
    };
    gallery: {
      label: string;
      title: string;
    };
    cta: {
      title: string;
      text: string;
      button1: string;
      button2: string;
    };
  };
  /** Images configurables depuis data/page-images.json */
  images?: {
    heroBackground?: string;
    originPhoto?: string;
    creativePhoto?: string;
    gallery?: string[];
  };
}

/**
 * Contenu de la page Dino avec textes éditables
 * Ambiance rétro années 60-70 - Décision audit 2025-01-20
 *
 * @author Lalou
 * @date 2025-01-20
 */
export default function DinoContent({ translations: t, images }: DinoContentProps) {
  // Images avec fallbacks
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
      {/* Hero avec image Dino - Les VRAIES Dino de Guillaume */}
      <div className="relative min-h-[60vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${heroBackground}")`,
          }}
        >
          {/* Overlay sobre */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Contenu centré - Typo serif rétro */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl">
          <EditableText
            textKey="dino.tag"
            as="div"
            className="text-white/60 text-xs mb-8 tracking-[0.4em] uppercase"
          >
            {t.tag}
          </EditableText>
          <EditableText
            textKey="dino.title"
            as="h1"
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-retro tracking-wide mb-6 sm:mb-8 text-white"
          >
            {t.title}
          </EditableText>
          <EditableText
            textKey="dino.subtitle"
            as="p"
            className="text-base sm:text-xl md:text-2xl font-light text-white/80 leading-relaxed max-w-2xl mx-auto"
          >
            {t.subtitle}
          </EditableText>

        </div>
      </div>

      {/* Lien vers l'histoire de la Dino */}
      <section className="py-12 bg-muted/10 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-lg font-light text-foreground">
                Découvrez l'histoire fascinante de la Ferrari Dino dans le monde automobile
              </p>
              <p className="text-muted-foreground font-light">
                De Alfredo Ferrari au mythe intemporel
              </p>
            </div>
            <Link
              href="/dino-histoire"
              className="px-6 sm:px-8 py-3.5 sm:py-4 border border-foreground/30 hover:border-foreground text-foreground font-light tracking-wide transition-all whitespace-nowrap min-h-[44px]"
            >
              L'histoire de la Dino →
            </Link>
          </div>
        </div>
      </section>

      {/* Section L'Origine */}
      <section className="py-12 sm:py-24 md:py-32 bg-muted/10 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* VRAIE photo des Dino de Guillaume */}
            <div className="order-2 md:order-1">
              <img
                src={originPhoto}
                alt="Les Ferrari Dino de Guillaume Farré"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Texte */}
            <div className="order-1 md:order-2">
              <EditableText
                textKey="dino.origin.label"
                as="div"
                className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4"
              >
                {t.origin.label}
              </EditableText>
              <EditableText
                textKey="dino.origin.title"
                as="h2"
                className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-6 text-foreground"
              >
                {t.origin.title}
              </EditableText>
              <EditableText
                textKey="dino.origin.text1"
                as="p"
                className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-8"
                multiline
              >
                {t.origin.text1}
              </EditableText>
              <EditableText
                textKey="dino.origin.text2"
                as="p"
                className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed"
                multiline
              >
                {t.origin.text2}
              </EditableText>
            </div>
          </div>
        </div>
      </section>

      {/* Section Caractéristiques - Style fiche technique rétro */}
      <section className="py-12 sm:py-24 md:py-32 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <EditableText
              textKey="dino.specs.label"
              as="div"
              className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4"
            >
              {t.specs.label}
            </EditableText>
            <EditableText
              textKey="dino.specs.title"
              as="h2"
              className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-8 sm:mb-16 text-foreground"
            >
              {t.specs.title}
            </EditableText>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Gauche */}
              <div className="space-y-8">
                <div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-light">
                    {t.specs.model}
                  </div>
                  <EditableText
                    textKey="dino.specs.modelValue"
                    as="p"
                    className="text-2xl font-light text-foreground"
                  >
                    {t.specs.modelValue}
                  </EditableText>
                </div>
                <div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-light">
                    {t.specs.year}
                  </div>
                  <EditableText
                    textKey="dino.specs.yearValue"
                    as="p"
                    className="text-2xl font-light text-foreground"
                  >
                    {t.specs.yearValue}
                  </EditableText>
                </div>
                <div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-light">
                    {t.specs.color}
                  </div>
                  <EditableText
                    textKey="dino.specs.colorValue"
                    as="p"
                    className="text-2xl font-light text-foreground"
                  >
                    {t.specs.colorValue}
                  </EditableText>
                </div>
              </div>

              {/* Droite */}
              <div className="space-y-8">
                <div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-light">
                    {t.specs.engine}
                  </div>
                  <EditableText
                    textKey="dino.specs.engineValue"
                    as="p"
                    className="text-lg font-light text-muted-foreground"
                  >
                    {t.specs.engineValue}
                  </EditableText>
                </div>
                <div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-light">
                    {t.specs.power}
                  </div>
                  <EditableText
                    textKey="dino.specs.powerValue"
                    as="p"
                    className="text-lg font-light text-muted-foreground"
                  >
                    {t.specs.powerValue}
                  </EditableText>
                </div>
                <div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-light">
                    {t.specs.weight}
                  </div>
                  <EditableText
                    textKey="dino.specs.weightValue"
                    as="p"
                    className="text-lg font-light text-muted-foreground"
                  >
                    {t.specs.weightValue}
                  </EditableText>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Rôle Créatif */}
      <section className="py-12 sm:py-24 md:py-32 bg-muted/10 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Texte */}
            <div>
              <EditableText
                textKey="dino.creative.label"
                as="div"
                className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4"
              >
                {t.creative.label}
              </EditableText>
              <EditableText
                textKey="dino.creative.title"
                as="h2"
                className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-6 text-foreground"
              >
                {t.creative.title}
              </EditableText>
              <EditableText
                textKey="dino.creative.text1"
                as="p"
                className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-6"
                multiline
              >
                {t.creative.text1}
              </EditableText>
              <EditableText
                textKey="dino.creative.text2"
                as="p"
                className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed"
                multiline
              >
                {t.creative.text2}
              </EditableText>
            </div>

            {/* Image du processus créatif */}
            <div>
              <img
                src={creativePhoto}
                alt="La Dino en action sur la toile"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section Galerie - Mix couleur et N&B selon audit */}
      <section className="py-12 sm:py-24 md:py-32 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <EditableText
              textKey="dino.gallery.label"
              as="div"
              className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4"
            >
              {t.gallery.label}
            </EditableText>
            <EditableText
              textKey="dino.gallery.title"
              as="h2"
              className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-foreground"
            >
              {t.gallery.title}
            </EditableText>
          </div>

          {/* Grille des vraies photos de Guillaume - Mix couleur/N&B */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {galleryImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Œuvre ${index + 1}`}
                className="w-full h-80 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final - Style rétro */}
      <section className="py-12 sm:py-24 md:py-32 bg-muted/10 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <EditableText
              textKey="dino.cta.title"
              as="h2"
              className="text-3xl md:text-4xl font-light tracking-wide mb-8"
            >
              {t.cta.title}
            </EditableText>
            <EditableText
              textKey="dino.cta.text"
              as="p"
              className="text-xl font-light text-muted-foreground mb-12 leading-relaxed"
              multiline
            >
              {t.cta.text}
            </EditableText>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/atelier"
                className="px-8 sm:px-10 py-4 sm:py-5 bg-foreground hover:bg-foreground/90 text-background font-light tracking-wide transition-all min-h-[48px] flex items-center justify-center"
              >
                {t.cta.button1}
              </Link>
              <Link
                href="/galerie"
                className="px-8 sm:px-10 py-4 sm:py-5 border border-foreground/30 hover:border-foreground text-foreground font-light tracking-wide transition-all min-h-[48px] flex items-center justify-center"
              >
                {t.cta.button2}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
