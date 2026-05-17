"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import VipCodeForm, { VIP_CODE_LENGTH } from "./VipCodeForm";
import VipWelcomeOverlay from "./VipWelcomeOverlay";

/**
 * Entree VIP — refonte Sprint 4.5 : approche sobre noir/blanc en accord
 * avec l'identite minimaliste du site Guillaume Farre (galerie, lightbox,
 * navigation). Les anciennes portes en faux bois (VipDoorFrame + DoorPanel
 * + DoorHardware avec gradients CSS marron/dore et rotateY 85deg sur 2.8s)
 * etaient jugees kitsch, lentes et discordantes avec la charte graphique.
 *
 * Flow :
 *   1. `code` : champ de saisie sobre sur fond noir.
 *   2. `validating` : POST `/api/vip/validate` (cookie HMAC pose si OK).
 *   3. `opening` : fade-out du form + fade-in du slogan (~700ms).
 *   4. `welcome` : maintien du slogan, puis reload (~1200ms total).
 *
 * Total animation < 2s. Respecte prefers-reduced-motion (skip animations,
 * fade instant 200ms).
 *
 * @author Lalou
 */

const ANIMATION_OPENING_MS = 700;
const ANIMATION_WELCOME_MS = 1200;
const SHAKE_RESET_MS = 600;
const FOCUS_DELAY_MS = 300;

type Phase = "code" | "validating" | "opening" | "welcome";

function messageForError(
  errorCode: string | undefined,
  t: (key: string) => string
): string {
  switch (errorCode) {
    case "expired":
      return t("expired");
    case "revoked":
      return t("revoked");
    case "already_used":
      return t("alreadyUsed");
    default:
      return t("invalid");
  }
}

export default function VipDoorEntry() {
  const t = useTranslations("vip");
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("code");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleValidate = useCallback(
    async (codeToValidate?: string) => {
      const finalCode = (codeToValidate || code).toUpperCase();
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/vip/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: finalCode }),
        });

        if (res.ok) {
          setPhase("opening");
          const openingDelay = reduceMotion ? 200 : ANIMATION_OPENING_MS;
          setTimeout(() => setPhase("welcome"), openingDelay);
          return;
        }

        const data = await res.json().catch(() => ({}));
        setError(messageForError(data?.error, t));
        setShake(true);
        setTimeout(() => setShake(false), SHAKE_RESET_MS);
        setPhase("code");
        setLoading(false);
      } catch (networkError) {
        console.error("[vip] validate network error", networkError);
        setError(t("invalid"));
        setShake(true);
        setTimeout(() => setShake(false), SHAKE_RESET_MS);
        setPhase("code");
        setLoading(false);
      }
    },
    [code, t, reduceMotion]
  );

  useEffect(() => {
    const urlCode = searchParams.get("code");
    if (urlCode && urlCode.length === VIP_CODE_LENGTH) {
      setCode(urlCode.toUpperCase());
      setPhase("validating");
      void handleValidate(urlCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (phase === "code" && inputRef.current) {
      const id = setTimeout(() => inputRef.current?.focus(), FOCUS_DELAY_MS);
      return () => clearTimeout(id);
    }
  }, [phase]);

  // Apres welcome, on force un reload complet pour que le Server Component
  // parent re-evalue `getAccessLevel()` — router.refresh() seul ne suffit
  // pas (cf. note Sprint 0). Reload court car page deja en cache + cookie.
  useEffect(() => {
    if (phase !== "welcome") return;
    if (typeof window === "undefined") return;
    const welcomeDelay = reduceMotion ? 200 : ANIMATION_WELCOME_MS;
    const id = setTimeout(() => {
      window.location.reload();
    }, welcomeDelay);
    return () => clearTimeout(id);
  }, [phase, reduceMotion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleValidate();
  };

  const formVisible = phase === "code" || phase === "validating";
  const overlayVisible = phase === "opening" || phase === "welcome";
  const fadeDuration = reduceMotion ? 0.2 : 0.6;

  return (
    <div className="fixed inset-0 overflow-hidden bg-black flex items-center justify-center">
      <AnimatePresence mode="wait">
        {formVisible && (
          <motion.div
            key="form"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: fadeDuration, ease: "easeOut" }}
          >
            <VipCodeForm
              code={code}
              error={error}
              loading={loading}
              inputRef={inputRef}
              shake={shake}
              onChange={setCode}
              onSubmit={handleSubmit}
            />
          </motion.div>
        )}
        {overlayVisible && (
          <motion.div
            key="welcome"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: fadeDuration, ease: "easeOut" }}
          >
            <VipWelcomeOverlay />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
