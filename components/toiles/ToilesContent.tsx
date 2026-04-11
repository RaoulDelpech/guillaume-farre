'use client';

/**
 * ToilesContent — Grille responsive des toiles avec AmericanFrame
 * Double mode :
 * - Public (showPrices=false) : pas de prix, CTA = formulaire d'interet
 * - VIP (showPrices=true) : prix affiches, CTA = reservation par mailto
 *
 * @author Lalou
 */

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import AmericanFrame from '@/components/AmericanFrame';
import ToileLightbox from './ToileLightbox';
import ContactArtistForm from './ContactArtistForm';
import { LINEN_BG, formatPrice } from './toiles-utils';
import type { Toile } from './types';

export type { Toile, PanelDimension } from './types';

const FRAME_COLORS = ['black', 'oak', 'walnut'] as const;

/** Max rendered frame height in px — constrains portrait images via max-width */
const MAX_FRAME_HEIGHT = 450;
/** Total frame padding (face+bevel+lip+gap) on each axis: ~20px per side */
const FRAME_OVERHEAD = 40;

function getFrameColor(index: number): 'black' | 'oak' | 'walnut' {
  return FRAME_COLORS[index % 3];
}

/** Compute max frame width so height stays <= MAX_FRAME_HEIGHT */
function getFrameMaxWidth(imgW: number, imgH: number): number {
  const aspect = imgW / imgH;
  const maxImgH = MAX_FRAME_HEIGHT - FRAME_OVERHEAD;
  return Math.round(maxImgH * aspect + FRAME_OVERHEAD);
}

interface ToilesContentProps {
  toiles: Toile[];
  showPrices?: boolean;
}

export default function ToilesContent({ toiles, showPrices = false }: ToilesContentProps) {
  const t = useTranslations('canvas');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [openFormId, setOpenFormId] = useState<number | null>(null);

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

  return (
    <div className="min-h-screen" style={LINEN_BG}>
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-7xl">
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

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {toiles.map((toile, index) => {
            const frameColor = getFrameColor(index);
            const isTriptych = toile.triptych && toile.images;
            const formOpen = openFormId === toile.id;

            return (
              <div
                key={toile.id}
                className={`flex flex-col group ${isTriptych ? 'md:col-span-2 lg:col-span-3' : ''}`}
              >
                {/* Toile avec cadre americain */}
                <button
                  onClick={() => setLightboxIdx(index)}
                  className="block mb-6 cursor-pointer transition-transform hover:scale-[1.01] duration-300 ease-out"
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
                              frameColor={frameColor}
                              className="w-full"
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div
                      className="mx-auto"
                      style={{ maxWidth: getFrameMaxWidth(toile.imageWidth || 1200, toile.imageHeight || 900) }}
                    >
                      <AmericanFrame
                        src={toile.image || ''}
                        alt={toile.name}
                        imageWidth={toile.imageWidth}
                        imageHeight={toile.imageHeight}
                        frameColor={frameColor}
                        className="w-full"
                        priority={index < 3}
                      />
                    </div>
                  )}
                </button>

                {/* Infos */}
                <div className="text-center">
                  <h2 className="text-lg font-light tracking-wide text-[#1a1a1a]">
                    {toile.name}
                  </h2>
                  <p className="text-neutral-500 text-xs font-light tracking-wider mt-1">
                    {toile.dimensions} — {toile.technique} — {toile.year}
                  </p>

                  {showPrices ? (
                    <>
                      {/* VIP : prix + reservation */}
                      <p className="text-lg font-extralight tracking-wide text-[#8c6e32] mt-2">
                        {formatPrice(toile.price)}
                      </p>
                      <a
                        href={generateMailto(toile.name)}
                        className="inline-flex items-center justify-center mt-3 px-6 py-3 text-neutral-600 text-xs tracking-[0.25em] uppercase hover:text-[#8c6e32] transition-all duration-300 border border-neutral-300 hover:border-[#8c6e32] min-h-[44px]"
                      >
                        {t('reserve')}
                      </a>
                    </>
                  ) : (
                    <>
                      {/* Public : pas de prix, formulaire d'interet */}
                      {!formOpen ? (
                        <button
                          onClick={() => setOpenFormId(toile.id)}
                          className="inline-flex items-center justify-center mt-4 px-6 py-3 text-neutral-500 text-xs tracking-[0.25em] uppercase hover:text-[#8c6e32] transition-all duration-300 border border-neutral-200 hover:border-[#8c6e32] min-h-[44px]"
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
      />
    </div>
  );
}
