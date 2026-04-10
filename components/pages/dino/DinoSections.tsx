"use client";

import EditableText from "@/components/admin/EditableText";
import { Link } from "@/i18n/routing";
import Image from "next/image";

interface SectionTranslations {
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
}

export function OriginSection({ t, image }: { t: SectionTranslations["origin"]; image: string }) {
  return (
    <section className="py-12 sm:py-24 md:py-32 bg-muted/10 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="order-2 md:order-1 relative aspect-[4/3]">
            <Image src={image} alt="Les Ferrari Dino de Guillaume Farré" fill
              sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" loading="lazy" />
          </div>
          <div className="order-1 md:order-2">
            <EditableText textKey="dino.origin.label" as="div" className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">{t.label}</EditableText>
            <EditableText textKey="dino.origin.title" as="h2" className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-6 text-foreground">{t.title}</EditableText>
            <EditableText textKey="dino.origin.text1" as="p" className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-8" multiline>{t.text1}</EditableText>
            <EditableText textKey="dino.origin.text2" as="p" className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed" multiline>{t.text2}</EditableText>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SpecsSection({ t }: { t: SectionTranslations["specs"] }) {
  const leftSpecs = [
    { label: t.model, key: "modelValue", value: t.modelValue, size: "text-2xl" },
    { label: t.year, key: "yearValue", value: t.yearValue, size: "text-2xl" },
    { label: t.color, key: "colorValue", value: t.colorValue, size: "text-2xl" },
  ];
  const rightSpecs = [
    { label: t.engine, key: "engineValue", value: t.engineValue, size: "text-lg" },
    { label: t.power, key: "powerValue", value: t.powerValue, size: "text-lg" },
    { label: t.weight, key: "weightValue", value: t.weightValue, size: "text-lg" },
  ];

  return (
    <section className="py-12 sm:py-24 md:py-32 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <EditableText textKey="dino.specs.label" as="div" className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">{t.label}</EditableText>
          <EditableText textKey="dino.specs.title" as="h2" className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-8 sm:mb-16 text-foreground">{t.title}</EditableText>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              {leftSpecs.map(s => (
                <div key={s.key}>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-light">{s.label}</div>
                  <EditableText textKey={`dino.specs.${s.key}`} as="p" className={`${s.size} font-light text-foreground`}>{s.value}</EditableText>
                </div>
              ))}
            </div>
            <div className="space-y-8">
              {rightSpecs.map(s => (
                <div key={s.key}>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-light">{s.label}</div>
                  <EditableText textKey={`dino.specs.${s.key}`} as="p" className={`${s.size} font-light text-muted-foreground`}>{s.value}</EditableText>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CreativeSection({ t, image }: { t: SectionTranslations["creative"]; image: string }) {
  return (
    <section className="py-12 sm:py-24 md:py-32 bg-muted/10 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <EditableText textKey="dino.creative.label" as="div" className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">{t.label}</EditableText>
            <EditableText textKey="dino.creative.title" as="h2" className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-6 text-foreground">{t.title}</EditableText>
            <EditableText textKey="dino.creative.text1" as="p" className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-6" multiline>{t.text1}</EditableText>
            <EditableText textKey="dino.creative.text2" as="p" className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed" multiline>{t.text2}</EditableText>
          </div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image src={image} alt="La Dino en action sur la toile" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function GallerySection({ t, images }: { t: SectionTranslations["gallery"]; images: string[] }) {
  return (
    <section className="py-12 sm:py-24 md:py-32 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <EditableText textKey="dino.gallery.label" as="div" className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">{t.label}</EditableText>
          <EditableText textKey="dino.gallery.title" as="h2" className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-foreground">{t.title}</EditableText>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {images.map((img, index) => (
            <div key={index} className="relative h-80 rounded-lg overflow-hidden">
              <Image src={img} alt={`Œuvre ${index + 1}`} fill sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" className="object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DinoCtaSection({ t }: { t: SectionTranslations["cta"] }) {
  return (
    <section className="py-12 sm:py-24 md:py-32 bg-muted/10 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <EditableText textKey="dino.cta.title" as="h2" className="text-3xl md:text-4xl font-light tracking-wide mb-8">{t.title}</EditableText>
          <EditableText textKey="dino.cta.text" as="p" className="text-xl font-light text-muted-foreground mb-12 leading-relaxed" multiline>{t.text}</EditableText>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/atelier" className="px-8 sm:px-10 py-4 sm:py-5 bg-foreground hover:bg-foreground/90 text-background font-light tracking-wide transition-all min-h-[48px] flex items-center justify-center">{t.button1}</Link>
            <Link href="/galerie" className="px-8 sm:px-10 py-4 sm:py-5 border border-foreground/30 hover:border-foreground text-foreground font-light tracking-wide transition-all min-h-[48px] flex items-center justify-center">{t.button2}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Lalou
