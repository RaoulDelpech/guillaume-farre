import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Toile } from "./types";
import { formatPrice, LINEN_BG } from "./toiles-utils";

interface ToileLightboxProps {
  toiles: Toile[];
  lightboxIdx: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ToileLightbox({
  toiles,
  lightboxIdx,
  onClose,
  onPrev,
  onNext,
}: ToileLightboxProps) {
  if (lightboxIdx === null) return null;

  const toile = toiles[lightboxIdx];

  return (
    <AnimatePresence>
      <motion.div
        key="toile-lightbox"
        className="fixed inset-0 z-50"
        style={LINEN_BG}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close */}
        <button
          className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center text-neutral-400 hover:text-neutral-800 transition-colors"
          onClick={onClose}
          aria-label="Fermer"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Prev */}
        {lightboxIdx > 0 && (
          <button
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-neutral-300 hover:text-neutral-700 transition-colors"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label="Precedent"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next */}
        {lightboxIdx < toiles.length - 1 && (
          <button
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-neutral-300 hover:text-neutral-700 transition-colors"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label="Suivant"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Image area */}
        <div
          className="absolute inset-0 flex items-center justify-center p-6 md:p-16 pb-24"
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
                <div className="flex gap-2">
                  {toile.images.map((img, i) => (
                    <Image
                      key={i}
                      src={img}
                      alt={`${toile.name} — ${i + 1}/3`}
                      width={toile.panelDimensions?.[i]?.imageWidth || 800}
                      height={toile.panelDimensions?.[i]?.imageHeight || 1200}
                      className="max-h-[85vh] w-auto object-contain"
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
                  className="max-h-[88vh] max-w-[92vw] w-auto h-auto object-contain"
                  quality={95}
                  priority
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 px-8 py-5 pointer-events-none">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-lg md:text-xl text-neutral-800 font-light tracking-wide">
                {toile.name}
              </h2>
              <p className="text-neutral-400 text-sm font-light mt-1">
                {toile.dimensions} — {toile.technique} — {toile.year}
              </p>
            </div>
            <p className="text-xl text-[#7A6030] font-light tracking-wide">
              {formatPrice(toile.price)}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
