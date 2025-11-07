"use client";
import { useState, useRef, DragEvent } from 'react';

interface DragDropUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
}

export default function DragDropUpload({
  onFilesSelected,
  accept = "image/*,video/*",
  multiple = true,
  maxFiles = 50,
}: DragDropUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter - 1 === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer.files);

    if (files.length > maxFiles) {
      alert(`Maximum ${maxFiles} fichiers autorisés`);
      return;
    }

    // Filter by accepted types
    const acceptedFiles = files.filter(file => {
      if (accept === "image/*,video/*") {
        return file.type.startsWith('image/') || file.type.startsWith('video/');
      }
      if (accept === "image/*") {
        return file.type.startsWith('image/');
      }
      if (accept === "video/*") {
        return file.type.startsWith('video/');
      }
      return true;
    });

    if (acceptedFiles.length === 0) {
      alert('Aucun fichier valide détecté');
      return;
    }

    if (acceptedFiles.length < files.length) {
      alert(`${files.length - acceptedFiles.length} fichier(s) rejeté(s) (format non supporté)`);
    }

    onFilesSelected(acceptedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    if (fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} fichiers autorisés`);
      return;
    }

    onFilesSelected(fileArray);

    // Reset input pour permettre re-upload même fichier
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        relative border-2 border-dashed rounded-lg p-12 cursor-pointer transition-all
        ${isDragging
          ? 'border-primary bg-primary/10 scale-105'
          : 'border-border hover:border-primary/50 hover:bg-muted/50'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="text-center pointer-events-none">
        {isDragging ? (
          <>
            <div className="text-6xl mb-4">📂</div>
            <p className="text-xl font-medium text-primary mb-2">
              Déposez les fichiers ici
            </p>
            <p className="text-sm text-muted-foreground">
              Les fichiers seront uploadés immédiatement
            </p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">📁</div>
            <p className="text-xl font-medium text-foreground mb-2">
              Glissez-déposez vos photos/vidéos ici
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              ou cliquez pour parcourir
            </p>
            <div className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium pointer-events-none">
              Sélectionner fichiers
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Formats acceptés: JPG, PNG, WebP, MP4, MOV
              <br />
              Maximum {maxFiles} fichiers
            </p>
          </>
        )}
      </div>

      {/* Overlay visuel drag */}
      {isDragging && (
        <div className="absolute inset-0 bg-primary/5 rounded-lg pointer-events-none" />
      )}
    </div>
  );
}
