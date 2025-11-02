"use client";
import { useEffect, useState } from "react";
import PhotoCard from "@/components/admin/PhotoCard";
import AdminAuth from "@/components/admin/AdminAuth";
import type { PhotoMetadata } from "@/lib/admin/photo-manager";
import Navigation from "@/components/navigation/Navigation";

export default function AdminPage() {
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterVisibility, setFilterVisibility] = useState<string>("all");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, []);

  async function loadPhotos() {
    try {
      const response = await fetch('/api/admin/photos');
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function savePhotos() {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photos),
      });

      if (response.ok) {
        setHasChanges(false);
        alert('✅ Photos sauvegardées avec succès !');
      } else {
        alert('❌ Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving photos:', error);
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  function updatePhoto(index: number, updatedPhoto: PhotoMetadata) {
    const newPhotos = [...photos];
    newPhotos[index] = updatedPhoto;
    setPhotos(newPhotos);
    setHasChanges(true);
  }

  // Filter photos
  const filteredPhotos = photos.filter(photo => {
    if (filterCategory !== "all" && photo.category !== filterCategory) return false;
    if (filterVisibility === "visible" && !photo.visible) return false;
    if (filterVisibility === "hidden" && photo.visible) return false;
    return true;
  });

  // Group by category
  const photosByCategory = filteredPhotos.reduce((acc, photo) => {
    if (!acc[photo.category]) acc[photo.category] = [];
    acc[photo.category].push(photo);
    return acc;
  }, {} as Record<string, PhotoMetadata[]>);

  const categories = Object.keys(photosByCategory).sort();

  // Stats
  const stats = {
    total: photos.length,
    visible: photos.filter(p => p.visible).length,
    hidden: photos.filter(p => !p.visible).length,
    forSale: photos.filter(p => p.forSale).length,
  };

  if (loading) {
    return (
      <AdminAuth>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl mb-2">⏳</div>
            <div>Chargement des photos...</div>
          </div>
        </div>
      </AdminAuth>
    );
  }

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Administration des Photos</h1>
          <p className="text-gray-600">
            Gérez toutes vos photos : visibilité, catégories, prix, et éditions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600">Total photos</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-700">{stats.visible}</div>
            <div className="text-sm text-gray-600">Visibles</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-700">{stats.hidden}</div>
            <div className="text-sm text-gray-600">Masquées</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">{stats.forSale}</div>
            <div className="text-sm text-gray-600">À la vente</div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white p-4 rounded-lg border mb-6 sticky top-16 z-30 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div>
              <label className="text-sm text-gray-600 mr-2">Catégorie:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border rounded"
              >
                <option value="all">Toutes ({photos.length})</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat} ({photosByCategory[cat].length})
                  </option>
                ))}
              </select>
            </div>

            {/* Visibility Filter */}
            <div>
              <label className="text-sm text-gray-600 mr-2">Affichage:</label>
              <select
                value={filterVisibility}
                onChange={(e) => setFilterVisibility(e.target.value)}
                className="px-3 py-2 border rounded"
              >
                <option value="all">Toutes</option>
                <option value="visible">Visibles uniquement</option>
                <option value="hidden">Masquées uniquement</option>
              </select>
            </div>

            <div className="flex-1" />

            {/* Save Button */}
            <button
              onClick={savePhotos}
              disabled={!hasChanges || saving}
              className={`px-6 py-2 rounded font-medium ${
                hasChanges
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {saving ? '⏳ Sauvegarde...' : hasChanges ? '💾 Sauvegarder les modifications' : '✅ Tout est sauvegardé'}
            </button>
          </div>
        </div>

        {/* Photos by Category */}
        {categories.map(category => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 capitalize">
              {category} ({photosByCategory[category].length})
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {photosByCategory[category].map((photo, index) => {
                const globalIndex = photos.findIndex(p => p.path === photo.path);
                return (
                  <PhotoCard
                    key={photo.path}
                    photo={photo}
                    onUpdate={(updatedPhoto) => updatePhoto(globalIndex, updatedPhoto)}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {filteredPhotos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucune photo trouvée avec ces filtres
          </div>
        )}
      </div>

      {/* Floating Save Button */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={savePhotos}
            disabled={saving}
            className="bg-blue-600 text-white px-8 py-4 rounded-full shadow-lg hover:bg-blue-700 font-bold text-lg flex items-center gap-2"
          >
            {saving ? '⏳ Sauvegarde...' : '💾 Sauvegarder tout'}
          </button>
        </div>
      )}
    </div>
    </AdminAuth>
  );
}
