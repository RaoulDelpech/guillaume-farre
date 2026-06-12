'use client';

/**
 * ToilesContent — Layout vertical une toile par rangée (galerie VIP style)
 * Double mode :
 * - Public (showPrices=false) : pas de prix, CTA = formulaire d'interet
 * - VIP (showPrices=true) : prix affiches, CTA = reservation par mailto
 *
 * @author Lalou
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import AmericanFrame from '@/components/AmericanFrame';
import ToileLightbox from './ToileLightbox';
import ContactArtistForm from './ContactArtistForm';
import CanvasReserveCTA from './CanvasReserveCTA';
import ReservationForm from '@/components/vip/ReservationForm';
import { LINEN_BG, paintingMaxWidth, BROWSE_VH, LARGE_BROWSE_VH } from './toiles-utils';
import blurPlaceholders from '@/data/blur-placeholders.json';
import type { Toile } from './types';

const BLUR = blurPlaceholders as Record<string, string>;

export type { Toile, PanelDimension } from './types';

interface ToilesContentProps {
  toiles: Toile[];
  showPrices?: boolean;
}

export default function ToilesContent({ toiles, showPrices = false }: ToilesContentProps) {
  const t = useTranslations('canvas');
  const router = useRouter();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [openFormId, setOpenFormId] = useState<number | null>(null);
  const [reservationToile, setReservationToile] = useState<Toile | null>(null);
  const [activeToileIdx, setActiveToileIdx] = useState<number>(0);
  const toileRefs = useRef<(HTMLDivElement | null)[]>([]);

  // IntersectionObserver pour detecter la toile active
  useEffect(() => {
    const observers = toileRefs.current.map((ref, idx) => {
      if (!ref) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveToileIdx(idx);
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [toiles.length]);

  useEffect(() => {
    if (lightboxIdx === null) return;

    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight')
        setLightboxIdx((i) => (i !== null && i < toiles.length - 1 ? i + 1 : i));
      if (e.key === 'ArrowLeft')
        setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : i));
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [lightboxIdx, toiles.length]);

  function scrollToToile(index: number) {
    toileRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <div className="min-h-screen relative" style={LINEN_BG}>
      {/* Sidebar miniatures - caché sur mobile, visible sur desktop */}
      <div className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-2 py-4 max-h-[80vh] overflow-y-auto"
           style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(140,110,50,0.3) transparent' }}>
        {toiles.map((toile, idx) => {
          const thumbSrc = toile.image || (toile.images && toile.images[0]) || '';
          return (
            <button
              key={toile.id}
              onClick={() => scrollToToile(idx)}
              className={`relative flex-shrink-0 w-16 h-16 overflow-hidden transition-all duration-200 rounded-sm ${
                idx === activeToileIdx
                  ? 'ring-2 ring-[#8c6e32] opacity-100 scale-105'
                  : 'opacity-40 hover:opacity-75 hover:scale-105'
              }`}
              aria-label={`Voir ${toile.name}`}
            >
              <Image
                src={thumbSrc}
                alt={toile.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extralight tracking-[0.08em] uppercase text-[#1a1a1a] mb-6">
            {t('title')}
          </h1>
          <p className="text-neutral-500 text-sm font-light tracking-wider max-w-xl mx-auto mb-6">
            {t('subtitle')}
          </p>
          <div className="w-16 h-px bg-[rgba(140,110,50,0.4)] mx-auto" />
        </div>

        {/* Toiles — une par rangée */}
        <div className="space-y-20 md:space-y-28">
          {toiles.map((toile, index) => {
            const isTriptych = toile.triptych && toile.images;
            const formOpen = openFormId === toile.id;
            // Grand format (ex. Atlantide 200x400 cm) : occupe toute la largeur
            // disponible pour rendre la monumentalite de la toile evidente.
            const isLarge = !!toile.largeFormat;

            return (
              <div
                key={toile.id}
                ref={(el) => { toileRefs.current[index] = el; }}
              >
                {/* Toile avec cadre americain */}
                <button
                  onClick={() => setLightboxIdx(index)}
                  className="block mx-auto cursor-pointer transition-transform hover:scale-[1.005] duration-300 ease-out"
                  aria-label={`Agrandir ${toile.name}`}
                >
                  {isTriptych ? (
                    <div className="flex items-end gap-3 md:gap-4 max-w-4xl mx-auto">
                      {toile.images!.map((img, i) => {
                        const pd = toile.panelDimensions?.[i];
                        // Normaliser les ratios : tous les panneaux du triptyque font 40x100cm
                        // → on force le meme ratio (le plus grand) pour un alignement parfait
                        const maxRatio = toile.panelDimensions
                          ? Math.max(...toile.panelDimensions.map(p => p.imageHeight / p.imageWidth))
                          : (pd?.imageHeight || 1800) / (pd?.imageWidth || 670);
                        const normW = pd?.imageWidth || 670;
                        const normH = Math.round(normW * maxRatio);
                        return (
                          <div key={i} className="flex-1">
                            <AmericanFrame
                              src={img}
                              alt={`${toile.name} — ${i + 1}/3`}
                              imageWidth={normW}
                              imageHeight={normH}
                              frameColor="black"
                              blurDataURL={BLUR[img]}
                              className="w-full"
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div
                      className="mx-auto"
                      style={{
                        maxWidth: paintingMaxWidth(
                          toile.imageWidth || 1200,
                          toile.imageHeight || 900,
                          isLarge ? LARGE_BROWSE_VH : BROWSE_VH
                        ),
                      }}
                    >
                      <AmericanFrame
                        src={toile.image || ''}
                        alt={toile.name}
                        imageWidth={toile.imageWidth}
                        imageHeight={toile.imageHeight}
                        frameColor="black"
                        blurDataURL={BLUR[toile.image || '']}
                        className="w-full"
                        sizes={isLarge ? '(max-width: 768px) 90vw, 540px' : undefined}
                        priority={index < 2}
                      />
                    </div>
                  )}
                </button>

                {/* Infos — nom a gauche, CTA a droite */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 max-w-4xl mx-auto gap-4">
                  <div>
                    {toile.largeFormat && (
                      <p className="text-[#8c6e32] text-[11px] font-normal tracking-[0.28em] uppercase mb-2">
                        {t('largeFormat')} · {toile.dimensions.replace('x', ' × ')}
                      </p>
                    )}
                    <h3 className="text-xl font-extralight tracking-wide text-[#1a1a1a]">
                      {toile.name}
                    </h3>
                    <p className="text-neutral-500 text-xs font-light tracking-wider mt-1">
                      {toile.dimensions} — {toile.technique} — {toile.year}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    {showPrices ? (
                      <CanvasReserveCTA
                        toile={toile}
                        onReserveClick={() => setReservationToile(toile)}
                      />
                    ) : (
                      <>
                        {!formOpen ? (
                          <button
                            onClick={() => setOpenFormId(toile.id)}
                            className="inline-flex items-center justify-center px-6 py-3 text-neutral-500 text-xs tracking-[0.25em] uppercase hover:text-[#8c6e32] transition-all duration-300 border border-neutral-300 hover:border-[#8c6e32] min-h-[44px]"
                          >
                            {t('interest')}
                          </button>
                        ) : (
                          <ContactArtistForm
                            toileName={toile.name}
                            onClose={() => setOpenFormId(null)}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Separateur entre toiles */}
                {index < toiles.length - 1 && (
                  <div className="h-px bg-[rgba(0,0,0,0.06)] max-w-4xl mx-auto mt-16 md:mt-20" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="pb-20 px-8 text-center">
        <p className="text-neutral-500 text-xs tracking-[0.15em] uppercase font-light max-w-lg mx-auto">
          {showPrices ? t('disclaimer') : t('disclaimerPublic')}
        </p>
      </div>

      <ToileLightbox
        toiles={toiles}
        lightboxIdx={lightboxIdx}
        showPrices={showPrices}
        onClose={() => setLightboxIdx(null)}
        onPrev={() => setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : i))}
        onNext={() => setLightboxIdx((i) => (i !== null && i < toiles.length - 1 ? i + 1 : i))}
        onGoTo={(i) => setLightboxIdx(i)}
      />

      {reservationToile ? (
        <ReservationForm
          canvasId={reservationToile.id}
          canvasTitle={reservationToile.name}
          canvas={{
            dimensions: reservationToile.dimensions,
            technique: reservationToile.technique,
            year: reservationToile.year,
            price: reservationToile.price,
          }}
          onClose={() => setReservationToile(null)}
          onSuccess={() => router.refresh()}
        />
      ) : null}

    </div>
  );
}
