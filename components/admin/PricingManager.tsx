"use client";

/**
 * Interface admin gestion pricing Guillaume Farre
 *
 * @author Lalou
 * @date 2026-04-09
 *
 * Affiche les formats et prix actuels.
 * Les prix sont fixes (pas de multiplicateurs).
 */

import { FORMATS, STANDARD_FORMATS, formatPrice, type PrintFormat } from '@/lib/pricing-config';

export default function PricingManager() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Grille de prix</h2>
        <p className="text-gray-600 text-sm mt-1">
          Tous les tirages sont sign\u00E9s et num\u00E9rot\u00E9s — 30 exemplaires max par photo
        </p>
      </div>

      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <div className="grid grid-cols-4 gap-3 text-sm font-medium text-gray-600 pb-2 border-b mb-3">
          <div>Format</div>
          <div>Prix</div>
          <div>Exemplaires</div>
          <div>Num\u00E9rotation</div>
        </div>

        <div className="space-y-2">
          {STANDARD_FORMATS.map((format) => {
            const info = FORMATS[format];
            return (
              <div key={format} className="grid grid-cols-4 gap-3 items-center py-2 hover:bg-gray-50 rounded px-2">
                <div className="font-medium">{info.label}</div>
                <div className="text-lg font-semibold">
                  {info.price !== null ? formatPrice(info.price) : 'Sur demande'}
                </div>
                <div className="text-gray-600">{info.exemplaires}</div>
                <div className="text-gray-500 text-sm">
                  n\u00B0{info.numberingStart} \u00E0 {info.numberingEnd}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <h4 className="font-semibold text-blue-900 mb-2">R\u00E8gles</h4>
        <ul className="space-y-1 text-blue-800">
          <li>Chaque photo existe en 30 exemplaires maximum (9+9+9+3)</li>
          <li>Les 3 exemplaires Hors Format sont sur devis uniquement</li>
          <li>Exception : la photo 15 existe en 1 seul exemplaire monumental (sur demande)</li>
        </ul>
      </div>
    </div>
  );
}
