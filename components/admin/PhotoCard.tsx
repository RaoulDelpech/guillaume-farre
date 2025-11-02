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
    <div className={`border rounded-lg p-4 transition-all ${!data.visible ? 'opacity-60 bg-red-900/20 border-red-700' : 'bg-gray-800 border-gray-700'} ${hasChanges ? 'border-blue-400 border-2 shadow-lg shadow-blue-500/20' : ''}`}>
      {/* Image */}
      <div className="relative aspect-square mb-3 bg-gray-900 rounded overflow-hidden">
        <img
          src={data.path}
          alt={data.filename}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Filename */}
      <div className="text-xs text-gray-400 mb-2 font-mono truncate" title={data.filename}>
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
          <span className="text-sm font-medium text-gray-200">
            {data.visible ? '✅ Visible sur le site' : '❌ Masquée'}
          </span>
        </label>
      </div>

      {/* Category */}
      <div className="mb-3">
        <label className="block text-xs text-gray-400 mb-1">Catégorie</label>
        <select
          value={data.category}
          onChange={(e) => handleChange({ category: e.target.value })}
          className="w-full px-2 py-1 text-sm border border-gray-600 rounded bg-gray-700 text-white"
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

      {/* For Sale */}
      <div className="mb-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.forSale}
            onChange={(e) => handleChange({ forSale: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-200">À la vente</span>
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
              <span className="text-sm text-gray-200">Série numérotée</span>
            </label>
          </div>

          <div className="mb-3">
            <label className="block text-xs text-gray-400 mb-1">Prix (€)</label>
            <input
              type="number"
              value={data.price || ''}
              onChange={(e) => handleChange({ price: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="300"
              className="w-full px-2 py-1 text-sm border border-gray-600 rounded bg-gray-700 text-white"
            />
          </div>

          {data.isNumberedSeries && (
            <div className="mb-3">
              <label className="block text-xs text-gray-400 mb-1">Édition limitée (nombre)</label>
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
                className="w-full px-2 py-1 text-sm border border-gray-600 rounded bg-gray-700 text-white"
              />
            </div>
          )}
        </>
      )}

      {/* Title */}
      <div className="mb-3">
        <label className="block text-xs text-gray-400 mb-1">Titre (optionnel)</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => handleChange({ title: e.target.value || undefined })}
          placeholder="Titre de l&apos;œuvre"
          className="w-full px-2 py-1 text-sm border border-gray-600 rounded bg-gray-700 text-white"
        />
      </div>

      {/* Year */}
      <div className="mb-3">
        <label className="block text-xs text-gray-400 mb-1">Année</label>
        <input
          type="number"
          value={data.year || 2024}
          onChange={(e) => handleChange({ year: e.target.value ? Number(e.target.value) : 2024 })}
          placeholder="2024"
          className="w-full px-2 py-1 text-sm border border-gray-600 rounded bg-gray-700 text-white"
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
