"use client";

import AdminLogin from "@/components/admin/AdminLogin";
import DuplicateDetector from "@/components/admin/DuplicateDetector";
import SimilarImagesPanel from "@/components/admin/SimilarImagesPanel";
// PHASE 1: Instagram et analyse commerciale désactivés temporairement
// import InstagramConfig from "@/components/admin/InstagramConfig";
// import CommercialDashboard from "@/components/admin/CommercialDashboard";
import PricingManager from "@/components/admin/PricingManager";
import PhotoFilters from "@/components/admin/PhotoFilters";
import PhotoFiltersPills from "@/components/admin/PhotoFiltersPills";
import BulkActions from "@/components/admin/BulkActions";
import AdminQuickActions from "@/components/admin/AdminQuickActions";
import NewsletterNotify from "@/components/admin/NewsletterNotify";
import SeriesSuggestionModal from "@/components/admin/SeriesSuggestionModal";

import { useAdminPhotos } from "@/hooks/useAdminPhotos";
import AdminStatsGrid from "./AdminStats";
import AdminActionsBar from "./AdminActionsBar";
import AdminPhotoCard from "./AdminPhotoCard";
import AdminZoomModal from "./AdminZoomModal";
import AdminSaveButton from "./AdminSaveButton";

export default function AdminPage() {
  const admin = useAdminPhotos();

  if (admin.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-2xl font-light">Chargement...</div>
      </div>
    );
  }

  if (!admin.isAuthenticated) {
    return <AdminLogin onLogin={() => admin.setIsAuthenticated(true)} />;
  }

  async function handleDeletePhoto(photo: { path: string; filename: string }) {
    if (!confirm(`Supprimer DÉFINITIVEMENT ${photo.filename} ? Cette action est IRRÉVERSIBLE.`)) return;
    try {
      const res = await fetch('/api/admin/delete-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: photo.path }),
      });
      if (res.ok) {
        admin.handleDeletePhoto(photo.path);
        alert('Photo supprimée définitivement');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch {
      alert('Erreur lors de la suppression');
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-light tracking-wide mb-3 text-foreground">Administration</h1>
          <p className="text-muted-foreground">
            {admin.photos.length} média{admin.photos.length > 1 ? 's' : ''} &bull; Gestion de la galerie
          </p>
        </div>

        <AdminQuickActions />
        <AdminStatsGrid stats={admin.stats} />

        <div className="mb-12"><DuplicateDetector /></div>

        <div className="mb-12">
          <SimilarImagesPanel
            onStatusChange={(filename, status) => {
              const photoIndex = admin.photos.findIndex(p => p.filename === filename);
              if (photoIndex !== -1) {
                admin.updatePhoto(photoIndex, { status });
              }
            }}
          />
        </div>

        {/* PHASE 1: Instagram et analyse commerciale désactivés temporairement */}
        {/* <div className="mb-12"><InstagramConfig /></div> */}
        {/* <div className="mb-12"><CommercialDashboard photos={admin.photos} /></div> */}
        <div className="mb-12"><PricingManager /></div>
        <div className="mb-12"><NewsletterNotify /></div>

        {/* Layout: sidebar filters + main content */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 mb-12">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <PhotoFilters photos={admin.photos} filters={admin.filters} onFiltersChange={admin.setFilters} />
          </div>

          <div className="space-y-6">
            <AdminActionsBar
              filteredPhotos={admin.filteredPhotos}
              selectedCount={admin.selectedPhotos.length}
              totalFiltered={admin.filteredPhotos.length}
              onRefresh={admin.loadPhotos}
              onToggleSelectAll={admin.toggleSelectAll}
              onSuggestionsReady={(s) => admin.setSeriesSuggestions(s)}
              onUpload={(files) => admin.handleUpload(files)}
            />

            <PhotoFiltersPills photos={admin.photos} filters={admin.filters} onFiltersChange={admin.setFilters} />

            {/* Photo grid */}
            <div key={admin.refreshKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {admin.filteredPhotos.map((photo) => {
                const globalIndex = admin.photos.findIndex(p => p.path === photo.path);
                return (
                  <AdminPhotoCard
                    key={photo.path}
                    photo={photo}
                    globalIndex={globalIndex}
                    refreshKey={admin.refreshKey}
                    isSelected={admin.selectedPhotos.includes(photo.path)}
                    updatePhoto={admin.updatePhoto}
                    onStatusChange={admin.handleStatusChange}
                    onToggleSelection={admin.togglePhotoSelection}
                    onZoom={(path) => admin.setZoomedImage(path)}
                    onDelete={handleDeletePhoto}
                    collections={admin.collections}
                  />
                );
              })}
            </div>

            {admin.filteredPhotos.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">Aucun media trouve</div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {admin.zoomedImage && (
        <AdminZoomModal imagePath={admin.zoomedImage} onClose={() => admin.setZoomedImage(null)} />
      )}

      {admin.analyzingSeries && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4" />
            <h2 className="text-2xl font-light mb-2 text-foreground">Analyse en cours...</h2>
            <p className="text-muted-foreground">
              L&apos;IA analyse vos photos pour suggérer des regroupements en séries.
            </p>
          </div>
        </div>
      )}

      {admin.seriesSuggestions && (
        <SeriesSuggestionModal
          suggestions={admin.seriesSuggestions}
          onApply={admin.handleApplySeries}
          onClose={() => admin.setSeriesSuggestions(null)}
        />
      )}

      <BulkActions
        selectedPhotos={admin.selectedPhotos}
        allPhotos={admin.photos}
        onBulkUpdate={admin.handleBulkUpdate}
        onBulkDelete={admin.handleBulkDelete}
        onClearSelection={() => admin.toggleSelectAll()}
      />

      <AdminSaveButton hasChanges={admin.hasChanges} saving={admin.saving} onSave={admin.savePhotos} />
    </div>
  );
}

// Lalou
