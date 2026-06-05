"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { addRipple } from "@/components/ui/RippleButton";
import { useVipCodes } from "@/hooks/useVipCodes";
import VipCodesList from "./VipCodesList";

/**
 * Interface admin pour envoyer des invitations VIP par WhatsApp + QR code.
 * Mobile-first — Guillaume envoie depuis son telephone.
 *
 * Presentation uniquement : toute la logique (pre-generation, liste, QR,
 * envoi WhatsApp) vit dans le hook useVipCodes. Ce composant n'est monte
 * que pour un admin authentifie (gating dans page.tsx).
 */
export default function VipManager() {
  const t = useTranslations("adminVip");
  const {
    codes,
    loading,
    phone,
    setPhone,
    generating,
    sent,
    qrUrl,
    inputRef,
    qrRef,
    waUrl,
    sendDisabled,
    handleSendClick,
    handleQrOnly,
    downloadQr,
  } = useVipCodes();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="text-center mb-12 pt-8">
        <p className="text-white/40 text-xs tracking-[0.3em] uppercase font-light mb-4">
          {t("tag")}
        </p>
        <h1 className="text-2xl font-light tracking-wide">Invitation privée</h1>
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
              ? "opacity-30 cursor-not-allowed border-white/30 text-white"
              : sent
                ? "border-emerald-500/60 text-emerald-400 bg-emerald-500/10"
                : "border-white/30 text-white hover:border-white/60 hover:bg-white/5"
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
      <VipCodesList codes={codes} loading={loading} />
    </div>
  );
}
