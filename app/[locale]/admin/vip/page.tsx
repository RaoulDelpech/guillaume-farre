"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { addRipple } from "@/components/ui/RippleButton";

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
  accessLevel?: 'hidden' | 'secret';
}

type AccessLevel = 'hidden' | 'secret';

export default function AdminVipPage() {
  const t = useTranslations("adminVip");
  const [codes, setCodes] = useState<VipCode[]>([]);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<AccessLevel>('secret');

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
      const res = await fetch("/api/vip/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessLevel: selectedLevel }),
      });
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

      {/* Selecteur niveau d'acces */}
      <div className="max-w-md mx-auto mb-6">
        <p className="text-white/40 text-xs tracking-[0.2em] uppercase font-light mb-4 text-center">
          {t("levelLabel")}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedLevel('secret')}
            className={`flex-1 py-4 text-xs tracking-[0.2em] uppercase font-light border transition-all ${
              selectedLevel === 'secret'
                ? 'border-white/60 text-white bg-white/10'
                : 'border-white/15 text-white/40 hover:border-white/30 hover:text-white/60'
            }`}
          >
            {t("levelSecret")}
            <span className="block text-[10px] mt-1 opacity-60 normal-case tracking-normal">
              {t("levelSecretDesc")}
            </span>
          </button>
          <button
            onClick={() => setSelectedLevel('hidden')}
            className={`flex-1 py-4 text-xs tracking-[0.2em] uppercase font-light border transition-all ${
              selectedLevel === 'hidden'
                ? 'border-white/60 text-white bg-white/10'
                : 'border-white/15 text-white/40 hover:border-white/30 hover:text-white/60'
            }`}
          >
            {t("levelHidden")}
            <span className="block text-[10px] mt-1 opacity-60 normal-case tracking-normal">
              {t("levelHiddenDesc")}
            </span>
          </button>
        </div>
      </div>

      {/* Bouton principal — gros, mobile-first */}
      <div className="max-w-md mx-auto mb-12">
        <button
          onClick={(e) => {
            addRipple(e);
            handleGenerate();
          }}
          disabled={generating}
          className="relative overflow-hidden w-full py-6 text-white text-sm tracking-[0.3em] uppercase font-light border border-white/30 hover:border-white/60 hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
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
              onClick={(e) => {
                addRipple(e);
                handleShare();
              }}
              className="relative overflow-hidden flex-1 py-4 text-white/60 text-xs tracking-[0.2em] uppercase border border-white/20 hover:border-white/40 hover:text-white/90 transition-all"
            >
              {t("share")}
            </button>
            <button
              onClick={(e) => {
                addRipple(e);
                handleCopy();
              }}
              className="relative overflow-hidden flex-1 py-4 text-white/60 text-xs tracking-[0.2em] uppercase border border-white/20 hover:border-white/40 hover:text-white/90 transition-all"
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
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-white/30 text-xs">
                          {formatTime(code.createdAt)}
                        </p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          code.accessLevel === 'hidden'
                            ? 'bg-blue-500/20 text-blue-300/60'
                            : 'bg-amber-500/20 text-amber-300/60'
                        }`}>
                          {code.accessLevel === 'hidden' ? 'galerie' : 'prix'}
                        </span>
                      </div>
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
