"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

/**
 * Bouton "Sortir" pose dans le header VIP. POST `/api/vip/logout` pour
 * effacer le cookie `gf_vip` (HttpOnly — impossible de le faire cote JS
 * seul), puis `router.refresh()` pour que le Server Component parent
 * re-evalue et bascule sur `VipDoorEntry`.
 *
 * Le bouton reste cliquable meme si la requete echoue : tant qu'on a
 * appele router.refresh(), la vue server-side rechecke `getAccessLevel()`
 * et redirige correctement si le cookie est bien parti.
 *
 * @author Lalou
 */
export default function VipExitButton() {
  const t = useTranslations("vip");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      await fetch("/api/vip/logout", { method: "POST" });
    } catch (err) {
      console.error("[vip] logout request failed", err);
    } finally {
      router.refresh();
      setLoading(false);
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
