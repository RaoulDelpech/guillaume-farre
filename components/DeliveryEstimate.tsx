'use client';

import { calculateDeliveryEstimate } from '@/lib/shipping/delivery-estimates';

interface DeliveryEstimateProps {
  countryCode?: string;
  variant?: 'compact' | 'detailed';
  className?: string;
}

export default function DeliveryEstimate({
  countryCode = 'FR',
  variant = 'compact',
  className = '',
}: DeliveryEstimateProps) {
  const estimate = calculateDeliveryEstimate(countryCode);

  // Format date pour affichage français
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
    });
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
        <span>📦</span>
        <span>
          Livraison estimée : <strong className="text-foreground">{estimate.label}</strong>
        </span>
      </div>
    );
  }

  // Variant détaillé
  return (
    <div className={`bg-muted/30 border border-border rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">📦</span>
        <div className="flex-1">
          <p className="font-medium text-foreground mb-2">Délai de livraison estimé</p>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>🎨</span>
              <span>
                Production : <strong className="text-foreground">{estimate.productionDays}</strong>
                {' '}(impression Fine Art Gelato)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span>🚚</span>
              <span>
                Expédition : <strong className="text-foreground">{estimate.shippingDays}</strong>
                {countryCode === 'FR' && ' (France métropolitaine)'}
              </span>
            </div>

            <div className="pt-2 border-t border-border mt-3">
              <p className="font-medium text-foreground">
                Réception estimée avant le{' '}
                <strong className="text-primary">{formatDate(estimate.estimatedDate)}</strong>
              </p>
              <p className="text-xs mt-1">
                ({estimate.label} à partir de la validation de votre commande)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Lalou
