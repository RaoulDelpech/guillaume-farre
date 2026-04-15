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
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import AmericanFrame from '@/components/AmericanFrame';
import ToileLightbox from './ToileLightbox';
import ContactArtistForm from './ContactArtistForm';
import { LINEN_BG, paintingMaxWidth, BROWSE_VH, formatPrice } from './toiles-utils';
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
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [openFormId, setOpenFormId] = useState<number | null>(null);
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

  function generateMailto(name: string): string {
    const subject = `Réservation — ${name}`;
    const body = `Bonjour,\n\nJe souhaite réserver la toile « ${name} ».\n\nMerci de me recontacter.\n\nCordialement`;
    return `mailto:contact@guillaumefarre.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

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
                    <div className="flex gap-3 md:gap-4 max-w-4xl mx-auto">
                      {toile.images!.map((img, i) => {
                        const pd = toile.panelDimensions?.[i];
                        return (
                          <div key={i} className="flex-1">
                            <AmericanFrame
                              src={img}
                              alt={`${toile.name} — ${i + 1}/3`}
                              imageWidth={pd?.imageWidth}
                              imageHeight={pd?.imageHeight}
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
                          BROWSE_VH
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
                        priority={index < 2}
                      />
                    </div>
                  )}
                </button>

                {/* Infos — nom a gauche, CTA a droite */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 max-w-4xl mx-auto gap-4">
                  <div>
                    <h3 className="text-xl font-extralight tracking-wide text-[#1a1a1a]">
                      {toile.name}
                    </h3>
                    <p className="text-neutral-500 text-xs font-light tracking-wider mt-1">
                      {toile.dimensions} — {toile.technique} — {toile.year}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    {showPrices ? (
                      <div className="flex items-center gap-6">
                        <span className="text-lg font-extralight tracking-wide text-[#8c6e32]">
                          {formatPrice(toile.price)}
                        </span>
                        <a
                          href={generateMailto(toile.name)}
                          className="inline-flex items-center justify-center px-6 py-3 text-neutral-500 text-xs tracking-[0.25em] uppercase hover:text-[#8c6e32] transition-all duration-300 border border-neutral-300 hover:border-[#8c6e32] min-h-[44px]"
                        >
                          {t('reserve')}
                        </a>
                      </div>
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

    </div>
  );
}
