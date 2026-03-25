"use client";
import { useState } from "react";
import type { PhotoMetadata } from "@/lib/admin/photo-manager";

interface PhotoCardProps {
  photo: PhotoMetadata;
  onUpdate: (photo: PhotoMetadata) => void;
}

export default function PhotoCard({ photo, onUpdate }: PhotoCardProps) {
  const [data, setData] = useState<PhotoMetadata>(photo);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (updates: Partial<PhotoMetadata>) => {
    const newData = { ...data, ...updates };
    setData(newData);
    setHasChanges(true);
    onUpdate(newData);
  };

  return (
    <div className={`border-2 rounded-lg p-4 transition-all ${!data.visible ? 'opacity-60 bg-red-950/40 border-red-600' : 'bg-gray-950 border-gray-600'} ${hasChanges ? 'border-blue-400 border-4 shadow-xl shadow-blue-500/50' : ''}`}>
      {/* Image */}
      <div className="relative aspect-square mb-3 bg-black rounded-lg overflow-hidden border-2 border-gray-700">
        <img
          src={data.path}
          alt={data.filename}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Filename */}
      <div className="text-xs text-gray-300 mb-2 font-mono truncate bg-gray-900 px-2 py-1 rounded" title={data.filename}>
        {data.filename}
      </div>

      {/* Visible Toggle */}
      <div className="mb-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.visible}
            onChange={(e) => handleChange({ visible: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm font-bold text-white">
            {data.visible ? '✅ Visible sur le site' : '❌ Masquée'}
          </span>
        </label>
      </div>

      {/* Status dropdown (en haut à droite) */}
      <div className="mb-3">
        <label className="block text-xs text-gray-200 mb-1 font-semibold">Statut</label>
        <select
          value={data.status || 'active'}
          onChange={(e) => handleChange({ status: e.target.value === 'active' ? null : e.target.value as 'trash' | 'to-sort' })}
          className="w-full px-3 py-2 text-sm border-2 border-gray-500 rounded-lg bg-black text-white font-medium"
        >
          <option value="active">Actif</option>
          <option value="to-sort">À trier</option>
          <option value="trash">Corbeille</option>
        </select>
      </div>

      {/* Category */}
      <div className="mb-3">
        <label className="block text-xs text-gray-200 mb-1 font-semibold">Catégorie</label>
        <select
          value={data.category}
          onChange={(e) => handleChange({ category: e.target.value })}
          className="w-full px-3 py-2 text-sm border-2 border-gray-500 rounded-lg bg-black text-white font-medium"
        >
          <option value="empreintes">Empreintes</option>
          <option value="atelier">Atelier</option>
          <option value="projection">Projection</option>
          <option value="uploads-preview">À trier</option>
          <option value="origins">Origins</option>
          <option value="toiles">Toiles</option>
          <option value="autres">Autres</option>
        </select>
      </div>

      {/* Categories (multi-select via checkboxes) */}
      <div className="mb-3">
        <label className="block text-xs text-gray-200 mb-1 font-semibold">Catégories (plusieurs possibles)</label>
        <div className="space-y-2">
          {(['unlimited', 'limited', 'xxl', 'monumental'] as const).map((cat) => {
            const labels = {
              unlimited: 'Tirage illimité (A4/A3/A2)',
              limited: 'Édition limitée (A3/A2/A1)',
              xxl: 'Format XXL (80x120cm)',
              monumental: 'Format monumental (120cm+)',
            };
            const isChecked = data.categories?.includes(cat) || false;
            return (
              <label key={cat} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => {
                    const currentCategories = data.categories || [];
                    const newCategories = e.target.checked
                      ? [...currentCategories, cat]
                      : currentCategories.filter((c) => c !== cat);
                    handleChange({ categories: newCategories });
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm text-white">{labels[cat]}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* For Sale */}
      <div className="mb-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.forSale}
            onChange={(e) => handleChange({ forSale: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm font-bold text-white">À la vente</span>
        </label>
      </div>

      {/* Numbered Series & Price (shown only if for sale) */}
      {data.forSale && (
        <>
          <div className="mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.isNumberedSeries}
                onChange={(e) => handleChange({ isNumberedSeries: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-bold text-white">Série numérotée</span>
            </label>
          </div>

          <div className="mb-3">
            <label className="block text-xs text-gray-200 mb-1 font-semibold">Prix (€)</label>
            <input
              type="number"
              value={data.price || ''}
              onChange={(e) => handleChange({ price: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="300"
              className="w-full px-3 py-2 text-sm border-2 border-gray-500 rounded-lg bg-black text-white font-medium"
            />
          </div>

          {data.isNumberedSeries && (
            <div className="mb-3">
              <label className="block text-xs text-gray-200 mb-1 font-semibold">Édition limitée (nombre)</label>
              <input
                type="number"
                value={data.edition?.count || ''}
                onChange={(e) => handleChange({
                  edition: {
                    type: 'limited',
                    count: e.target.value ? Number(e.target.value) : undefined
                  }
                })}
                placeholder="10"
                className="w-full px-3 py-2 text-sm border-2 border-gray-500 rounded-lg bg-black text-white font-medium"
              />
            </div>
          )}
        </>
      )}

      {/* Title */}
      <div className="mb-3">
        <label className="block text-xs text-gray-200 mb-1 font-semibold">Titre (optionnel)</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => handleChange({ title: e.target.value || undefined })}
          placeholder="Titre de l&apos;œuvre"
          className="w-full px-3 py-2 text-sm border-2 border-gray-500 rounded-lg bg-black text-white font-medium"
        />
      </div>

      {/* Year */}
      <div className="mb-3">
        <label className="block text-xs text-gray-200 mb-1 font-semibold">Année</label>
        <input
          type="number"
          value={data.year || 2024}
          onChange={(e) => handleChange({ year: e.target.value ? Number(e.target.value) : 2024 })}
          placeholder="2024"
          className="w-full px-3 py-2 text-sm border-2 border-gray-500 rounded-lg bg-black text-white font-medium"
        />
      </div>

      {hasChanges && (
        <div className="text-xs text-blue-400 font-medium">
          ⚠️ Modifications non sauvegardées
        </div>
      )}
    </div>
  );
}
