"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Entrée sombre avec portes d'atelier industrielles
 * Les portes s'écartent au clic sur "Entrer", révélant le site
 *
 * @author Lalou
 */

// Cookie helpers
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export default function DarkEntry() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<"intro" | "opening" | "done">("intro");
  const pathname = usePathname();

  useEffect(() => {
    // Ne pas afficher sur les pages admin
    if (pathname?.includes("/admin")) return;

    // Vérifier si l'utilisateur a déjà vu l'entrée
    const hasSeen = getCookie("gf_dark_entry_seen");
    if (!hasSeen) {
      setShow(true);
    }
  }, [pathname]);

  const handleEnter = () => {
    setPhase("opening");
    // Attendre que les portes s'ouvrent (1.5s) puis marquer comme vu
    setTimeout(() => {
      setCookie("gf_dark_entry_seen", "true", 7);
      setPhase("done");
    }, 1800);
  };

  if (!show || phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Porte gauche */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          phase === "opening" ? "-translate-x-full" : "translate-x-0"
        }`}
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
          boxShadow: "inset -20px 0 60px rgba(0,0,0,0.8)",
        }}
      >
        {/* Texture métal */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.03) 2px,
              rgba(255,255,255,0.03) 4px
            )`,
          }}
        />
        {/* Rivets */}
        <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        <div className="absolute top-8 right-20 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        <div className="absolute bottom-8 right-8 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        <div className="absolute bottom-8 right-20 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        {/* Poignée */}
        <div className="absolute top-1/2 right-6 -translate-y-1/2 w-2 h-24 bg-zinc-500 rounded-full shadow-lg" />
      </div>

      {/* Porte droite */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full transition-transform duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          phase === "opening" ? "translate-x-full" : "translate-x-0"
        }`}
        style={{
          background: "linear-gradient(225deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
          boxShadow: "inset 20px 0 60px rgba(0,0,0,0.8)",
        }}
      >
        {/* Texture métal */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.03) 2px,
              rgba(255,255,255,0.03) 4px
            )`,
          }}
        />
        {/* Rivets */}
        <div className="absolute top-8 left-8 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        <div className="absolute top-8 left-20 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        <div className="absolute bottom-8 left-8 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        <div className="absolute bottom-8 left-20 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        {/* Poignée */}
        <div className="absolute top-1/2 left-6 -translate-y-1/2 w-2 h-24 bg-zinc-500 rounded-full shadow-lg" />
      </div>

      {/* Ligne centrale (jonction des portes) */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-black/50 transition-opacity duration-500 ${
          phase === "opening" ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Contenu centré */}
      {phase === "intro" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          {/* Ligne fine horizontale */}
          <div className="h-px w-32 md:w-48 bg-white/20 mb-12 animate-[fadeIn_1s_ease-out]" />

          {/* Nom de l'artiste */}
          <p className="text-white/50 text-xs md:text-sm tracking-[0.5em] uppercase font-light mb-6 animate-[fadeIn_1s_ease-out_0.3s_both]">
            Guillaume Farré
          </p>

          {/* Phrase signature */}
          <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-light tracking-wide text-center px-8 animate-[fadeIn_1s_ease-out_0.6s_both]">
            Une Dino pour pinceau
          </h1>

          {/* Sous-titre */}
          <p className="text-white/40 text-sm md:text-base font-light tracking-widest mt-6 animate-[fadeIn_1s_ease-out_0.9s_both]">
            Toiles · Photographies · Performances
          </p>

          {/* Ligne fine horizontale */}
          <div className="h-px w-32 md:w-48 bg-white/20 mt-12 animate-[fadeIn_1s_ease-out_1.2s_both]" />

          {/* Bouton Entrer */}
          <button
            onClick={handleEnter}
            className="mt-16 text-white/30 text-xs tracking-[0.3em] uppercase hover:text-white/60 transition-colors pointer-events-auto animate-[fadeIn_1s_ease-out_1.5s_both]"
          >
            Entrer
          </button>
        </div>
      )}
    </div>
  );
}

// Lalou
