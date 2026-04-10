"use client";

import { Link } from "@/i18n/routing";
import { usePanierCheckout } from "./usePanierCheckout";
import PanierSuccess from "./PanierSuccess";
import PanierPending from "./PanierPending";
import PanierCanceled from "./PanierCanceled";
import PanierEmpty from "./PanierEmpty";
import PanierItemCard from "./PanierItemCard";
import PanierSummary from "./PanierSummary";

export default function PanierClient() {
  const {
    items,
    removeItem,
    clearCart,
    totalPrice,
    finalPrice,
    earlyAccess,
    discountAmount,
    needsKyc,
    identityVerified,
    loading,
    verifying,
    error,
    paymentStatus,
    daysUntilExpiration,
    engagementsAccepted,
    success,
    canceled,
    handleCheckout,
    handleVerifyIdentity,
  } = usePanierCheckout();

  // Post-checkout : vérification du paiement en cours
  if (success === "true") {
    if (paymentStatus === "loading") {
      return (
        <div className="text-center py-28 max-w-3xl mx-auto">
          <div className="text-6xl mb-8 animate-pulse">&#x23F3;</div>
          <h2 className="text-4xl font-light mb-6">Vérification du paiement...</h2>
        </div>
      );
    }

    if (paymentStatus === "pending") return <PanierPending />;
    return <PanierSuccess />;
  }

  if (canceled === "true") return <PanierCanceled />;
  if (items.length === 0) return <PanierEmpty />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-8 lg:gap-12">
        {/* Liste des produits */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-light">Votre panier ({items.length})</h2>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-muted-foreground hover:text-destructive transition-colors"
              >
                Vider le panier
              </button>
            )}
          </div>

          {items.map((item) => (
            <PanierItemCard
              key={`${item.id}-${item.format}`}
              item={item}
              onRemove={() => removeItem(`${item.id}-${item.format}`)}
            />
          ))}
        </div>

        <PanierSummary
          totalPrice={totalPrice}
          finalPrice={finalPrice}
          earlyAccess={earlyAccess}
          discountAmount={discountAmount}
          needsKyc={needsKyc}
          identityVerified={identityVerified}
          loading={loading}
          verifying={verifying}
          error={error}
          engagementsAccepted={engagementsAccepted}
          daysUntilExpiration={daysUntilExpiration}
          onCheckout={handleCheckout}
          onVerifyIdentity={handleVerifyIdentity}
        />
      </div>

      {/* Suggestions */}
      <div className="mt-12 sm:mt-20 border-t pt-12 sm:pt-20">
        <h3 className="text-2xl sm:text-3xl font-light mb-6 sm:mb-8">Vous pourriez aussi aimer</h3>
        <div className="text-center text-muted-foreground">
          <Link href="/boutique" className="hover:text-primary transition-colors">
            Découvrir d'autres œuvres &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
