"use client";

/**
 * Interface admin gestion pricing dynamique Guillaume Farré
 *
 * @author Lalou
 * @date 2025-11-08
 *
 * Permet à Guillaume de gérer ses prix facilement :
 * - Prix de base unlimited + limited
 * - Multiplicateurs auto
 * - Override manuel par format
 * - Toggle Auto/Manuel
 */

import { useState, useEffect } from 'react';
import {
  DEFAULT_PRICING,
  FORMATS_BY_CATEGORY,
  FORMAT_LABELS,
  type PricingConfig,
  type PricingCategory,
  type PricingFormat,
} from '@/lib/pricing-config';
import {
  calculatePrice,
  formatPrice,
  updateBasePrice,
  setManualPrice,
  clearManualPrice,
  updateMultiplier,
} from '@/lib/pricing-calculator';

export default function PricingManager() {
  const [config, setConfig] = useState<PricingConfig>(DEFAULT_PRICING);
  const [editingFormat, setEditingFormat] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [tempMultiplier, setTempMultiplier] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Charger config depuis API au montage
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
      console.error('Erreur chargement config pricing:', error);
      // Utiliser config par défaut si erreur
    }
  }

  async function saveConfig(newConfig: PricingConfig) {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: newConfig }),
      });

      if (res.ok) {
        setConfig(newConfig);
        showMessage('success', 'Prix sauvegardés avec succès');
      } else {
        showMessage('error', 'Erreur sauvegarde des prix');
      }
    } catch (error) {
      console.error('Erreur sauvegarde pricing:', error);
      showMessage('error', 'Erreur réseau');
    } finally {
      setIsSaving(false);
    }
  }

  function showMessage(type: 'success' | 'error', text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  function handleBasePriceChange(category: PricingCategory, value: string) {
    const price = parseFloat(value);
    if (isNaN(price) || price <= 0) return;

    const newConfig = updateBasePrice(category, price, config);
    saveConfig(newConfig);
  }

  function handleMultiplierChange(
    category: PricingCategory,
    format: PricingFormat,
    value: string
  ) {
    const multiplier = parseFloat(value);
    if (isNaN(multiplier) || multiplier <= 0) return;

    const newConfig = updateMultiplier(category, format, multiplier, config);
    saveConfig(newConfig);
  }

  function handleSetManualPrice(category: PricingCategory, format: PricingFormat, value: string) {
    const price = parseFloat(value);
    if (isNaN(price) || price <= 0) {
      showMessage('error', 'Prix invalide');
      return;
    }

    const key = `${category}-${format}` as const;
    const newConfig = setManualPrice(key, price, config);
    saveConfig(newConfig);
    setEditingFormat(null);
    setTempPrice('');
  }

  function handleClearManualPrice(category: PricingCategory, format: PricingFormat) {
    const key = `${category}-${format}` as const;
    const newConfig = clearManualPrice(key, config);
    saveConfig(newConfig);
  }

  function renderCategorySection(category: PricingCategory) {
    const formats = FORMATS_BY_CATEGORY[category];
    const basePrice = category === 'unlimited' ? config.prixBaseUnlimited : config.prixBaseLimited;
    const title = category === 'unlimited' ? 'TIRAGE ILLIMITÉ' : 'SÉRIE LIMITÉE (1/7)';

    return (
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4 uppercase tracking-wide">{title}</h3>

        {/* Prix de base */}
        <div className="mb-6 pb-6 border-b">
          <label className="block text-sm font-medium mb-2">
            Prix de base ({category === 'unlimited' ? 'A4' : 'A3'})
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              step="10"
              value={basePrice}
              onChange={(e) => handleBasePriceChange(category, e.target.value)}
              className="w-32 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-gray-600">€</span>
          </div>
        </div>

        {/* Tableau formats */}
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-3 text-sm font-medium text-gray-600 pb-2 border-b">
            <div>Format</div>
            <div>Prix calculé</div>
            <div>Multiplicateur</div>
            <div>Mode</div>
            <div>Actions</div>
          </div>

          {formats.map((format) => {
            const key = `${category}-${format}`;
            const calculation = calculatePrice(category, format, config);
            const isManual = calculation.isManual;
            const isEditing = editingFormat === key;

            return (
              <div key={format} className="grid grid-cols-5 gap-3 items-center py-2 hover:bg-gray-50 rounded px-2">
                {/* Format */}
                <div className="font-medium">{FORMAT_LABELS[format]}</div>

                {/* Prix */}
                <div className="text-lg font-semibold">
                  {formatPrice(calculation.price)}
                </div>

                {/* Multiplicateur */}
                <div>
                  {!isManual && calculation.multiplier && (
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={calculation.multiplier}
                      onChange={(e) => handleMultiplierChange(category, format, e.target.value)}
                      className="w-20 px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                    />
                  )}
                  {isManual && <span className="text-gray-400 text-sm">—</span>}
                </div>

                {/* Badge mode */}
                <div>
                  {isManual ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Manuel
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Auto
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {!isManual && (
                    <button
                      onClick={() => {
                        setEditingFormat(key);
                        setTempPrice(calculation.price.toString());
                      }}
                      className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 transition"
                    >
                      ✎ Manuel
                    </button>
                  )}
                  {isManual && (
                    <button
                      onClick={() => handleClearManualPrice(category, format)}
                      className="text-sm px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 transition text-blue-700"
                    >
                      ↻ Auto
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal édition prix manuel */}
        {editingFormat && editingFormat.startsWith(category) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
              <h4 className="text-lg font-semibold mb-4">
                Prix manuel - {FORMAT_LABELS[editingFormat.split('-')[1] as PricingFormat]}
              </h4>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Prix personnalisé</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={tempPrice}
                    onChange={(e) => setTempPrice(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <span className="text-gray-600">€</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const [cat, fmt] = editingFormat.split('-');
                    handleSetManualPrice(cat as PricingCategory, fmt as PricingFormat, tempPrice);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Valider
                </button>
                <button
                  onClick={() => {
                    setEditingFormat(null);
                    setTempPrice('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des prix</h2>
          <p className="text-gray-600 text-sm mt-1">
            Système pricing dynamique - Style Peter Lik
          </p>
        </div>

        {/* Indicateur sauvegarde */}
        {isSaving && (
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            Sauvegarde...
          </div>
        )}
      </div>

      {/* Message flash */}
      {message && (
        <div
          className={`px-4 py-3 rounded-md ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Sections catégories */}
      <div className="grid md:grid-cols-2 gap-6">
        {renderCategorySection('unlimited')}
        {renderCategorySection('limited')}
      </div>

      {/* Aide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Comment ça marche ?</h4>
        <ul className="space-y-1 text-blue-800">
          <li>
            <strong>Mode Auto</strong> : Le prix se calcule automatiquement (prix de base ×
            multiplicateur)
          </li>
          <li>
            <strong>Mode Manuel</strong> : Vous définissez un prix personnalisé fixe
          </li>
          <li>
            <strong>Prix de base</strong> : Modifier le prix de base recalcule tous les prix en mode
            Auto
          </li>
          <li>
            <strong>Multiplicateur</strong> : Ajuster pour changer les écarts entre formats
          </li>
        </ul>
      </div>

      {/* Info dernière mise à jour */}
      <div className="text-xs text-gray-500 text-center">
        Dernière mise à jour : {new Date(config.lastUpdated).toLocaleString('fr-FR')}
      </div>
    </div>
  );
}
