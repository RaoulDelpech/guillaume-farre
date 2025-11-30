"use client";
import { useEffect } from "react";
import { Link } from "@/i18n/routing";
import type { Work } from "@/lib/works";
import { altForWork } from "@/lib/images";

interface LightboxProps {
  open: boolean;
  work: Work | null;
  onClose: () => void;
}

/**
 * Lightbox pleine page immersive
 * Photo sans filtre, fond noir pur, interface minimale
 *
 * @author Lalou
 * @updated 2025-11-30 - Style immersif sans filtre blanc
 */
export default function Lightbox({ open, work, onClose }: LightboxProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!open || !work) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      onClick={onClose}
    >
      {/* Bouton fermer - discret en haut à droite */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-20 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white text-3xl transition-colors"
        aria-label="Fermer"
      >
        ×
      </button>

      {/* Photo pleine page */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8" onClick={(e) => e.stopPropagation()}>
        {work.images.length > 0 && (
          <img
            src={work.images[0]}
            alt={altForWork(work)}
            className="max-w-full max-h-full object-contain"
          />
        )}
      </div>

      {/* Info et CTA en bas - minimaliste */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8" onClick={(e) => e.stopPropagation()}>
        <div className="max-w-4xl mx-auto flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide">{work.title}</h2>
            <p className="text-white/60 font-light mt-1">{work.year}</p>
          </div>
          <Link
            href="/boutique"
            className="px-8 py-3 border border-white/40 hover:border-white text-white font-light tracking-wide rounded-sm transition-all hover:bg-white/10"
          >
            Commander
          </Link>
        </div>
      </div>
    </div>
  );
}
