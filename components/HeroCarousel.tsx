"use client";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function HeroCarousel() {
  const t = useTranslations("hero");
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      image: "/images/origins/atelier-deux-voitures.jpg",
      title: t("origine.title"),
      subtitle: t("origine.subtitle"),
      description: t("origine.description"),
      cta: { text: t("origine.cta"), href: "/histoire" },
    },
    {
      image: "/images/origins/atelier-deux-voitures-grises.jpg",
      title: t("atelier.title"),
      subtitle: t("atelier.subtitle"),
      description: t("atelier.description"),
      cta: { text: t("atelier.cta"), href: "/atelier" },
    },
    {
      image: "/images/works/atelier/atelier-005.jpg",
      title: t("creations.title"),
      subtitle: t("creations.subtitle"),
      description: t("creations.description"),
      cta: { text: t("creations.cta"), href: "/histoire" },
    },
    {
      image: "/images/works/empreintes/empreintes-007.jpg",
      title: t("photographies.title"),
      subtitle: t("photographies.subtitle"),
      description: t("photographies.description"),
      cta: { text: t("photographies.cta"), href: "/galerie" },
    },
    {
      image: "/images/works/atelier/atelier-011.jpg",
      title: t("conceptCarArt.title"),
      subtitle: t("conceptCarArt.subtitle"),
      description: t("conceptCarArt.description"),
      cta: { text: t("conceptCarArt.cta"), href: "/concept-car-art" },
    },
    {
      image: "/images/works/projection/projection-011.jpg",
      title: t("acquerir.title"),
      subtitle: t("acquerir.subtitle"),
      description: t("acquerir.description"),
      cta: { text: t("acquerir.cta"), href: "/boutique" },
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrent(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden bg-background">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* Overlay beaucoup plus sombre pour lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75" />
          </div>

          {/* Content */}
          <div className="relative h-full container flex flex-col justify-center items-start text-white px-6 lg:px-8">
            {/* Boîte semi-transparente derrière le texte pour garantir lisibilité */}
            <div className="max-w-4xl bg-black/30 backdrop-blur-md p-8 md:p-12 rounded-lg">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-light tracking-wide mb-4 md:mb-6 animate-fade-in drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {slide.title}
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light italic mb-6 md:mb-8 text-white animate-fade-in-delay-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {slide.subtitle}
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light mb-8 md:mb-12 text-white/95 max-w-3xl leading-relaxed animate-fade-in-delay-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
                {slide.description}
              </p>
              <Link
                href={slide.cta.href}
                className="inline-block px-8 py-4 md:px-10 md:py-5 bg-white/90 hover:bg-white text-foreground hover:text-foreground text-base md:text-lg font-medium tracking-wide rounded backdrop-blur-sm transition-all animate-fade-in-delay-3 shadow-lg"
              >
                {slide.cta.text}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center justify-center text-white text-lg md:text-xl z-10"
        aria-label="Diapositive précédente"
      >
        ←
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center justify-center text-white text-lg md:text-xl z-10"
        aria-label="Diapositive suivante"
      >
        →
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
              index === current
                ? "bg-white w-6 md:w-8"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Aller à la diapositive ${index + 1}`}
          />
        ))}
      </div>

      {/* Quick Access Menu */}
      <div className="absolute top-2 right-2 md:top-4 md:right-4 flex gap-2 z-10">
        <Link
          href="/galerie"
          className="px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-md text-white text-xs md:text-sm transition-all"
        >
          {t("galerie")}
        </Link>
        <Link
          href="/boutique"
          className="px-3 py-1.5 md:px-4 md:py-2 bg-primary/80 backdrop-blur-sm hover:bg-primary rounded-md text-white text-xs md:text-sm transition-all"
        >
          {t("boutique")}
        </Link>
      </div>
    </section>
  );
}
