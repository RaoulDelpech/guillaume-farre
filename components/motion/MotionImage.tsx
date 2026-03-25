'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { ImageProps } from 'next/image';

/**
 * Image avec animation de fade-in élégante au chargement
 * Évite le flash de contenu non chargé
 *
 * @author Lalou
 * @date 2026-03-25
 */

interface MotionImageProps extends Omit<ImageProps, 'onLoad'> {
  className?: string;
}

export function MotionImage({ src, alt, className = '', ...props }: MotionImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      <Image
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        {...props}
      />
    </motion.div>
  );
}
