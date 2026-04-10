"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ScrollReveal from "@/components/animations/ScrollReveal";
import TextReveal from "@/components/animations/TextReveal";
import LineReveal from "@/components/animations/LineReveal";
import ImageReveal from "@/components/animations/ImageReveal";
import MagneticButton from "@/components/animations/MagneticButton";
import AmericanFrame from "@/components/AmericanFrame";
import TimelineNav from "./TimelineNav";
import ToileLightbox from "./ToileLightbox";
import ReservationForm from "./ReservationForm";
import { useToilesNavigation } from "@/hooks/useToilesNavigation";
import { BROWSE_VH, LINEN_BG, formatPrice, paintingMaxWidth } from "./toiles-utils";
import type { Toile, ReservationForm as ReservationFormType } from "./types";

// Re-export types for backwards compatibility
export type { Toile, PanelDimension } from "./types";

/**
 * Contenu page Toiles — VIP uniquement
 * Fond ivoire (meme charte que la galerie photos), cadres americains alternes.
 *
 * @author Lalou
 */

const FRAME_COLORS = ['black', 'oak', 'walnut'] as const;

function getFrameColor(id: number): 'black' | 'oak' | 'walnut' {
  if (id % 3 === 0) return 'walnut';
  if (id % 3 === 1) return 'black';
  return 'oak';
}

export default function ToilesContent({ toiles }: { toiles: Toile[] }) {
  const t = useTranslations("canvas");
  const [selectedCanvas, setSelectedCanvas] = useState<number | null>(null);
  const [form, setForm] = useState<ReservationFormType>({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<number | null>(null);

  const { activeIdx, lightboxIdx, setLightboxIdx, scrollTo, setRef } =
    useToilesNavigation(toiles.length);

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
          message: form.message || undefined,
        }),
      });
      if (res.ok) {
        setSubmitted(toile.id);
        setSelectedCanvas(null);
        setForm({ name: "", email: "", phone: "", message: "" });
      }
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={LINEN_BG}>
      {/* Header */}
      <div className="pt-32 pb-16 px-8 md:px-16 text-center">
        <TextReveal
          tag="h1"
          className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-[0.08em] uppercase mb-4 text-[#1a1a1a]"
        >
          {t("title")}
        </TextReveal>
        <TextReveal
          tag="p"
          className="text-sm md:text-base font-light tracking-[0.15em] uppercase text-neutral-500 mb-10"
        >
          {t("subtitle")}
        </TextReveal>
        <div className="flex justify-center">
          <LineReveal color="rgba(140,110,50,0.4)" width="80px" delay={0.6} />
        </div>
      </div>

      <TimelineNav toiles={toiles} activeIdx={activeIdx} onSelect={scrollTo} />

      {/* Paintings */}
      <div className="px-8 md:px-16 lg:pl-48 lg:pr-16 pb-32">
        <div className="space-y-20 md:space-y-28 max-w-4xl mx-auto">
          {toiles.map((toile, index) => {
            const iw = toile.imageWidth || 1200;
            const ih = toile.imageHeight || 900;
            const maxW = toile.triptych ? "100%" : paintingMaxWidth(iw, ih, BROWSE_VH);
            const frameColor = getFrameColor(toile.id);

            return (
              <div key={toile.id} className="group" ref={setRef(index)}>
                <ImageReveal delay={index * 0.08}>
                  <div
                    className="mx-auto cursor-zoom-in"
                    style={{ maxWidth: maxW }}
                    onClick={() => setLightboxIdx(index)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Agrandir ${toile.name}`}
                    onKeyDown={(e) => { if (e.key === "Enter") setLightboxIdx(index); }}
                  >
                    {toile.triptych && toile.images ? (
                      <div className="flex gap-3 md:gap-4">
                        {toile.images.map((img, i) => {
                          const pd = toile.panelDimensions?.[i];
                          return (
                            <div key={i} className="flex-1">
                              <AmericanFrame
                                src={img}
                                alt={`${toile.name} — ${i + 1}/3`}
                                imageWidth={pd?.imageWidth}
                                imageHeight={pd?.imageHeight}
                                frameColor={frameColor}
                                className="w-full"
                              />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <AmericanFrame
                        src={toile.image || ""}
                        alt={toile.name}
                        imageWidth={iw}
                        imageHeight={ih}
                        frameColor={frameColor}
                        className="w-full"
                        priority={index === 0}
                      />
                    )}
                  </div>
                </ImageReveal>

                {/* Info bar */}
                <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4 mx-auto max-w-2xl">
                  <ScrollReveal delay={index * 0.08 + 0.2}>
                    <h3 className="text-xl md:text-2xl font-extralight tracking-wide text-[#1a1a1a]">{toile.name}</h3>
                    <p className="text-neutral-500 text-xs font-light tracking-wider mt-1">
                      {toile.dimensions} — {toile.technique} — {toile.year}
                    </p>
                  </ScrollReveal>

                  <ScrollReveal delay={index * 0.08 + 0.3}>
                    <div className="flex items-end gap-6">
                      <p className="text-xl md:text-2xl font-extralight tracking-wide text-[#8c6e32]">
                        {formatPrice(toile.price)}
                      </p>

                      {submitted === toile.id ? (
                        <p className="text-[#8c6e32] text-xs tracking-[0.2em] uppercase pb-1">
                          {t("reserveForm.success")}
                        </p>
                      ) : selectedCanvas === toile.id ? (
                        <ReservationForm
                          form={form}
                          onChange={setForm}
                          onSubmit={() => handleReserve(toile)}
                          onCancel={() => setSelectedCanvas(null)}
                          submitting={submitting}
                        />
                      ) : (
                        <MagneticButton strength={0.25}>
                          <button
                            onClick={() => setSelectedCanvas(toile.id)}
                            className="py-2.5 px-6 text-neutral-600 text-[10px] tracking-[0.3em] uppercase hover:text-[#8c6e32] transition-all duration-500 border border-neutral-300 hover:border-[#8c6e32]"
                          >
                            {t("reserve")}
                          </button>
                        </MagneticButton>
                      )}
                    </div>
                  </ScrollReveal>
                </div>

                {index < toiles.length - 1 && (
                  <div className="mt-16 md:mt-20 flex justify-center">
                    <LineReveal color="rgba(0,0,0,0.06)" width="100%" delay={index * 0.08 + 0.4} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="pb-20 px-8 text-center">
        <p className="text-neutral-500 text-xs tracking-[0.15em] uppercase font-light max-w-lg mx-auto">
          {t("disclaimer")}
        </p>
      </div>

      <ToileLightbox
        toiles={toiles}
        lightboxIdx={lightboxIdx}
        onClose={() => setLightboxIdx(null)}
        onPrev={() => setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : i))}
        onNext={() => setLightboxIdx((i) => (i !== null && i < toiles.length - 1 ? i + 1 : i))}
      />
    </div>
  );
}
