"use client";

/**
 * Affichage prix style Peter Lik - Guillaume Farré
 *
 * @author Lalou
 * @date 2025-11-08
 *
 * Style ultra-épuré sans "à partir de"
 * Format direct: "Format A4    150 €"
 */

import { useEffect, useState } from 'react';
import { DEFAULT_PRICING, type PricingConfig, type PricingCategory } from '@/lib/pricing-config';
import { calculatePrice, formatPrice } from '@/lib/pricing-calculator';

interface PricingDisplayProps {
  category: PricingCategory;
  className?: string;
}

export default function PricingDisplay({ category, className = '' }: PricingDisplayProps) {
  const [config, setConfig] = useState<PricingConfig>(DEFAULT_PRICING);

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    try {
      const res = await fetch('/api/admin/pricing');
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config || DEFAULT_PRICING);
      }
    } catch (error) {
      console.error('Erreur chargement pricing:', error);
    }
  }

  const formats = category === 'unlimited' ? (['a4', 'a3', 'a2'] as const) : (['a3', 'a2', 'a1'] as const);

  const formatLabels = {
    a4: 'Format A4',
    a3: 'Format A3',
    a2: 'Format A2',
    a1: 'Format A1',
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-700 mb-3">
        {category === 'unlimited' ? 'TIRAGE ILLIMITÉ' : 'SÉRIE LIMITÉE 1/7'}
      </h3>

      <div className="space-y-1">
        {formats.map((format) => {
          const calculation = calculatePrice(category, format, config);

          return (
            <div key={format} className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">{formatLabels[format]}</span>
              <span className="text-base font-semibold tabular-nums tracking-wide">
                {formatPrice(calculation.price)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
