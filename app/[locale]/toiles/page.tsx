"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ScrollReveal from "@/components/animations/ScrollReveal";
import TextReveal from "@/components/animations/TextReveal";
import LineReveal from "@/components/animations/LineReveal";
import ImageReveal from "@/components/animations/ImageReveal";
import MagneticButton from "@/components/animations/MagneticButton";

/**
 * Page Toiles — VIP uniquement
 * Ultra-minimaliste. L'art parle, pas le texte.
 *
 * @author Lalou
 */

interface Canvas {
  id: string;
  title: string;
  dimensions: string;
  price: number;
  image: string;
  available: boolean;
}

// Donnees placeholder — seront remplacees par les vraies toiles de Guillaume
const CANVASES: Canvas[] = [
  {
    id: "toile-001",
    title: "Traces #1",
    dimensions: "150 × 200 cm",
    price: 8500,
    image: "/images/works/empreintes/empreintes-01.jpg",
    available: true,
  },
  {
    id: "toile-002",
    title: "Traces #2",
    dimensions: "120 × 180 cm",
    price: 6500,
    image: "/images/works/empreintes/empreintes-02.jpg",
    available: true,
  },
  {
    id: "toile-003",
    title: "Projection #1",
    dimensions: "100 × 150 cm",
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
}

export default function ToilesPage() {
  const t = useTranslations("canvas");
  const [selectedCanvas, setSelectedCanvas] = useState<string | null>(null);
  const [form, setForm] = useState<ReservationForm>({ name: "", email: "", phone: "" });
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
        }),
      });

      if (res.ok) {
        setSubmitted(canvasId);
        setSelectedCanvas(null);
        setForm({ name: "", email: "", phone: "" });
      }
    } catch {
      // Silently fail
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header — nom + ligne, rien d'autre */}
      <div className="pt-32 pb-20 px-8 md:px-16 text-center">
        <TextReveal
          tag="h1"
          className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-[0.08em] uppercase mb-10"
        >
          {t("title")}
        </TextReveal>

        <div className="flex justify-center">
          <LineReveal color="rgba(196,165,112,0.3)" width="80px" delay={0.6} />
        </div>
      </div>

      {/* Toiles — une par ligne sur grand ecran, empilees sur mobile */}
      <div className="max-w-6xl mx-auto px-8 md:px-16 pb-32">
        <div className="space-y-32 md:space-y-40">
          {CANVASES.map((canvas, index) => (
            <div key={canvas.id} className="group">
              {/* Image pleine largeur */}
              <ImageReveal delay={index * 0.15}>
                <div className="aspect-[16/10] bg-zinc-900/30 overflow-hidden">
                  <img
                    src={canvas.image}
                    alt={canvas.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                  />
                </div>
              </ImageReveal>

              {/* Infos — minimaliste */}
              <div className="mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <ScrollReveal delay={index * 0.15 + 0.2}>
                  <h3 className="text-2xl md:text-3xl font-extralight tracking-wide">
                    {canvas.title}
                  </h3>
                  <p className="text-white/30 text-sm font-light tracking-wider mt-2">
                    {canvas.dimensions}
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={index * 0.15 + 0.3}>
                  <div className="flex items-end gap-8">
                    {/* Prix */}
                    <p className="text-2xl md:text-3xl font-extralight tracking-wide text-[rgba(196,165,112,0.85)]">
                      {formatPrice(canvas.price)}
                    </p>

                    {/* Action */}
                    {submitted === canvas.id ? (
                      <p className="text-[rgba(196,165,112,0.5)] text-xs tracking-[0.2em] uppercase pb-1">
                        {t("reserveForm.success")}
                      </p>
                    ) : selectedCanvas === canvas.id ? (
                      <div className="flex flex-col gap-4 w-full max-w-sm">
                        <input
                          type="text"
                          placeholder={t("reserveForm.name")}
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-0 py-3 bg-transparent border-0 border-b border-white/10 text-white text-sm placeholder-white/20 font-light focus:outline-none focus:border-[rgba(196,165,112,0.4)] transition-colors"
                        />
                        <input
                          type="email"
                          placeholder={t("reserveForm.email")}
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-0 py-3 bg-transparent border-0 border-b border-white/10 text-white text-sm placeholder-white/20 font-light focus:outline-none focus:border-[rgba(196,165,112,0.4)] transition-colors"
                        />
                        <input
                          type="tel"
                          placeholder={t("reserveForm.phone")}
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full px-0 py-3 bg-transparent border-0 border-b border-white/10 text-white text-sm placeholder-white/20 font-light focus:outline-none focus:border-[rgba(196,165,112,0.4)] transition-colors"
                        />
                        <div className="flex gap-4 pt-2">
                          <button
                            onClick={() => handleReserve(canvas.id)}
                            disabled={submitting || !form.name || !form.email || !form.phone}
                            className="flex-1 py-3 text-white/50 text-xs tracking-[0.25em] uppercase hover:text-white transition-colors border border-white/10 hover:border-[rgba(196,165,112,0.3)] disabled:opacity-20"
                          >
                            {submitting ? "···" : t("reserveForm.submit")}
                          </button>
                          <button
                            onClick={() => setSelectedCanvas(null)}
                            className="px-6 py-3 text-white/20 text-xs tracking-[0.2em] uppercase hover:text-white/40 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <MagneticButton strength={0.25}>
                        <button
                          onClick={() => setSelectedCanvas(canvas.id)}
                          disabled={!canvas.available}
                          className="py-3 px-8 text-white/30 text-xs tracking-[0.3em] uppercase hover:text-[rgba(196,165,112,0.7)] transition-all duration-500 border border-white/8 hover:border-[rgba(196,165,112,0.2)] disabled:opacity-10"
                        >
                          {canvas.available ? t("reserve") : t("reserved")}
                        </button>
                      </MagneticButton>
                    )}
                  </div>
                </ScrollReveal>
              </div>

              {/* Separateur entre toiles */}
              {index < CANVASES.length - 1 && (
                <div className="mt-24 md:mt-32 flex justify-center">
                  <LineReveal
                    color="rgba(255,255,255,0.04)"
                    width="100%"
                    delay={index * 0.15 + 0.4}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
