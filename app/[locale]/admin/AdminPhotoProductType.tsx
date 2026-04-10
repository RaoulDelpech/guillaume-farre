import type { PhotoMetadata } from '@/lib/admin/photo-manager';

interface AdminPhotoProductTypeProps {
  photo: PhotoMetadata;
  globalIndex: number;
  updatePhoto: (index: number, updates: Partial<PhotoMetadata>) => void;
  collections: string[];
}

const PHOTO_CATEGORIES = ['empreinte', 'projection', 'atelier'] as const;

export default function AdminPhotoProductType({
  photo,
  globalIndex,
  updatePhoto,
  collections,
}: AdminPhotoProductTypeProps) {
  return (
    <div className="space-y-3 p-3 bg-card/50 border border-border rounded-lg">
      <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
        Type d&apos;oeuvre
      </label>

      {/* Photo vs Canvas toggle */}
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            name={`productType-${photo.path}`}
            checked={photo.productType !== 'canvas'}
            onChange={() => updatePhoto(globalIndex, { productType: 'photo' })}
            className="w-4 h-4 rounded-full border-border"
          />
          <span className="text-sm group-hover:text-primary transition-colors">Photo</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            name={`productType-${photo.path}`}
            checked={photo.productType === 'canvas'}
            onChange={() => updatePhoto(globalIndex, { productType: 'canvas', photoCategory: undefined })}
            className="w-4 h-4 rounded-full border-border"
          />
          <span className="text-sm group-hover:text-primary transition-colors">Toile</span>
        </label>
      </div>

      {/* Photo category section */}
      {photo.productType !== 'canvas' && (
        <div className="mt-3 space-y-3">
          <label className="block text-xs text-muted-foreground uppercase tracking-wide">
            Categorie photo
          </label>
          <div className="flex gap-3">
            {PHOTO_CATEGORIES.map(cat => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name={`photoCategory-${photo.path}`}
                  checked={photo.photoCategory === cat}
                  onChange={() => {
                    const updates: Partial<PhotoMetadata> = { photoCategory: cat };
                    if (cat === 'atelier') {
                      updates.forSale = false;
                      updates.priceSigned = undefined;
                      updates.priceUnsigned = undefined;
                    }
                    updatePhoto(globalIndex, updates);
                  }}
                  className="w-4 h-4 rounded-full border-border"
                />
                <span className="text-sm group-hover:text-primary transition-colors capitalize">{cat}</span>
              </label>
            ))}
          </div>

          {photo.photoCategory === 'atelier' && (
            <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-400">
              Les photos d&apos;atelier ne sont pas mises en vente
            </div>
          )}

          {(photo.photoCategory === 'empreinte' || photo.photoCategory === 'projection') && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Prix non signe (EUR)</label>
                <input
                  type="number"
                  value={photo.priceUnsigned || ''}
                  onChange={(e) => updatePhoto(globalIndex, { priceUnsigned: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Ex: 500"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Prix signe (EUR)</label>
                <input
                  type="number"
                  value={photo.priceSigned || ''}
                  onChange={(e) => updatePhoto(globalIndex, { priceSigned: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Ex: 800"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Canvas section */}
      {photo.productType === 'canvas' && (
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Prix (EUR)</label>
              <input
                type="number"
                value={photo.canvasDetails?.price || ''}
                onChange={(e) => updatePhoto(globalIndex, {
                  canvasDetails: {
                    ...(photo.canvasDetails || { dimensions: '', technique: '' }),
                    price: e.target.value ? Number(e.target.value) : 0,
                  },
                })}
                placeholder="Ex: 15000"
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Dimensions</label>
              <input
                type="text"
                value={photo.canvasDetails?.dimensions || ''}
                onChange={(e) => updatePhoto(globalIndex, {
                  canvasDetails: {
                    ...(photo.canvasDetails || { price: 0, technique: '' }),
                    dimensions: e.target.value,
                  },
                })}
                placeholder="Ex: 150 x 200 cm"
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Technique</label>
            <input
              type="text"
              value={photo.canvasDetails?.technique || ''}
              onChange={(e) => updatePhoto(globalIndex, {
                canvasDetails: {
                  ...(photo.canvasDetails || { price: 0, dimensions: '' }),
                  technique: e.target.value,
                },
              })}
              placeholder="Ex: Passage Ferrari Dino sur toile"
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Date de publication</label>
            <input
              type="date"
              value={photo.publishDate || ''}
              onChange={(e) => updatePhoto(globalIndex, { publishDate: e.target.value || undefined })}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Invisible sur le site standard jusqu&apos;a cette date. Visible sur acces VIP/secret.
            </p>
          </div>
        </div>
      )}

      {/* Collection (shared between photo and canvas) */}
      <div className="mt-3">
        <label className="block text-xs text-muted-foreground mb-1">Collection</label>
        <input
          type="text"
          value={photo.collection || ''}
          onChange={(e) => updatePhoto(globalIndex, { collection: e.target.value || undefined })}
          placeholder="Ex: Collection Noir, Dino 2024"
          list="collections-list"
          className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
        />
        <datalist id="collections-list">
          {collections.map(col => (
            <option key={col} value={col} />
          ))}
        </datalist>
      </div>
    </div>
  );
}
