"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import VipDoorFrame from "./VipDoorFrame";
import VipCodeForm, { VIP_CODE_LENGTH } from "./VipCodeForm";
import VipWelcomeOverlay from "./VipWelcomeOverlay";

/**
 * Porte d'entree VIP : saisie d'un code 8 caracteres, animation des
 * portes d'atelier en bois, puis bascule vers la vue privee.
 *
 * Flow :
 * 1. Phase `code` : champ de saisie devant les portes fermees.
 * 2. Phase `validating` : POST `/api/vip/validate` (cookie HMAC pose si OK).
 * 3. Phase `opening` : portes pivotent vers l'exterieur (rotateY 85deg).
 * 4. Phase `welcome` : overlay de bienvenue + `router.refresh()` qui
 *    re-evalue le Server Component parent `/[locale]/vip` — comme le cookie
 *    est maintenant pose, il rendra `VipPrivateView` automatiquement.
 *
 * Si `?code=XXXXXXXX` est passe en URL, la validation est declenchee
 * automatiquement (pratique pour les QR codes). Branches d'erreur :
 * `invalid`, `expired`, `revoked`, `already_used` (defense en profondeur
 * Sprint 0 — codes poly-use 24h, ce dernier ne devrait plus se declencher
 * mais reste gere proprement).
 *
 * @author Lalou
 */

const ANIMATION_OPENING_MS = 3000;
const ANIMATION_WELCOME_MS = 3500;
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

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
          setTimeout(() => setPhase("welcome"), ANIMATION_OPENING_MS);
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
    [code, t]
  );

  // Auto-validation depuis ?code= (QR code)
  useEffect(() => {
    const urlCode = searchParams.get("code");
    if (urlCode && urlCode.length === VIP_CODE_LENGTH) {
      setCode(urlCode.toUpperCase());
      setPhase("validating");
      void handleValidate(urlCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Focus input quand le formulaire est visible
  useEffect(() => {
    if (phase === "code" && inputRef.current) {
      const id = setTimeout(() => inputRef.current?.focus(), FOCUS_DELAY_MS);
      return () => clearTimeout(id);
    }
  }, [phase]);

  // Apres welcome, on demande au server component parent de re-rendre.
  // Avec le cookie HMAC desormais pose, il retournera VipPrivateView.
  useEffect(() => {
    if (phase !== "welcome") return;
    const id = setTimeout(() => router.refresh(), ANIMATION_WELCOME_MS);
    return () => clearTimeout(id);
  }, [phase, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleValidate();
  };

  const doorsOpen = phase === "opening" || phase === "welcome";
  const formVisible = phase === "code" || phase === "validating";

  return (
    <div
      className="fixed inset-0 overflow-hidden flex items-center justify-center"
      style={{ background: "inherit" }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: doorsOpen ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,220,150,0.5) 0%, rgba(255,200,120,0.2) 40%, transparent 70%)",
        }}
      />
      <VipDoorFrame doorsOpen={doorsOpen} shake={shake} />
      <AnimatePresence>
        {formVisible && (
          <VipCodeForm
            code={code}
            error={error}
            loading={loading}
            inputRef={inputRef}
            onChange={setCode}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {phase === "welcome" && <VipWelcomeOverlay />}
      </AnimatePresence>
    </div>
  );
}
