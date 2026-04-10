import Image from 'next/image';
import type { PhotoMetadata } from '@/lib/admin/photo-manager';
import AIAnalysisPanel from '@/components/admin/AIAnalysisPanel';
import InstagramSuggestionPanel from '@/components/admin/InstagramSuggestionPanel';
import PhotoDescriptionAI from '@/components/admin/PhotoDescriptionAI';
import AdminPhotoProductType from './AdminPhotoProductType';

interface AdminPhotoCardProps {
  photo: PhotoMetadata;
  globalIndex: number;
  refreshKey: number;
  isSelected: boolean;
  updatePhoto: (index: number, updates: Partial<PhotoMetadata>) => void;
  onStatusChange: (index: number, newStatus: string) => void;
  onToggleSelection: (path: string) => void;
  onZoom: (path: string) => void;
  onDelete: (photo: PhotoMetadata) => void;
  collections: string[];
}

const CATEGORY_OPTIONS = [
  { value: 'unlimited', label: 'unlimited' },
  { value: 'limited', label: 'limited' },
  { value: 'xxl', label: 'xxl' },
  { value: 'monumental', label: 'monumental' },
] as const;

const ORIENTATION_OPTIONS = [
  { value: 'auto', label: 'Automatique (IA détecte)', icon: '✅' },
  { value: 'vertical', label: 'Vertical (forcer)', icon: '📐' },
  { value: 'horizontal', label: 'Horizontal (forcer)', icon: '📐' },
] as const;

export default function AdminPhotoCard({
  photo,
  globalIndex,
  refreshKey,
  isSelected,
  updatePhoto,
  onStatusChange,
  onToggleSelection,
  onZoom,
  onDelete,
  collections,
}: AdminPhotoCardProps) {
  function handleOrientationChange(value: string) {
    updatePhoto(globalIndex, { orientation: value as 'auto' | 'vertical' | 'horizontal' });

    if (value === 'auto' && !photo.aiDetectedOrientation) {
      fetch('/api/admin/detect-orientation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoPath: photo.path }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            updatePhoto(globalIndex, { aiDetectedOrientation: data.orientation });
          }
        })
        .catch(err => console.error('Erreur détection orientation:', err));
    }
  }

  return (
    <div
      className={`bg-card border rounded-lg overflow-hidden transition-all ${
        isSelected
          ? 'border-primary border-2'
          : photo.visible
            ? 'border-border'
            : 'border-muted-foreground/30'
      }`}
    >
      {/* Image */}
      <div
        className="relative aspect-square bg-muted cursor-zoom-in group"
        onClick={() => onZoom(photo.path)}
      >
        <div className="absolute top-2 left-2 z-10" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelection(photo.path)}
            className="w-5 h-5 rounded border-2 border-white shadow-lg cursor-pointer"
          />
        </div>
        <Image
          key={`${photo.path}-${refreshKey}`}
          src={`${photo.path}?t=${refreshKey}`}
          alt={photo.filename}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
            Cliquer pour agrandir
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Filename */}
        <div className="text-xs text-muted-foreground break-all font-mono">{photo.filename}</div>

        {/* Visibility */}
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

        {/* Status */}
        <div>
          <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wide">Statut</label>
          <select
            value={photo.status || ''}
            onChange={(e) => onStatusChange(globalIndex, e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">✅ Visible</option>
            <option value="to-sort">⏳ À trier</option>
          </select>
        </div>

        {/* Delete */}
        <button
          onClick={() => onDelete(photo)}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
        >
          Supprimer définitivement
        </button>

        {/* Legacy category */}
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

        {/* Multi-categories */}
        <div className="space-y-2">
          <label className="block text-xs text-muted-foreground uppercase tracking-wide">Catégories</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORY_OPTIONS.map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={photo.categories?.includes(value) || false}
                  onChange={(e) => {
                    const categories = photo.categories || [];
                    const newCategories = e.target.checked
                      ? [...categories, value]
                      : categories.filter(c => c !== value);
                    updatePhoto(globalIndex, { categories: newCategories });
                  }}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-xs group-hover:text-primary transition-colors capitalize">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wide">
            Tags (séparés par virgules)
          </label>
          <input
            type="text"
            value={(photo.tags || []).join(', ')}
            onChange={(e) => {
              const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t.length > 0);
              updatePhoto(globalIndex, { tags });
            }}
            placeholder="Ex: rouge, Ferrari F40, noir et blanc"
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Material */}
        <div>
          <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">Matériau</label>
          <select
            value={photo.material || 'semi-glossy'}
            onChange={(e) => updatePhoto(globalIndex, { material: e.target.value as 'semi-glossy' | 'aluminum' })}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
          >
            <option value="semi-glossy">Papier Semi-Brillant (€13.20)</option>
            <option value="aluminum">Aluminium Brossé (€16.81)</option>
          </select>
        </div>

        {/* Orientation */}
        <div className="space-y-3">
          <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">Orientation</label>
          <div className="space-y-2">
            {ORIENTATION_OPTIONS.map(({ value, label, icon }) => (
              <label key={value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name={`orientation-${photo.path}`}
                  checked={value === 'auto' ? (photo.orientation === 'auto' || !photo.orientation) : photo.orientation === value}
                  onChange={() => handleOrientationChange(value)}
                  className="w-4 h-4 rounded-full border-border"
                />
                <span className="text-sm group-hover:text-primary transition-colors">
                  {icon} {label}
                  {value === 'auto' && photo.orientation === 'auto' && photo.aiDetectedOrientation && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      &rarr; {photo.aiDetectedOrientation === 'vertical' ? '📐 Vertical' : '📐 Horizontal'}
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Product type section */}
        <AdminPhotoProductType
          photo={photo}
          globalIndex={globalIndex}
          updatePhoto={updatePhoto}
          collections={collections}
        />

        {/* Sale options (hidden for trash and atelier) */}
        {photo.status !== 'trash' && photo.photoCategory !== 'atelier' && (
          <>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={photo.forSale}
                onChange={(e) => updatePhoto(globalIndex, { forSale: e.target.checked })}
                className="w-4 h-4 rounded border-border"
              />
              <span className="text-sm group-hover:text-primary transition-colors">A vendre</span>
            </label>

            <AIAnalysisPanel
              photoFilename={photo.filename}
              category={photo.photoCategory || photo.category || 'autres'}
              currentPrice={photo.price}
              onApplySuggestions={(suggestions) => {
                updatePhoto(globalIndex, {
                  price: suggestions.price,
                  forSale: true,
                  edition: {
                    type: suggestions.isLimitedEdition ? 'limited' : 'open',
                    count: suggestions.editionNumber,
                  },
                });
              }}
            />
          </>
        )}

        {/* AI Description */}
        <PhotoDescriptionAI
          photoPath={photo.path}
          photoFilename={photo.filename}
          category={photo.category || 'autres'}
          seriesName={photo.seriesName}
          currentDescription={photo.description}
          aiGenerated={photo.aiGenerated}
          onApplyDescription={(description) => {
            updatePhoto(globalIndex, { description, aiGenerated: true });
          }}
        />

        {/* Instagram */}
        <InstagramSuggestionPanel
          photoPath={photo.path}
          photoTitle={photo.filename}
          category={photo.category || 'autres'}
          seriesName={photo.seriesName}
        />
      </div>
    </div>
  );
}
