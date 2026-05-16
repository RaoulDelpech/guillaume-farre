"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Bouton "Sortir" pose dans le header VIP. POST `/api/vip/logout` pour
 * effacer le cookie `gf_vip` (HttpOnly — impossible de le faire cote JS
 * seul), puis `window.location.reload()` pour que le Server Component
 * parent `/[locale]/vip` re-evalue `getAccessLevel()` et bascule sur
 * `VipDoorEntry`.
 *
 * On evite `router.refresh()` ici parce qu'il garde le composant client
 * `VipPrivateView` monte meme quand le server change la decision —
 * meme symptome observe Sprint 1 sur le flux entree -> vue privee.
 * `window.location.reload()` est un peu plus heavy (un round-trip HTML)
 * mais garantit que le swap Client Component A -> B est commite.
 *
 * @author Lalou
 */
export default function VipExitButton() {
  const t = useTranslations("vip");
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      await fetch("/api/vip/logout", { method: "POST" });
    } catch (err) {
      console.error("[vip] logout request failed", err);
    } finally {
      if (typeof window !== "undefined") {
        window.location.reload();
      } else {
        setLoading(false);
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="text-xs sm:text-sm font-light tracking-[0.2em] uppercase text-neutral-600 hover:text-[#8c6e32] transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px] px-3"
    >
      {t("exit")}
    </button>
  );
}
