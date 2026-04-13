"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Image from "next/image";

/**
 * Landing Coming Soon — Guillaume Farré
 *
 * Countdown vers 15 avril 2026, carousel photos, formulaire newsletter
 * Lien discret "Accès privé" qui révèle le formulaire mot de passe
 *
 * @author Lalou
 */
export default function LoginPage() {
  const t = useTranslations("comingSoon");
  const locale = useLocale();
  const router = useRouter();

  // États countdown
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // États carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselImages = ["/images/toiles/1.jpg", "/images/toiles/20.jpg", "/images/toiles/5.jpg"];

  // États formulaire newsletter
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  // États formulaire mot de passe
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Countdown
  useEffect(() => {
    const targetDate = new Date("2026-04-15T00:00:00+02:00"); // CET

    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Carousel autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Focus input password quand formulaire apparaît
  useEffect(() => {
    if (showPasswordForm && passwordInputRef.current) {
      setTimeout(() => passwordInputRef.current?.focus(), 200);
    }
  }, [showPasswordForm]);

  // Submit newsletter
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

  // Submit mot de passe
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push(`/${locale}`);
        router.refresh();
      } else {
        setPasswordError(true);
        setPasswordLoading(false);
      }
    } catch (error) {
      setPasswordError(true);
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFEFA] text-[#1a1a1a]">
      {/* 1. Titre */}
      <div className="pt-20 md:pt-24 pb-8 md:pb-12 text-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-wide">
          Guillaume Farré
        </h1>
      </div>

      {/* 2. Carousel */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        {carouselImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* 3. Grille photos */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 3, 5, 8, 11, 14].map((num) => (
            <div key={num} className="relative aspect-[4/3]">
              <Image
                src={`/images/works/photos/${num}.jpg`}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Countdown */}
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="flex justify-center gap-8 md:gap-16">
          <div className="flex flex-col items-center">
            <div className="text-5xl md:text-7xl font-light tracking-wider mb-2">
              {String(timeRemaining.days).padStart(2, "0")}
            </div>
            <div className="text-xs md:text-sm text-[#1a1a1a]/40 tracking-widest uppercase">
              {t("days")}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-5xl md:text-7xl font-light tracking-wider mb-2">
              {String(timeRemaining.hours).padStart(2, "0")}
            </div>
            <div className="text-xs md:text-sm text-[#1a1a1a]/40 tracking-widest uppercase">
              {t("hours")}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-5xl md:text-7xl font-light tracking-wider mb-2">
              {String(timeRemaining.minutes).padStart(2, "0")}
            </div>
            <div className="text-xs md:text-sm text-[#1a1a1a]/40 tracking-widest uppercase">
              {t("minutes")}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-5xl md:text-7xl font-light tracking-wider mb-2">
              {String(timeRemaining.seconds).padStart(2, "0")}
            </div>
            <div className="text-xs md:text-sm text-[#1a1a1a]/40 tracking-widest uppercase">
              {t("seconds")}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Formulaire newsletter */}
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
              className="w-full py-3 text-[#1a1a1a]/40 text-xs md:text-sm tracking-[0.3em] uppercase hover:text-[#1a1a1a]/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {newsletterStatus === "loading" ? "···" : t("submit")}
            </button>
          )}
        </form>
      </div>

      {/* 6. Lien "Accès privé" */}
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        {!showPasswordForm ? (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="text-[#1a1a1a]/20 text-xs tracking-widest uppercase hover:text-[#1a1a1a]/40 transition-colors"
          >
            {t("privateAccess")}
          </button>
        ) : (
          <div className="max-w-sm mx-auto animate-[fadeIn_0.5s_ease-out]">
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <input
                  ref={passwordInputRef}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("password")}
                  className="w-full px-0 py-4 bg-transparent border-0 border-b border-[#1a1a1a]/20 text-[#1a1a1a] text-center placeholder-[#1a1a1a]/30 font-light tracking-widest focus:outline-none focus:border-[#1a1a1a]/50 transition-colors"
                />
              </div>

              {passwordError && (
                <p className="text-center text-[#1a1a1a]/40 text-xs font-light tracking-wide">
                  {t("accessDenied")}
                </p>
              )}

              <button
                type="submit"
                disabled={passwordLoading || !password}
                className="w-full py-3 text-[#1a1a1a]/40 text-xs md:text-sm tracking-[0.3em] uppercase hover:text-[#1a1a1a]/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {passwordLoading ? "···" : t("enter")}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
