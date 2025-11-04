"use client";
import { useEffect, useState } from "react";
import type { PhotoMetadata } from "@/lib/admin/photo-manager";
import AIAnalysisPanel from "@/components/admin/AIAnalysisPanel";
import DuplicateDetector from "@/components/admin/DuplicateDetector";
import InstagramSuggestionPanel from "@/components/admin/InstagramSuggestionPanel";
import InstagramConfig from "@/components/admin/InstagramConfig";
import CommercialDashboard from "@/components/admin/CommercialDashboard";
import SeriesSuggestionModal from "@/components/admin/SeriesSuggestionModal";
import type { SeriesSuggestion } from "@/app/api/admin/suggest-series/route";

export default function AdminPage() {
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState("all");
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [seriesSuggestions, setSeriesSuggestions] = useState<SeriesSuggestion[] | null>(null);
  const [analyzingSeries, setAnalyzingSeries] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, []);

  async function loadPhotos() {
    try {
      const res = await fetch('/api/admin/photos');
      const data = await res.json();
      setPhotos(data);
    } catch (error) {
      console.error('Erreur chargement photos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));

    try {
      // Upload les fichiers
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        alert('Erreur lors de l\'upload');
        return;
      }

      // Recharger les photos
      await loadPhotos();

      // Si 2+ photos uploadées, analyser pour suggérer des séries
      if (uploadData.files && uploadData.files.length >= 2) {
        setAnalyzingSeries(true);

        try {
          const photoPaths = uploadData.files.map((f: any) => f.path);
          const suggestRes = await fetch('/api/admin/suggest-series', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ photos: photoPaths }),
          });

          const suggestData = await suggestRes.json();

          if (suggestData.suggestions && suggestData.suggestions.length > 0) {
            setSeriesSuggestions(suggestData.suggestions);
          } else {
            alert('Fichiers uploadés avec succès');
          }
        } catch (error) {
          console.error('Erreur lors de l\'analyse des séries:', error);
          alert('Fichiers uploadés avec succès (analyse IA non disponible)');
        } finally {
          setAnalyzingSeries(false);
        }
      } else {
        alert('Fichier uploadé avec succès');
      }
    } catch (error) {
      alert('Erreur lors de l\'upload');
    }
  }

  async function savePhotos() {
    setSaving(true);
    try {
      await fetch('/api/admin/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photos),
      });
      setHasChanges(false);
      alert('Modifications sauvegardées');
    } catch {
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  function updatePhoto(index: number, updates: Partial<PhotoMetadata>) {
    const newPhotos = [...photos];
    newPhotos[index] = { ...newPhotos[index], ...updates };
    setPhotos(newPhotos);
    setHasChanges(true);
  }

  function handleApplySeries(seriesName: string, photoPaths: string[]) {
    const newPhotos = [...photos];
    photoPaths.forEach((photoPath) => {
      const index = newPhotos.findIndex((p) => p.path === photoPath);
      if (index !== -1) {
        newPhotos[index] = { ...newPhotos[index], seriesName };
      }
    });
    setPhotos(newPhotos);
    setHasChanges(true);
    setSeriesSuggestions(null);
    alert(`Série "${seriesName}" appliquée à ${photoPaths.length} photo(s)`);
  }

  const filteredPhotos = photos.filter(p => {
    if (filterCategory !== "all" && p.category !== filterCategory) return false;
    if (filterVisibility === "visible" && !p.visible) return false;
    if (filterVisibility === "hidden" && p.visible) return false;
    return true;
  });

  const categories = [...new Set(photos.map(p => p.category))].sort();
  const stats = {
    total: photos.length,
    visible: photos.filter(p => p.visible).length,
    hidden: photos.filter(p => !p.visible).length,
    forSale: photos.filter(p => p.forSale).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-2xl font-light">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-light tracking-wide mb-3 text-foreground">
            Administration
          </h1>
          <p className="text-muted-foreground">
            {photos.length} média{photos.length > 1 ? 's' : ''} • Gestion de la galerie
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="text-4xl font-light text-foreground mb-2">{stats.total}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide">Total</div>
          </div>
          <div className="bg-card border border-primary/30 rounded-lg p-8">
            <div className="text-4xl font-light text-primary mb-2">{stats.visible}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide">Visibles</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="text-4xl font-light text-muted-foreground mb-2">{stats.hidden}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide">Masquées</div>
          </div>
          <div className="bg-card border border-primary/30 rounded-lg p-8">
            <div className="text-4xl font-light text-primary mb-2">{stats.forSale}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide">À vendre</div>
          </div>
        </div>

        {/* Duplicate Detector */}
        <div className="mb-12">
          <DuplicateDetector />
        </div>

        {/* Instagram Configuration */}
        <div className="mb-12">
          <InstagramConfig />
        </div>

        {/* Commercial Performance Dashboard */}
        <div className="mb-12">
          <CommercialDashboard photos={photos} />
        </div>

        {/* Actions */}
        <div className="bg-card border border-border rounded-lg p-8 mb-12">
          <div className="flex flex-wrap gap-6 items-center">
            <div>
              <label className="block text-sm text-muted-foreground mb-2 uppercase tracking-wide">Catégorie</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:border-primary transition-colors"
              >
                <option value="all">Toutes ({photos.length})</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2 uppercase tracking-wide">Visibilité</label>
              <select
                value={filterVisibility}
                onChange={(e) => setFilterVisibility(e.target.value)}
                className="px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:border-primary transition-colors"
              >
                <option value="all">Toutes</option>
                <option value="visible">Visibles</option>
                <option value="hidden">Masquées</option>
              </select>
            </div>

            <div className="flex-1"></div>

            <button
              onClick={loadPhotos}
              className="px-6 py-3 bg-card hover:bg-muted border border-border rounded-md text-foreground font-medium transition-colors"
            >
              Actualiser
            </button>

            <label className="px-6 py-3 bg-primary hover:bg-accent text-primary-foreground rounded-md cursor-pointer font-medium transition-colors">
              Upload Photos/Vidéos
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleUpload}
                className="hidden"
              />
            </label>

            {hasChanges && (
              <button
                onClick={savePhotos}
                disabled={saving}
                className="px-6 py-3 bg-primary hover:bg-accent text-primary-foreground rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            )}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPhotos.map((photo, index) => {
            const globalIndex = photos.findIndex(p => p.path === photo.path);
            return (
              <div
                key={photo.path}
                className={`bg-card border rounded-lg overflow-hidden transition-all ${
                  photo.visible ? 'border-border' : 'border-muted-foreground/30'
                }`}
              >
                <div
                  className="relative aspect-square bg-muted cursor-zoom-in group"
                  onClick={() => setZoomedImage(photo.path)}
                >
                  <img
                    src={photo.path}
                    alt={photo.filename}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                      🔍 Cliquer pour agrandir
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="text-xs text-muted-foreground break-all font-mono">
                    {photo.filename}
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={photo.visible}
                      onChange={(e) => updatePhoto(globalIndex, { visible: e.target.checked })}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm group-hover:text-primary transition-colors">
                      {photo.visible ? 'Visible' : 'Masquée'}
                    </span>
                  </label>

                  <select
                    value={photo.category}
                    onChange={(e) => updatePhoto(globalIndex, { category: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="empreintes">Empreintes</option>
                    <option value="atelier">Atelier</option>
                    <option value="projection">Projection</option>
                    <option value="uploads-preview">À trier</option>
                    <option value="uploads">Uploads</option>
                    <option value="origins">Origins</option>
                  </select>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={photo.forSale}
                      onChange={(e) => updatePhoto(globalIndex, { forSale: e.target.checked })}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm group-hover:text-primary transition-colors">
                      À vendre
                    </span>
                  </label>

                  {/* AI Analysis Button */}
                  <AIAnalysisPanel
                    photoFilename={photo.filename}
                    category={photo.category}
                    currentPrice={photo.price}
                    onApplySuggestions={(suggestions) => {
                      updatePhoto(globalIndex, {
                        price: suggestions.price,
                        forSale: true,
                        edition: {
                          type: suggestions.isLimitedEdition ? 'limited' : 'open',
                          count: suggestions.editionNumber
                        }
                      });
                    }}
                  />

                  {/* Instagram Optimizer */}
                  <InstagramSuggestionPanel
                    photoPath={photo.path}
                    photoTitle={photo.filename}
                    category={photo.category}
                    seriesName={photo.seriesName}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            Aucun média trouvé
          </div>
        )}
      </div>

      {/* Modal de zoom */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-colors"
          >
            ×
          </button>
          <img
            src={zoomedImage}
            alt="Zoom"
            className="max-w-full max-h-full object-contain cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Modal d'analyse de séries */}
      {analyzingSeries && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-2xl font-light mb-2 text-foreground">
              Analyse en cours...
            </h2>
            <p className="text-muted-foreground">
              L'IA analyse vos photos pour suggérer des regroupements en séries.
            </p>
          </div>
        </div>
      )}

      {/* Modal de suggestions de séries */}
      {seriesSuggestions && (
        <SeriesSuggestionModal
          suggestions={seriesSuggestions}
          onApply={handleApplySeries}
          onClose={() => setSeriesSuggestions(null)}
        />
      )}
    </div>
  );
}
