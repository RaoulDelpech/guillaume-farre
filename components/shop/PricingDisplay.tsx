"use client";

/**
 * Affichage prix style Peter Lik - Guillaume Farré
 *
 * @author Lalou
 * @date 2025-11-08
 * @updated 2025-11-29 - Support 9/99 exemplaires, plus de tirages illimités
 *
 * Style ultra-épuré
 * Grands formats (A1, A0, 2A0) : 9 exemplaires
 * Petits formats (A2, A3, A4) : 99 exemplaires
 */

import { useEffect, useState } from 'react';
import { DEFAULT_PRICING, type PricingConfig } from '@/lib/pricing-config';
import { formatPrice } from '@/lib/pricing-calculator';

interface PricingDisplayProps {
  formatType?: 'grand' | 'petit' | 'all';
  className?: string;
}

// Prix fixes (2025-11-29)
const PRIX_FORMATS = {
  a4: { price: 250, label: 'Format A4', dimensions: '21 × 29.7 cm', exemplaires: 99 },
  a3: { price: 500, label: 'Format A3', dimensions: '29.7 × 42 cm', exemplaires: 99 },
  a2: { price: 800, label: 'Format A2', dimensions: '42 × 59.4 cm', exemplaires: 99 },
  a1: { price: 1200, label: 'Format A1', dimensions: '59.4 × 84.1 cm', exemplaires: 9 },
  a0: { price: null, label: 'Format A0', dimensions: '84.1 × 118.9 cm', exemplaires: 9 },
  '2a0': { price: null, label: 'Format 2A0', dimensions: '118.9 × 168.2 cm', exemplaires: 9 },
};

export default function PricingDisplay({ formatType = 'all', className = '' }: PricingDisplayProps) {
  const petitsFormats = ['a4', 'a3', 'a2'] as const;
  const grandsFormats = ['a1', 'a0', '2a0'] as const;

  const formatsToShow = formatType === 'petit' ? petitsFormats :
                        formatType === 'grand' ? grandsFormats :
                        [...petitsFormats, ...grandsFormats];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Petits formats */}
      {(formatType === 'all' || formatType === 'petit') && (
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-700 mb-3">
            PETITS FORMATS — 99 exemplaires
          </h3>
          <div className="space-y-1">
            {petitsFormats.map((format) => {
              const info = PRIX_FORMATS[format];
              return (
                <div key={format} className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-600">{info.label}</span>
                    <span className="text-xs text-gray-400 ml-2">{info.dimensions}</span>
                  </div>
                  <span className="text-base font-semibold tabular-nums tracking-wide">
                    {formatPrice(info.price!)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grands formats */}
      {(formatType === 'all' || formatType === 'grand') && (
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-700 mb-3">
            GRANDS FORMATS — 9 exemplaires
          </h3>
          <div className="space-y-1">
            {grandsFormats.map((format) => {
              const info = PRIX_FORMATS[format];
              return (
                <div key={format} className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-600">{info.label}</span>
                    <span className="text-xs text-gray-400 ml-2">{info.dimensions}</span>
                  </div>
                  <span className="text-base font-semibold tabular-nums tracking-wide">
                    {info.price ? formatPrice(info.price) : 'Sur devis'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
