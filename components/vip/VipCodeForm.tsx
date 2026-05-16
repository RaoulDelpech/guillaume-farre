"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

/**
 * Formulaire de saisie du code VIP 8 caracteres. Pose en overlay devant
 * les portes, glisse en fade in/out via AnimatePresence cote parent.
 *
 * @author Lalou
 */

export const VIP_CODE_LENGTH = 8;

interface VipCodeFormProps {
  code: string;
  error: string | null;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function VipCodeForm({
  code,
  error,
  loading,
  inputRef,
  onChange,
  onSubmit,
}: VipCodeFormProps) {
  const t = useTranslations("vip");

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-20"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="w-full max-w-xs px-6">
        <div className="text-center mb-8">
          <p
            className="text-xs tracking-[0.3em] uppercase font-light"
            style={{ color: "rgba(60,45,30,0.45)" }}
          >
            {t("tag")}
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
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
              name="code"
              type="text"
              value={code}
              onChange={(e) =>
                onChange(e.target.value.toUpperCase().slice(0, VIP_CODE_LENGTH))
              }
              placeholder={t("codeLabel")}
              maxLength={VIP_CODE_LENGTH}
              className="w-full px-4 py-3.5 bg-transparent text-center font-light tracking-[0.4em] text-base focus:outline-none min-h-[48px] uppercase"
              style={{ color: "rgb(60,45,30)" }}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
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
          <button
            type="submit"
            disabled={loading || code.length !== VIP_CODE_LENGTH}
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
  );
}
