"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

/**
 * Interface admin pour generer des codes VIP
 * Mobile-first — Guillaume genere les liens depuis son telephone
 *
 * @author Lalou
 */

interface VipCode {
  code: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
  usedAt?: string;
}

export default function AdminVipPage() {
  const t = useTranslations("adminVip");
  const [codes, setCodes] = useState<VipCode[]>([]);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCodes();
  }, []);

  async function loadCodes() {
    try {
      const res = await fetch("/api/vip/list");
      if (res.ok) {
        const data = await res.json();
        setCodes(data.codes || []);
      }
    } catch {
      // Silent
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    setGeneratedUrl(null);
    setGeneratedCode(null);
    setCopied(false);

    try {
      const res = await fetch("/api/vip/generate", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setGeneratedUrl(data.url);
        setGeneratedCode(data.code);
        loadCodes(); // Refresh list
      }
    } catch {
      // Silent
    } finally {
      setGenerating(false);
    }
  }

  async function handleShare() {
    if (!generatedUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Invitation privée — Guillaume Farré",
          text: "Découvrez les toiles originales de Guillaume Farré",
          url: generatedUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  }

  async function handleCopy() {
    if (!generatedUrl) return;
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text
    }
  }

  function getCodeStatus(code: VipCode): "active" | "used" | "expired" {
    if (code.used) return "used";
    if (new Date(code.expiresAt) < new Date()) return "expired";
    return "active";
  }

  function formatTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function timeRemaining(expiresAt: string): string {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return t("status.expired");
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h${minutes.toString().padStart(2, "0")} ${t("remaining")}`;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="text-center mb-12 pt-8">
        <p className="text-white/40 text-xs tracking-[0.3em] uppercase font-light mb-4">
          {t("tag")}
        </p>
        <h1 className="text-2xl font-light tracking-wide">
          {t("title")}
        </h1>
      </div>

      {/* Bouton principal — gros, mobile-first */}
      <div className="max-w-md mx-auto mb-12">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full py-6 text-white text-sm tracking-[0.3em] uppercase font-light border border-white/30 hover:border-white/60 hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {generating ? t("generating") : t("generate")}
        </button>
      </div>

      {/* Code genere */}
      {generatedUrl && (
        <div className="max-w-md mx-auto mb-12 text-center animate-[fadeIn_0.3s_ease-out]">
          <p className="text-white/40 text-xs tracking-[0.2em] uppercase font-light mb-4">
            {t("generated")}
          </p>
          <p className="text-3xl font-light tracking-[0.5em] mb-6">
            {generatedCode}
          </p>
          <p className="text-white/30 text-xs mb-8 break-all px-4">
            {generatedUrl}
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleShare}
              className="flex-1 py-4 text-white/60 text-xs tracking-[0.2em] uppercase border border-white/20 hover:border-white/40 hover:text-white/90 transition-all"
            >
              {t("share")}
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 py-4 text-white/60 text-xs tracking-[0.2em] uppercase border border-white/20 hover:border-white/40 hover:text-white/90 transition-all"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
        </div>
      )}

      {/* Liste des codes actifs */}
      <div className="max-w-md mx-auto">
        <div className="border-t border-white/10 pt-8">
          <p className="text-white/40 text-xs tracking-[0.2em] uppercase font-light mb-6">
            {t("activeCodes")}
          </p>

          {loading ? (
            <p className="text-white/20 text-sm text-center">{t("loading")}</p>
          ) : codes.length === 0 ? (
            <p className="text-white/20 text-sm text-center">{t("noActiveCodes")}</p>
          ) : (
            <div className="space-y-4">
              {codes.map((code) => {
                const status = getCodeStatus(code);
                return (
                  <div
                    key={code.code}
                    className="flex items-center justify-between py-3 border-b border-white/5"
                  >
                    <div>
                      <p className="text-sm font-light tracking-[0.3em]">
                        {code.code}
                      </p>
                      <p className="text-white/30 text-xs mt-1">
                        {formatTime(code.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      {status === "active" && (
                        <>
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500/60 mr-2" />
                          <span className="text-white/40 text-xs">
                            {timeRemaining(code.expiresAt)}
                          </span>
                        </>
                      )}
                      {status === "used" && (
                        <span className="text-white/20 text-xs tracking-wide">
                          {t("status.used")}
                        </span>
                      )}
                      {status === "expired" && (
                        <span className="text-white/20 text-xs tracking-wide">
                          {t("status.expired")}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
