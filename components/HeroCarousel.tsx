"use client";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import EditableText from "@/components/admin/EditableText";

interface HeroCarouselProps {
  /** Images des slides passées depuis le serveur (data/page-images.json) */
  slides?: string[];
}

/**
 * Hero Carousel - Images configurables via data/page-images.json
 * @author Lalou
 * @date 2025-01-20
 */
export default function HeroCarousel({ slides: slideImages }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Utilise les images passées en props ou les valeurs par défaut
  const slides = (slideImages || [
    "/images/toiles/1.jpg",
    "/images/toiles/8.jpg",
    "/images/toiles/12.jpg",
  ]).map(image => ({ image }));

  // Autoplay - 12 secondes par slide (cinématographique)
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 12000);
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
    <section className="relative w-full h-[60vh] sm:h-[65vh] md:h-[70vh] overflow-hidden bg-black">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.image})`,
              transition: "transform 12s linear",
              transform: index === current ? "scale(1.1)" : "scale(1)"
            }}
          />
          {/* Overlay pour lisibilité */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}

      {/* Content - Nom de l'artiste, sobre */}
      <div className="relative h-full container flex flex-col justify-end items-center text-center text-white px-4 sm:px-6 lg:px-8 pb-16 md:pb-20 z-10">
        <div className="max-w-4xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extralight tracking-[0.2em] uppercase animate-fade-in">
            Guillaume Farré
          </h1>
          <p className="mt-3 text-sm sm:text-base font-light tracking-[0.15em] text-white/70 animate-fade-in-delay-1">
            Toiles et Photographies
          </p>
        </div>
      </div>

      {/* Navigation Arrows - 44px minimum pour mobile (accessibilité) */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all flex items-center justify-center text-white/70 hover:text-white z-20 active:scale-95"
        aria-label="Image précédente"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all flex items-center justify-center text-white/70 hover:text-white z-20 active:scale-95"
        aria-label="Image suivante"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Navigation - Discrets en bas */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 sm:h-1.5 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
              index === current
                ? "bg-white w-8 sm:w-8"
                : "bg-white/40 hover:bg-white/60 w-2 sm:w-1.5"
            }`}
            aria-label={`Image ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
}
