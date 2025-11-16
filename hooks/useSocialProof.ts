/**
 * Hook Social Proof - Éléments d'urgence et confiance
 *
 * Fonctionnalités :
 * - Compteur visiteurs en temps réel (simulated)
 * - Dernière vente (based on stock changes)
 * - Badge urgence (éditions bientôt épuisées)
 *
 * @author Lalou
 */

import { useState, useEffect } from 'react';

interface SocialProofData {
  currentViewers: number; // Nombre de personnes regardant
  lastSaleHours: number | null; // Dernière vente il y a X heures
  isAlmostSoldOut: boolean; // Édition bientôt épuisée
}

interface UseSocialProofOptions {
  photoPath: string; // Identifiant unique photo
  stockAvailable?: number; // Stock disponible (pour éditions limitées)
  stockTotal?: number; // Stock total
}

/**
 * Hook pour générer des données de social proof
 */
export function useSocialProof({
  photoPath,
  stockAvailable,
  stockTotal = 7,
}: UseSocialProofOptions): SocialProofData {
  const [currentViewers, setCurrentViewers] = useState<number>(0);
  const [lastSaleHours, setLastSaleHours] = useState<number | null>(null);

  useEffect(() => {
    // 1. Générer nombre de visiteurs en temps réel (algorithme intelligent)
    const generateViewers = () => {
      // Base : 1-5 visiteurs selon popularité photo
      const photoHash = hashString(photoPath);
      const baseViewers = (photoHash % 5) + 1;

      // Variation aléatoire ±2 pour effet "temps réel"
      const variation = Math.floor(Math.random() * 5) - 2;
      const viewers = Math.max(1, baseViewers + variation);

      setCurrentViewers(viewers);
    };

    // Initialiser
    generateViewers();

    // Mettre à jour toutes les 30-60 secondes (simule entrées/sorties)
    const interval = setInterval(() => {
      generateViewers();
    }, (30 + Math.random() * 30) * 1000); // 30-60s aléatoire

    return () => clearInterval(interval);
  }, [photoPath]);

  useEffect(() => {
    // 2. Simuler dernière vente selon stock disponible
    if (stockAvailable !== undefined && stockTotal) {
      const soldCount = stockTotal - stockAvailable;

      if (soldCount > 0) {
        // Plus l'édition est vendue, plus la dernière vente est récente
        const maxHoursAgo = 720; // 30 jours max
        const minHoursAgo = 2; // 2 heures min

        // Formule : Plus il reste peu de stock, plus vente récente
        const urgencyFactor = 1 - (stockAvailable / stockTotal);
        const hoursAgo = Math.floor(
          minHoursAgo + (maxHoursAgo - minHoursAgo) * (1 - urgencyFactor)
        );

        setLastSaleHours(hoursAgo);
      } else {
        // Aucune vente encore
        setLastSaleHours(null);
      }
    }
  }, [stockAvailable, stockTotal]);

  // 3. Déterminer si édition bientôt épuisée
  const isAlmostSoldOut = stockAvailable !== undefined && stockAvailable <= 3 && stockAvailable > 0;

  return {
    currentViewers,
    lastSaleHours,
    isAlmostSoldOut,
  };
}

/**
 * Hash simple d'une string pour génération pseudo-aléatoire cohérente
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Formatte durée en texte lisible
 */
export function formatLastSale(hours: number): string {
  if (hours < 1) {
    return "il y a moins d'1 heure";
  } else if (hours === 1) {
    return "il y a 1 heure";
  } else if (hours < 24) {
    return `il y a ${hours} heures`;
  } else if (hours < 48) {
    return "il y a 1 jour";
  } else if (hours < 168) { // 7 jours
    const days = Math.floor(hours / 24);
    return `il y a ${days} jours`;
  } else if (hours < 720) { // 30 jours
    const weeks = Math.floor(hours / 168);
    return `il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  } else {
    return "il y a plus d'un mois";
  }
}

/**
 * Variante pour compteur visiteurs avec texte
 */
export function formatViewers(count: number): string {
  if (count === 1) {
    return "1 personne regarde cette œuvre";
  } else if (count === 2) {
    return "2 personnes regardent cette œuvre";
  } else {
    return `${count} personnes regardent cette œuvre`;
  }
}

// Lalou
