"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ScrollReveal from "@/components/animations/ScrollReveal";
import TextReveal from "@/components/animations/TextReveal";
import LineReveal from "@/components/animations/LineReveal";
import ImageReveal from "@/components/animations/ImageReveal";
import MagneticButton from "@/components/animations/MagneticButton";

/**
 * Contenu page Toiles — VIP uniquement
 * Recoit les donnees depuis le Server Component parent
 *
 * @author Lalou
 */

export interface Toile {
  id: number;
  name: string;
  dimensions: string;
  technique: string;
  year: number;
  price: number;
  image?: string;
  triptych?: boolean;
  images?: string[];
}

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

export default function ToilesContent({ toiles }: { toiles: Toile[] }) {
  const t = useTranslations("canvas");
  const [selectedCanvas, setSelectedCanvas] = useState<number | null>(null);
  const [form, setForm] = useState<ReservationForm>({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<number | null>(null);

  const handleReserve = async (toile: Toile) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          canvasTitle: toile.name,
          name: form.name,
          email: form.email,
          phone: form.phone,
        }),
      });

      if (res.ok) {
        setSubmitted(toile.id);
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
      {/* Header */}
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

      {/* Toiles */}
      <div className="max-w-6xl mx-auto px-8 md:px-16 pb-32">
        <div className="space-y-32 md:space-y-40">
          {toiles.map((toile, index) => (
            <div key={toile.id} className="group">
              {/* Image(s) */}
              <ImageReveal delay={index * 0.08}>
                {toile.triptych && toile.images ? (
                  <div className="flex gap-2 md:gap-4">
                    {toile.images.map((img, i) => (
                      <div key={i} className="flex-1 aspect-[2/5] bg-zinc-900/30 overflow-hidden">
                        <img
                          src={img}
                          alt={`${toile.name} — ${i + 1}/3`}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-zinc-900/30 overflow-hidden">
                    <img
                      src={toile.image}
                      alt={toile.name}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                    />
                  </div>
                )}
              </ImageReveal>

              {/* Infos */}
              <div className="mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <ScrollReveal delay={index * 0.08 + 0.2}>
                  <h3 className="text-2xl md:text-3xl font-extralight tracking-wide">
                    {toile.name}
                  </h3>
                  <p className="text-white/30 text-sm font-light tracking-wider mt-2">
                    {toile.dimensions} — {toile.technique} — {toile.year}
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={index * 0.08 + 0.3}>
                  <div className="flex items-end gap-8">
                    <p className="text-2xl md:text-3xl font-extralight tracking-wide text-[rgba(196,165,112,0.85)]">
                      {formatPrice(toile.price)}
                    </p>

                    {submitted === toile.id ? (
                      <p className="text-[rgba(196,165,112,0.5)] text-xs tracking-[0.2em] uppercase pb-1">
                        {t("reserveForm.success")}
                      </p>
                    ) : selectedCanvas === toile.id ? (
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
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <button
                            onClick={() => handleReserve(toile)}
                            disabled={submitting || !form.name || !form.email || !form.phone}
                            className="flex-1 py-4 sm:py-3 text-white/50 text-xs tracking-[0.25em] uppercase hover:text-white transition-colors border border-white/10 hover:border-[rgba(196,165,112,0.3)] disabled:opacity-20 min-h-[44px]"
                          >
                            {submitting ? "···" : t("reserveForm.submit")}
                          </button>
                          <button
                            onClick={() => setSelectedCanvas(null)}
                            className="py-4 sm:py-3 px-6 text-white/20 text-xs tracking-[0.2em] uppercase hover:text-white/40 transition-colors min-h-[44px]"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <MagneticButton strength={0.25}>
                        <button
                          onClick={() => setSelectedCanvas(toile.id)}
                          className="py-3 px-8 text-white/30 text-xs tracking-[0.3em] uppercase hover:text-[rgba(196,165,112,0.7)] transition-all duration-500 border border-white/8 hover:border-[rgba(196,165,112,0.2)]"
                        >
                          {t("reserve")}
                        </button>
                      </MagneticButton>
                    )}
                  </div>
                </ScrollReveal>
              </div>

              {/* Separateur */}
              {index < toiles.length - 1 && (
                <div className="mt-24 md:mt-32 flex justify-center">
                  <LineReveal
                    color="rgba(255,255,255,0.04)"
                    width="100%"
                    delay={index * 0.08 + 0.4}
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
