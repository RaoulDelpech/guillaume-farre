/**
 * Composant Social Proof - Direction Artistique Galerie Haut de Gamme
 *
 * Affiche éléments de confiance et urgence avec style minimaliste :
 * - Compteur visiteurs temps réel
 * - Dernière vente
 * - Badge urgence éditions limitées
 *
 * @author Lalou
 * @updated 2025-01-20 - Conformité direction artistique
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
        {/* Compteur visiteurs - style minimaliste */}
        {currentViewers > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-light">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground/40"></span>
            </span>
            <span>{currentViewers} {currentViewers === 1 ? 'personne regarde' : 'personnes regardent'}</span>
          </div>
        )}

        {/* Dernière vente */}
        {lastSaleHours !== null && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-light">
            <span>Dernière vente {formatLastSale(lastSaleHours)}</span>
          </div>
        )}

        {/* Badge urgence - style sobre */}
        {isAlmostSoldOut && (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-muted/50 border border-border text-xs text-muted-foreground font-light">
            <span>Bientôt épuisé</span>
          </div>
        )}
      </div>
    );
  }

  // Variant 'detailed' pour modal produit - style galerie
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Compteur visiteurs - Style card minimaliste */}
      {currentViewers > 0 && (
        <div className="flex items-center gap-3 p-4 bg-muted/10 border border-border">
          <div className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground/40"></span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-light text-foreground">
              {formatViewers(currentViewers)}
            </p>
            <p className="text-xs text-muted-foreground font-light">
              En ce moment
            </p>
          </div>
        </div>
      )}

      {/* Dernière vente - Style card minimaliste */}
      {lastSaleHours !== null && (
        <div className="flex items-center gap-3 p-4 bg-muted/10 border border-border">
          <div className="flex-1">
            <p className="text-sm font-light text-foreground">
              Dernière vente {formatLastSale(lastSaleHours)}
            </p>
            <p className="text-xs text-muted-foreground font-light">
              Édition limitée prisée
            </p>
          </div>
        </div>
      )}

      {/* Badge urgence - Style card minimaliste */}
      {isAlmostSoldOut && (
        <div className="flex items-center gap-3 p-4 bg-muted/10 border border-border">
          <div className="flex-1">
            <p className="text-sm font-light text-foreground">
              Édition bientôt épuisée
            </p>
            <p className="text-xs text-muted-foreground font-light">
              Plus que {stockAvailable} exemplaire{stockAvailable! > 1 ? 's' : ''} disponible{stockAvailable! > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Lalou
