"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

/**
 * Overlay de bienvenue affiche apres l'ouverture des portes, avant le
 * `router.refresh()` qui bascule la page sur la vue privee.
 *
 * @author Lalou
 */
export default function VipWelcomeOverlay() {
  const t = useTranslations("vip");

  return (
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
  );
}
