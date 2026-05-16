'use client';

/**
 * CTA "Reserver" pour une toile en vue VIP (showPrices=true).
 *
 * Trois variantes selon `toile.status` :
 *  - available (ou absent) : bouton actif qui ouvre le formulaire
 *  - reserved_pending / reserved_signed / partial_paid : grise + libelle
 *    "Reservee jusqu'au DD/MM"
 *  - paid / unavailable : grise + libelle "Vendue"
 *
 * @author Lalou
 */

import { useTranslations, useLocale } from 'next-intl';
import type { Toile, ToileStatus } from './types';
import { formatPrice } from './toiles-utils';

interface CanvasReserveCTAProps {
  toile: Toile;
  onReserveClick: () => void;
}

const RESERVED_STATUSES: ReadonlySet<ToileStatus> = new Set([
  'reserved_pending',
  'reserved_signed',
  'partial_paid',
]);
const SOLD_STATUSES: ReadonlySet<ToileStatus> = new Set(['paid', 'unavailable']);

function formatReservedDate(iso: string | null | undefined, locale: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  try {
    return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit' }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

export default function CanvasReserveCTA({ toile, onReserveClick }: CanvasReserveCTAProps) {
  const t = useTranslations('reservation');
  const locale = useLocale();
  const status: ToileStatus = toile.status ?? 'available';

  if (SOLD_STATUSES.has(status)) {
    return (
      <div className="flex items-center gap-6">
        <span className="text-lg font-extralight tracking-wide text-[#8c6e32]">
          {formatPrice(toile.price)}
        </span>
        <span
          aria-disabled="true"
          className="inline-flex items-center justify-center px-6 py-3 text-neutral-400 text-xs tracking-[0.25em] uppercase border border-neutral-200 bg-neutral-50 min-h-[44px] cursor-not-allowed"
        >
          {t('sold')}
        </span>
      </div>
    );
  }

  if (RESERVED_STATUSES.has(status)) {
    const date = formatReservedDate(toile.reservedUntil, locale);
    return (
      <div className="flex items-center gap-6">
        <span className="text-lg font-extralight tracking-wide text-[#8c6e32]">
          {formatPrice(toile.price)}
        </span>
        <span
          aria-disabled="true"
          className="inline-flex items-center justify-center px-6 py-3 text-neutral-400 text-xs tracking-[0.2em] uppercase border border-neutral-200 bg-neutral-50 min-h-[44px] cursor-not-allowed"
        >
          {date ? t('reserved_until', { date }) : t('reserved')}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <span className="text-lg font-extralight tracking-wide text-[#8c6e32]">
        {formatPrice(toile.price)}
      </span>
      <button
        type="button"
        onClick={onReserveClick}
        className="inline-flex items-center justify-center px-6 py-3 text-neutral-500 text-xs tracking-[0.25em] uppercase hover:text-[#8c6e32] transition-all duration-300 border border-neutral-300 hover:border-[#8c6e32] min-h-[44px]"
      >
        {t('button')}
      </button>
    </div>
  );
}
