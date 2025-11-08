'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, RotateCw, RotateCcw, Crop, Save, RotateCwSquare } from 'lucide-react';

// Types locaux pour react-easy-crop
interface Point {
  x: number;
  y: number;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PhotoEditorProps {
  photo: {
    path: string;
    filename: string;
  };
  onSave: (editedData: EditedPhotoData) => Promise<void>;
  onClose: () => void;
}

export interface EditedPhotoData {
  filename: string;
  cropArea: Area;
  rotation: number;
}

export default function PhotoEditor({ photo, onSave, onClose }: PhotoEditorProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleRotate = (degrees: number) => {
    setRotation((prev) => {
      const newRotation = prev + degrees;
      // Normaliser entre -180 et 180
      if (newRotation > 180) return newRotation - 360;
      if (newRotation < -180) return newRotation + 360;
      return newRotation;
    });
  };

  const handleFineRotation = (value: number) => {
    setRotation(value);
  };

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    setIsSaving(true);
    try {
      await onSave({
        filename: photo.filename,
        cropArea: croppedAreaPixels,
        rotation,
      });
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la photo éditée');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Crop className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">Éditer la photo</h2>
              <p className="text-sm text-muted-foreground">{photo.filename}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            disabled={isSaving}
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Crop Area */}
        <div className="relative flex-1 bg-black min-h-[400px]">
          <Cropper
            image={photo.path}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={undefined} // Libre
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            objectFit="contain"
          />
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-border space-y-6">
          {/* Zoom */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              Zoom
              <span className="text-xs text-muted-foreground">({Math.round(zoom * 100)}%)</span>
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Rotation fine */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              Angle de rotation
              <span className="text-xs text-muted-foreground">({rotation}°)</span>
            </label>
            <input
              type="range"
              min={-45}
              max={45}
              step={1}
              value={rotation}
              onChange={(e) => handleFineRotation(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Quick rotation buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Rotation rapide</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleRotate(-90)}
                className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm">90° gauche</span>
              </button>
              <button
                onClick={() => setRotation(0)}
                className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RotateCwSquare className="w-4 h-4" />
                <span className="text-sm">Réinitialiser</span>
              </button>
              <button
                onClick={() => handleRotate(90)}
                className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RotateCw className="w-4 h-4" />
                <span className="text-sm">90° droite</span>
              </button>
              <button
                onClick={() => handleRotate(180)}
                className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RotateCwSquare className="w-4 h-4" />
                <span className="text-sm">180°</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors font-medium"
              disabled={isSaving}
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !croppedAreaPixels}
              className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Lalou
