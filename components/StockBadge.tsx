'use client';

interface StockBadgeProps {
  available: number;
  total: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  formatType?: 'grand' | 'petit'; // Pour afficher le bon label
}

/**
 * Badge de stock pour éditions limitées
 * - Grands formats (A1, A0, 2A0) : X/9
 * - Petits formats (A2, A3, A4) : X/99
 *
 * @author Lalou
 * @updated 2025-11-29 - Support 9/99 exemplaires
 */
export default function StockBadge({ available, total, size = 'md', className = '', formatType }: StockBadgeProps) {
  // Déterminer couleur selon disponibilité - Palette neutre direction artistique
  const getColorClasses = () => {
    if (available === 0) {
      return 'bg-muted text-muted-foreground border-border';
    }
    if (available <= 2) {
      return 'bg-muted/80 text-foreground border-foreground/30';
    }
    return 'bg-muted/50 text-muted-foreground border-border';
  };

  // Taille du badge
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  // Texte selon disponibilité
  const getText = () => {
    // Label du type de format
    const formatLabel = formatType === 'grand' ? 'Grand format' : formatType === 'petit' ? 'Petit format' : '';

    if (available === 0) {
      return '❌ ÉPUISÉ';
    }
    if (available === 1) {
      return `⚠️ Dernier exemplaire (1/${total})`;
    }
    if (available <= 2) {
      return `⚠️ ${available}/${total} restants`;
    }
    // Afficher X/9 ou X/99 selon le total
    return `Édition ${total - available + 1}/${total}`;
  };

  return (
    <div
      className={`
        ${getColorClasses()}
        ${getSizeClasses()}
        ${className}
        inline-flex items-center gap-1.5
        font-medium rounded-full border backdrop-blur-sm
        transition-all duration-300
      `}
    >
      {getText()}
    </div>
  );
}

// Animation subtile pour urgence (CSS dans globals.css)
// @keyframes pulse-subtle {
//   0%, 100% { opacity: 1; }
//   50% { opacity: 0.85; }
// }

// Lalou
