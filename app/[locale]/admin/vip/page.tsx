"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { addRipple } from "@/components/ui/RippleButton";

/**
 * Interface admin pour envoyer des invitations VIP par WhatsApp
 * Mobile-first — Guillaume envoie depuis son telephone
 *
 * Architecture popup blocker safe :
 *   - Un code VIP est pre-genere au montage (et regenere apres chaque envoi).
 *   - Le bouton "Envoyer via WhatsApp" est une balise <a target="_blank">
 *     dont le href est recalcule selon le numero saisi.
 *   - Le click utilisateur est une user gesture native qui ouvre l'onglet
 *     WhatsApp sans passer par window.open() programmatique apres await
 *     (Safari/Chrome tuent l'onglet about:blank apres le 1er await).
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

// Normaliser le numero : +33 si commence par 0, sinon garder tel quel
function normalizePhone(raw: string): string {
  const digits = raw.replace(/[\s\-\.\(\)]/g, '');
  if (digits.startsWith('0') && digits.length === 10) {
    return '33' + digits.slice(1);
  }
  if (digits.startsWith('+')) return digits.slice(1);
  return digits;
}

function buildWaUrl(phone: string, vipUrl: string): string {
  const message = `Invitation privée — Guillaume Farré\n\nDécouvrez mes toiles originales et photographies en accès exclusif (24h) :\n${vipUrl}`;
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`;
}

export default function AdminVipPage() {
  const t = useTranslations("adminVip");
  const [codes, setCodes] = useState<VipCode[]>([]);
  const [phone, setPhone] = useState("");
  const [generating, setGenerating] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);
  // Code VIP pre-genere pour le prochain envoi (refresh apres chaque "envoyer")
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  // QR code separe : genere a la demande via "Generer QR code", pas synchronise
  // au pre-generated du bouton WhatsApp pour eviter d'afficher l'URL de l'envoi en cours.
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const qrRef = useRef<HTMLCanvasElement>(null);

  const refreshPendingCode = useCallback(async () => {
    try {
      const res = await fetch("/api/vip/generate", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setPendingUrl(data.url);
      }
    } catch {
      // Silent — la balise <a> sera disabled si pendingUrl null
    }
  }, []);

  const loadCodes = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadCodes();
    refreshPendingCode();
  }, [loadCodes, refreshPendingCode]);

  // URL WhatsApp recalculee a la volee selon phone + code pre-genere.
  // Pas de debounce : la generation a deja eu lieu, on construit juste un
  // querystring. Le click utilisateur sur la balise <a> reste une user gesture.
  const waUrl = useMemo(() => {
    if (!pendingUrl || !phone.trim()) return null;
    return buildWaUrl(phone, pendingUrl);
  }, [pendingUrl, phone]);

  const handleSendClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!waUrl) {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }
      addRipple(e);
      // Marquer comme envoye, vider le champ, regenerer un nouveau code
      // pour le destinataire suivant. Tout cela se fait APRES que le browser
      // ait deja accepte le href (user gesture preservee).
      setSent(true);
      setPhone("");
      // Defer pour ne pas bloquer le rendu du nouvel onglet
      setTimeout(() => {
        loadCodes();
        refreshPendingCode();
      }, 100);
      setTimeout(() => setSent(false), 3000);
    },
    [waUrl, loadCodes, refreshPendingCode],
  );

  async function handleQrOnly() {
    setGenerating(true);
    try {
      const res = await fetch("/api/vip/generate", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setQrUrl(data.url);
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

  const sendDisabled = !waUrl;

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
        <Link
          href="/fr/admin/vip/reservations"
          className="inline-block mt-4 text-xs px-4 py-2 border border-[#C4A570]/40 text-[#C4A570] hover:bg-[#C4A570]/10 transition-colors tracking-[0.15em] uppercase"
        >
          Voir les réservations
        </Link>
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
            placeholder="06 12 34 56 78"
            className="flex-1 bg-transparent border border-white/20 text-white text-center text-lg tracking-[0.15em] font-light py-4 px-4 placeholder:text-white/15 focus:border-white/50 focus:outline-none transition-colors"
            autoComplete="tel"
            inputMode="tel"
          />
        </div>
        <a
          href={waUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleSendClick}
          aria-disabled={sendDisabled}
          className={`relative overflow-hidden block text-center w-full mt-4 py-5 text-sm tracking-[0.3em] uppercase font-light border transition-all ${
            sendDisabled
              ? 'opacity-30 cursor-not-allowed border-white/30 text-white'
              : sent
              ? 'border-emerald-500/60 text-emerald-400 bg-emerald-500/10'
              : 'border-white/30 text-white hover:border-white/60 hover:bg-white/5'
          }`}
        >
          {sent ? "Envoyé via WhatsApp" : "Envoyer via WhatsApp"}
        </a>
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
        {qrUrl && (
          <div className="mt-8 flex flex-col items-center gap-5 py-6 border border-white/10 bg-white/[0.02]">
            <div className="p-4 bg-black">
              <QRCodeCanvas
                ref={qrRef}
                value={qrUrl}
                size={256}
                bgColor="#000000"
                fgColor="#FFFFFF"
                level="M"
              />
            </div>
            <p className="text-white/30 text-[10px] tracking-[0.15em] font-light max-w-[280px] text-center break-all">
              {qrUrl}
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
