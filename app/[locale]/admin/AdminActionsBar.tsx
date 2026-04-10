import type { PhotoMetadata } from '@/lib/admin/photo-manager';
import DragDropUpload from '@/components/admin/DragDropUpload';
import SeriesSuggestButton from '@/components/admin/SeriesSuggestButton';
import type { SeriesSuggestion } from '@/app/api/admin/suggest-series/route';

interface AdminActionsBarProps {
  filteredPhotos: PhotoMetadata[];
  selectedCount: number;
  totalFiltered: number;
  onRefresh: () => void;
  onToggleSelectAll: () => void;
  onSuggestionsReady: (suggestions: SeriesSuggestion[]) => void;
  onUpload: (files: File[]) => void;
}

export default function AdminActionsBar({
  filteredPhotos,
  selectedCount,
  totalFiltered,
  onRefresh,
  onToggleSelectAll,
  onSuggestionsReady,
  onUpload,
}: AdminActionsBarProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-wrap gap-4 items-center">
        <button
          onClick={onRefresh}
          className="px-6 py-3 bg-card hover:bg-muted border border-border rounded-md text-foreground font-medium transition-colors"
        >
          Actualiser
        </button>

        <button
          onClick={onToggleSelectAll}
          className="px-6 py-3 bg-card hover:bg-muted border border-border rounded-md text-foreground font-medium transition-colors"
        >
          {selectedCount === totalFiltered ? '☐ Tout désélectionner' : '☑ Tout sélectionner'}
        </button>

        <SeriesSuggestButton
          photos={filteredPhotos.map((p) => ({ path: p.path, filename: p.filename }))}
          onSuggestionsReady={onSuggestionsReady}
        />

        <div className="col-span-full">
          <DragDropUpload
            onFilesSelected={onUpload}
            accept="image/*,video/*"
            multiple={true}
          />
        </div>
      </div>
    </div>
  );
}
