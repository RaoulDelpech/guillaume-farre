"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Page de login avec portes d'atelier industrielles
 * Ambiance confidentielle / club privé
 *
 * Séquence :
 * 1. Portes fermées + champ mot de passe
 * 2. Mot de passe correct → portes s'ouvrent lentement
 * 3. Message de bienvenue apparaît derrière les portes
 * 4. Redirect vers site
 *
 * @author Lalou
 */
export default function LoginPage() {
  const [phase, setPhase] = useState<"password" | "opening" | "welcome">("password");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase === "password" && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [phase]);

  // Redirect après le message de bienvenue
  useEffect(() => {
    if (phase === "welcome") {
      const timer = setTimeout(() => {
        router.push("/fr");
        router.refresh();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [phase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      document.cookie = "gf_dark_entry_seen=true;path=/;max-age=604800";
      setPhase("opening");
      // Attendre que les portes soient ouvertes avant d'afficher le message
      setTimeout(() => setPhase("welcome"), 3500);
    } else {
      setError(true);
      setLoading(false);
    }
  };

  const doorsOpen = phase === "opening" || phase === "welcome";

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Porte gauche */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-[3000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          doorsOpen ? "-translate-x-full" : "translate-x-0"
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
        {/* Rivets - cachés sur mobile */}
        <div className="hidden md:block absolute top-8 right-8 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        <div className="hidden md:block absolute top-8 right-20 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        <div className="hidden md:block absolute bottom-8 right-8 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        <div className="hidden md:block absolute bottom-8 right-20 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        {/* Poignée - plus petite sur mobile */}
        <div className="absolute top-1/2 right-4 md:right-6 -translate-y-1/2 w-1.5 md:w-2 h-16 md:h-24 bg-zinc-500 rounded-full shadow-lg" />
      </div>

      {/* Porte droite */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full transition-transform duration-[3000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          doorsOpen ? "translate-x-full" : "translate-x-0"
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
        {/* Rivets - cachés sur mobile */}
        <div className="hidden md:block absolute top-8 left-8 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        <div className="hidden md:block absolute top-8 left-20 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        <div className="hidden md:block absolute bottom-8 left-8 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        <div className="hidden md:block absolute bottom-8 left-20 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        {/* Poignée - plus petite sur mobile */}
        <div className="absolute top-1/2 left-4 md:left-6 -translate-y-1/2 w-1.5 md:w-2 h-16 md:h-24 bg-zinc-500 rounded-full shadow-lg" />
      </div>

      {/* Ligne centrale (jonction des portes) */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-black/50 transition-opacity duration-[3000ms] ${
          doorsOpen ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Formulaire mot de passe (portes fermées) */}
      {phase === "password" && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-full max-w-sm px-8 animate-[fadeIn_1s_ease-out_0.3s_both]">
            <div className="text-center mb-12">
              <p className="text-white/40 text-xs tracking-[0.3em] uppercase font-light">
                Espace privé
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <input
                  ref={inputRef}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className="w-full px-0 py-4 bg-transparent border-0 border-b border-white/20 text-white text-center placeholder-white/30 font-light tracking-widest focus:outline-none focus:border-white/50 transition-colors min-h-[44px]"
                />
              </div>

              {error && (
                <p className="text-white/50 text-xs font-light text-center tracking-wide">
                  Accès refusé
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="w-full py-3 text-white/40 text-xs sm:text-sm tracking-[0.3em] uppercase hover:text-white/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed min-h-[48px] flex items-center justify-center"
              >
                {loading ? "···" : "Entrer"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Message de bienvenue (révélé après ouverture des portes) */}
      {(phase === "opening" || phase === "welcome") && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
          <div className={`flex flex-col items-center transition-opacity duration-[2000ms] ${
            phase === "welcome" ? "opacity-100" : "opacity-0"
          }`}>
            {/* Ligne fine horizontale */}
            <div className="h-px w-32 md:w-48 bg-white/20 mb-12" />

            {/* Nom de l'artiste */}
            <p className="text-white/50 text-xs md:text-sm tracking-[0.5em] uppercase font-light mb-6">
              Guillaume Farré
            </p>

            {/* Phrase signature */}
            <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-light tracking-wide text-center px-8">
              Une Dino pour pinceau
            </h1>

            {/* Sous-titre */}
            <p className="text-white/40 text-sm md:text-base font-light tracking-widest mt-6">
              Toiles · Photographies · Performances
            </p>

            {/* Ligne fine horizontale */}
            <div className="h-px w-32 md:w-48 bg-white/20 mt-12" />
          </div>
        </div>
      )}
    </div>
  );
}
