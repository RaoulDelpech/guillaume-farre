/**
 * Composant Social Proof
 *
 * Affiche éléments de confiance et urgence :
 * - Compteur visiteurs temps réel
 * - Dernière vente
 * - Badge urgence éditions limitées
 *
 * @author Lalou
 */

import { useSocialProof, formatLastSale, formatViewers } from '@/hooks/useSocialProof';

interface SocialProofProps {
  photoPath: string;
  stockAvailable?: number;
  stockTotal?: number;
  variant?: 'compact' | 'detailed'; // Compact pour grille, detailed pour modal
  className?: string;
}

export default function SocialProof({
  photoPath,
  stockAvailable,
  stockTotal = 7,
  variant = 'compact',
  className = '',
}: SocialProofProps) {
  const { currentViewers, lastSaleHours, isAlmostSoldOut } = useSocialProof({
    photoPath,
    stockAvailable,
    stockTotal,
  });

  // Ne rien afficher si aucune donnée pertinente
  if (currentViewers === 0 && !lastSaleHours && !isAlmostSoldOut) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        {/* Compteur visiteurs (toujours affiché si >0) */}
        {currentViewers > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>{currentViewers} {currentViewers === 1 ? 'personne regarde' : 'personnes regardent'}</span>
          </div>
        )}

        {/* Dernière vente */}
        {lastSaleHours !== null && (
          <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
            <span>🔥</span>
            <span>Dernière vente {formatLastSale(lastSaleHours)}</span>
          </div>
        )}

        {/* Badge urgence */}
        {isAlmostSoldOut && (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-xs text-orange-600 dark:text-orange-400 font-medium">
            <span>⚠️</span>
            <span>Bientôt épuisé</span>
          </div>
        )}
      </div>
    );
  }

  // Variant 'detailed' pour modal produit
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Compteur visiteurs - Style card */}
      {currentViewers > 0 && (
        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              {formatViewers(currentViewers)}
            </p>
            <p className="text-xs text-green-700 dark:text-green-300">
              En ce moment
            </p>
          </div>
        </div>
      )}

      {/* Dernière vente - Style card */}
      {lastSaleHours !== null && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <span className="text-2xl">🔥</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
              Dernière vente {formatLastSale(lastSaleHours)}
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Édition limitée prisée
            </p>
          </div>
        </div>
      )}

      {/* Badge urgence - Style card */}
      {isAlmostSoldOut && (
        <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
              Édition bientôt épuisée
            </p>
            <p className="text-xs text-orange-700 dark:text-orange-300">
              Plus que {stockAvailable} exemplaire{stockAvailable! > 1 ? 's' : ''} disponible{stockAvailable! > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Lalou
