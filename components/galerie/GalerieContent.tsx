'use client';

/**
 * GalerieContent - Galerie photos avec grille responsive, lightbox et prix
 * Affiche les 16 photographies avec les prix importes depuis pricing-config.ts
 * @author Lalou
 */

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import AmericanFrame from '@/components/AmericanFrame';
import { STANDARD_FORMATS, FORMATS, formatPrice, type PrintFormat } from '@/lib/pricing-config';
import photos from '@/data/photos.json';
import blurPlaceholders from '@/data/blur-placeholders.json';

const FRAME_COLORS = ['black', 'oak', 'walnut'] as const;
const BLUR: Record<string, string> = blurPlaceholders;

interface Photo {
  id: number;
  name: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
}

/**
 * Determine la couleur du cadre selon l'ID (alternance noir/chene/noyer)
 */
function getFrameColor(id: number): 'black' | 'oak' | 'walnut' {
  if (id % 3 === 0) return 'walnut';
  if (id % 3 === 1) return 'black';
  return 'oak';
}

export function GalerieContent() {
  const t = useTranslations('gallery');
  const locale = useLocale();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const typedPhotos = photos as Photo[];

  // Navigation clavier dans la lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null || prev === 0 ? typedPhotos.length - 1 : prev - 1
        );
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null || prev === typedPhotos.length - 1 ? 0 : prev + 1
        );
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, typedPhotos.length]);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    setLightboxIndex((prev) =>
      prev === null || prev === 0 ? typedPhotos.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setLightboxIndex((prev) =>
      prev === null || prev === typedPhotos.length - 1 ? 0 : prev + 1
    );
  };

  /**
   * Genere le lien mailto avec subject et body pre-remplis
   */
  function generateMailto(name: string): string {
    const subject = t('mailSubject', { name });
    const body = t('mailBody', { name });
    return `mailto:contact@guillaumefarre.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <>
      {/* Header */}
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extralight tracking-[0.08em] uppercase text-[#1a1a1a] mb-6">
            {t('photosTitle')}
          </h1>
          <div className="w-16 h-px bg-[rgba(140,110,50,0.4)] mx-auto mb-6" />
          <p className="text-lg font-light text-neutral-500">
            {t('photosSubtitle')}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {typedPhotos.map((photo, index) => {
            const frameColor = getFrameColor(photo.id);
            const blurDataURL = BLUR[photo.image] || undefined;

            return (
              <div key={photo.id} className="flex flex-col group">
                {/* Photo avec AmericanFrame */}
                <button
                  onClick={() => openLightbox(index)}
                  className="block mb-6 cursor-pointer transition-transform hover:scale-[1.01] duration-300 ease-out"
                  aria-label={t('lightboxOpen')}
                >
                  <AmericanFrame
                    src={photo.image}
                    alt={photo.name}
                    imageWidth={photo.imageWidth}
                    imageHeight={photo.imageHeight}
                    frameColor={frameColor}
                    className="w-full"
                    blurDataURL={blurDataURL}
                    priority={index < 3}
                  />
                </button>

                {/* Titre */}
                <h2 className="text-xl font-light tracking-wide text-[#1a1a1a] mb-4">
                  {photo.name}
                </h2>

                {/* Tableau de prix */}
                <div className="space-y-2 mb-4">
                  {STANDARD_FORMATS.map((formatKey: PrintFormat) => {
                    const config = FORMATS[formatKey];
                    const price = config.price;
                    const start = config.numberingStart;
                    const end = config.numberingEnd;
                    const numbering =
                      start && end ? t('numbering', { start, end }) : '';

                    return (
                      <div
                        key={formatKey}
                        className="flex justify-between items-center text-sm text-neutral-700"
                      >
                        <span className="font-light">{config.label}</span>
                        <span className="font-light text-neutral-500 text-xs">
                          {numbering}
                        </span>
                        <span className="font-light tabular-nums">
                          {price === null ? t('onRequest') : formatPrice(price)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Certificat */}
                <p className="text-xs font-light text-neutral-500 mb-4">
                  {t('certificate')}
                </p>

                {/* CTA mailto */}
                <a
                  href={generateMailto(photo.name)}
                  className="text-xs uppercase tracking-widest text-[#8c6e32] hover:text-[#6e5426] transition-colors inline-flex items-center gap-1"
                >
                  {t('acquire')}
                  <span className="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox enrichie avec prix, certificat et mailto */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={typedPhotos[lightboxIndex].name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Bouton fermer */}
            <motion.button
              onClick={closeLightbox}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/60 hover:text-white w-12 h-12 flex items-center justify-center transition-colors z-20"
              aria-label={t('lightboxClose')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.25 }}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Fleche gauche */}
            <motion.button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white w-12 h-12 flex items-center justify-center transition-colors z-20"
              aria-label={t('lightboxPrev')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.25 }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            {/* Fleche droite */}
            <motion.button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white w-12 h-12 flex items-center justify-center transition-colors z-20"
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
              className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10 max-w-7xl w-full px-4 sm:px-12 lg:px-16 py-16"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIndex}
                  className="relative flex-shrink-0"
                  style={{ maxWidth: '60vw', maxHeight: '75vh' }}
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
                    className="max-w-[90vw] lg:max-w-[60vw] max-h-[50vh] lg:max-h-[75vh] w-auto h-auto object-contain"
                    priority
                    unoptimized
                  />
                </motion.div>
              </AnimatePresence>

              {/* Panneau infos : nom, prix, certificat, CTA */}
              <motion.div
                className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-sm w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {/* Nom de la photo */}
                <h2 className="text-xl md:text-2xl font-light text-white tracking-wide mb-1">
                  {typedPhotos[lightboxIndex].name}
                </h2>
                <p className="text-sm text-white/40 font-light mb-6">
                  {lightboxIndex + 1} / {typedPhotos.length}
                </p>

                {/* Tableau de prix */}
                <div className="w-full space-y-2 mb-5">
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
                <p className="text-xs font-light text-white/50 mb-6 leading-relaxed">
                  {t('certificate')}
                </p>

                {/* CTA mailto */}
                <a
                  href={generateMailto(typedPhotos[lightboxIndex].name)}
                  className="inline-block px-8 py-3 border border-white/40 hover:border-white text-white font-light tracking-wide text-sm uppercase transition-all duration-300 hover:bg-white/10"
                >
                  {t('acquire')}
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
