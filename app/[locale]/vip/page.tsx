"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

/**
 * Page d'entree VIP — Invitation privee
 * Meme ambiance portes d'atelier que le login, mais avec code VIP
 *
 * Flow :
 * 1. Si ?code=XXXXXXXX en URL → validation automatique
 * 2. Sinon → champ de saisie code 8 chars
 * 3. Code valide → portes s'ouvrent → message invitation → redirect /toiles
 *
 * @author Lalou
 */
export default function VipPage() {
  const t = useTranslations("vip");
  const locale = useLocale();
  const [phase, setPhase] = useState<"code" | "validating" | "opening" | "welcome">("code");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [accessLevel, setAccessLevel] = useState<'hidden' | 'secret'>('secret');
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-validation si code en query param
  useEffect(() => {
    const urlCode = searchParams.get("code");
    if (urlCode && urlCode.length === 8) {
      setCode(urlCode.toUpperCase());
      setPhase("validating");
      handleValidate(urlCode);
    }
  }, [searchParams]);

  // Focus input
  useEffect(() => {
    if (phase === "code" && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [phase]);

  // Redirect apres welcome — galerie pour hidden, toiles pour secret
  useEffect(() => {
    if (phase === "welcome") {
      const timer = setTimeout(() => {
        const destination = accessLevel === 'secret' ? `/${locale}/toiles` : `/${locale}/galerie`;
        router.push(destination);
        router.refresh();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [phase, router, accessLevel, locale]);

  async function handleValidate(codeToValidate?: string) {
    const finalCode = codeToValidate || code;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/vip/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: finalCode.toUpperCase() }),
      });

      if (res.ok) {
        const data = await res.json();
        setAccessLevel(data.accessLevel || 'secret');
        setPhase("opening");
        setTimeout(() => setPhase("welcome"), 5500);
      } else {
        const data = await res.json();
        if (data.error === "expired") {
          setError(t("expired"));
        } else if (data.error === "already_used") {
          setError(t("alreadyUsed"));
        } else {
          setError(t("invalid"));
        }
        setPhase("code");
        setLoading(false);
      }
    } catch {
      setError(t("invalid"));
      setPhase("code");
      setLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleValidate();
  };

  const doorsOpen = phase === "opening" || phase === "welcome";

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Porte gauche */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-[5000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          doorsOpen ? "-translate-x-full" : "translate-x-0"
        }`}
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
          boxShadow: "inset -20px 0 60px rgba(0,0,0,0.8)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)`,
          }}
        />
        <div className="hidden md:block absolute top-8 right-8 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        <div className="hidden md:block absolute top-8 right-20 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        <div className="hidden md:block absolute bottom-8 right-8 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        <div className="hidden md:block absolute bottom-8 right-20 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        <div className="absolute top-1/2 right-4 md:right-6 -translate-y-1/2 w-1.5 md:w-2 h-16 md:h-24 bg-zinc-500 rounded-full shadow-lg" />
      </div>

      {/* Porte droite */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full transition-transform duration-[5000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          doorsOpen ? "translate-x-full" : "translate-x-0"
        }`}
        style={{
          background: "linear-gradient(225deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
          boxShadow: "inset 20px 0 60px rgba(0,0,0,0.8)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)`,
          }}
        />
        <div className="hidden md:block absolute top-8 left-8 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        <div className="hidden md:block absolute top-8 left-20 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        <div className="hidden md:block absolute bottom-8 left-8 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        <div className="hidden md:block absolute bottom-8 left-20 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
        <div className="absolute top-1/2 left-4 md:left-6 -translate-y-1/2 w-1.5 md:w-2 h-16 md:h-24 bg-zinc-500 rounded-full shadow-lg" />
      </div>

      {/* Ligne centrale */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-black/50 transition-opacity duration-[5000ms] ${
          doorsOpen ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Formulaire code VIP (portes fermees) */}
      {(phase === "code" || phase === "validating") && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-full max-w-sm px-8 animate-[fadeIn_1s_ease-out_0.3s_both]">
            <div className="text-center mb-12">
              <p className="text-white/40 text-xs tracking-[0.3em] uppercase font-light">
                {t("tag")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <input
                  ref={inputRef}
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 8))}
                  placeholder={t("codeLabel")}
                  maxLength={8}
                  className="w-full px-0 py-4 bg-transparent border-0 border-b border-white/20 text-white text-center placeholder-white/30 font-light tracking-[0.5em] text-lg focus:outline-none focus:border-white/50 transition-colors min-h-[44px] uppercase"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              {error && (
                <p className="text-white/50 text-xs font-light text-center tracking-wide">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || code.length !== 8}
                className="w-full py-3 text-white/40 text-xs sm:text-sm tracking-[0.3em] uppercase hover:text-white/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed min-h-[48px] flex items-center justify-center"
              >
                {loading ? "···" : t("enter")}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Message de bienvenue VIP */}
      {(phase === "opening" || phase === "welcome") && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
          <div className={`flex flex-col items-center transition-opacity duration-[2000ms] ${
            phase === "welcome" ? "opacity-100" : "opacity-0"
          }`}>
            <div className="h-px w-32 md:w-48 bg-white/20 mb-12" />

            <p className="text-white/50 text-xs md:text-sm tracking-[0.5em] uppercase font-light mb-6">
              Guillaume Farré
            </p>

            <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-light tracking-wide text-center px-8">
              {t("welcome")}
            </h1>

            <p className="text-white/40 text-sm md:text-base font-light tracking-widest mt-6">
              {t("welcomeSubtitle")}
            </p>

            <div className="h-px w-32 md:w-48 bg-white/20 mt-12" />
          </div>
        </div>
      )}
    </div>
  );
}
