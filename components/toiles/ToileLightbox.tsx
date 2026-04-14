import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Toile } from "./types";
import { formatPrice } from "./toiles-utils";

const LIGHTBOX_BG = {
  backgroundColor: "#050505",
} as const;

const SWIPE_THRESHOLD = 50;

interface ToileLightboxProps {
  toiles: Toile[];
  lightboxIdx: number | null;
  showPrices?: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
}

export default function ToileLightbox({
  toiles,
  lightboxIdx,
  showPrices = false,
  onClose,
  onPrev,
  onNext,
  onGoTo,
}: ToileLightboxProps) {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Scroll la miniature active dans le strip vertical
  useEffect(() => {
    if (lightboxIdx === null || !thumbnailsRef.current) return;
    const activeThumb = thumbnailsRef.current.children[lightboxIdx] as HTMLElement;
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [lightboxIdx]);

  if (lightboxIdx === null) return null;

  const toile = toiles[lightboxIdx];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) onNext();
      else onPrev();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="toile-lightbox"
        className="fixed inset-0 z-50"
        style={LIGHTBOX_BG}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close */}
        <button
          className="absolute top-3 right-3 sm:top-6 sm:right-6 z-10 w-12 h-12 flex items-center justify-center text-neutral-500 hover:text-neutral-200 transition-colors"
          onClick={onClose}
          aria-label="Fermer"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Prev — masque sur mobile (swipe a la place) */}
        {lightboxIdx > 0 && (
          <button
            className="absolute left-2 sm:left-8 md:left-24 top-1/2 -translate-y-1/2 z-10 w-12 h-12 hidden sm:flex items-center justify-center text-neutral-600 hover:text-neutral-300 transition-colors"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label="Precedent"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next — masque sur mobile */}
        {lightboxIdx < toiles.length - 1 && (
          <button
            className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 hidden sm:flex items-center justify-center text-neutral-600 hover:text-neutral-300 transition-colors"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label="Suivant"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Miniatures laterales — desktop */}
        <div
          ref={thumbnailsRef}
          className="absolute left-3 sm:left-6 top-16 bottom-20 z-10 hidden md:flex flex-col gap-2 overflow-y-auto py-2"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}
        >
          {toiles.map((t, idx) => {
            const thumbSrc = t.image || (t.images && t.images[0]) || '';
            return (
              <button
                key={t.id}
                onClick={(e) => { e.stopPropagation(); onGoTo(idx); }}
                className={`relative flex-shrink-0 w-16 h-16 overflow-hidden transition-all duration-200 ${
                  idx === lightboxIdx
                    ? 'ring-2 ring-[#B8956A] opacity-100'
                    : 'opacity-40 hover:opacity-75'
                }`}
                aria-label={t.name}
              >
                <Image
                  src={thumbSrc}
                  alt={t.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                  unoptimized
                />
              </button>
            );
          })}
        </div>

        {/* Image area */}
        <div
          className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-16 md:pl-28 pb-20 sm:pb-24"
          onClick={onClose}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {toile.triptych && toile.images ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  {toile.images.map((img, i) => (
                    <Image
                      key={i}
                      src={img}
                      alt={`${toile.name} — ${i + 1}/3`}
                      width={toile.panelDimensions?.[i]?.imageWidth || 800}
                      height={toile.panelDimensions?.[i]?.imageHeight || 1200}
                      className="max-h-[28vh] sm:max-h-[85vh] w-auto object-contain"
                      quality={95}
                    />
                  ))}
                </div>
              ) : (
                <Image
                  src={toile.image || ""}
                  alt={toile.name}
                  width={toile.imageWidth || 1200}
                  height={toile.imageHeight || 900}
                  className="max-h-[65vh] sm:max-h-[88vh] max-w-[92vw] w-auto h-auto object-contain"
                  quality={95}
                  priority
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 py-3 sm:py-5 pointer-events-none">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-end justify-between gap-1 sm:gap-2">
            <div className="text-center sm:text-left">
              <h2 className="text-base sm:text-lg md:text-xl text-neutral-200 font-light tracking-wide">
                {toile.name}
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm font-light mt-0.5 sm:mt-1">
                {toile.dimensions} — {toile.technique} — {toile.year}
              </p>
            </div>
            {showPrices && (
              <p className="text-lg sm:text-xl text-[#B8956A] font-light tracking-wide">
                {formatPrice(toile.price)}
              </p>
            )}
          </div>
        </div>

        {/* Indicateur swipe sur mobile */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 sm:hidden">
          <p className="text-white/25 text-xs tracking-wide">
            ← Glisser →
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
