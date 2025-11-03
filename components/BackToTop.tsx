"use client";
import { useEffect, useState } from "react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { playWhoosh } = useSoundEffects();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    playWhoosh();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-gradient-to-br from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center group animate-bounce"
      title="Retour en haut"
    >
      <span className="text-2xl">↑</span>

      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 right-0 bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Retour en haut
      </div>
    </button>
  );
}
