"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import blurPlaceholders from "@/data/blur-placeholders.json";

const BLUR = blurPlaceholders as Record<string, string>;

interface HeroCarouselProps {
  /** Images des slides passées depuis le serveur (data/page-images.json) */
  slides?: string[];
}

/**
 * Hero Carousel - Images configurables via data/page-images.json
 * Pas de texte overlay — juste les images, rien d'autre.
 * @author Lalou
 */
export default function HeroCarousel({ slides: slideImages }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = (slideImages || [
    "/images/toiles/1.jpg",
    "/images/toiles/20.jpg",
    "/images/works/photos/16.jpg",
  ]).map((image, i) => ({ image, alt: `Guillaume Farré — œuvre ${i + 1}` }));

  // Autoplay - 12 secondes par slide
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
    <section className="relative w-full h-[60vh] sm:h-[65vh] md:h-[70vh] overflow-hidden bg-[#FAF7F2]">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            className="object-cover object-center"
            sizes="100vw"
            quality={75}
            priority={index === 0}
            {...(BLUR[slide.image] ? { placeholder: 'blur' as const, blurDataURL: BLUR[slide.image] } : {})}
          />
        </div>
      ))}

      {/* Navigation Arrows */}
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

      {/* Dots Navigation */}
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
