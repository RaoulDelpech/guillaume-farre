'use client';

/**
 * ArtEditionsSection — Section "Editions d'art" en tete de galerie.
 * Oeuvres en edition limitee 8 + 2 E.A, prix fixe, support papier ou caisson LED.
 * Paiement carte immediat (Stripe) via /api/stripe/checkout (format 'art-edition').
 * @author Lalou
 */

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import PhotoFrame from '@/components/PhotoFrame';
import { formatPrice } from '@/lib/pricing-config';
import { trackAddToCart, trackBeginCheckout } from '@/lib/analytics';
import artEditions from '@/data/art-editions.json';
import blurPlaceholders from '@/data/blur-placeholders.json';

const BLUR: Record<string, string> = blurPlaceholders;

interface ArtEdition {
  id: string;
  name: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  support: string;
  dimensions: string;
  price: number;
  edition: { size: number; ea: number; total: number; sold: number };
}

/** Disponibilites par edition (id -> nb restant), chargees depuis l'API */
type StockMap = Record<string, number>;

function EditionCard({
  edition,
  available,
  busy,
  onBuy,
}: {
  edition: ArtEdition;
  available: number | null;
  busy: boolean;
  onBuy: (e: ArtEdition) => void;
}) {
  const t = useTranslations('artEditions');
  const soldOut = available !== null && available <= 0;
  const isLed = edition.support.toLowerCase().includes('led');

  return (
    <div className="flex flex-col">
      <PhotoFrame
        src={edition.image}
        alt={edition.name}
        imageWidth={edition.imageWidth}
        imageHeight={edition.imageHeight}
        className="w-full"
        blurDataURL={BLUR[edition.image] || undefined}
      />
      <div className="mt-4 text-center flex-1 flex flex-col">
        <h3 className="text-base sm:text-lg font-extralight text-[#2a2a2a] tracking-wider uppercase">
          {edition.name}
        </h3>
        <p className="mt-1 text-[11px] font-light tracking-[0.18em] uppercase text-[#8c6e32]">
          {isLed ? t('supportLed') : t('supportPaper')} · {edition.dimensions}
        </p>
        <p className="mt-1 text-[10px] font-light tracking-[0.15em] uppercase text-[#9a9a9a]">
          {t('editionLabel', { size: edition.edition.size, ea: edition.edition.ea })}
        </p>
        <p className="mt-3 text-sm font-normal tabular-nums text-[#2a2a2a]">
          {formatPrice(edition.price)}
        </p>
        <div className="mt-3">
          {soldOut ? (
            <span className="text-[11px] font-light tracking-[0.2em] uppercase text-[#b0b0b0]">
              {t('soldOut')}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onBuy(edition)}
              disabled={busy}
              className="inline-flex items-center justify-center px-6 py-2.5 border border-[#8c6e32]/40 hover:border-[#8c6e32] text-[#2a2a2a] hover:text-[#8c6e32] text-[11px] font-light tracking-[0.2em] uppercase transition-all duration-300 min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {busy ? t('loading') : t('acquire')}
            </button>
          )}
          {available !== null && !soldOut && (
            <p className="mt-2 text-[9px] font-light tracking-[0.15em] uppercase text-[#9a9a9a]">
              {t('available', { count: available })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ArtEditionsSection() {
  const t = useTranslations('artEditions');
  const locale = useLocale();
  const editions = artEditions as ArtEdition[];
  const [stock, setStock] = useState<StockMap>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/art-editions')
      .then((r) => r.json())
      .then((data) => setStock(data))
      .catch(() => {});
  }, []);

  async function buy(edition: ArtEdition) {
    trackAddToCart({ id: `art_${edition.id}`, name: edition.name, price: edition.price, quantity: 1 });
    trackBeginCheckout(
      [{ id: `art_${edition.id}`, name: edition.name, price: edition.price, quantity: 1 }],
      edition.price
    );
    setBusyId(edition.id);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              title: edition.name,
              price: edition.price,
              format: 'art-edition',
              artEditionId: edition.id,
              images: [edition.image],
              photoPath: edition.image,
              material: edition.support,
              orientation: edition.imageWidth > edition.imageHeight ? 'landscape' : 'vertical',
              frame: 'none',
              category: 'Edition art',
            },
          ],
          locale,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || t('paymentError'));
        setBusyId(null);
      }
    } catch (err) {
      console.error('Art edition checkout error:', err);
      alert(t('paymentError'));
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto px-4 sm:px-8 lg:px-12 pt-12 sm:pt-16 md:pt-24 pb-4 max-w-[1400px]">
      <div className="text-center mb-10 sm:mb-14">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-extralight tracking-[0.08em] uppercase text-[#1a1a1a] mb-4">
          {t('title')}
        </h2>
        <p className="text-neutral-500 text-xs sm:text-sm font-light tracking-wider max-w-xl mx-auto">
          {t('subtitle')}
        </p>
        <div className="w-16 h-px bg-[rgba(140,110,50,0.4)] mx-auto mt-6" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
        {editions.map((edition) => (
          <EditionCard
            key={edition.id}
            edition={edition}
            available={stock[edition.id] ?? edition.edition.total - edition.edition.sold}
            busy={busyId === edition.id}
            onBuy={buy}
          />
        ))}
      </div>

      <div className="w-24 h-px bg-[rgba(0,0,0,0.08)] mx-auto mt-16 sm:mt-24" />
    </div>
  );
}
