'use client';

import { useEffect, useState, useMemo } from 'react';
import type { PhotoMetadata } from '@/lib/admin/photo-manager';
import type { EditedPhotoData } from '@/components/admin/PhotoEditor';
import type { SeriesSuggestion } from '@/app/api/admin/suggest-series/route';

interface AdminFilters {
  status: string;
  mainCategory: string;
  subCategories: string[];
  series: string;
  showGrouped: boolean;
}

interface AdminStats {
  total: number;
  visible: number;
  hidden: number;
  forSale: number;
  limitedEditions: number;
  soldOut: number;
  totalValue: number;
}

export type { AdminFilters, AdminStats };

export function useAdminPhotos() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AdminFilters>({
    status: 'all',
    mainCategory: 'all',
    subCategories: [],
    series: 'all',
    showGrouped: false,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [seriesSuggestions, setSeriesSuggestions] = useState<SeriesSuggestion[] | null>(null);
  const [analyzingSeries, setAnalyzingSeries] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
      setAdminToken(token);
    }
  }, []);

  useEffect(() => {
    loadPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      files = e;
    } else {
      files = e.target.files;
    }
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));

    try {
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        alert("Erreur lors de l'upload");
        return;
      }

      await loadPhotos();
      setFilters(prev => ({ ...prev, status: 'to-sort' }));
      setRefreshKey(prev => prev + 1);

      setTimeout(async () => {
        await loadPhotos();
        setRefreshKey(prev => prev + 1);
      }, 300);

      if (uploadData.files && uploadData.files.length >= 2) {
        setAnalyzingSeries(true);
        try {
          const photoPaths = uploadData.files.map((f: { path: string }) => f.path);
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
          console.error("Erreur lors de l'analyse des séries:", error);
          alert('Fichiers uploadés avec succès (analyse IA non disponible)');
        } finally {
          setAnalyzingSeries(false);
        }
      } else {
        alert('Fichier uploadé avec succès');
      }
    } catch {
      alert("Erreur lors de l'upload");
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

  function handleStatusChange(index: number, newStatus: string) {
    updatePhoto(index, { status: newStatus as 'trash' | 'to-sort' | null });
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
        await loadPhotos();
        setRefreshKey(prev => prev + 1);
        alert(`Photo éditée sauvegardée: ${data.editedFile}`);
      } else {
        throw new Error(data.error || "Erreur lors de l'édition");
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  }

  function handleBulkUpdate(paths: string[], updates: Partial<PhotoMetadata>) {
    const newPhotos = [...photos];
    paths.forEach((p) => {
      const index = newPhotos.findIndex((photo) => photo.path === p);
      if (index !== -1) {
        newPhotos[index] = { ...newPhotos[index], ...updates };
      }
    });
    setPhotos(newPhotos);
    setHasChanges(true);
  }

  function handleBulkDelete(paths: string[]) {
    const newPhotos = photos.filter((p) => !paths.includes(p.path));
    setPhotos(newPhotos);
    setHasChanges(true);
  }

  function handleDeletePhoto(photoPath: string) {
    setPhotos(photos.filter(p => p.path !== photoPath));
  }

  const filteredPhotos = useMemo(() => {
    return photos.filter(p => {
      if (!filters.showGrouped && p.seriesName && p.seriesName.trim() !== '') {
        return false;
      }
      if (filters.status !== 'all') {
        const currentStatus = p.status || null;
        if (currentStatus !== filters.status) return false;
      }
      if (filters.mainCategory !== 'all') {
        if (p.category !== filters.mainCategory) return false;
      }
      if (filters.subCategories.length > 0) {
        const hasAnySubCategory = filters.subCategories.some(subCat =>
          p.categories?.includes(subCat as 'unlimited' | 'limited' | 'xxl' | 'monumental')
        );
        if (!hasAnySubCategory) return false;
      }
      if (filters.series !== 'all') {
        if (p.seriesName !== filters.series) return false;
      }
      return true;
    });
  }, [photos, filters]);

  function togglePhotoSelection(path: string) {
    setSelectedPhotos((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  }

  function toggleSelectAll() {
    if (selectedPhotos.length === filteredPhotos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(filteredPhotos.map((p) => p.path));
    }
  }

  const stats: AdminStats = useMemo(() => ({
    total: photos.length,
    visible: photos.filter(p => p.visible).length,
    hidden: photos.filter(p => !p.visible).length,
    forSale: photos.filter(p => p.forSale).length,
    limitedEditions: photos.filter(p => p.categories?.includes('limited')).length,
    soldOut: photos.filter(p => p.limitedEdition?.available === 0).length,
    totalValue: photos.reduce((sum, p) => {
      if (!p.forSale) return sum;
      const avgPrice = p.price || 500;
      return sum + avgPrice;
    }, 0),
  }), [photos]);

  const collections = useMemo(() => {
    return [...new Set(photos.map(p => p.collection).filter(Boolean))] as string[];
  }, [photos]);

  return {
    // Auth
    isAuthenticated, setIsAuthenticated, adminToken,
    // Data
    photos, loading, filteredPhotos, stats, collections,
    // Filters
    filters, setFilters,
    // UI state
    hasChanges, saving, zoomedImage, setZoomedImage,
    seriesSuggestions, setSeriesSuggestions,
    analyzingSeries, refreshKey,
    selectedPhotos,
    // Actions
    loadPhotos, handleUpload, savePhotos,
    updatePhoto, handleStatusChange,
    handleApplySeries, handleSaveEditedPhoto,
    handleBulkUpdate, handleBulkDelete, handleDeletePhoto,
    togglePhotoSelection, toggleSelectAll,
  };
}
