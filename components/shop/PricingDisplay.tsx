"use client";

/**
 * Affichage grille de prix — Guillaume Farre
 *
 * @author Lalou
 * @date 2026-04-09
 *
 * 3 formats avec prix fixes + hors format sur demande
 * Tous signes et numerotes, 30 exemplaires max par photo
 */

import { FORMATS, STANDARD_FORMATS, formatPrice, type PrintFormat } from '@/lib/pricing-config';

interface PricingDisplayProps {
  className?: string;
  /** Si true, n'affiche que les formats avec prix fixe (pas hors-format) */
  purchasableOnly?: boolean;
}

export default function PricingDisplay({ className = '', purchasableOnly = false }: PricingDisplayProps) {
  const formatsToShow = purchasableOnly
    ? STANDARD_FORMATS.filter(f => FORMATS[f].price !== null)
    : STANDARD_FORMATS;

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-700 mb-3">
          Tirages sign\u00E9s et num\u00E9rot\u00E9s
        </h3>
        <div className="space-y-2">
          {formatsToShow.map((format) => {
            const info = FORMATS[format];
            return (
              <div key={format} className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium text-gray-600">{info.label}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    {info.exemplaires} exemplaires (n\u00B0{info.numberingStart}-{info.numberingEnd})
                  </span>
                </div>
                <span className="text-base font-semibold tabular-nums tracking-wide">
                  {info.price !== null ? formatPrice(info.price) : 'Sur demande'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
