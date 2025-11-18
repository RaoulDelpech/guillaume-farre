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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl hover:text-red-500"
        aria-label="Fermer"
      >
        ✕
      </button>
      <div className="relative max-w-7xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
        {work.images.length > 0 && (
          <img
            src={work.images[0]}
            alt={altForWork(work)}
            className="max-w-full max-h-[85vh] object-contain"
          />
        )}
        <div className="mt-4 text-white text-center">
          <h2 className="text-xl font-bold">{work.title}</h2>
          <p className="text-sm text-gray-300 mb-4">{work.year}</p>
          <Link
            href="/boutique"
            className="inline-block px-8 py-3 bg-white hover:bg-gray-200 text-black font-light tracking-wide rounded transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            Voir dans la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}
