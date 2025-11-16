'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X } from 'lucide-react';

interface ImageCarouselZoomProps {
  images: string[];
  title?: string;
  className?: string;
}

export default function ImageCarouselZoom({
  images,
  title,
  className = '',
}: ImageCarouselZoomProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset zoom and pan when changing image
  useEffect(() => {
    setIsZoomed(false);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleZoomIn = () => {
    setIsZoomed(true);
    setZoomLevel((prev) => Math.min(prev + 1, 4));
  };

  const handleZoomOut = () => {
    if (zoomLevel === 1) {
      setIsZoomed(false);
    } else {
      setZoomLevel((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed || zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - panPosition.x,
      y: e.clientY - panPosition.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'Escape') {
      setIsZoomed(false);
      setZoomLevel(1);
    }
    if (e.key === '+' || e.key === '=') handleZoomIn();
    if (e.key === '-') handleZoomOut();
  };

  useEffect(() => {
    if (isZoomed) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isZoomed, currentIndex]);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Aucune image disponible</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main image container */}
      <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden group">
        <img
          ref={imageRef}
          src={images[currentIndex]}
          alt={`${title || 'Image'} - ${currentIndex + 1}/${images.length}`}
          className={`w-full h-full object-contain transition-transform duration-200 ${
            isDragging ? 'cursor-grabbing' : isZoomed && zoomLevel > 1 ? 'cursor-grab' : 'cursor-zoom-in'
          }`}
          style={{
            transform: isZoomed ? `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)` : 'none',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={() => {
            if (!isZoomed) {
              setIsZoomed(true);
              setZoomLevel(2);
            }
          }}
          draggable={false}
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 4}
            className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-all disabled:opacity-30"
            aria-label="Zoom avant"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-all disabled:opacity-30"
            aria-label="Zoom arrière"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
        </div>

        {/* Zoom indicator */}
        {isZoomed && zoomLevel > 1 && (
          <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            ×{zoomLevel}
          </div>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentIndex
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-transparent hover:border-primary/50'
              }`}
            >
              <img
                src={img}
                alt={`Miniature ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen zoom modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
          onClick={() => {
            setIsZoomed(false);
            setZoomLevel(1);
          }}
        >
          {/* Close button */}
          <button
            onClick={() => {
              setIsZoomed(false);
              setZoomLevel(1);
            }}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Zoom level indicator */}
          <div className="absolute top-4 left-4 bg-white/10 text-white px-4 py-2 rounded-lg">
            Zoom ×{zoomLevel}
          </div>

          {/* Main zoomed image */}
          <div
            className="relative max-w-7xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex]}
              alt={`${title || 'Image'} - Zoom`}
              className={`max-w-full max-h-[90vh] object-contain ${
                isDragging ? 'cursor-grabbing' : zoomLevel > 1 ? 'cursor-grab' : 'cursor-zoom-in'
              }`}
              style={{
                transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              draggable={false}
            />
          </div>

          {/* Navigation in fullscreen */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Zoom controls in fullscreen */}
          <div className="absolute bottom-8 right-8 flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              disabled={zoomLevel <= 1}
              className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg transition-all disabled:opacity-30"
            >
              <ZoomOut className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              disabled={zoomLevel >= 4}
              className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg transition-all disabled:opacity-30"
            >
              <ZoomIn className="w-6 h-6" />
            </button>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-lg text-sm">
            <p>
              <kbd className="px-2 py-1 bg-white/20 rounded">←</kbd> / <kbd className="px-2 py-1 bg-white/20 rounded">→</kbd> Naviguer •{' '}
              <kbd className="px-2 py-1 bg-white/20 rounded">+</kbd> / <kbd className="px-2 py-1 bg-white/20 rounded">-</kbd> Zoomer •{' '}
              <kbd className="px-2 py-1 bg-white/20 rounded">ESC</kbd> Quitter
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Lalou
