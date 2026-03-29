"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Page Toiles — VIP uniquement
 * Catalogue des toiles originales avec prix et reservation
 *
 * Protege par middleware (cookie gf_vip requis)
 * Pas de paiement en ligne — reservation seulement
 *
 * @author Lalou
 */

interface Canvas {
  id: string;
  title: string;
  dimensions: string;
  technique: string;
  price: number;
  image: string;
  available: boolean;
}

// Donnees placeholder — seront remplacees par les vraies toiles de Guillaume
const CANVASES: Canvas[] = [
  {
    id: "toile-001",
    title: "Traces de la Dino #1",
    dimensions: "150 × 200 cm",
    technique: "Peinture industrielle sur toile, passage direct Ferrari Dino 246 GT",
    price: 8500,
    image: "/images/works/empreintes/empreintes-01.jpg",
    available: true,
  },
  {
    id: "toile-002",
    title: "Traces de la Dino #2",
    dimensions: "120 × 180 cm",
    technique: "Peinture industrielle sur toile, passage direct Ferrari Dino 246 GT",
    price: 6500,
    image: "/images/works/empreintes/empreintes-02.jpg",
    available: true,
  },
  {
    id: "toile-003",
    title: "Projection atelier",
    dimensions: "100 × 150 cm",
    technique: "Peinture industrielle sur toile, projections par rotation",
    price: 5000,
    image: "/images/works/projection/projection-01.jpg",
    available: true,
  },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

interface ReservationForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ToilesPage() {
  const t = useTranslations("canvas");
  const [selectedCanvas, setSelectedCanvas] = useState<string | null>(null);
  const [form, setForm] = useState<ReservationForm>({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);

  const handleReserve = async (canvasId: string) => {
    const canvas = CANVASES.find((c) => c.id === canvasId);
    if (!canvas) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          canvasTitle: canvas.title,
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message || undefined,
        }),
      });

      if (res.ok) {
        setSubmitted(canvasId);
        setSelectedCanvas(null);
        setForm({ name: "", email: "", phone: "", message: "" });
      }
    } catch {
      // Silently fail for now
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="pt-24 pb-16 px-8 text-center">
        <p className="text-white/40 text-xs tracking-[0.3em] uppercase font-light mb-6">
          {t("tag")}
        </p>
        <h1 className="text-3xl md:text-5xl font-light tracking-wide mb-4">
          {t("title")}
        </h1>
        <p className="text-white/40 text-sm md:text-base font-light tracking-widest max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
        <div className="h-px w-32 md:w-48 bg-white/20 mx-auto mt-8" />
      </div>

      {/* Grille des toiles */}
      <div className="max-w-6xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {CANVASES.map((canvas) => (
            <div key={canvas.id} className="group">
              {/* Image */}
              <div className="aspect-[4/3] bg-zinc-900 mb-6 overflow-hidden">
                <img
                  src={canvas.image}
                  alt={canvas.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                />
              </div>

              {/* Infos */}
              <h3 className="text-lg font-light tracking-wide mb-2">
                {canvas.title}
              </h3>
              <p className="text-white/40 text-sm font-light mb-1">
                {canvas.dimensions}
              </p>
              <p className="text-white/30 text-xs font-light mb-4 leading-relaxed">
                {canvas.technique}
              </p>

              {/* Prix */}
              <p className="text-xl font-light tracking-wide mb-6">
                {formatPrice(canvas.price)}
              </p>

              {/* Bouton reservation ou confirmation */}
              {submitted === canvas.id ? (
                <p className="text-white/60 text-sm font-light tracking-wide">
                  {t("reserveForm.success")}
                </p>
              ) : selectedCanvas === canvas.id ? (
                /* Formulaire inline */
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                  <input
                    type="text"
                    placeholder={t("reserveForm.name")}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-white/20 text-white text-sm placeholder-white/30 font-light focus:outline-none focus:border-white/50 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder={t("reserveForm.email")}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-white/20 text-white text-sm placeholder-white/30 font-light focus:outline-none focus:border-white/50 transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder={t("reserveForm.phone")}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-white/20 text-white text-sm placeholder-white/30 font-light focus:outline-none focus:border-white/50 transition-colors"
                  />
                  <textarea
                    placeholder={t("reserveForm.message")}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={2}
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-white/20 text-white text-sm placeholder-white/30 font-light focus:outline-none focus:border-white/50 transition-colors resize-none"
                  />
                  <div className="flex gap-4 pt-2">
                    <button
                      onClick={() => handleReserve(canvas.id)}
                      disabled={submitting || !form.name || !form.email || !form.phone}
                      className="flex-1 py-3 text-white/60 text-xs tracking-[0.2em] uppercase hover:text-white/90 transition-colors border border-white/20 hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {submitting ? "···" : t("reserveForm.submit")}
                    </button>
                    <button
                      onClick={() => setSelectedCanvas(null)}
                      className="px-6 py-3 text-white/30 text-xs tracking-[0.2em] uppercase hover:text-white/60 transition-colors"
                    >
                      {t("reserveForm.cancel")}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedCanvas(canvas.id)}
                  disabled={!canvas.available}
                  className="w-full py-3 text-white/40 text-xs tracking-[0.3em] uppercase hover:text-white/80 transition-colors border border-white/15 hover:border-white/30 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  {canvas.available ? t("reserve") : t("reserved")}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer discret */}
      <div className="border-t border-white/10 py-8 text-center">
        <p className="text-white/20 text-xs font-light tracking-wide">
          {t("disclaimer")}
        </p>
      </div>
    </div>
  );
}
