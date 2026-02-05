"use client";

import { useState, useEffect } from "react";

/**
 * Animation post-login "Rideau de lumière dorée"
 * Sensation d'exclusivité et d'accès privilégié
 * Direction artistique: palette bronze/doré (primary)
 *
 * @author Lalou
 * @date 2025-01-20
 * @updated Conformité direction artistique
 */

// Cookie helpers
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

export default function WelcomeAnimation() {
  const [showAnimation, setShowAnimation] = useState(false);
  const [phase, setPhase] = useState<"initial" | "light" | "reveal" | "done">("initial");

  useEffect(() => {
    // Vérifier si on doit jouer l'animation (flag set par login)
    const shouldAnimate = getCookie("gf_welcome_animation");
    if (shouldAnimate === "true") {
      setShowAnimation(true);
      deleteCookie("gf_welcome_animation");

      // Séquence d'animation
      setTimeout(() => setPhase("light"), 100);
      setTimeout(() => setPhase("reveal"), 1500);
      setTimeout(() => setPhase("done"), 3000);
    }
  }, []);

  if (!showAnimation || phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black transition-opacity duration-1000 ${
        phase === "reveal" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Particules dorées flottantes - Couleur primary (bronze) */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full transition-all duration-[3000ms] ${
              phase === "light" || phase === "reveal" ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundColor: "rgba(196, 165, 112, 0.6)", // primary color
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: phase === "light" || phase === "reveal"
                ? `translateY(${-50 + Math.random() * 100}px)`
                : "translateY(0)",
              transitionDelay: `${Math.random() * 500}ms`,
            }}
          />
        ))}
      </div>

      {/* Rayon de lumière horizontal - Couleur primary */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 h-[2px] transition-all duration-1000 ease-out ${
          phase === "light" || phase === "reveal"
            ? "left-0 right-0 opacity-100"
            : "left-1/2 right-1/2 opacity-0"
        }`}
        style={{
          background: "linear-gradient(to right, transparent, rgba(196, 165, 112, 0.8), transparent)"
        }}
      />

      {/* Halo lumineux central - Couleur primary */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full transition-all duration-1500 ${
          phase === "light" || phase === "reveal"
            ? "scale-150 opacity-30"
            : "scale-0 opacity-0"
        }`}
        style={{
          background: "radial-gradient(circle, rgba(196,165,112,0.4) 0%, transparent 70%)",
        }}
      />

      {/* Texte de bienvenue */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p
          className={`text-white/70 text-sm tracking-[0.3em] uppercase font-light mb-4 transition-all duration-700 ${
            phase === "light" || phase === "reveal"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          Bienvenue
        </p>
        <h1
          className={`text-white text-3xl md:text-4xl font-light tracking-wider transition-all duration-700 ${
            phase === "light" || phase === "reveal"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          dans l'univers de Guillaume Farré
        </h1>
      </div>

      {/* Voiles qui s'écartent (effet rideau) */}
      <div
        className={`absolute top-0 bottom-0 left-0 bg-black transition-transform duration-1000 ease-in-out ${
          phase === "reveal" ? "-translate-x-full" : "translate-x-0"
        }`}
        style={{ width: "51%" }}
      />
      <div
        className={`absolute top-0 bottom-0 right-0 bg-black transition-transform duration-1000 ease-in-out ${
          phase === "reveal" ? "translate-x-full" : "translate-x-0"
        }`}
        style={{ width: "51%" }}
      />
    </div>
  );
}

// Lalou
