"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

type SubscribeState = "idle" | "loading" | "success" | "error" | "invalidEmail";

interface NewsletterSubscribeProps {
  variant: "footer" | "standalone";
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSubscribe({ variant }: NewsletterSubscribeProps) {
  const t = useTranslations("newsletter");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubscribeState>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!EMAIL_REGEX.test(email.trim())) {
      setState("invalidEmail");
      return;
    }

    setState("loading");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), locale }),
      });

      if (res.ok) {
        setState("success");
        setEmail("");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  const isFooter = variant === "footer";

  return (
    <div className={isFooter ? "w-full" : "max-w-md mx-auto"}>
      {!isFooter && (
        <h3 className="text-lg font-light tracking-wide mb-2 text-[#1a1a1a]">
          {t("title")}
        </h3>
      )}

      <p className="text-sm text-muted-foreground mb-4 font-light">
        {t("description")}
      </p>

      {state === "success" ? (
        <p className="text-sm text-[#8c6e32] font-light">{t("success")}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-3 items-start">
          <div className="flex-1">
            <label htmlFor={`newsletter-email-${variant}`} className="sr-only">
              {t("placeholder")}
            </label>
            <input
              id={`newsletter-email-${variant}`}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === "invalidEmail" || state === "error") {
                  setState("idle");
                }
              }}
              placeholder={t("placeholder")}
              aria-invalid={state === "invalidEmail"}
              aria-describedby={
                state === "invalidEmail" || state === "error"
                  ? `newsletter-msg-${variant}`
                  : undefined
              }
              className="w-full px-4 py-2.5 text-sm font-light border border-border rounded-sm
                bg-transparent text-foreground placeholder:text-muted-foreground
                focus:outline-none focus:border-[#8c6e32] transition-colors"
            />
            {(state === "invalidEmail" || state === "error") && (
              <p
                id={`newsletter-msg-${variant}`}
                className="mt-1.5 text-xs text-red-600 font-light"
                role="alert"
              >
                {state === "invalidEmail" ? t("invalidEmail") : t("error")}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={state === "loading"}
            className="min-h-[44px] px-5 py-2.5 text-sm font-light rounded-sm
              bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {state === "loading" ? "..." : t("submit")}
          </button>
        </form>
      )}
    </div>
  );
}

// Lalou
