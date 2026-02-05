"use client";

import { useEffect, useState } from "react";

/**
 * Bouton flottant "Retour en haut" après scroll
 * Style minimaliste - Décision audit 2025-01-20
 *
 * @author Lalou
 * @date 2025-01-20
 */
export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:border-foreground text-foreground flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
      aria-label="Retour en haut"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5 15l7-7 7 7"
        />
      </svg>
    </button>
  );
}
