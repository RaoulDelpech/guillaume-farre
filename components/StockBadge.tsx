'use client';

interface StockBadgeProps {
  available: number;
  total: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function StockBadge({ available, total, size = 'md', className = '' }: StockBadgeProps) {
  // Déterminer couleur selon disponibilité
  const getColorClasses = () => {
    if (available === 0) {
      return 'bg-red-500/90 text-white border-red-600';
    }
    if (available <= 2) {
      return 'bg-orange-500/90 text-white border-orange-600 animate-pulse-subtle';
    }
    return 'bg-green-500/20 text-green-700 border-green-500';
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
    if (available === 0) {
      return '❌ ÉPUISÉ';
    }
    if (available === 1) {
      return `⚠️ Dernier exemplaire (1/${total})`;
    }
    if (available <= 2) {
      return `⚠️ ${available}/${total} restants`;
    }
    return `${available}/${total} disponibles`;
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
