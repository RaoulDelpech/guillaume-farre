"use client";
import { useEffect } from "react";
import Image from "next/image";
import type { Work } from "@/lib/works";
import { altForWork } from "@/lib/images";

interface LightboxProps {
  open: boolean;
  work: Work | null;
  works?: Work[]; // Liste complète pour navigation
  onClose: () => void;
  onNavigate?: (work: Work) => void; // Callback pour navigation
}

/**
 * Lightbox pleine page immersive - Décision audit 2025-01-20
 * Image + titre + prix + bouton "Me contacter"
 * Navigation flèches gauche/droite
 * Style immersif, infos discrètes en bas
 *
 * @author Lalou
 * @updated 2025-01-20
 */
export default function Lightbox({ open, work, works = [], onClose, onNavigate }: LightboxProps) {
  // Index actuel et navigation
  const currentIndex = works.findIndex((w) => w.slug === work?.slug);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < works.length - 1;

  const goToPrev = () => {
    if (hasPrev && onNavigate) {
      onNavigate(works[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    if (hasNext && onNavigate) {
      onNavigate(works[currentIndex + 1]);
    }
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    if (open) {
      document.addEventListener("keydown", handleKeydown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose, currentIndex]);

  if (!open || !work) return null;

  // Formater le prix
  const formatPrice = () => {
    if (!work.prices) return "Sur demande";
    const prices = work.prices;
    if (prices.small) return `À partir de ${prices.small}€`;
    if (prices.medium) return `À partir de ${prices.medium}€`;
    if (prices.large) return `${prices.large}€`;
    return "Sur demande";
  };

  // Générer l'URL de contact pré-rempli
  const contactUrl = `/contact?sujet=oeuvre&oeuvre=${encodeURIComponent(work.title)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      onClick={onClose}
    >
      {/* Bouton fermer */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-20 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors"
        aria-label="Fermer"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation gauche */}
      {hasPrev && works.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          aria-label="Image précédente"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Navigation droite */}
      {hasNext && works.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          aria-label="Image suivante"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Photo pleine page */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 md:p-16"
        onClick={(e) => e.stopPropagation()}
      >
        {work.images.length > 0 && (
          <div className="relative max-w-full max-h-full" style={{ width: '100%', height: '100%' }}>
            <Image
              src={work.images[0]}
              alt={altForWork(work)}
              fill
              sizes="100vw"
              className="object-contain"
              priority
              unoptimized
            />
          </div>
        )}
      </div>

      {/* Info et CTA en bas - Décision audit */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-light text-white tracking-wide mb-1">
              {work.title}
            </h2>
            <div className="flex items-center gap-4 text-white/60 font-light text-sm">
              <span>{work.year}</span>
              <span>•</span>
              <span>{work.type === "photo" ? "Photographie" : "Toile"}</span>
              {work.edition?.type === "limited" && (
                <>
                  <span>•</span>
                  <span className="text-white/90">Édition limitée</span>
                </>
              )}
            </div>
            {/* Prix */}
            <p className="text-white/80 font-light mt-2">{formatPrice()}</p>
          </div>

          {/* CTA - Décision audit : "Me contacter pour cette œuvre" */}
          <a
            href={contactUrl}
            className="px-8 py-4 border border-white/40 hover:border-white text-white font-light tracking-wide transition-all hover:bg-white/10 whitespace-nowrap"
          >
            Me contacter pour cette œuvre
          </a>
        </div>

        {/* Indicateur de position */}
        {works.length > 1 && (
          <div className="text-center mt-4 text-white/40 text-sm font-light">
            {currentIndex + 1} / {works.length}
          </div>
        )}
      </div>
    </div>
  );
}
