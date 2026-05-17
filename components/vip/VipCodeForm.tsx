"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

/**
 * Formulaire de saisie du code VIP (8 caracteres). Refonte Sprint 4.5 :
 * palette sobre noir/blanc en accord avec l'identite graphique du site.
 * Le shake (rejet code) est porte directement sur le form via prop
 * `shake` (avant : transmis aux DoorPanel maintenant supprimes).
 *
 * @author Lalou
 */

export const VIP_CODE_LENGTH = 8;

const SHAKE_KEYFRAMES = [0, -4, 4, -3, 3, -1, 1, 0];
const SHAKE_DURATION_S = 0.5;

interface VipCodeFormProps {
  code: string;
  error: string | null;
  loading: boolean;
  shake: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function VipCodeForm({
  code,
  error,
  loading,
  shake,
  inputRef,
  onChange,
  onSubmit,
}: VipCodeFormProps) {
  const t = useTranslations("vip");

  return (
    <motion.div
      className="w-full max-w-xs px-6"
      animate={shake ? { x: SHAKE_KEYFRAMES } : { x: 0 }}
      transition={
        shake ? { duration: SHAKE_DURATION_S, ease: "easeInOut" } : {}
      }
    >
      <div className="text-center mb-10">
        <div className="h-px w-16 mx-auto mb-6 bg-white/15" />
        <p className="text-xs tracking-[0.4em] uppercase font-light text-white/50">
          {t("tag")}
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="relative">
          <input
            ref={inputRef}
            name="code"
            type="text"
            value={code}
            onChange={(e) =>
              onChange(e.target.value.toUpperCase().slice(0, VIP_CODE_LENGTH))
            }
            placeholder={t("codeLabel")}
            maxLength={VIP_CODE_LENGTH}
            className="w-full px-4 py-3.5 bg-transparent text-center font-light tracking-[0.4em] text-base text-white placeholder:text-white/25 focus:outline-none min-h-[48px] uppercase border-b border-white/20 focus:border-white/60 transition-colors duration-300"
            autoComplete="off"
            spellCheck={false}
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
  );
}
