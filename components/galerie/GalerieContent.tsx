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
import LandingSection from '@/components/landing/LandingSection';
import { STANDARD_FORMATS, PURCHASABLE_FORMATS, FORMATS, formatPrice, type PrintFormat } from '@/lib/pricing-config';
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

/** Prix special photo 7 (Magma) pour test Stripe */
const PHOTO_7_TEST_PRICE_24x36 = 20;

/** Donnees d'edition par photo et format (nombre de tirages disponibles) */
type EditionsMap = Record<string, Record<string, number>>;

/** Panneau achat inline sous chaque photo */
function PhotoPurchasePanel({
  photo,
  isOpen,
  onToggle,
  locale,
  editions,
}: {
  photo: Photo;
  isOpen: boolean;
  onToggle: () => void;
  locale: string;
  editions: EditionsMap;
}) {
  const [purchasing, setPurchasing] = useState(false);
  const isMonumental = photo.id === 16;

  function getPrice(format: PrintFormat): number {
    if (photo.id === 7 && format === '24x36') return PHOTO_7_TEST_PRICE_24x36;
    return FORMATS[format].price!;
  }

  function getAvailable(format: string): number | null {
    return editions[`photo_${photo.id}`]?.[format] ?? null;
  }

  async function checkout(format: PrintFormat) {
    setPurchasing(true);
    try {
      const price = getPrice(format);
      const orientation =
        photo.imageWidth > photo.imageHeight ? 'landscape' : 'vertical';

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              title: photo.name,
              price,
              format,
              images: [photo.image],
              photoPath: photo.image,
              material: 'semi-glossy',
              orientation,
              frame: 'none',
              category: 'Photographie',
              photoId: photo.id,
            },
          ],
          locale,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erreur de paiement');
        setPurchasing(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Erreur de paiement');
      setPurchasing(false);
    }
  }

  if (isMonumental) {
    return (
      <div className="mt-4 text-center">
        <a
          href={`/${locale}/contact`}
          className="text-[11px] font-light tracking-[0.2em] uppercase text-[#1a1a1a]/70 hover:text-[#8c6e32] transition-colors duration-300 border-b border-[#8c6e32]/30 pb-0.5"
        >
          Nous contacter
        </a>
      </div>
    );
  }

  return (
    <div className="mt-4 text-center">
      <button
        type="button"
        onClick={onToggle}
        className="text-[11px] font-light tracking-[0.2em] uppercase text-[#1a1a1a]/70 hover:text-[#8c6e32] transition-colors duration-300 border-b border-[#8c6e32]/30 pb-0.5"
      >
        {isOpen ? 'Fermer' : 'Acquérir ce tirage'}
      </button>

      {isOpen && (
        <div className="mt-4 mx-auto max-w-[280px] bg-white/80 backdrop-blur-sm border border-[#e8e0d0] rounded-sm p-4 space-y-2.5">
          {PURCHASABLE_FORMATS.map((format) => {
            const price = getPrice(format);
            const available = getAvailable(format);
            const soldOut = available !== null && available <= 0;

            return (
              <div key={format}>
                <button
                  type="button"
                  onClick={() => checkout(format)}
                  disabled={purchasing || soldOut}
                  className="flex items-center justify-between w-full text-[11px] tracking-[0.1em] text-[#2a2a2a] hover:text-[#8c6e32] transition-colors duration-200 py-1.5 border-b border-[#e8e0d0]/60 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="font-light uppercase">{FORMATS[format].label}</span>
                  <span className="font-normal tabular-nums">
                    {soldOut ? 'Épuisé' : formatPrice(price)}
                  </span>
                </button>
                {available !== null && !soldOut && (
                  <p className="text-[9px] font-light tracking-[0.15em] uppercase text-[#9a9a9a] mt-0.5">
                    {available} tirage{available > 1 ? 's' : ''} disponible{available > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function GalerieContent() {
  const t = useTranslations('gallery');
  const locale = useLocale();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<PrintFormat>('24x36');
  const [purchasing, setPurchasing] = useState(false);
  const [openPurchaseId, setOpenPurchaseId] = useState<number | null>(null);
  const [editions, setEditions] = useState<EditionsMap>({});

  // Charger les donnees d'editions au montage
  useEffect(() => {
    fetch('/api/editions')
      .then((r) => r.json())
      .then((data) => setEditions(data))
      .catch(() => {});
  }, []);

  const togglePurchase = (photoId: number) => {
    setOpenPurchaseId((prev) => (prev === photoId ? null : photoId));
  };

  // Touch swipe state
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

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

  // Reset format quand on change de photo
  useEffect(() => {
    setSelectedFormat('24x36');
    setPurchasing(false);
  }, [lightboxIndex]);

  // Scroll la miniature active dans le strip vertical
  useEffect(() => {
    if (lightboxIndex === null || !thumbnailsRef.current) return;
    const activeThumb = thumbnailsRef.current.children[lightboxIndex] as HTMLElement;
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [lightboxIndex]);

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

  /** Prix effectif pour la photo courante dans le format selectionne */
  function getLightboxPrice(): number | null {
    const config = FORMATS[selectedFormat];
    if (!config.price) return null;
    if (lightboxIndex !== null) {
      const photo = typedPhotos[lightboxIndex];
      if (photo.id === 7 && selectedFormat === '24x36') return PHOTO_7_TEST_PRICE_24x36;
    }
    return config.price;
  }

  /** Tirages disponibles pour la photo courante dans un format donne */
  function getLightboxAvailable(format: string): number | null {
    if (lightboxIndex === null) return null;
    const photo = typedPhotos[lightboxIndex];
    return editions[`photo_${photo.id}`]?.[format] ?? null;
  }

  async function handlePurchase() {
    if (lightboxIndex === null) return;
    const photo = typedPhotos[lightboxIndex];
    const price = getLightboxPrice();
    if (!price) return;

    setPurchasing(true);
    try {
      const orientation =
        photo.imageWidth > photo.imageHeight ? 'landscape' : 'vertical';

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              title: photo.name,
              price,
              format: selectedFormat,
              images: [photo.image],
              photoPath: photo.image,
              material: 'semi-glossy',
              orientation,
              frame: 'none',
              category: 'Photographie',
              photoId: photo.id,
            },
          ],
          locale,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erreur de paiement');
        setPurchasing(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Erreur de paiement');
      setPurchasing(false);
    }
  }

  /** Retrouve l'index global d'une photo par son id (pour ouvrir la lightbox) */
  function getGlobalIndex(id: number): number {
    return typedPhotos.findIndex((p) => p.id === id);
  }

  return (
    <>
      {/* Header */}
      <div className="mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16 md:py-24 max-w-[1400px]">
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extralight tracking-[0.08em] uppercase text-[#1a1a1a] mb-6">
            {t('photosTitle')}
          </h1>
          <div className="w-16 h-px bg-[rgba(140,110,50,0.4)] mx-auto" />
        </div>

        {/* Grille en rangees */}
        <div className="space-y-8 sm:space-y-14">
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
                  <p className="mt-4 sm:mt-5 text-base sm:text-lg font-extralight text-[#2a2a2a] tracking-wider uppercase text-center">
                    {photo.name}
                  </p>
                  <PhotoPurchasePanel
                    photo={photo}
                    isOpen={openPurchaseId === photo.id}
                    onToggle={() => togglePurchase(photo.id)}
                    locale={locale}
                    editions={editions}
                  />
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
                      <p className="mt-4 sm:mt-5 text-base sm:text-lg font-extralight text-[#2a2a2a] tracking-wider uppercase text-center">
                        {photo.name}
                      </p>
                      <PhotoPurchasePanel
                        photo={photo}
                        isOpen={openPurchaseId === photo.id}
                        onToggle={() => togglePurchase(photo.id)}
                        locale={locale}
                        editions={editions}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Mentions legales */}
        <div className="text-center mt-16 sm:mt-24 space-y-2">
          <p className="text-xs font-light tracking-[0.15em] uppercase text-[#8c8c8c]">
            Tirage numéroté et signé — Édition limitée
          </p>
          <p className="text-xs font-light text-[#a0a0a0]">
            TVA non applicable, article 293 B du Code général des impôts
          </p>
        </div>
      </div>

      {/* Section landing — grille photos + newsletter */}
      <LandingSection />

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

            {/* Contenu principal : miniatures + image + infos */}
            <div
              className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-8 max-w-[1500px] w-full h-full px-4 sm:px-12 lg:px-16 py-14 sm:py-16 mx-auto overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Miniatures laterales — desktop */}
              <div
                ref={thumbnailsRef}
                className="hidden lg:flex flex-col gap-2 flex-shrink-0 self-stretch overflow-y-auto py-2"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}
              >
                {typedPhotos.map((photo, idx) => (
                  <button
                    key={photo.id}
                    onClick={() => setLightboxIndex(idx)}
                    className={`relative flex-shrink-0 w-16 h-16 overflow-hidden transition-all duration-200 ${
                      idx === lightboxIndex
                        ? 'ring-2 ring-[#B8956A] opacity-100'
                        : 'opacity-40 hover:opacity-75'
                    }`}
                    aria-label={photo.name}
                  >
                    <Image
                      src={photo.image}
                      alt={photo.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>

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

                {typedPhotos[lightboxIndex].id === 16 ? (
                  /* Photo 16 (Bettejuice) : piece unique, sur demande */
                  <>
                    <p className="text-sm text-white/50 font-light mb-6 leading-relaxed">
                      Format monumental — Pièce unique — Sur demande
                    </p>
                    <a
                      href={`/${locale}/contact`}
                      className="inline-flex items-center justify-center px-8 py-3.5 border border-white/40 hover:border-white text-white font-light tracking-wide text-sm uppercase transition-all duration-300 hover:bg-white/10 min-h-[44px]"
                    >
                      Nous contacter
                    </a>
                  </>
                ) : (
                  /* Photos 1-15 : selection format + checkout Stripe */
                  <>
                    {/* Selection format avec radio custom */}
                    <div className="w-full space-y-1.5 mb-4 sm:mb-5">
                      {STANDARD_FORMATS.map((formatKey: PrintFormat) => {
                        const config = FORMATS[formatKey];
                        const purchasable = config.price !== null;
                        const isSelected = selectedFormat === formatKey;
                        const available = getLightboxAvailable(formatKey);
                        const soldOut = available !== null && available <= 0;
                        const displayPrice = purchasable
                          ? (lightboxIndex !== null && typedPhotos[lightboxIndex].id === 7 && formatKey === '24x36'
                              ? PHOTO_7_TEST_PRICE_24x36
                              : config.price!)
                          : null;

                        if (purchasable) {
                          return (
                            <div key={formatKey}>
                              <button
                                type="button"
                                onClick={() => setSelectedFormat(formatKey)}
                                disabled={soldOut}
                                className={`flex items-center justify-between w-full text-sm border-b pb-2 text-left transition-colors ${
                                  soldOut
                                    ? 'border-white/10 opacity-40 cursor-not-allowed'
                                    : isSelected
                                      ? 'border-white/40'
                                      : 'border-white/15'
                                }`}
                                aria-pressed={isSelected}
                              >
                                <span className="flex items-center gap-2.5">
                                  <span
                                    className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
                                      isSelected && !soldOut
                                        ? 'border-white'
                                        : 'border-white/50'
                                    }`}
                                  >
                                    {isSelected && !soldOut && (
                                      <span className="w-2 h-2 rounded-full bg-white" />
                                    )}
                                  </span>
                                  <span
                                    className={`font-light transition-colors ${
                                      isSelected && !soldOut
                                        ? 'text-white'
                                        : 'text-white/80'
                                    }`}
                                  >
                                    {config.label}
                                  </span>
                                </span>
                                <span className="flex items-center gap-2">
                                  <span
                                    className={`font-light tabular-nums transition-colors ${
                                      isSelected && !soldOut
                                        ? 'text-white'
                                        : 'text-white/70'
                                    }`}
                                  >
                                    {soldOut ? 'Épuisé' : formatPrice(displayPrice!)}
                                  </span>
                                </span>
                              </button>
                              {available !== null && !soldOut && (
                                <p className="text-[9px] font-light tracking-[0.15em] uppercase text-white/35 mt-0.5 pl-6">
                                  {available} tirage{available > 1 ? 's' : ''} disponible{available > 1 ? 's' : ''}
                                </p>
                              )}
                            </div>
                          );
                        }

                        return (
                          <div key={formatKey}>
                            <div className="flex items-center justify-between text-sm border-b border-white/15 pb-2 pl-6">
                              <span className="font-light text-white/50">
                                {config.label}
                              </span>
                              <span className="font-light text-white/50 tabular-nums">
                                {t('onRequest')}
                              </span>
                            </div>
                            {available !== null && !soldOut && (
                              <p className="text-[9px] font-light tracking-[0.15em] uppercase text-white/35 mt-0.5 pl-6">
                                {available} tirage{available > 1 ? 's' : ''} disponible{available > 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Certificat */}
                    <p className="text-xs font-light text-white/50 mb-4 sm:mb-6 leading-relaxed">
                      {t('certificate')}
                    </p>

                    {/* Bouton achat Stripe */}
                    {(() => {
                      const currentPrice = getLightboxPrice();
                      const currentAvail = getLightboxAvailable(selectedFormat);
                      const currentSoldOut = currentAvail !== null && currentAvail <= 0;
                      return (
                        <button
                          type="button"
                          onClick={handlePurchase}
                          disabled={purchasing || currentSoldOut || !currentPrice}
                          className="inline-flex items-center justify-center px-8 py-3.5 border border-white/40 hover:border-white text-white font-light tracking-wide text-sm uppercase transition-all duration-300 hover:bg-white/10 min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {purchasing
                            ? 'Chargement...'
                            : currentSoldOut
                              ? 'Épuisé'
                              : currentPrice
                                ? `${t('acquire')} — ${formatPrice(currentPrice)}`
                                : t('onRequest')}
                        </button>
                      );
                    })()}
                  </>
                )}
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
