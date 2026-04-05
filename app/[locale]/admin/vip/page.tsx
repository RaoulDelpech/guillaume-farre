"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { QRCodeCanvas } from "qrcode.react";
import { addRipple } from "@/components/ui/RippleButton";

/**
 * Interface admin pour envoyer des invitations VIP par WhatsApp
 * Mobile-first — Guillaume envoie depuis son telephone
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

export default function AdminVipPage() {
  const t = useTranslations("adminVip");
  const [codes, setCodes] = useState<VipCode[]>([]);
  const [phone, setPhone] = useState("");
  const [generating, setGenerating] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastVipUrl, setLastVipUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const qrRef = useRef<HTMLCanvasElement>(null);

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

  // Normaliser le numero : +33 si commence par 0, sinon garder tel quel
  function normalizePhone(raw: string): string {
    const digits = raw.replace(/[\s\-\.\(\)]/g, '');
    if (digits.startsWith('0') && digits.length === 10) {
      return '33' + digits.slice(1);
    }
    if (digits.startsWith('+')) return digits.slice(1);
    return digits;
  }

  async function handleSend() {
    if (!phone.trim()) {
      inputRef.current?.focus();
      return;
    }

    setGenerating(true);
    setSent(false);

    // Ouvrir la fenetre AVANT le fetch (sinon popup bloque par Safari/iOS)
    const waWindow = window.open('about:blank', '_blank');

    try {
      const res = await fetch("/api/vip/generate", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        const url = data.url;
        setLastVipUrl(url);

        const message = `Invitation privée — Guillaume Farré\n\nDécouvrez mes toiles originales et photographies en accès exclusif (24h) :\n${url}`;
        const waUrl = `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`;

        if (waWindow) {
          waWindow.location.href = waUrl;
        } else {
          // Fallback si popup bloque malgre tout
          window.location.href = waUrl;
        }

        setSent(true);
        setPhone("");
        loadCodes();
        setTimeout(() => setSent(false), 3000);
      } else {
        waWindow?.close();
      }
    } catch {
      waWindow?.close();
    } finally {
      setGenerating(false);
    }
  }

  async function handleQrOnly() {
    setGenerating(true);
    try {
      const res = await fetch("/api/vip/generate", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLastVipUrl(data.url);
        loadCodes();
      }
    } catch {
      // Silent
    } finally {
      setGenerating(false);
    }
  }

  const downloadQr = useCallback(() => {
    const canvas = qrRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "vip-qrcode.png";
    a.click();
  }, []);

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
          Invitation privée
        </h1>
      </div>

      {/* Champ numero + bouton envoyer */}
      <div className="max-w-md mx-auto mb-12">
        <label className="block text-white/40 text-xs tracking-[0.2em] uppercase font-light mb-4 text-center">
          Numéro du destinataire
        </label>
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="06 12 34 56 78"
            className="flex-1 bg-transparent border border-white/20 text-white text-center text-lg tracking-[0.15em] font-light py-4 px-4 placeholder:text-white/15 focus:border-white/50 focus:outline-none transition-colors"
            autoComplete="tel"
            inputMode="tel"
          />
        </div>
        <button
          onClick={(e) => {
            addRipple(e);
            handleSend();
          }}
          disabled={generating || !phone.trim()}
          className={`relative overflow-hidden w-full mt-4 py-5 text-sm tracking-[0.3em] uppercase font-light border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            sent
              ? 'border-emerald-500/60 text-emerald-400 bg-emerald-500/10'
              : 'border-white/30 text-white hover:border-white/60 hover:bg-white/5'
          }`}
        >
          {generating ? "Génération..." : sent ? "Envoyé via WhatsApp" : "Envoyer via WhatsApp"}
        </button>
        <p className="text-white/20 text-[10px] text-center mt-3 font-light">
          Génère un lien exclusif 24h et ouvre WhatsApp
        </p>

        {/* Bouton QR code seul — pour montrer en face a face */}
        <button
          onClick={(e) => {
            addRipple(e);
            handleQrOnly();
          }}
          disabled={generating}
          className="relative overflow-hidden w-full mt-3 py-4 text-xs tracking-[0.3em] uppercase font-light border border-white/15 text-white/50 hover:border-white/40 hover:text-white/70 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {generating ? "Génération..." : "Générer QR code"}
        </button>
        <p className="text-white/20 text-[10px] text-center mt-2 font-light">
          À montrer directement sur votre écran
        </p>

        {/* QR code genere */}
        {lastVipUrl && (
          <div className="mt-8 flex flex-col items-center gap-5 py-6 border border-white/10 bg-white/[0.02]">
            <div className="p-4 bg-black">
              <QRCodeCanvas
                ref={qrRef}
                value={lastVipUrl}
                size={256}
                bgColor="#000000"
                fgColor="#FFFFFF"
                level="M"
              />
            </div>
            <p className="text-white/30 text-[10px] tracking-[0.15em] font-light max-w-[280px] text-center break-all">
              {lastVipUrl}
            </p>
            <button
              onClick={downloadQr}
              className="py-3 px-8 text-white/40 text-xs tracking-[0.2em] uppercase font-light border border-white/10 hover:border-white/30 hover:text-white/60 transition-all"
            >
              Télécharger PNG
            </button>
          </div>
        )}
      </div>

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
