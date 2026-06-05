"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { addRipple } from "@/components/ui/RippleButton";
import { buildWaUrl, type VipCode } from "@/lib/vip/format";

/**
 * Logique de gestion des codes VIP : pre-generation, liste, QR, envoi WhatsApp.
 *
 * Architecture popup blocker safe : un code est pre-genere au montage puis
 * apres chaque envoi, et le bouton WhatsApp est une balise <a> dont le href
 * (waUrl) est calcule a la volee. Le click reste une user gesture native.
 *
 * Memes conventions que useAdminPhotos : state + actions exposes par le hook,
 * la presentation est laissee au composant.
 */
export function useVipCodes() {
  const [codes, setCodes] = useState<VipCode[]>([]);
  const [phone, setPhone] = useState("");
  const [generating, setGenerating] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);
  // Code VIP pre-genere pour le prochain envoi (refresh apres chaque "envoyer").
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  // QR genere a la demande, separe du pre-generated pour ne pas afficher
  // l'URL de l'envoi WhatsApp en cours.
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
      // Silent — la balise <a> sera disabled si pendingUrl null.
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

  // URL WhatsApp recalculee selon phone + code pre-genere.
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
      // Marquer envoye, vider le champ, regenerer un code pour le suivant.
      setSent(true);
      setPhone("");
      setTimeout(() => {
        loadCodes();
        refreshPendingCode();
      }, 100);
      setTimeout(() => setSent(false), 3000);
    },
    [waUrl, loadCodes, refreshPendingCode],
  );

  const handleQrOnly = useCallback(async () => {
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
  }, [loadCodes]);

  const downloadQr = useCallback(() => {
    const canvas = qrRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "vip-qrcode.png";
    a.click();
  }, []);

  return {
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
    sendDisabled: !waUrl,
    handleSendClick,
    handleQrOnly,
    downloadQr,
  };
}
