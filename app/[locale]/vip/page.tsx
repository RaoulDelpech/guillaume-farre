"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Page d'entree VIP — Double porte d'atelier en bois
 *
 * Flow :
 * 1. Si ?code=XXXXXXXX en URL -> validation automatique
 * 2. Sinon -> champ de saisie code 8 chars devant les portes
 * 3. Code invalide -> portes tremblent (shake)
 * 4. Code valide -> lumiere chaude filtre -> portes s'ouvrent vers l'exterieur -> redirect /toiles
 *
 * @author Lalou
 */
export default function VipPage() {
  const t = useTranslations("vip");
  const locale = useLocale();
  const [phase, setPhase] = useState<
    "code" | "validating" | "opening" | "welcome"
  >("code");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [accessLevel, setAccessLevel] = useState<"hidden" | "secret">(
    "secret"
  );
  const [shake, setShake] = useState(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Focus input
  useEffect(() => {
    if (phase === "code" && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [phase]);

  // Redirect apres welcome
  useEffect(() => {
    if (phase === "welcome") {
      const timer = setTimeout(() => {
        const destination =
          accessLevel === "secret"
            ? `/${locale}/toiles`
            : `/${locale}/galerie`;
        router.push(destination);
        router.refresh();
      }, 3500);
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
        setAccessLevel(data.accessLevel || "secret");
        setPhase("opening");
        setTimeout(() => setPhase("welcome"), 3000);
      } else {
        const data = await res.json();
        if (data.error === "expired") {
          setError(t("expired"));
        } else if (data.error === "already_used") {
          setError(t("alreadyUsed"));
        } else {
          setError(t("invalid"));
        }
        setShake(true);
        setTimeout(() => setShake(false), 600);
        setPhase("code");
        setLoading(false);
      }
    } catch {
      setError(t("invalid"));
      setShake(true);
      setTimeout(() => setShake(false), 600);
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
    <div
      className="fixed inset-0 overflow-hidden flex items-center justify-center"
      style={{ background: "#FEFEFA" }}
    >
      {/* Lumiere chaude derriere les portes */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: doorsOpen ? 1 : 0,
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,220,150,0.5) 0%, rgba(255,200,120,0.2) 40%, transparent 70%)",
        }}
      />

      {/* Encadrement de porte en pierre sombre */}
      <div className="relative" style={{ perspective: "1200px" }}>
        {/* Cadre exterieur — pierre/bois sombre */}
        <div
          className="relative px-3 sm:px-4 pt-3 sm:pt-4 pb-4 sm:pb-5 rounded-t-lg"
          style={{
            background:
              "linear-gradient(180deg, #3d3228 0%, #2e261f 50%, #251f19 100%)",
            boxShadow:
              "0 25px 80px rgba(0,0,0,0.35), 0 8px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Linteau decoratif */}
          <div
            className="absolute top-0 left-0 right-0 h-3 sm:h-4 rounded-t-lg"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          />

          {/* Moulure interieure du cadre */}
          <div
            className="relative overflow-hidden rounded-sm"
            style={{
              boxShadow:
                "inset 0 0 15px rgba(0,0,0,0.5), inset 0 0 3px rgba(0,0,0,0.3)",
            }}
          >
            {/* Container des deux battants */}
            <div
              className="relative flex"
              style={{
                width: "min(80vw, 520px)",
                height: "min(65vh, 580px)",
              }}
            >
              {/* Battant gauche */}
              <motion.div
                className="relative w-1/2 h-full origin-left"
                style={{
                  transformStyle: "preserve-3d",
                }}
                animate={{
                  rotateY: doorsOpen ? -85 : 0,
                }}
                transition={{
                  duration: 2.5,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: doorsOpen ? 0.3 : 0,
                }}
              >
                <DoorPanel side="left" shake={shake} />
              </motion.div>

              {/* Battant droit */}
              <motion.div
                className="relative w-1/2 h-full origin-right"
                style={{
                  transformStyle: "preserve-3d",
                }}
                animate={{
                  rotateY: doorsOpen ? 85 : 0,
                }}
                transition={{
                  duration: 2.5,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: doorsOpen ? 0.3 : 0,
                }}
              >
                <DoorPanel side="right" shake={shake} />
              </motion.div>

              {/* Ligne centrale entre les battants */}
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full z-10"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(60,45,30,0.6) 0%, rgba(40,30,20,0.8) 50%, rgba(60,45,30,0.6) 100%)",
                }}
                animate={{ opacity: doorsOpen ? 0 : 1 }}
                transition={{ duration: 1 }}
              />

              {/* Lumiere qui filtre entre les battants au moment de l'ouverture */}
              <AnimatePresence>
                {doorsOpen && (
                  <motion.div
                    className="absolute inset-0 z-[5]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(255,215,130,0.7) 0%, rgba(255,195,100,0.3) 40%, transparent 65%)",
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Seuil de porte en bas */}
          <div
            className="absolute bottom-0 left-0 right-0 h-4 sm:h-5"
            style={{
              background:
                "linear-gradient(180deg, #2e261f 0%, #3d3228 60%, #4a3d32 100%)",
              borderTop: "1px solid rgba(255,255,255,0.04)",
            }}
          />
        </div>
      </div>

      {/* Formulaire code VIP — superpose devant les portes */}
      <AnimatePresence>
        {(phase === "code" || phase === "validating") && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="w-full max-w-xs px-6">
              {/* Tag invitation */}
              <div className="text-center mb-8">
                <p
                  className="text-xs tracking-[0.3em] uppercase font-light"
                  style={{ color: "rgba(60,45,30,0.45)" }}
                >
                  {t("tag")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Champ de saisie */}
                <div
                  className="relative rounded-md overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(8px)",
                    boxShadow:
                      "0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
                    border: "1px solid rgba(160,130,80,0.2)",
                  }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.toUpperCase().slice(0, 8))
                    }
                    placeholder={t("codeLabel")}
                    maxLength={8}
                    className="w-full px-4 py-3.5 bg-transparent text-center font-light tracking-[0.4em] text-base focus:outline-none min-h-[48px] uppercase"
                    style={{
                      color: "rgb(60,45,30)",
                    }}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                {/* Message d'erreur */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-light text-center tracking-wide"
                    style={{ color: "rgba(160,80,60,0.7)" }}
                  >
                    {error}
                  </motion.p>
                )}

                {/* Bouton entrer — style laiton/or */}
                <button
                  type="submit"
                  disabled={loading || code.length !== 8}
                  className="w-full py-3 text-xs sm:text-sm tracking-[0.3em] uppercase transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed min-h-[48px] flex items-center justify-center rounded-md"
                  style={{
                    background:
                      "linear-gradient(180deg, #a08850 0%, #8c6e32 50%, #7a5f2a 100%)",
                    color: "rgba(255,255,255,0.9)",
                    boxShadow:
                      "0 2px 10px rgba(140,110,50,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                    border: "1px solid rgba(140,110,50,0.4)",
                  }}
                >
                  {loading ? "..." : t("enter")}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message de bienvenue VIP — apparait quand les portes sont ouvertes */}
      <AnimatePresence>
        {phase === "welcome" && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            <div className="flex flex-col items-center">
              <div
                className="h-px w-32 md:w-48 mb-10"
                style={{ background: "rgba(140,110,50,0.3)" }}
              />
              <p
                className="text-xs md:text-sm tracking-[0.5em] uppercase font-light mb-5"
                style={{ color: "rgba(60,45,30,0.5)" }}
              >
                Guillaume Farré
              </p>
              <h1
                className="text-2xl md:text-4xl lg:text-5xl font-light tracking-wide text-center px-8"
                style={{ color: "rgb(60,45,30)" }}
              >
                {t("welcome")}
              </h1>
              <p
                className="text-sm md:text-base font-light tracking-widest mt-5"
                style={{ color: "rgba(60,45,30,0.45)" }}
              >
                {t("welcomeSubtitle")}
              </p>
              <div
                className="h-px w-32 md:w-48 mt-10"
                style={{ background: "rgba(140,110,50,0.3)" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
 * Composant panneau de porte en bois
 * ============================================================ */

function DoorPanel({
  side,
  shake,
}: {
  side: "left" | "right";
  shake: boolean;
}) {
  const isLeft = side === "left";

  return (
    <motion.div
      className="absolute inset-0"
      animate={shake ? { x: [0, -4, 4, -3, 3, -1, 1, 0] } : { x: 0 }}
      transition={shake ? { duration: 0.5, ease: "easeInOut" } : {}}
    >
      {/* Surface bois principale */}
      <div
        className="absolute inset-0"
        style={{
          background: isLeft
            ? "linear-gradient(165deg, #b08450 0%, #9a7040 25%, #8a6235 50%, #7d5830 75%, #6e4d28 100%)"
            : "linear-gradient(195deg, #b08450 0%, #9a7040 25%, #8a6235 50%, #7d5830 75%, #6e4d28 100%)",
        }}
      >
        {/* Grain du bois — lignes fines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                ${isLeft ? "178deg" : "182deg"},
                transparent,
                transparent 5px,
                rgba(90,55,25,0.12) 5px,
                rgba(90,55,25,0.12) 6px,
                transparent 6px,
                transparent 17px,
                rgba(70,42,18,0.08) 17px,
                rgba(70,42,18,0.08) 18px
              ),
              repeating-linear-gradient(
                ${isLeft ? "176deg" : "184deg"},
                transparent,
                transparent 29px,
                rgba(110,70,30,0.06) 29px,
                rgba(110,70,30,0.06) 30px,
                transparent 30px,
                transparent 47px,
                rgba(80,50,20,0.04) 47px,
                rgba(80,50,20,0.04) 48px
              )
            `,
          }}
        />

        {/* Noeuds de bois decoratifs (subtils) */}
        <div
          className="absolute hidden sm:block"
          style={{
            top: isLeft ? "22%" : "65%",
            left: isLeft ? "35%" : "55%",
            width: "30px",
            height: "18px",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(70,40,15,0.15) 0%, rgba(90,55,25,0.08) 50%, transparent 70%)",
          }}
        />
        <div
          className="absolute hidden sm:block"
          style={{
            top: isLeft ? "72%" : "28%",
            left: isLeft ? "60%" : "30%",
            width: "22px",
            height: "14px",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(70,40,15,0.1) 0%, rgba(90,55,25,0.05) 50%, transparent 70%)",
          }}
        />

        {/* Reflet de lumiere sur le bois */}
        <div
          className="absolute inset-0"
          style={{
            background: isLeft
              ? "linear-gradient(120deg, rgba(255,255,255,0.06) 0%, transparent 40%, rgba(0,0,0,0.04) 100%)"
              : "linear-gradient(60deg, rgba(0,0,0,0.04) 0%, transparent 60%, rgba(255,255,255,0.06) 100%)",
          }}
        />

        {/* Panneau central en relief — moulure classique */}
        <div
          className="absolute"
          style={{
            top: "8%",
            left: "12%",
            right: "12%",
            bottom: "8%",
          }}
        >
          {/* Bordure exterieure de la moulure */}
          <div
            className="absolute inset-0 rounded-[1px]"
            style={{
              border: "2px solid rgba(80,50,25,0.2)",
              boxShadow:
                "inset 2px 2px 4px rgba(0,0,0,0.1), inset -1px -1px 2px rgba(255,255,255,0.08), 1px 1px 3px rgba(0,0,0,0.06)",
            }}
          />

          {/* Panneau interieur — leger creux */}
          <div
            className="absolute rounded-[1px]"
            style={{
              top: "6px",
              left: "6px",
              right: "6px",
              bottom: "6px",
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.03) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.04) 100%)",
              boxShadow:
                "inset 1px 1px 3px rgba(0,0,0,0.06), inset -1px -1px 2px rgba(255,255,255,0.05)",
            }}
          />

          {/* Traverse horizontale centrale — separation classique */}
          <div
            className="absolute left-[6px] right-[6px]"
            style={{
              top: "48%",
              height: "5px",
              background:
                "linear-gradient(180deg, rgba(80,50,25,0.15) 0%, rgba(60,38,18,0.2) 50%, rgba(80,50,25,0.15) 100%)",
              boxShadow:
                "0 1px 1px rgba(255,255,255,0.06), 0 -1px 1px rgba(0,0,0,0.06)",
            }}
          />
        </div>

        {/* Poignee en laiton */}
        <div
          className="absolute top-1/2 -translate-y-1/2 z-10"
          style={{
            [isLeft ? "right" : "left"]: "10%",
          }}
        >
          {/* Rosace de la poignee */}
          <div
            className="relative"
            style={{
              width: "clamp(32px, 5vw, 44px)",
              height: "clamp(32px, 5vw, 44px)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, #d4b06a 0%, #b8943e 30%, #8c6e32 60%, #705828 100%)",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,220,150,0.3), inset 0 -1px 2px rgba(0,0,0,0.15)",
              border: "1px solid rgba(140,110,50,0.5)",
            }}
          >
            {/* Trou de serrure */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-[1px]">
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, #3a2a15 0%, #2a1d0f 100%)",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
                }}
              />
              <div
                style={{
                  width: "3px",
                  height: "6px",
                  borderRadius: "0 0 1px 1px",
                  background:
                    "linear-gradient(180deg, #3a2a15 0%, #2a1d0f 100%)",
                  boxShadow: "inset 0 1px 1px rgba(0,0,0,0.3)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Charnieres — cote oppose a la poignee */}
        {[15, 50, 85].map((top) => (
          <div
            key={top}
            className="absolute z-10"
            style={{
              top: `${top}%`,
              [isLeft ? "left" : "right"]: "-1px",
              transform: "translateY(-50%)",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "clamp(24px, 3.5vw, 32px)",
                borderRadius: "1px",
                background:
                  "linear-gradient(180deg, #c4a55a 0%, #a88d40 40%, #8c7535 100%)",
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,220,150,0.25)",
                border: "1px solid rgba(140,110,50,0.4)",
                position: "relative",
              }}
            >
              {/* Vis de la charniere */}
              <div
                style={{
                  position: "absolute",
                  top: "25%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, #7a6528 0%, #6a5822 100%)",
                  boxShadow:
                    "inset 0 0.5px 1px rgba(0,0,0,0.3), 0 0.5px 0 rgba(255,220,150,0.15)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "75%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, #7a6528 0%, #6a5822 100%)",
                  boxShadow:
                    "inset 0 0.5px 1px rgba(0,0,0,0.3), 0 0.5px 0 rgba(255,220,150,0.15)",
                }}
              />
            </div>
          </div>
        ))}

        {/* Ombre portee interieure pour la profondeur */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: isLeft
              ? "inset -4px 0 12px rgba(0,0,0,0.15), inset 0 4px 8px rgba(0,0,0,0.05), inset 0 -4px 8px rgba(0,0,0,0.05)"
              : "inset 4px 0 12px rgba(0,0,0,0.15), inset 0 4px 8px rgba(0,0,0,0.05), inset 0 -4px 8px rgba(0,0,0,0.05)",
          }}
        />
      </div>
    </motion.div>
  );
}
