"use client";

import { useEffect, useState } from "react";
import type { PhotoMetadata } from "@/lib/admin/photo-manager";
import { AutoSaveProvider } from "@/contexts/AutoSaveContext";
import UnifiedAdminLayout from "@/components/admin/UnifiedAdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import PhotoManager from "@/components/admin/PhotoManager";
import AIAssistant from "@/components/admin/AIAssistant";
import PhotoPreview from "@/components/admin/PhotoPreview";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import BatchOperations from "@/components/admin/BatchOperations";
import AdminLogin from "@/components/admin/AdminLogin";
import DragDropUpload from "@/components/admin/DragDropUpload";
import PhotoDescriptionAI from "@/components/admin/PhotoDescriptionAI";
import PricingManager from "@/components/admin/PricingManager";
import CommercialDashboard from "@/components/admin/CommercialDashboard";
import InstagramConfig from "@/components/admin/InstagramConfig";
import DuplicateDetector from "@/components/admin/DuplicateDetector";
import SimilarImagesPanel from "@/components/admin/SimilarImagesPanel";
import SeriesSuggestionModal from "@/components/admin/SeriesSuggestionModal";
import type { SeriesSuggestion } from "@/app/api/admin/suggest-series/route";
import { toast } from "sonner";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState<string>("");
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "photos" | "ai" | "analytics">("dashboard");
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [previewPhoto, setPreviewPhoto] = useState<PhotoMetadata | null>(null);
  const [seriesSuggestions, setSeriesSuggestions] = useState<SeriesSuggestion[] | null>(null);
  const [analyzingSeries, setAnalyzingSeries] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Vérifier si déjà authentifié au chargement
  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (token) {
      setIsAuthenticated(true);
      setAdminToken(token);
    }
  }, []);

  // Charger les photos
  useEffect(() => {
    if (isAuthenticated) {
      loadPhotos();
    }
  }, [isAuthenticated]);

  async function loadPhotos() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/photos');
      const data = await res.json();
      setPhotos(data);
      toast.success(`${data.length} photos chargées`);
    } catch (error) {
      console.error('Erreur chargement photos:', error);
      toast.error('Erreur lors du chargement des photos');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(files: File[]) {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));

    try {
      toast.info(`Upload de ${files.length} fichier(s)...`);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        toast.error('Erreur lors de l\'upload');
        return;
      }

      // Recharger les photos
      await loadPhotos();
      setRefreshKey(prev => prev + 1);

      toast.success(`${files.length} fichier(s) uploadé(s) avec succès`);

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
          }
        } catch (error) {
          console.error('Erreur lors de l\'analyse des séries:', error);
        } finally {
          setAnalyzingSeries(false);
        }
      }
    } catch (error) {
      toast.error('Erreur lors de l\'upload');
    }
  }

  async function savePhotos() {
    try {
      toast.info('Sauvegarde en cours...');
      await fetch('/api/admin/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photos),
      });
      toast.success('Modifications sauvegardées');
      return Promise.resolve();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
      throw error;
    }
  }

  function updatePhoto(index: number, updates: Partial<PhotoMetadata>) {
    const newPhotos = [...photos];
    newPhotos[index] = { ...newPhotos[index], ...updates };
    setPhotos(newPhotos);
  }

  async function handleBatchOperation(operationId: string, items: string[]) {
    // Simuler l'opération batch
    toast.info(`Opération ${operationId} sur ${items.length} photos...`);

    // Ici, implémenter les vraies opérations selon operationId
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success(`Opération ${operationId} terminée`);
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
    setSeriesSuggestions(null);
    toast.success(`Série "${seriesName}" appliquée à ${photoPaths.length} photo(s)`);
  }

  // Si pas authentifié, afficher login
  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  // Si chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-foreground text-2xl font-light">Chargement de l'interface admin...</div>
        </div>
      </div>
    );
  }

  return (
    <AutoSaveProvider onSave={savePhotos}>
      <UnifiedAdminLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stats={{
          totalPhotos: photos.length,
          publishedPhotos: photos.filter(p => p.visible).length,
          salesThisMonth: 12,
          monthlyRevenue: 8400,
          limitedEditions: photos.filter(p => p.categories?.includes('limited')).length
        }}
      >
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <AdminDashboard />

            {/* Upload Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-light mb-4">📸 Upload de photos</h2>
              <DragDropUpload
                onFilesSelected={handleUpload}
                accept="image/*,video/*"
                multiple={true}
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CommercialDashboard photos={photos} />
              <DuplicateDetector />
              <InstagramConfig />
            </div>

            {/* Pricing Manager */}
            <PricingManager />
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === "photos" && (
          <>
            <PhotoManager
              photos={photos}
              selectedPhotos={selectedPhotos}
              onPhotosChange={setPhotos}
              onSelectionChange={setSelectedPhotos}
              onPhotoClick={(photo) => setPreviewPhoto(photo)}
              onUpload={handleUpload}
            />

            {/* Batch Operations */}
            <BatchOperations
              selectedItems={selectedPhotos}
              onOperation={handleBatchOperation}
              totalItems={photos.length}
            />

            {/* Preview Modal */}
            {previewPhoto && (
              <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
                  <PhotoPreview
                    photo={previewPhoto}
                    onClose={() => setPreviewPhoto(null)}
                    onSave={(updates) => {
                      const index = photos.findIndex(p => p.path === previewPhoto.path);
                      if (index !== -1) {
                        updatePhoto(index, updates);
                      }
                      setPreviewPhoto(null);
                      toast.success('Photo mise à jour');
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* AI Assistant Tab */}
        {activeTab === "ai" && (
          <div className="space-y-8">
            <AIAssistant
              photos={photos}
              onApplySuggestions={(photoId, suggestions) => {
                const index = photos.findIndex(p => p.filename === photoId);
                if (index !== -1) {
                  updatePhoto(index, suggestions);
                  toast.success('Suggestions appliquées');
                }
              }}
            />

            {/* Similar Images Panel */}
            <SimilarImagesPanel
              token={adminToken}
              onStatusChange={(filename, status) => {
                const photoIndex = photos.findIndex(p => p.filename === filename);
                if (photoIndex !== -1) {
                  updatePhoto(photoIndex, { status });
                  toast.success(`Statut mis à jour: ${status}`);
                }
              }}
            />

            {/* Photo Descriptions AI */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.slice(0, 6).map((photo, index) => (
                <div key={photo.path} className="bg-card border border-border rounded-lg p-4">
                  <img
                    src={photo.path}
                    alt={photo.filename}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <PhotoDescriptionAI
                    photoPath={photo.path}
                    photoFilename={photo.filename}
                    category={photo.category || 'autres'}
                    seriesName={photo.seriesName}
                    currentDescription={photo.description}
                    aiGenerated={photo.aiGenerated}
                    onApplyDescription={(description) => {
                      updatePhoto(index, {
                        description,
                        aiGenerated: true
                      });
                      toast.success('Description générée');
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <AnalyticsDashboard />
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
      </UnifiedAdminLayout>
    </AutoSaveProvider>
  );
}

// Lalou