"use client";
import { useState } from 'react';

interface DuplicateFile {
  path: string;
  fileName: string;
  size: number;
  fullPath: string;
}

interface DuplicateGroup {
  hash: string;
  type: 'exact' | 'similar-name';
  files: DuplicateFile[];
  count: number;
  pattern?: string;
}

interface ScanResult {
  success: boolean;
  duplicates: DuplicateGroup[];
  summary: {
    groupCount: number;
    duplicateFilesCount: number;
    scannedDirectory: string;
  };
}

export default function DuplicateDetector() {
  const [scanning, setScanning] = useState(false);
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [summary, setSummary] = useState<ScanResult['summary'] | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  /**
   * Scanne les photos pour détecter les doublons
   */
  const handleScan = async () => {
    setScanning(true);
    setDuplicates([]);
    setSummary(null);
    setSelectedFiles(new Set());

    try {
      const response = await fetch('/api/admin/duplicates');
      const data: ScanResult = await response.json();

      if (data.success) {
        setDuplicates(data.duplicates);
        setSummary(data.summary);
        setShowDuplicates(true);

        // Auto-sélectionner les doublons (garder le premier de chaque groupe)
        const autoSelected = new Set<string>();
        data.duplicates.forEach((group) => {
          // Garder le premier fichier, sélectionner les autres pour suppression
          group.files.slice(1).forEach((file) => {
            autoSelected.add(file.path);
          });
        });
        setSelectedFiles(autoSelected);
      }
    } catch (error) {
      console.error('Erreur scan:', error);
      alert('Erreur lors du scan des doublons');
    } finally {
      setScanning(false);
    }
  };

  /**
   * Supprime les fichiers sélectionnés
   */
  const handleDelete = async () => {
    if (selectedFiles.size === 0) {
      alert('Aucun fichier sélectionné');
      return;
    }

    const confirmed = confirm(
      `⚠️ Supprimer ${selectedFiles.size} fichier(s) en double ?\n\nCette action est irréversible.`
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      const response = await fetch('/api/admin/duplicates', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filesToDelete: Array.from(selectedFiles) }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ ${data.summary.deleted} fichier(s) supprimé(s) !`);

        // Re-scanner après suppression
        setShowDuplicates(false);
        await handleScan();
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  /**
   * Toggle sélection d'un fichier
   */
  const toggleFile = (filePath: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(filePath)) {
      newSelected.delete(filePath);
    } else {
      newSelected.add(filePath);
    }
    setSelectedFiles(newSelected);
  };

  /**
   * Formatte la taille du fichier
   */
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">🔍 Détection des doublons</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Scanne automatiquement les photos importées pour détecter les doublons
          </p>
        </div>

        <button
          onClick={handleScan}
          disabled={scanning}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {scanning ? '⏳ Scan en cours...' : '🔍 Scanner les doublons'}
        </button>
      </div>

      {/* Résumé */}
      {summary && (
        <div className="mb-4 p-4 bg-muted rounded-md">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{summary.groupCount}</div>
              <div className="text-xs text-muted-foreground">Groupes de doublons</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-destructive">{summary.duplicateFilesCount}</div>
              <div className="text-xs text-muted-foreground">Fichiers à supprimer</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{selectedFiles.size}</div>
              <div className="text-xs text-muted-foreground">Fichiers sélectionnés</div>
            </div>
          </div>

          {summary.duplicateFilesCount > 0 && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowDuplicates(!showDuplicates)}
                className="flex-1 px-4 py-2 bg-background border rounded-md hover:bg-muted"
              >
                {showDuplicates ? '🔼 Masquer les doublons' : '🔽 Afficher les doublons'}
              </button>

              {selectedFiles.size > 0 && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-md font-medium hover:bg-destructive/90 disabled:opacity-50"
                >
                  {deleting ? '⏳ Suppression...' : `🗑️ Supprimer ${selectedFiles.size} fichier(s)`}
                </button>
              )}
            </div>
          )}

          {summary.duplicateFilesCount === 0 && (
            <div className="mt-4 text-center text-green-600 font-medium">
              ✅ Aucun doublon détecté !
            </div>
          )}
        </div>
      )}

      {/* Liste des doublons */}
      {showDuplicates && duplicates.length > 0 && (
        <div className="space-y-4">
          <div className="sticky top-0 z-10 bg-background p-3 border-b border-border">
            <div className="text-sm font-medium text-muted-foreground">
              📋 Affichage de {duplicates.length} groupe{duplicates.length > 1 ? 's' : ''} de doublons ({summary?.duplicateFilesCount} fichiers à supprimer au total)
            </div>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
          {duplicates.map((group, idx) => (
            <div key={group.hash} className="border rounded-lg p-4 bg-background">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-medium">
                    Groupe #{idx + 1} - {group.count} fichiers identiques (contenu exact)
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Hash MD5: {group.hash.substring(0, 12)}...
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  🔴 Contenu d'image identique
                </div>
              </div>

              <div className="space-y-2">
                {group.files.map((file, fileIdx) => {
                  const isSelected = selectedFiles.has(file.path);
                  const isFirst = fileIdx === 0;

                  return (
                    <div
                      key={file.path}
                      className={`flex items-center gap-3 p-3 rounded-md border ${
                        isSelected
                          ? 'bg-destructive/10 border-destructive'
                          : isFirst
                          ? 'bg-green-500/10 border-green-500'
                          : 'bg-muted'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleFile(file.path)}
                        disabled={isFirst}
                        className="w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                      />

                      {/* Miniature cliquable */}
                      <div
                        onClick={() => setZoomedImage(file.path)}
                        className="relative w-16 h-16 flex-shrink-0 cursor-zoom-in group overflow-hidden rounded border border-border hover:border-primary transition-colors"
                      >
                        <img
                          src={file.path}
                          alt={file.fileName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium">
                            🔍
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{file.fileName}</div>
                        <div className="text-xs text-muted-foreground truncate">{file.path}</div>
                      </div>

                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatSize(file.size)}
                      </div>

                      {isFirst && (
                        <div className="px-2 py-1 bg-green-600 text-white text-xs rounded font-medium">
                          CONSERVER
                        </div>
                      )}

                      {isSelected && !isFirst && (
                        <div className="px-2 py-1 bg-destructive text-destructive-foreground text-xs rounded font-medium">
                          SUPPRIMER
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-3 bg-muted rounded-md text-xs text-muted-foreground">
        <div className="font-medium mb-1">💡 Fonctionnement :</div>
        <ul className="list-disc list-inside space-y-1">
          <li>Le scan détecte automatiquement les fichiers identiques (même contenu)</li>
          <li>Cliquez sur les miniatures pour agrandir et vérifier</li>
          <li>Pour chaque groupe, le premier fichier est conservé (✅ vert)</li>
          <li>Les autres sont pré-sélectionnés pour suppression (❌ rouge)</li>
          <li>Vous pouvez modifier la sélection avant de supprimer</li>
          <li>⚠️ La suppression est irréversible</li>
        </ul>
      </div>

      {/* Modal zoom image */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-colors z-10"
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
    </div>
  );
}
