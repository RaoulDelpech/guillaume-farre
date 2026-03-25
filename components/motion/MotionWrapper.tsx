'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * Variantes d'animation réutilisables pour framer-motion
 * Style élégant et discret pour galerie d'art
 *
 * @author Lalou
 * @date 2026-03-25
 */

// Variantes d'animation prédéfinies
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 }
};

// Container avec stagger children pour animations en cascade
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Easing élégant (courbe d'animation douce)
export const elegantEasing: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface MotionSectionProps {
  children: ReactNode;
  variant?: 'fadeInUp' | 'fadeIn' | 'scaleIn' | 'slideInLeft' | 'slideInRight';
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: boolean;
}

/**
 * Section animée avec scroll reveal
 * Apparaît une fois quand elle entre dans le viewport
 */
export function MotionSection({
  children,
  variant = 'fadeInUp',
  className = '',
  delay = 0,
  duration = 0.6,
  stagger = false,
  ...props
}: MotionSectionProps) {
  const variants = { fadeInUp, fadeIn, scaleIn, slideInLeft, slideInRight };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: elegantEasing,
        ...(stagger ? staggerContainer.visible.transition : {})
      }}
      variants={stagger ? staggerContainer : variants[variant]}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Item d'une liste animée en stagger
 * À utiliser à l'intérieur d'un MotionSection avec stagger={true}
 */
export function MotionItem({ children, className = '', variant = 'fadeInUp' }: { children: ReactNode, className?: string, variant?: 'fadeInUp' | 'fadeIn' | 'scaleIn' }) {
  const variants = { fadeInUp, fadeIn, scaleIn, slideInLeft, slideInRight };

  return (
    <motion.div variants={variants[variant]} className={className}>
      {children}
    </motion.div>
  );
}
