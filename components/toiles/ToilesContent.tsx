"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ScrollReveal from "@/components/animations/ScrollReveal";
import TextReveal from "@/components/animations/TextReveal";
import LineReveal from "@/components/animations/LineReveal";
import ImageReveal from "@/components/animations/ImageReveal";
import MagneticButton from "@/components/animations/MagneticButton";
import AmericanFrame from "@/components/AmericanFrame";

/**
 * Contenu page Toiles — VIP uniquement
 * Navigation laterale timeline arc (incurve a gauche),
 * tableaux a ~40% de la taille max, lightbox 100% au clic.
 *
 * @author Lalou
 */

export interface PanelDimension {
  imageWidth: number;
  imageHeight: number;
}

export interface Toile {
  id: number;
  name: string;
  dimensions: string;
  technique: string;
  year: number;
  price: number;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  triptych?: boolean;
  images?: string[];
  panelDimensions?: PanelDimension[];
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

// Frame padding constants (must match AmericanFrame.tsx)
// face(10) + bevel(1) + lip(3) + gap(6) = 20px per side, x2 = 40px
const FRAME_TOTAL_PX = (10 + 1 + 3 + 6) * 2; // 40px

// Browsing: paintings occupy ~75% of viewport height (frame included)
const BROWSE_VH = 75;
// Lightbox: near-full viewport
const LIGHTBOX_VH = 88;

/** Compute CSS max-width so painting height stays under targetVH. */
function paintingMaxWidth(w: number, h: number, targetVH: number): string {
  const ar = w / h;
  return `min(100%, calc((${targetVH}vh - ${FRAME_TOTAL_PX}px) * ${ar} + ${FRAME_TOTAL_PX}px))`;
}

/* ================================================================
   Timeline nav — courbe subtile (parabole douce).
   L'actif est tout a gauche, les voisins s'eloignent legerement.
   ================================================================ */
function TimelineNav({
  toiles,
  activeIdx,
  onSelect,
}: {
  toiles: Toile[];
  activeIdx: number;
  onSelect: (i: number) => void;
}) {
  return (
    <nav
      className="fixed left-6 xl:left-10 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-start gap-px"
      aria-label="Navigation tableaux"
    >
      {toiles.map((toile, i) => {
        const isActive = i === activeIdx;
        const distance = Math.abs(i - activeIdx);

        // Courbe quasi invisible : ligne droite avec micro-souffle
        const arcX = Math.sqrt(distance) * 0.5;
        const opacity = Math.max(0.25, 1 - distance * 0.08);

        return (
          <button
            key={toile.id}
            onClick={() => onSelect(i)}
            className="flex items-center gap-2.5 cursor-pointer"
            style={{
              height: 24,
              transform: `translateX(${Math.round(arcX)}px)`,
              opacity,
              transition: 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.4s ease',
            }}
            aria-label={toile.name}
          >
            {toile.image ? (
              <div
                className="rounded-sm overflow-hidden flex-shrink-0"
                style={{
                  width: isActive ? 44 : distance <= 2 ? 22 : 10,
                  height: isActive ? 44 : distance <= 2 ? 22 : 10,
                  borderRadius: distance > 3 ? '50%' : 2,
                  transition: 'width 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), height 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), border-radius 0.5s ease',
                  boxShadow: isActive ? '0 1px 6px rgba(0,0,0,0.25)' : 'none',
                }}
              >
                <Image
                  src={toile.image}
                  alt={toile.name}
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <span
                className="rounded-full flex-shrink-0"
                style={{
                  width: isActive ? 8 : 5,
                  height: isActive ? 8 : 5,
                  background: isActive ? '#7A6030' : 'rgba(160,160,160,0.35)',
                  transition: 'all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
                }}
              />
            )}

            {isActive && (
              <span
                className="block whitespace-nowrap overflow-hidden text-ellipsis"
                style={{
                  fontSize: 11,
                  color: '#7A6030',
                  fontWeight: 300,
                  letterSpacing: '0.05em',
                  maxWidth: 110,
                }}
              >
                {toile.name}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function ToilesContent({ toiles }: { toiles: Toile[] }) {
  const t = useTranslations("canvas");
  const [selectedCanvas, setSelectedCanvas] = useState<number | null>(null);
  const [form, setForm] = useState<ReservationForm>({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<number | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const isScrolling = useRef(false);

  // Track which painting is in view (skip during programmatic scroll)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrolling.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = refs.current.indexOf(entry.target as HTMLDivElement);
            if (i !== -1) setActiveIdx(i);
          }
        }
      },
      { threshold: 0.3, rootMargin: "-15% 0px -15% 0px" },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [toiles.length]);

  // Lightbox keyboard nav
  useEffect(() => {
    if (lightboxIdx === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight")
        setLightboxIdx((i) => (i !== null && i < toiles.length - 1 ? i + 1 : i));
      if (e.key === "ArrowLeft")
        setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : i));
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [lightboxIdx, toiles.length]);

  const scrollTo = (i: number) => {
    setActiveIdx(i);
    isScrolling.current = true;
    refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => { isScrolling.current = false; }, 900);
  };

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
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen text-[#1a1a1a]"
      style={{
        backgroundColor: "#FAF7F2",
        backgroundImage: [
          // Texture lin tres fine (horizontale + verticale)
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.008) 2px, rgba(0,0,0,0.008) 3px)",
          "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.006) 3px, rgba(0,0,0,0.006) 4px)",
          // Eclat soyeux central (brillance subtile)
          "radial-gradient(ellipse at 50% 30%, rgba(255,255,245,0.5) 0%, transparent 70%)",
        ].join(", "),
      }}
    >
      {/* Header */}
      <div className="pt-32 pb-16 px-8 md:px-16 text-center">
        <TextReveal
          tag="h1"
          className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-[0.08em] uppercase mb-10"
        >
          {t("title")}
        </TextReveal>
        <div className="flex justify-center">
          <LineReveal color="rgba(140,110,50,0.4)" width="80px" delay={0.6} />
        </div>
      </div>

      {/* --- Timeline arc navigation (left side, lg+) --- */}
      <TimelineNav toiles={toiles} activeIdx={activeIdx} onSelect={scrollTo} />

      {/* --- Paintings --- */}
      <div className="px-8 md:px-16 lg:pl-48 lg:pr-16 pb-32">
        <div className="space-y-20 md:space-y-28 max-w-4xl mx-auto">
          {toiles.map((toile, index) => {
            const iw = toile.imageWidth || 1200;
            const ih = toile.imageHeight || 900;
            const maxW = toile.triptych ? "100%" : paintingMaxWidth(iw, ih, BROWSE_VH);

            return (
              <div
                key={toile.id}
                className="group"
                ref={(el) => {
                  refs.current[index] = el;
                }}
              >
                {/* Painting — click to lightbox */}
                <ImageReveal delay={index * 0.08}>
                  <div
                    className="mx-auto cursor-zoom-in"
                    style={{ maxWidth: maxW }}
                    onClick={() => setLightboxIdx(index)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Agrandir ${toile.name}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setLightboxIdx(index);
                    }}
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
                                frameColor="black"
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
                        frameColor="black"
                        className="w-full"
                      />
                    )}
                  </div>
                </ImageReveal>

                {/* Info bar — centered under painting */}
                <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4 mx-auto max-w-2xl">
                  <ScrollReveal delay={index * 0.08 + 0.2}>
                    <h3 className="text-xl md:text-2xl font-extralight tracking-wide">
                      {toile.name}
                    </h3>
                    <p className="text-neutral-500 text-xs font-light tracking-wider mt-1">
                      {toile.dimensions} — {toile.technique} — {toile.year}
                    </p>
                  </ScrollReveal>

                  <ScrollReveal delay={index * 0.08 + 0.3}>
                    <div className="flex items-end gap-6">
                      <p className="text-xl md:text-2xl font-extralight tracking-wide text-[#7A6030]">
                        {formatPrice(toile.price)}
                      </p>

                      {submitted === toile.id ? (
                        <p className="text-[#8B7340] text-xs tracking-[0.2em] uppercase pb-1">
                          {t("reserveForm.success")}
                        </p>
                      ) : selectedCanvas === toile.id ? (
                        <div className="flex flex-col gap-4 w-full max-w-sm">
                          <input
                            type="text"
                            placeholder={t("reserveForm.name")}
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-0 py-3 bg-transparent border-0 border-b border-neutral-300 text-neutral-900 text-sm placeholder-neutral-400 font-light focus:outline-none focus:border-[#B8956A] transition-colors"
                          />
                          <input
                            type="email"
                            placeholder={t("reserveForm.email")}
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-0 py-3 bg-transparent border-0 border-b border-neutral-300 text-neutral-900 text-sm placeholder-neutral-400 font-light focus:outline-none focus:border-[#B8956A] transition-colors"
                          />
                          <input
                            type="tel"
                            placeholder={t("reserveForm.phone")}
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full px-0 py-3 bg-transparent border-0 border-b border-neutral-300 text-neutral-900 text-sm placeholder-neutral-400 font-light focus:outline-none focus:border-[#B8956A] transition-colors"
                          />
                          <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                              onClick={() => handleReserve(toile)}
                              disabled={submitting || !form.name || !form.email || !form.phone}
                              className="flex-1 py-4 sm:py-3 text-neutral-500 text-xs tracking-[0.25em] uppercase hover:text-neutral-900 transition-colors border border-neutral-300 hover:border-[#B8956A] disabled:opacity-20 min-h-[44px]"
                            >
                              {submitting ? "···" : t("reserveForm.submit")}
                            </button>
                            <button
                              onClick={() => setSelectedCanvas(null)}
                              className="py-4 sm:py-3 px-6 text-neutral-400 text-xs tracking-[0.2em] uppercase hover:text-neutral-600 transition-colors min-h-[44px]"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ) : (
                        <MagneticButton strength={0.25}>
                          <button
                            onClick={() => setSelectedCanvas(toile.id)}
                            className="py-2.5 px-6 text-neutral-500 text-[10px] tracking-[0.3em] uppercase hover:text-[#7A6030] transition-all duration-500 border border-neutral-300 hover:border-[#B8956A]"
                          >
                            {t("reserve")}
                          </button>
                        </MagneticButton>
                      )}
                    </div>
                  </ScrollReveal>
                </div>

                {/* Separator */}
                {index < toiles.length - 1 && (
                  <div className="mt-16 md:mt-20 flex justify-center">
                    <LineReveal
                      color="rgba(0,0,0,0.08)"
                      width="100%"
                      delay={index * 0.08 + 0.4}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Lightbox (100% taille max) --- */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            key="toile-lightbox"
            className="fixed inset-0 z-50"
            style={{
              backgroundColor: "#FAF7F2",
              backgroundImage: [
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.008) 2px, rgba(0,0,0,0.008) 3px)",
                "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.006) 3px, rgba(0,0,0,0.006) 4px)",
                "radial-gradient(ellipse at 50% 30%, rgba(255,255,245,0.5) 0%, transparent 70%)",
              ].join(", "),
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close */}
            <button
              className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center text-neutral-400 hover:text-neutral-800 transition-colors"
              onClick={() => setLightboxIdx(null)}
              aria-label="Fermer"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Prev */}
            {lightboxIdx > 0 && (
              <button
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-neutral-300 hover:text-neutral-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx(lightboxIdx - 1);
                }}
                aria-label="Precedent"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Next */}
            {lightboxIdx < toiles.length - 1 && (
              <button
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-neutral-300 hover:text-neutral-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx(lightboxIdx + 1);
                }}
                aria-label="Suivant"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {/* Image area — 100% max size */}
            <div
              className="absolute inset-0 flex items-center justify-center p-6 md:p-16 pb-24"
              onClick={() => setLightboxIdx(null)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {toiles[lightboxIdx].triptych && toiles[lightboxIdx].images ? (
                    <div className="flex gap-2">
                      {toiles[lightboxIdx].images!.map((img, i) => (
                        <Image
                          key={i}
                          src={img}
                          alt={`${toiles[lightboxIdx].name} — ${i + 1}/3`}
                          width={toiles[lightboxIdx].panelDimensions?.[i]?.imageWidth || 800}
                          height={toiles[lightboxIdx].panelDimensions?.[i]?.imageHeight || 1200}
                          className="max-h-[85vh] w-auto object-contain"
                          quality={95}
                        />
                      ))}
                    </div>
                  ) : (
                    <Image
                      src={toiles[lightboxIdx].image || ""}
                      alt={toiles[lightboxIdx].name}
                      width={toiles[lightboxIdx].imageWidth || 1200}
                      height={toiles[lightboxIdx].imageHeight || 900}
                      className="max-h-[88vh] max-w-[92vw] w-auto h-auto object-contain"
                      quality={95}
                      priority
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-0 px-8 py-5 pointer-events-none">
              <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
                <div>
                  <h2 className="text-lg md:text-xl text-neutral-800 font-light tracking-wide">
                    {toiles[lightboxIdx].name}
                  </h2>
                  <p className="text-neutral-400 text-sm font-light mt-1">
                    {toiles[lightboxIdx].dimensions} — {toiles[lightboxIdx].technique} —{" "}
                    {toiles[lightboxIdx].year}
                  </p>
                </div>
                <p className="text-xl text-[#7A6030] font-light tracking-wide">
                  {formatPrice(toiles[lightboxIdx].price)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
