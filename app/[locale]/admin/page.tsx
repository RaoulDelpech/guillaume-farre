"use client";
import { useEffect, useState } from "react";
import type { PhotoMetadata } from "@/lib/admin/photo-manager";
import AIAnalysisPanel from "@/components/admin/AIAnalysisPanel";
import DuplicateDetector from "@/components/admin/DuplicateDetector";
import InstagramSuggestionPanel from "@/components/admin/InstagramSuggestionPanel";
import InstagramConfig from "@/components/admin/InstagramConfig";
import CommercialDashboard from "@/components/admin/CommercialDashboard";

export default function AdminPage() {
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState("all");
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

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
      await fetch('/api/upload', { method: 'POST', body: formData });
      alert('✅ Photos uploadées !');
      loadPhotos();
    } catch (error) {
      alert('❌ Erreur upload');
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
      alert('✅ Sauvegardé !');
    } catch {
      alert('❌ Erreur sauvegarde');
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
      <div style={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#fff', fontSize: '24px' }}>⏳ Chargement...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px', color: '#fff' }}>
          🎨 Administration Photos
        </h1>
        <p style={{ color: '#888' }}>Gérez vos {photos.length} photos</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '2px solid #333' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff' }}>{stats.total}</div>
          <div style={{ color: '#888', fontSize: '14px' }}>Total photos</div>
        </div>
        <div style={{ backgroundColor: '#0a3d0a', padding: '20px', borderRadius: '8px', border: '2px solid #0f0' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#0f0' }}>{stats.visible}</div>
          <div style={{ color: '#0a0', fontSize: '14px' }}>Visibles</div>
        </div>
        <div style={{ backgroundColor: '#3d0a0a', padding: '20px', borderRadius: '8px', border: '2px solid #f00' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f00' }}>{stats.hidden}</div>
          <div style={{ color: '#a00', fontSize: '14px' }}>Masquées</div>
        </div>
        <div style={{ backgroundColor: '#0a1a3d', padding: '20px', borderRadius: '8px', border: '2px solid #00f' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#09f' }}>{stats.forSale}</div>
          <div style={{ color: '#069', fontSize: '14px' }}>À vendre</div>
        </div>
      </div>

      {/* Duplicate Detector */}
      <div style={{ marginBottom: '30px' }}>
        <DuplicateDetector />
      </div>

      {/* Instagram Configuration */}
      <div style={{ marginBottom: '30px' }}>
        <InstagramConfig />
      </div>

      {/* Commercial Performance Dashboard */}
      <div style={{ marginBottom: '30px' }}>
        <CommercialDashboard photos={photos} />
      </div>

      {/* Actions */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '2px solid #333' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
          <div>
            <label style={{ marginRight: '10px', color: '#ccc' }}>Catégorie:</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
              style={{ padding: '10px', backgroundColor: '#000', color: '#fff', border: '2px solid #555', borderRadius: '5px' }}>
              <option value="all">Toutes ({photos.length})</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ marginRight: '10px', color: '#ccc' }}>Visibilité:</label>
            <select value={filterVisibility} onChange={(e) => setFilterVisibility(e.target.value)}
              style={{ padding: '10px', backgroundColor: '#000', color: '#fff', border: '2px solid #555', borderRadius: '5px' }}>
              <option value="all">Toutes</option>
              <option value="visible">Visibles</option>
              <option value="hidden">Masquées</option>
            </select>
          </div>

          <button onClick={loadPhotos}
            style={{ padding: '10px 20px', backgroundColor: '#0066cc', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            🔄 Actualiser
          </button>

          <label style={{ padding: '10px 20px', backgroundColor: '#00aa00', color: '#fff', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            📤 Upload
            <input type="file" multiple accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
          </label>

          {hasChanges && (
            <button onClick={savePhotos} disabled={saving}
              style={{ padding: '10px 20px', backgroundColor: '#ff6600', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              {saving ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
            </button>
          )}
        </div>
      </div>

      {/* Photos Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {filteredPhotos.map((photo, index) => {
          const globalIndex = photos.findIndex(p => p.path === photo.path);
          return (
            <div key={photo.path} style={{
              backgroundColor: photo.visible ? '#1a1a1a' : '#3d0a0a',
              padding: '15px',
              borderRadius: '8px',
              border: `2px solid ${photo.visible ? '#333' : '#f00'}`
            }}>
              <img src={photo.path} alt={photo.filename}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px', marginBottom: '10px' }} />

              <div style={{ fontSize: '11px', color: '#666', marginBottom: '10px', wordBreak: 'break-all' }}>
                {photo.filename}
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={photo.visible}
                  onChange={(e) => updatePhoto(globalIndex, { visible: e.target.checked })} />
                <span style={{ fontWeight: 'bold' }}>
                  {photo.visible ? '✅ Visible' : '❌ Masquée'}
                </span>
              </label>

              <select value={photo.category}
                onChange={(e) => updatePhoto(globalIndex, { category: e.target.value })}
                style={{ width: '100%', padding: '8px', backgroundColor: '#000', color: '#fff', border: '1px solid #555', borderRadius: '4px', marginBottom: '10px' }}>
                <option value="empreintes">Empreintes</option>
                <option value="atelier">Atelier</option>
                <option value="projection">Projection</option>
                <option value="uploads-preview">À trier</option>
                <option value="uploads">Uploads</option>
                <option value="origins">Origins</option>
              </select>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '15px' }}>
                <input type="checkbox" checked={photo.forSale}
                  onChange={(e) => updatePhoto(globalIndex, { forSale: e.target.checked })} />
                <span>💰 À vendre</span>
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
          );
        })}
      </div>

      {filteredPhotos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#666', fontSize: '18px' }}>
          Aucune photo trouvée
        </div>
      )}
    </div>
  );
}
