'use client';

/**
 * GalerieContent - Galerie photos en rangees avec lightbox et prix
 * Layout en rangees avec flex proportionnel (solo, trio, duo)
 * Prix affiches uniquement dans la lightbox (au clic)
 * @author Lalou
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import PhotoFrame from '@/components/PhotoFrame';
import { STANDARD_FORMATS, FORMATS, formatPrice, type PrintFormat } from '@/lib/pricing-config';
import photos from '@/data/photos.json';
import blurPlaceholders from '@/data/blur-placeholders.json';

const BLUR: Record<string, string> = blurPlaceholders;

/** Disposition des photos en rangees */
const ROWS: number[][] = [
  [1],
  [2, 3, 4],
  [5, 6, 7],
  [8, 9, 10],
  [11, 12, 13],
  [14, 15],
  [16],
];

interface Photo {
  id: number;
  name: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
}

/** Seuil en px pour considerer un mouvement comme un swipe */
const SWIPE_THRESHOLD = 50;

export function GalerieContent() {
  const t = useTranslations('gallery');
  const locale = useLocale();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Touch swipe state
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const typedPhotos = photos as Photo[];

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null || prev === 0 ? typedPhotos.length - 1 : prev - 1
    );
  }, [typedPhotos.length]);

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null || prev === typedPhotos.length - 1 ? 0 : prev + 1
    );
  }, [typedPhotos.length]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  // Navigation clavier dans la lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, closeLightbox, prevImage, nextImage]);

  const openLightbox = (index: number) => setLightboxIndex(index);

  // Touch handlers pour le swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) nextImage();
      else prevImage();
    }
  };

  function generateMailto(name: string): string {
    const subject = t('mailSubject', { name });
    const body = t('mailBody', { name });
    return `mailto:contact@guillaumefarre.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  /** Retrouve l'index global d'une photo par son id (pour ouvrir la lightbox) */
  function getGlobalIndex(id: number): number {
    return typedPhotos.findIndex((p) => p.id === id);
  }

  return (
    <>
      {/* Header */}
      <div className="mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16 md:py-24 max-w-[1800px]">
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extralight tracking-[0.08em] uppercase text-[#1a1a1a] mb-6">
            {t('photosTitle')}
          </h1>
          <div className="w-16 h-px bg-[rgba(140,110,50,0.4)] mx-auto" />
        </div>

        {/* Grille en rangees */}
        <div className="space-y-6 sm:space-y-10">
          {ROWS.map((rowIds, rowIndex) => {
            const rowPhotos = rowIds.map(
              (id) => typedPhotos.find((p) => p.id === id)!
            );
            const isSolo = rowPhotos.length === 1;

            if (isSolo) {
              const photo = rowPhotos[0];
              const globalIdx = getGlobalIndex(photo.id);
              const blurDataURL = BLUR[photo.image] || undefined;

              return (
                <div key={rowIndex} className="group w-full">
                  <button
                    onClick={() => openLightbox(globalIdx)}
                    className="block w-full cursor-pointer transition-transform hover:scale-[1.003] duration-300 ease-out"
                    aria-label={t('lightboxOpen')}
                  >
                    <PhotoFrame
                      src={photo.image}
                      alt={photo.name}
                      imageWidth={photo.imageWidth}
                      imageHeight={photo.imageHeight}
                      className="w-full"
                      blurDataURL={blurDataURL}
                      priority={rowIndex === 0}
                    />
                  </button>
                  <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg font-light text-[#1a1a1a] tracking-wide text-center">
                    {photo.name}
                  </p>
                </div>
              );
            }

            // Pour les duos : calcul exact CSS calc() pour hauteurs egales
            const isDuo = rowPhotos.length === 2;
            let duoWidths: string[] = [];

            if (isDuo) {
              const r1 = rowPhotos[0].imageHeight / rowPhotos[0].imageWidth;
              const r2 = rowPhotos[1].imageHeight / rowPhotos[1].imageWidth;
              const P = 156;
              const GAP = 24;
              const pf1 = r2 / (r1 + r2);
              const pxOff = P * (r1 - r2) / (r1 + r2);

              duoWidths = [
                `calc(${(pf1 * 100).toFixed(2)}% + ${(pxOff - pf1 * GAP).toFixed(1)}px)`,
                `calc(${((1 - pf1) * 100).toFixed(2)}% + ${(-pxOff - (1 - pf1) * GAP).toFixed(1)}px)`,
              ];
            }

            return (
              <div key={rowIndex} className="flex flex-wrap gap-4 sm:gap-6">
                {rowPhotos.map((photo, idx) => {
                  const globalIdx = getGlobalIndex(photo.id);
                  const blurDataURL = BLUR[photo.image] || undefined;

                  // Duo : largeurs calculees. Trio : flexGrow proportionnel
                  const itemStyle: React.CSSProperties = isDuo
                    ? { width: duoWidths[idx] }
                    : { flexGrow: (photo.imageWidth + 156) / (photo.imageHeight + 156) };

                  return (
                    <div
                      key={photo.id}
                      className={`group ${isDuo ? 'basis-full sm:basis-auto sm:flex-none' : 'basis-full sm:basis-0'}`}
                      style={itemStyle}
                    >
                      <button
                        onClick={() => openLightbox(globalIdx)}
                        className="block w-full cursor-pointer transition-transform hover:scale-[1.003] duration-300 ease-out"
                        aria-label={t('lightboxOpen')}
                      >
                        <PhotoFrame
                          src={photo.image}
                          alt={photo.name}
                          imageWidth={photo.imageWidth}
                          imageHeight={photo.imageHeight}
                          className="w-full"
                          blurDataURL={blurDataURL}
                          priority={rowIndex < 2}
                        />
                      </button>
                      <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg font-light text-[#1a1a1a] tracking-wide text-center">
                        {photo.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox avec prix, certificat et mailto */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={typedPhotos[lightboxIndex].name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Bouton fermer */}
            <motion.button
              onClick={closeLightbox}
              className="absolute top-3 right-3 sm:top-6 sm:right-6 text-white/60 hover:text-white w-12 h-12 flex items-center justify-center transition-colors z-20"
              aria-label={t('lightboxClose')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.25 }}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Fleche gauche — masquee sur mobile (swipe a la place) */}
            <motion.button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-1 sm:left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white w-12 h-12 hidden sm:flex items-center justify-center transition-colors z-20"
              aria-label={t('lightboxPrev')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.25 }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            {/* Fleche droite — masquee sur mobile */}
            <motion.button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-1 sm:right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white w-12 h-12 hidden sm:flex items-center justify-center transition-colors z-20"
              aria-label={t('lightboxNext')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.25 }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>

            {/* Contenu principal : image + infos */}
            <div
              className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-10 max-w-7xl w-full h-full px-4 sm:px-12 lg:px-16 py-14 sm:py-16 mx-auto overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIndex}
                  className="relative flex-shrink-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Image
                    src={typedPhotos[lightboxIndex].image}
                    alt={typedPhotos[lightboxIndex].name}
                    width={typedPhotos[lightboxIndex].imageWidth}
                    height={typedPhotos[lightboxIndex].imageHeight}
                    className="max-w-[92vw] sm:max-w-[90vw] lg:max-w-[60vw] max-h-[45vh] sm:max-h-[50vh] lg:max-h-[75vh] w-auto h-auto object-contain"
                    priority
                    unoptimized
                  />
                </motion.div>
              </AnimatePresence>

              {/* Panneau infos : nom, prix, certificat, CTA */}
              <motion.div
                className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-sm w-full flex-shrink-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h2 className="text-lg sm:text-xl md:text-2xl font-light text-white tracking-wide mb-1">
                  {typedPhotos[lightboxIndex].name}
                </h2>
                <p className="text-sm text-white/40 font-light mb-4 sm:mb-6">
                  {lightboxIndex + 1} / {typedPhotos.length}
                </p>

                {/* Tableau de prix */}
                <div className="w-full space-y-2 mb-4 sm:mb-5">
                  {STANDARD_FORMATS.map((formatKey: PrintFormat) => {
                    const config = FORMATS[formatKey];
                    const price = config.price;
                    const numbering = config.numberingStart && config.numberingEnd
                      ? t('numbering', { start: config.numberingStart, end: config.numberingEnd })
                      : '';

                    return (
                      <div
                        key={formatKey}
                        className="flex justify-between items-center text-sm border-b border-white/10 pb-2"
                      >
                        <span className="font-light text-white/80">{config.label}</span>
                        <span className="font-light text-white/40 text-xs mx-2">
                          {numbering}
                        </span>
                        <span className="font-light text-white tabular-nums">
                          {price === null ? t('onRequest') : formatPrice(price)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Certificat */}
                <p className="text-xs font-light text-white/50 mb-4 sm:mb-6 leading-relaxed">
                  {t('certificate')}
                </p>

                {/* CTA mailto */}
                <a
                  href={generateMailto(typedPhotos[lightboxIndex].name)}
                  className="inline-block px-8 py-3.5 border border-white/40 hover:border-white text-white font-light tracking-wide text-sm uppercase transition-all duration-300 hover:bg-white/10 min-h-[44px] flex items-center justify-center"
                >
                  {t('acquire')}
                </a>
              </motion.div>
            </div>

            {/* Indicateur swipe sur mobile */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:hidden">
              <p className="text-white/30 text-xs tracking-wide">
                ← {t('lightboxSwipe') || 'Glisser'} →
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
