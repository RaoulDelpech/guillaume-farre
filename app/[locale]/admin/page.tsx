"use client";
import { useEffect, useState } from "react";
import type { PhotoMetadata } from "@/lib/admin/photo-manager";
import AIAnalysisPanel from "@/components/admin/AIAnalysisPanel";
import DuplicateDetector from "@/components/admin/DuplicateDetector";
import InstagramSuggestionPanel from "@/components/admin/InstagramSuggestionPanel";
import InstagramConfig from "@/components/admin/InstagramConfig";
import CommercialDashboard from "@/components/admin/CommercialDashboard";
import SeriesSuggestionModal from "@/components/admin/SeriesSuggestionModal";
import AdminLogin from "@/components/admin/AdminLogin";
import DragDropUpload from "@/components/admin/DragDropUpload";
import PhotoDescriptionAI from "@/components/admin/PhotoDescriptionAI";
import PricingManager from "@/components/admin/PricingManager";
import SeriesSuggestButton from "@/components/admin/SeriesSuggestButton";
import SimilarImagesPanel from "@/components/admin/SimilarImagesPanel";
import PhotoFilters from "@/components/admin/PhotoFilters";
import PhotoEditor, { EditedPhotoData } from "@/components/admin/PhotoEditor";
import type { SeriesSuggestion } from "@/app/api/admin/suggest-series/route";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState<string>("");
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState("all");
  const [filters, setFilters] = useState({
    status: 'active' as string,
    mainCategory: 'all' as string,
    subCategories: [] as string[],
    series: 'all' as string,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [seriesSuggestions, setSeriesSuggestions] = useState<SeriesSuggestion[] | null>(null);
  const [analyzingSeries, setAnalyzingSeries] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingPhoto, setEditingPhoto] = useState<PhotoMetadata | null>(null);

  // Vérifier si déjà authentifié au chargement
  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (token) {
      setIsAuthenticated(true);
      setAdminToken(token);
    }
  }, []);

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

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement> | File[]) {
    let files: FileList | File[] | null;

    if (Array.isArray(e)) {
      // Called from DragDropUpload with File[]
      files = e;
    } else {
      // Called from input onChange with event
      files = e.target.files;
    }

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
      // Force le re-render de l'UI
      setRefreshKey(prev => prev + 1);

      // Switcher automatiquement vers "À trier" pour voir les photos uploadées
      setFilterVisibility("to-sort");

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

  // IA AUTO: Génération automatique de description quand statut → active
  async function handleStatusChange(index: number, newStatus: string) {
    const photo = photos[index];
    const oldStatus = photo.status || 'active';

    // Update status first
    updatePhoto(index, { status: newStatus as 'active' | 'trash' | 'to-sort' });

    // Si changement vers "active" ET pas de description → générer automatiquement
    if (newStatus === 'active' && oldStatus !== 'active' && !photo.description?.trim()) {
      console.log('🤖 IA Auto: Génération description pour', photo.filename);

      try {
        const response = await fetch('/api/admin/generate-description', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            photoPath: photo.path,
            photoFilename: photo.filename,
            category: photo.category || 'autres',
            seriesName: photo.seriesName
          })
        });

        const data = await response.json();

        if (response.ok && data.description) {
          // Mettre à jour avec la description générée
          updatePhoto(index, {
            description: data.description,
            aiGenerated: true
          });
          console.log('✅ Description IA générée:', data.description.substring(0, 50) + '...');
        }
      } catch (err) {
        console.error('❌ Erreur IA Auto:', err);
        // On ne bloque pas le changement de statut en cas d'erreur
      }
    }
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

  async function handleSaveEditedPhoto(editedData: EditedPhotoData) {
    try {
      const response = await fetch('/api/admin/edit-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Recharger les photos pour afficher la nouvelle photo éditée
        await loadPhotos();
        setRefreshKey(prev => prev + 1);
        alert(`Photo éditée sauvegardée: ${data.editedFile}`);
      } else {
        throw new Error(data.error || 'Erreur lors de l\'édition');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error; // Re-throw pour que PhotoEditor puisse gérer l'erreur
    }
  }

  const filteredPhotos = photos.filter(p => {
    // Filtre statut
    const status = p.status || 'active';
    if (filters.status !== 'all') {
      if (status !== filters.status) return false;
    }

    // Filtre catégorie principale
    if (filters.mainCategory !== 'all') {
      if (p.category !== filters.mainCategory) return false;
    }

    // Filtre sous-catégories (multi-sélection)
    if (filters.subCategories.length > 0) {
      const hasAnySubCategory = filters.subCategories.some(subCat =>
        p.categories?.includes(subCat as 'unlimited' | 'limited' | 'xxl' | 'monumental')
      );
      if (!hasAnySubCategory) return false;
    }

    // Filtre série
    if (filters.series !== 'all') {
      if (p.seriesName !== filters.series) return false;
    }

    return true;
  });

  const categories = [...new Set(photos.map(p => p.category))].sort();
  // Statistiques enrichies - DONNÉES RÉELLES
  const stats = {
    total: photos.length,
    visible: photos.filter(p => p.visible).length,
    hidden: photos.filter(p => !p.visible).length,
    forSale: photos.filter(p => p.forSale).length,

    // Stats séries limitées
    limitedEditions: photos.filter(p => p.categories?.includes('limited')).length,
    soldOut: photos.filter(p => p.limitedEdition?.available === 0).length,

    // Valeur totale inventaire (estimation si pas de prix précis)
    totalValue: photos.reduce((sum, p) => {
      if (!p.forSale) return sum;
      // Valeur moyenne estimée pour calcul approximatif
      const avgPrice = p.price || 500;
      return sum + avgPrice;
    }, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-2xl font-light">Chargement...</div>
      </div>
    );
  }

  // Afficher page de login si pas authentifié
  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
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

        {/* Stats enrichies - DONNÉES RÉELLES */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-16">
          <div className="bg-card border border-border rounded-lg p-6 md:p-8">
            <div className="text-3xl md:text-4xl font-light text-foreground mb-2">{stats.total}</div>
            <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">Total</div>
          </div>
          <div className="bg-card border border-primary/30 rounded-lg p-6 md:p-8">
            <div className="text-3xl md:text-4xl font-light text-primary mb-2">{stats.visible}</div>
            <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">Visibles</div>
          </div>
          <div className="bg-card border border-green-500/30 rounded-lg p-6 md:p-8">
            <div className="text-3xl md:text-4xl font-light text-green-500 mb-2">{stats.forSale}</div>
            <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">À vendre</div>
          </div>
          <div className="bg-card border border-purple-500/30 rounded-lg p-6 md:p-8">
            <div className="text-3xl md:text-4xl font-light text-purple-500 mb-2">{stats.limitedEditions}</div>
            <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">Éditions limitées</div>
          </div>
          <div className="bg-card border border-orange-500/30 rounded-lg p-6 md:p-8">
            <div className="text-3xl md:text-4xl font-light text-orange-500 mb-2">{stats.soldOut}</div>
            <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">Épuisées</div>
          </div>
          <div className="bg-card border border-green-500/30 rounded-lg p-6 md:p-8">
            <div className="text-2xl md:text-3xl font-light text-green-500 mb-2">
              {stats.totalValue.toLocaleString('fr-FR')}€
            </div>
            <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">Valeur totale</div>
          </div>
        </div>

        {/* Duplicate Detector */}
        <div className="mb-12">
          <DuplicateDetector />
        </div>

        {/* Similar Images Panel */}
        <div className="mb-12">
          <SimilarImagesPanel
            token={adminToken}
            onStatusChange={(filename, status) => {
              const photoIndex = photos.findIndex(p => p.filename === filename);
              if (photoIndex !== -1) {
                const updatedPhotos = [...photos];
                updatedPhotos[photoIndex] = {
                  ...updatedPhotos[photoIndex],
                  status
                };
                setPhotos(updatedPhotos);
                setHasChanges(true);
              }
            }}
          />
        </div>

        {/* Instagram Configuration */}
        <div className="mb-12">
          <InstagramConfig />
        </div>

        {/* Commercial Performance Dashboard */}
        <div className="mb-12">
          <CommercialDashboard photos={photos} />
        </div>

        {/* Pricing Management */}
        <div className="mb-12">
          <PricingManager />
        </div>

        {/* Layout avec sidebar filtres + contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 mb-12">
          {/* Sidebar Filtres */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <PhotoFilters
              photos={photos}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Contenu principal */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex flex-wrap gap-4 items-center">

            <button
              onClick={loadPhotos}
              className="px-6 py-3 bg-card hover:bg-muted border border-border rounded-md text-foreground font-medium transition-colors"
            >
              Actualiser
            </button>

            <SeriesSuggestButton
              photos={filteredPhotos.map((p) => ({ path: p.path, filename: p.filename }))}
              onSuggestionsReady={(suggestions) => setSeriesSuggestions(suggestions)}
            />

            <div className="col-span-full">
              <DragDropUpload
                onFilesSelected={(files) => {
                  handleUpload(files);
                }}
                accept="image/*,video/*"
                multiple={true}
              />
            </div>

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
        <div key={refreshKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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

                  {/* Statut photo */}
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                      Statut
                    </label>
                    <select
                      value={photo.status || 'active'}
                      onChange={(e) => handleStatusChange(globalIndex, e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="active">✅ Active</option>
                      <option value="to-sort">⏳ À trier</option>
                      <option value="trash">🗑️ Corbeille</option>
                    </select>
                  </div>

                  {/* Catégorie ancienne (legacy) */}
                  <select
                    value={photo.category}
                    onChange={(e) => updatePhoto(globalIndex, { category: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="empreintes">Empreintes</option>
                    <option value="atelier">Atelier</option>
                    <option value="projection">Projection</option>
                    <option value="a-trier">À trier</option>
                    <option value="uploads-preview">Uploads Preview</option>
                    <option value="uploads">Uploads</option>
                    <option value="origins">Origins</option>
                  </select>

                  {/* Catégories multiples (nouveau schema) */}
                  <div className="space-y-2">
                    <label className="block text-xs text-muted-foreground uppercase tracking-wide">
                      Catégories
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['unlimited', 'limited', 'xxl', 'monumental'].map((cat) => (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={photo.categories?.includes(cat as any) || false}
                            onChange={(e) => {
                              const categories = photo.categories || [];
                              const newCategories = e.target.checked
                                ? [...categories, cat as any]
                                : categories.filter(c => c !== cat);
                              updatePhoto(globalIndex, { categories: newCategories });
                            }}
                            className="w-4 h-4 rounded border-border"
                          />
                          <span className="text-xs group-hover:text-primary transition-colors capitalize">
                            {cat}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Multi-categorisation: Tags */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                        Tags (séparés par virgules)
                      </label>
                      <input
                        type="text"
                        value={(photo.tags || []).join(', ')}
                        onChange={(e) => {
                          const tags = e.target.value
                            .split(',')
                            .map(t => t.trim())
                            .filter(t => t.length > 0);
                          updatePhoto(globalIndex, { tags });
                        }}
                        placeholder="Ex: rouge, Ferrari F40, noir et blanc"
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

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
                    category={photo.category || 'autres'}
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

                  {/* Photo Description AI */}
                  <PhotoDescriptionAI
                    photoPath={photo.path}
                    photoFilename={photo.filename}
                    category={photo.category || 'autres'}
                    seriesName={photo.seriesName}
                    currentDescription={photo.description}
                    aiGenerated={photo.aiGenerated}
                    onApplyDescription={(description) => {
                      updatePhoto(globalIndex, {
                        description,
                        aiGenerated: true
                      });
                    }}
                  />

                  {/* Instagram Optimizer */}
                  <InstagramSuggestionPanel
                    photoPath={photo.path}
                    photoTitle={photo.filename}
                    category={photo.category || 'autres'}
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
        </div>
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
