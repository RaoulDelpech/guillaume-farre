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
      image: "/images/works/atelier/atelier-004.jpg",
      title: t("creations.title"),
      subtitle: t("creations.subtitle"),
      description: t("creations.description"),
      cta: { text: t("creations.cta"), href: "/histoire" },
    },
    {
      image: "/images/works/atelier/atelier-020.jpg",
      title: t("atelier.title"),
      subtitle: t("atelier.subtitle"),
      description: t("atelier.description"),
      cta: { text: t("atelier.cta"), href: "/atelier" },
    },
    {
      image: "/images/works/atelier/atelier-028.jpg",
      title: t("photographies.title"),
      subtitle: t("photographies.subtitle"),
      description: t("photographies.description"),
      cta: { text: t("photographies.cta"), href: "/galerie" },
    },
    {
      image: "/images/works/atelier/atelier-045.jpg",
      title: t("conceptCarArt.title"),
      subtitle: t("conceptCarArt.subtitle"),
      description: t("conceptCarArt.description"),
      cta: { text: t("conceptCarArt.cta"), href: "/concept-car-art" },
    },
    {
      image: "/images/works/atelier/atelier-063.jpg",
      title: t("origine.title"),
      subtitle: t("origine.subtitle"),
      description: t("origine.description"),
      cta: { text: t("origine.cta"), href: "/histoire" },
    },
    {
      image: "/images/works/atelier/atelier-072.jpg",
      title: t("acquerir.title"),
      subtitle: t("acquerir.subtitle"),
      description: t("acquerir.description"),
      cta: { text: t("acquerir.cta"), href: "/boutique" },
    },
  ];

  // Autoplay effect
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.code === "Space") {
        e.preventDefault();
        setIsAutoPlaying(!isAutoPlaying);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isAutoPlaying]);

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
    <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden bg-background">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Background Image - Contain pour éviter déformation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`w-full max-w-4xl h-full bg-contain bg-center bg-no-repeat transition-transform duration-1000 ${
                index === current ? "scale-105" : "scale-100"
              }`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Overlay léger pour lisibilité texte */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
            </div>
          </div>

          {/* Content - Centré world-class */}
          <div className="relative h-full container flex flex-col justify-center items-center text-center text-white px-6 lg:px-8">
            <div className="max-w-5xl">
              {/* Titre principal - Taille optimale lisible */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-wider mb-6 md:mb-8 animate-fade-in leading-tight">
                {slide.title}
              </h1>

              {/* Sous-titre premium */}
              <p className="text-lg sm:text-xl md:text-2xl font-light mb-8 md:mb-10 text-white/95 animate-fade-in-delay-1 tracking-wide">
                {slide.subtitle}
              </p>

              {/* Description - Plus lisible, plus spacieux */}
              <p className="text-lg sm:text-xl md:text-2xl font-light mb-10 md:mb-14 text-white/90 max-w-4xl mx-auto leading-relaxed animate-fade-in-delay-2">
                {slide.description}
              </p>

              {/* CTA Premium - Plus visible */}
              <Link
                href={slide.cta.href}
                className="inline-block px-12 py-5 md:px-16 md:py-6 bg-white hover:bg-white/95 text-black text-lg md:text-xl font-light tracking-wider rounded-sm transition-all animate-fade-in-delay-3 shadow-2xl hover:shadow-3xl hover:scale-105 duration-300"
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

      {/* Scroll Indicator - Premium touch with fade out */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 animate-pulse opacity-50">
        <svg
          className="w-5 h-5 md:w-6 md:h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  );
}
