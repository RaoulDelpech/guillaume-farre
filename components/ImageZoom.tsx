"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { elegantEasing } from "@/components/motion/MotionWrapper";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageZoom({ src, alt, className = "" }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);
  const { playClick, playWhoosh } = useSoundEffects();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  const handleToggleZoom = () => {
    if (isZoomed) {
      playClick();
    } else {
      playWhoosh();
    }
    setIsZoomed(!isZoomed);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isZoomed) {
      setIsZoomed(false);
      playClick();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed]);

  return (
    <>
      <div
        ref={imageRef}
        className={`relative cursor-zoom-in ${className}`}
        onClick={handleToggleZoom}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
          quality={80}
          priority
        />

        {/* Zoom hint */}
        <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          <span>🔍</span>
          <span>Cliquer pour zoomer</span>
        </div>
      </div>

      {/* Zoomed overlay */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: elegantEasing }}
            className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center cursor-zoom-out"
            onClick={handleToggleZoom}
          >
          {/* Instructions */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md text-white text-sm px-4 py-2 rounded-lg flex items-center gap-3">
            <span>🖱️ Bougez la souris pour explorer</span>
            <span>•</span>
            <span>❌ Cliquer ou [ESC] pour fermer</span>
          </div>

          {/* Close button */}
          <button
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-2xl transition-all"
            onClick={handleToggleZoom}
          >
            ✕
          </button>

          {/* Zoomed image */}
          <div
            className="relative w-full h-full cursor-move"
            onMouseMove={handleMouseMove}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="absolute inset-0 bg-no-repeat transition-transform duration-100"
              style={{
                backgroundImage: `url(${src})`,
                backgroundSize: "200%",
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />

            {/* Crosshair */}
            <div
              className="absolute w-px h-8 bg-white/50 pointer-events-none"
              style={{
                left: `${zoomPosition.x}%`,
                top: `${zoomPosition.y - 2}%`,
                transform: "translateX(-50%)",
              }}
            />
            <div
              className="absolute w-8 h-px bg-white/50 pointer-events-none"
              style={{
                left: `${zoomPosition.x - 2}%`,
                top: `${zoomPosition.y}%`,
                transform: "translateY(-50%)",
              }}
            />
          </div>

          {/* Zoom indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full">
            🔍 Zoom 200%
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
