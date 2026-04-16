"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

/**
 * Page login — Accès admin uniquement
 *
 * Formulaire mot de passe simple pour accès admin.
 * Redirige vers /admin si mot de passe correct.
 *
 * @author Lalou
 */
export default function LoginPage() {
  const t = useTranslations("login");
  const locale = useLocale();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Focus input au chargement
  useEffect(() => {
    passwordInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
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
        router.push(`/${locale}/admin`);
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl md:text-4xl font-light tracking-wide text-zinc-900 text-center mb-12">
          {t("title")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <input
              ref={passwordInputRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("password")}
              className="w-full px-0 py-4 bg-transparent border-0 border-b border-zinc-300 text-zinc-900 text-center placeholder-zinc-400 font-light tracking-wide focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          {passwordError && (
            <p className="text-center text-zinc-500 text-sm font-light tracking-wide">
              {t("error")}
            </p>
          )}

          <button
            type="submit"
            disabled={passwordLoading || !password}
            className="w-full min-h-[44px] py-3 bg-zinc-900 text-white text-sm tracking-wide uppercase hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
          >
            {passwordLoading ? "···" : t("enter")}
          </button>
        </form>
      </div>
    </div>
  );
}
