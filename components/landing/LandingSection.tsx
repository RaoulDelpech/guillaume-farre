"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";

/**
 * Section landing réutilisable — Grille photos + formulaire newsletter
 * Extraite de la page login, utilisée en bas des pages /toiles et /galerie
 *
 * @author Lalou
 */
export default function LandingSection() {
  const t = useTranslations("comingSoon");
  const locale = useLocale();

  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus("loading");
    setNewsletterMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setNewsletterStatus("error");
      setNewsletterMessage(t("invalidEmail"));
      return;
    }

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });

      if (res.ok) {
        setNewsletterStatus("success");
        setNewsletterMessage(t("success"));
        setEmail("");
      } else {
        const data = await res.json();
        setNewsletterStatus("error");
        setNewsletterMessage(data.error || t("error"));
      }
    } catch (error) {
      setNewsletterStatus("error");
      setNewsletterMessage(t("error"));
    }
  };

  return (
    <div className="bg-white text-[#1a1a1a]">
      {/* Grille photos */}
      <div className="container mx-auto px-4 pt-16 md:pt-24 pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 3, 5, 8, 11, 14].map((num, index) => (
            <div key={num} className="relative aspect-[4/3]">
              <Image
                src={`/images/works/photos/${num}.jpg`}
                alt={`Photographie de Guillaume Farré — n°${num}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Formulaire newsletter */}
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-xl">
        <p className="text-center text-[#1a1a1a]/60 text-sm md:text-base font-light tracking-wide mb-8">
          {t("emailLabel")}
        </p>
        <form onSubmit={handleNewsletterSubmit} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            disabled={newsletterStatus === "loading" || newsletterStatus === "success"}
            className="w-full px-0 py-4 bg-transparent border-0 border-b border-[#1a1a1a]/20 text-[#1a1a1a] text-center placeholder-[#1a1a1a]/30 font-light tracking-widest focus:outline-none focus:border-[#1a1a1a]/50 transition-colors disabled:opacity-50"
          />
          {newsletterStatus === "success" || newsletterStatus === "error" ? (
            <div className="text-center">
              <p
                className={`text-sm font-light tracking-wide ${
                  newsletterStatus === "success" ? "text-[#1a1a1a]/60" : "text-[#1a1a1a]/40"
                }`}
              >
                {newsletterMessage}
              </p>
            </div>
          ) : (
            <button
              type="submit"
              disabled={newsletterStatus === "loading" || !email}
              className="w-full min-h-[44px] py-3 text-[#1a1a1a]/60 text-xs md:text-sm tracking-[0.3em] uppercase hover:text-[#1a1a1a]/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {newsletterStatus === "loading" ? "···" : t("submit")}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
