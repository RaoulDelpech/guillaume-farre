interface PanierSummaryProps {
  totalPrice: number;
  finalPrice: number;
  earlyAccess: boolean;
  discountAmount: number;
  needsKyc: boolean;
  identityVerified: boolean;
  loading: boolean;
  verifying: boolean;
  error: string | null;
  engagementsAccepted: boolean;
  daysUntilExpiration: number | null;
  onCheckout: () => void;
  onVerifyIdentity: () => void;
}

const KYC_THRESHOLD = 10_000;

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

export default function PanierSummary({
  totalPrice,
  finalPrice,
  earlyAccess,
  discountAmount,
  needsKyc,
  identityVerified,
  loading,
  verifying,
  error,
  daysUntilExpiration,
  onCheckout,
  onVerifyIdentity,
}: PanierSummaryProps) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-card border rounded-lg p-4 sm:p-8 sticky top-24">
        {/* Cart expiration indicator */}
        {daysUntilExpiration !== null && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>🕐</span>
              <span>
                Panier conservé {daysUntilExpiration === 30 ? '' : 'encore '}
                <strong className="text-foreground">{daysUntilExpiration} jours</strong>
              </span>
            </div>
          </div>
        )}
        <h3 className="text-xl font-light mb-6">Résumé de la commande</h3>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sous-total</span>
            <span>{totalPrice.toLocaleString('fr-FR')} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Livraison</span>
            <span className="text-green-600 font-medium">Offerte</span>
          </div>

          {earlyAccess && (
            <div className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4 my-4">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg">⭐</span>
                <div className="flex-1">
                  <p className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                    Privilège Early Collector
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    En tant que visiteur avant l'ouverture officielle, vous bénéficiez d'une réduction exclusive.
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-base font-medium text-amber-900 dark:text-amber-100">
                <span>Réduction -25%</span>
                <span>-{discountAmount.toLocaleString('fr-FR')} €</span>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex justify-between text-xl font-light">
              <span>Total</span>
              <span>{finalPrice.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
        </div>

        {/* Alma 3x/4x */}
        {finalPrice >= 100 && (
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💳</span>
              <div>
                <p className="font-medium text-green-900 dark:text-green-100 mb-1">
                  Paiement en 3x ou 4x sans frais
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                  Payez en plusieurs fois via Alma, sans frais supplémentaires
                </p>
                <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
                  {finalPrice >= 100 && finalPrice < 300 && (
                    <p>• 3x {Math.round(finalPrice / 3)}€/mois</p>
                  )}
                  {finalPrice >= 300 && (
                    <>
                      <p>• 3x {Math.round(finalPrice / 3)}€/mois</p>
                      <p>• 4x {Math.round(finalPrice / 4)}€/mois</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bank transfer */}
        {finalPrice >= 1000 && (
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🏦</span>
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Virement bancaire disponible
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">
                  Pour les montants importants, payez par virement SEPA. Les coordonnées bancaires vous seront communiquées après validation.
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Frais réduits · Délai : 1-2 jours ouvrés
                </p>
              </div>
            </div>
          </div>
        )}

        {/* KYC */}
        {needsKyc && (
          <div className={`border rounded-lg p-4 mb-6 ${
            identityVerified
              ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
              : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{identityVerified ? '✅' : '🪪'}</span>
              <div>
                {identityVerified ? (
                  <>
                    <p className="font-medium text-green-900 dark:text-green-100 mb-1">Identité vérifiée</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Votre vérification d'identité a été validée. Vous pouvez procéder au paiement.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-amber-900 dark:text-amber-100 mb-1">Vérification d'identité requise</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mb-1">
                      Pour les achats supérieurs à {KYC_THRESHOLD.toLocaleString('fr-FR')} €, une vérification d'identité est requise conformément à la réglementation.
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Rapide et sécurisé · Pièce d'identité + selfie · Données traitées par Stripe
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Main CTA */}
        {needsKyc && !identityVerified ? (
          <button
            onClick={onVerifyIdentity}
            disabled={verifying}
            className="w-full px-6 sm:px-12 py-4 sm:py-5 bg-amber-600 hover:bg-amber-700 text-white font-light tracking-wide rounded-lg text-base sm:text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4 min-h-[48px]"
          >
            {verifying ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner />
                Vérification en cours...
              </span>
            ) : (
              'Vérifier mon identité'
            )}
          </button>
        ) : (
          <button
            onClick={onCheckout}
            disabled={loading}
            className="w-full px-6 sm:px-12 py-4 sm:py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-base sm:text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4 min-h-[48px] flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner />
                Chargement...
              </span>
            ) : (
              earlyAccess ? 'Réserver l\'œuvre' : 'Procéder au paiement'
            )}
          </button>
        )}

        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2"><span>✓</span><span>Paiement sécurisé par Stripe</span></div>
          <div className="flex items-start gap-2"><span>✓</span><span>Certificat d'authenticité inclus</span></div>
          <div className="flex items-start gap-2"><span>✓</span><span>Livraison assurée offerte</span></div>
          <div className="flex items-start gap-2"><span>✓</span><span>Retour 14 jours</span></div>
        </div>
      </div>
    </div>
  );
}
