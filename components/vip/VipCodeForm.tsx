"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

/**
 * Formulaire de saisie du code VIP (8 caracteres) — Sprint 6 : composant
 * autonome (gere fetch + reload). Refactor de Sprint 4.5 : on a retire
 * l'orchestrateur `VipDoorEntry` et l'overlay `VipWelcomeOverlay` (splash
 * "Bienvenue dans l'atelier" abandonne). Apres validation du code, on
 * recharge directement la page pour que le Server Component parent
 * re-evalue `getAccessLevel()`.
 *
 * Comportement :
 *  1. Si `?code=XXXXXXXX` dans l'URL : autoset + validation immediate.
 *  2. Sinon : saisie clavier 8 chars, submit POST `/api/vip/validate`.
 *  3. En cas de succes : `window.location.reload()` (Server Component re-render).
 *  4. En cas d'erreur : message + shake (Framer Motion) + reset focus.
 *
 * @author Lalou
 */

export const VIP_CODE_LENGTH = 8;

const SHAKE_KEYFRAMES = [0, -4, 4, -3, 3, -1, 1, 0];
const SHAKE_DURATION_S = 0.5;
const SHAKE_RESET_MS = 600;
const FOCUS_DELAY_MS = 300;

function messageForError(
  errorCode: string | undefined,
  t: (key: string) => string,
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

export default function VipCodeForm() {
  const t = useTranslations("vip");
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

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
          // Server Component parent re-evaluera getAccessLevel() apres reload.
          window.location.reload();
          return;
        }

        const data = await res.json().catch(() => ({}));
        setError(messageForError(data?.error, t));
        setShake(true);
        setTimeout(() => setShake(false), SHAKE_RESET_MS);
        setLoading(false);
      } catch (networkError) {
        console.error("[vip] validate network error", networkError);
        setError(t("invalid"));
        setShake(true);
        setTimeout(() => setShake(false), SHAKE_RESET_MS);
        setLoading(false);
      }
    },
    [code, t],
  );

  // Auto-validation si ?code=XXXXXXXX present dans l'URL (lien magique).
  useEffect(() => {
    const urlCode = searchParams.get("code");
    if (urlCode && urlCode.length === VIP_CODE_LENGTH) {
      setCode(urlCode.toUpperCase());
      void handleValidate(urlCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (!loading && inputRef.current) {
      const id = setTimeout(() => inputRef.current?.focus(), FOCUS_DELAY_MS);
      return () => clearTimeout(id);
    }
  }, [loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleValidate();
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-black flex items-center justify-center">
      <motion.div
        className="w-full max-w-xs px-6"
        animate={shake ? { x: SHAKE_KEYFRAMES } : { x: 0 }}
        transition={shake ? { duration: SHAKE_DURATION_S, ease: "easeInOut" } : {}}
      >
        <div className="text-center mb-10">
          <div className="h-px w-16 mx-auto mb-6 bg-white/15" />
          <p className="text-xs tracking-[0.4em] uppercase font-light text-white/50">
            {t("tag")}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input
              ref={inputRef}
              name="code"
              type="text"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.toUpperCase().slice(0, VIP_CODE_LENGTH))
              }
              placeholder={t("codeLabel")}
              maxLength={VIP_CODE_LENGTH}
              className="w-full px-4 py-3.5 bg-transparent text-center font-light tracking-[0.4em] text-base text-white placeholder:text-white/25 focus:outline-none min-h-[48px] uppercase border-b border-white/20 focus:border-white/60 transition-colors duration-300"
              autoComplete="off"
              spellCheck={false}
              disabled={loading}
            />
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-light text-center tracking-wide text-red-300/80"
            >
              {error}
            </motion.p>
          )}
          <button
            type="submit"
            disabled={loading || code.length !== VIP_CODE_LENGTH}
            className="w-full py-3 text-xs sm:text-sm tracking-[0.3em] uppercase transition-colors duration-300 disabled:opacity-25 disabled:cursor-not-allowed min-h-[48px] flex items-center justify-center border border-white/30 text-white/85 hover:bg-white hover:text-black"
          >
            {loading ? "..." : t("enter")}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
