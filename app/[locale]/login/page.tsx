"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Page de login avec portes d'atelier industrielles
 * Ambiance confidentielle / club privé
 *
 * Séquence :
 * 1. Portes fermées avec texte
 * 2. Clic "Entrer" → portes s'ouvrent
 * 3. Champ mot de passe apparaît
 * 4. Login → redirect vers site avec vidéo
 *
 * @author Lalou
 */
export default function LoginPage() {
  const [phase, setPhase] = useState<"doors" | "password" | "success">("doors");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus sur le champ password quand il apparaît
  useEffect(() => {
    if (phase === "password" && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [phase]);

  const handleEnter = () => {
    setPhase("password");
  };

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
      setPhase("success");
      // Cookie pour déclencher la vidéo après login
      document.cookie = "gf_dark_entry_seen=true;path=/;max-age=604800";
      setTimeout(() => {
        router.push("/fr");
        router.refresh();
      }, 800);
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Porte gauche */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          phase !== "doors" ? "-translate-x-full" : "translate-x-0"
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
        className={`absolute top-0 right-0 w-1/2 h-full transition-transform duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          phase !== "doors" ? "translate-x-full" : "translate-x-0"
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
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-black/50 transition-opacity duration-500 ${
          phase !== "doors" ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Contenu portes fermées */}
      {phase === "doors" && (
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
            className="mt-12 sm:mt-16 text-white/30 text-xs sm:text-sm tracking-[0.3em] uppercase hover:text-white/60 transition-colors pointer-events-auto animate-[fadeIn_1s_ease-out_1.5s_both] min-h-[48px] px-6 flex items-center justify-center"
          >
            Entrer
          </button>
        </div>
      )}

      {/* Formulaire mot de passe (après ouverture des portes) */}
      {(phase === "password" || phase === "success") && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
            phase === "success" ? "opacity-0" : "opacity-100"
          }`}
          style={{ animationDelay: "1s" }}
        >
          <div className="w-full max-w-sm px-8 animate-[fadeIn_1s_ease-out_0.5s_both]">
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
                {loading ? "···" : "Valider"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
