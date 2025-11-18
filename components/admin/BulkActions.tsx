"use client";
import { useState } from 'react';
import type { PhotoMetadata } from '@/lib/admin/photo-manager';

interface BulkActionsProps {
  selectedPhotos: string[]; // paths des photos sélectionnées
  allPhotos: PhotoMetadata[];
  onBulkUpdate: (paths: string[], updates: Partial<PhotoMetadata>) => void;
  onBulkDelete: (paths: string[]) => void;
  onClearSelection: () => void;
}

export default function BulkActions({
  selectedPhotos,
  allPhotos,
  onBulkUpdate,
  onBulkDelete,
  onClearSelection,
}: BulkActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (selectedPhotos.length === 0) return null;

  const handleAction = (action: string) => {
    const confirmMessage = `Appliquer "${action}" à ${selectedPhotos.length} photo(s) ?`;

    switch (action) {
      case 'set-visible':
        if (confirm(confirmMessage)) {
          onBulkUpdate(selectedPhotos, { visible: true });
          onClearSelection();
        }
        break;

      case 'set-hidden':
        if (confirm(confirmMessage)) {
          onBulkUpdate(selectedPhotos, { visible: false });
          onClearSelection();
        }
        break;

      case 'set-status-null':
        if (confirm(confirmMessage)) {
          onBulkUpdate(selectedPhotos, { status: null });
          onClearSelection();
        }
        break;

      case 'set-status-trash':
        if (confirm(confirmMessage)) {
          onBulkUpdate(selectedPhotos, { status: 'trash' });
          onClearSelection();
        }
        break;

      case 'set-status-to-sort':
        if (confirm(confirmMessage)) {
          onBulkUpdate(selectedPhotos, { status: 'to-sort' });
          onClearSelection();
        }
        break;

      case 'add-category-unlimited':
        if (confirm(confirmMessage)) {
          selectedPhotos.forEach(path => {
            const photo = allPhotos.find(p => p.path === path);
            if (photo) {
              const newCategories = [...(photo.categories || [])];
              if (!newCategories.includes('unlimited')) {
                newCategories.push('unlimited');
              }
              onBulkUpdate([path], { categories: newCategories as any });
            }
          });
          onClearSelection();
        }
        break;

      case 'add-category-limited':
        if (confirm(confirmMessage)) {
          selectedPhotos.forEach(path => {
            const photo = allPhotos.find(p => p.path === path);
            if (photo) {
              const newCategories = [...(photo.categories || [])];
              if (!newCategories.includes('limited')) {
                newCategories.push('limited');
              }
              onBulkUpdate([path], {
                categories: newCategories as any,
                limitedEdition: {
                  total: 9,
                  sold: 0,
                  available: 9,
                  closed: false,
                },
              });
            }
          });
          onClearSelection();
        }
        break;

      case 'delete-permanent':
        const confirmDelete = confirm(
          `⚠️ ATTENTION: Supprimer définitivement ${selectedPhotos.length} photo(s) ?\n\nCette action est IRRÉVERSIBLE.`
        );
        if (confirmDelete) {
          onBulkDelete(selectedPhotos);
          onClearSelection();
        }
        break;

      default:
        break;
    }

    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-card border-2 border-primary rounded-lg shadow-2xl p-4 min-w-[400px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">{selectedPhotos.length}</span>
            </div>
            <div>
              <div className="font-medium text-sm">
                {selectedPhotos.length} photo{selectedPhotos.length > 1 ? 's' : ''} sélectionnée{selectedPhotos.length > 1 ? 's' : ''}
              </div>
              <div className="text-xs text-muted-foreground">Cliquez pour voir les actions</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-medium transition-colors"
            >
              {isOpen ? 'Fermer' : 'Actions'}
            </button>
            <button
              onClick={onClearSelection}
              className="px-3 py-2 hover:bg-muted rounded-md text-sm text-muted-foreground transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="grid grid-cols-2 gap-2 pt-4 border-t">
            {/* Visibilité */}
            <button
              onClick={() => handleAction('set-visible')}
              className="px-3 py-2 text-left hover:bg-muted rounded-md text-sm transition-colors"
            >
              👁️ Rendre visible
            </button>
            <button
              onClick={() => handleAction('set-hidden')}
              className="px-3 py-2 text-left hover:bg-muted rounded-md text-sm transition-colors"
            >
              🙈 Masquer
            </button>

            {/* Statuts */}
            <button
              onClick={() => handleAction('set-status-null')}
              className="px-3 py-2 text-left hover:bg-muted rounded-md text-sm transition-colors"
            >
              ✅ Statut: Actif
            </button>
            <button
              onClick={() => handleAction('set-status-to-sort')}
              className="px-3 py-2 text-left hover:bg-muted rounded-md text-sm transition-colors"
            >
              ⏳ Statut: À trier
            </button>
            <button
              onClick={() => handleAction('set-status-trash')}
              className="px-3 py-2 text-left hover:bg-muted rounded-md text-sm transition-colors"
            >
              🗑️ Statut: Corbeille
            </button>

            {/* Catégories */}
            <button
              onClick={() => handleAction('add-category-unlimited')}
              className="px-3 py-2 text-left hover:bg-muted rounded-md text-sm transition-colors"
            >
              ♾️ + Tirage illimité
            </button>
            <button
              onClick={() => handleAction('add-category-limited')}
              className="px-3 py-2 text-left hover:bg-muted rounded-md text-sm transition-colors"
            >
              🔢 + Série limitée
            </button>

            {/* Danger zone */}
            <button
              onClick={() => handleAction('delete-permanent')}
              className="col-span-2 px-3 py-2 text-left bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-md text-sm font-medium transition-colors border border-red-500/30"
            >
              🚨 Supprimer définitivement
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Lalou
