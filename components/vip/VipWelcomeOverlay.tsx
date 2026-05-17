"use client";

import { useTranslations } from "next-intl";

/**
 * Slogan affiche apres validation du code VIP, avant le reload qui bascule
 * vers la vue privee. Refonte Sprint 4.5 : typographie sobre blanche sur
 * fond noir (cohesion charte graphique site). L'animation d'entree/sortie
 * est portee par le parent VipDoorEntry via Framer Motion + AnimatePresence,
 * cf. respect prefers-reduced-motion.
 *
 * @author Lalou
 */
export default function VipWelcomeOverlay() {
  const t = useTranslations("vip");

  return (
    <div className="flex flex-col items-center px-8 text-center">
      <div className="h-px w-24 md:w-32 mb-8 bg-white/20" />
      <p className="text-[10px] md:text-xs tracking-[0.5em] uppercase font-light text-white/40 mb-4">
        Guillaume Farré
      </p>
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-extralight tracking-wide text-white">
        {t("welcome")}
      </h1>
      <p className="text-xs md:text-sm font-light tracking-[0.2em] mt-4 text-white/50">
        {t("welcomeSubtitle")}
      </p>
      <div className="h-px w-24 md:w-32 mt-8 bg-white/20" />
    </div>
  );
}
