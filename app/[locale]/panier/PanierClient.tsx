"use client";

import { useCart } from "@/contexts/CartContext";
import { Link } from "@/i18n/routing";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { isEarlyAccess, EARLY_ACCESS_DISCOUNT } from "@/lib/early-access";
import { trackBeginCheckout, trackPurchase } from "@/lib/analytics";

// Seuil KYC (obligation LCB-FT pour vente d'art)
const KYC_THRESHOLD = 10_000;

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function PanierClient() {
  const { items, removeItem, clearCart, totalPrice, daysUntilExpiration, engagementsAccepted } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'paid' | 'pending' | null>(null);
  const [identityVerified, setIdentityVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [earlyAccess, setEarlyAccess] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');
  const sessionId = searchParams.get('session_id');

  // Vérifier si en mode early access
  useEffect(() => {
    setEarlyAccess(isEarlyAccess());
  }, []);

  // Calculer le prix avec la réduction Early Collector si applicable
  const discountAmount = earlyAccess ? totalPrice * EARLY_ACCESS_DISCOUNT : 0;
  const finalPrice = totalPrice - discountAmount;

  const needsKyc = finalPrice >= KYC_THRESHOLD;

  // Après checkout Stripe : vérifier si c'est un paiement immédiat (CB) ou en attente (virement)
  useEffect(() => {
    if (success === 'true') {
      // Sauvegarder les items avant de vider le panier pour le tracking
      const itemsForTracking = [...items];
      const totalForTracking = finalPrice;

      clearCart();

      if (sessionId) {
        setPaymentStatus('loading');
        fetch(`/api/stripe/session-status?session_id=${sessionId}`)
          .then(res => res.json())
          .then(data => {
            // 'paid' = CB/Alma (immédiat), 'unpaid' = virement SEPA (en attente)
            const isPaid = data.payment_status === 'paid';
            setPaymentStatus(isPaid ? 'paid' : 'pending');

            // GA4 tracking - Purchase (seulement si paiement immédiat)
            if (isPaid && itemsForTracking.length > 0) {
              trackPurchase(
                sessionId,
                itemsForTracking.map((item) => ({
                  id: item.id,
                  name: item.title,
                  price: item.price,
                  quantity: 1,
                  category: item.category,
                })),
                totalForTracking
              );
            }
          })
          .catch(() => {
            // En cas d'erreur, afficher la page de succès par défaut
            setPaymentStatus('paid');
          });
      } else {
        setPaymentStatus('paid');
      }
    }
  }, [success, sessionId]);

  // Vérification d'identité Stripe Identity (KYC) pour commandes > 10K EUR
  const handleVerifyIdentity = async () => {
    setVerifying(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe non disponible');

      // Créer une session de vérification côté serveur
      const response = await fetch('/api/stripe/identity', { method: 'POST' });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Erreur de vérification');

      // Ouvrir le modal Stripe Identity
      const { error: verifyError } = await stripe.verifyIdentity(data.clientSecret);

      if (verifyError) {
        if (verifyError.code === 'session_cancelled') {
          // L'utilisateur a fermé le modal, pas une erreur
          return;
        }
        throw new Error(verifyError.message);
      }

      // Vérification terminée avec succès
      setIdentityVerified(true);
    } catch (err: any) {
      console.error('[Panier] Erreur vérification identité:', err);
      setError(err.message || 'Erreur lors de la vérification d\'identité');
    } finally {
      setVerifying(false);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    // Rediriger vers la page d'engagements si early access et pas encore accepté
    if (isEarlyAccess() && !engagementsAccepted) {
      router.push(`/${locale}/engagements`);
      return;
    }

    // GA4 tracking - Begin checkout
    trackBeginCheckout(
      items.map((item) => ({
        id: item.id,
        name: item.title,
        price: item.price,
        quantity: 1,
        category: item.category,
      })),
      finalPrice
    );

    setLoading(true);
    setError(null);

    try {
      // Préparer les items pour Stripe
      const stripeItems = items.map((item) => ({
        title: item.title,
        price: item.price,
        category: item.category,
        images: [item.image],
        photoPath: item.photoPath,
        format: item.format || 'A2',
        material: item.material || 'semi-glossy',
        orientation: item.orientation || 'vertical',
        frame: item.frame || 'none',
      }));

      console.log('[Panier] Items du panier:', items);
      console.log('[Panier] Items pour Stripe:', stripeItems);

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: stripeItems, locale }),
      });

      console.log('[Panier] Response status:', response.status);
      const data = await response.json();
      console.log('[Panier] Response data:', data);

      if (!response.ok) {
        // Erreur API (400, 500, etc.)
        console.error('[Panier] Erreur API:', data);
        throw new Error(data.error || 'Erreur lors de la création de la session de paiement');
      }

      if (data.url) {
        // Succès - rediriger vers Stripe Checkout
        console.log('[Panier] Redirection vers Stripe:', data.url);
        window.location.href = data.url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (err: any) {
      console.error('[Panier] Erreur checkout:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Page post-checkout : adapte le message selon le statut de paiement
  if (success === 'true') {
    // Chargement du statut en cours
    if (paymentStatus === 'loading') {
      return (
        <div className="text-center py-28 max-w-3xl mx-auto">
          <div className="text-6xl mb-8 animate-pulse">⏳</div>
          <h2 className="text-4xl font-light mb-6">Vérification du paiement...</h2>
        </div>
      );
    }

    // Virement SEPA — commande reservee, paiement en attente
    if (paymentStatus === 'pending') {
      return (
        <div className="text-center py-16 sm:py-28 max-w-4xl mx-auto px-4">
          <div className="text-5xl sm:text-6xl mb-6 sm:mb-8">🏦</div>
          <h2 className="text-3xl sm:text-5xl font-light mb-4 sm:mb-6">Commande reservee</h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
            Votre virement est en cours de traitement. Les oeuvres sont reservees a votre nom.
          </p>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 sm:p-8 mb-8 sm:mb-12 text-left max-w-2xl mx-auto">
            <h3 className="text-2xl font-light mb-6 text-blue-900 dark:text-blue-100">Prochaines étapes</h3>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏦</span>
                <div>
                  <p className="font-medium text-foreground">Virement en cours</p>
                  <p className="text-sm">Votre virement sera traité sous 1 à 2 jours ouvrés.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="font-medium text-foreground">Confirmation automatique</p>
                  <p className="text-sm">Vous recevrez un email dès réception du paiement.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <p className="font-medium text-foreground">Production de votre œuvre</p>
                  <p className="text-sm">L'impression Fine Art démarrera immédiatement après réception du virement.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <p className="font-medium text-foreground">Expédition sécurisée</p>
                  <p className="text-sm">Livraison assurée sous 2-4 jours (France métropolitaine)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-block px-12 py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-lg transition-all"
            >
              Retour à l'accueil
            </Link>
            <Link
              href="/boutique"
              className="inline-block px-12 py-5 border-2 border-border hover:border-primary text-foreground font-light tracking-wide rounded-lg text-lg transition-all"
            >
              Continuer mes achats
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-12">
            Une question ? Contactez-nous à <a href="mailto:contact@guillaumefarre.com" className="underline hover:text-primary">contact@guillaumefarre.com</a>
          </p>
        </div>
      );
    }

    // CB / Alma — paiement confirme immediatement
    return (
      <div className="text-center py-16 sm:py-28 max-w-4xl mx-auto px-4">
        <div className="text-5xl sm:text-6xl mb-6 sm:mb-8">✅</div>
        <h2 className="text-3xl sm:text-5xl font-light mb-4 sm:mb-6">Merci pour votre commande !</h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
          Votre paiement a ete confirme avec succes.
        </p>

        <div className="bg-card border border-border rounded-xl p-4 sm:p-8 mb-8 sm:mb-12 text-left max-w-2xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-light mb-4 sm:mb-6">Prochaines etapes</h3>
          <div className="space-y-4 text-muted-foreground">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📧</span>
              <div>
                <p className="font-medium text-foreground">Confirmation par email</p>
                <p className="text-sm">Vous allez recevoir un email de confirmation avec le récapitulatif de votre commande et votre facture.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎨</span>
              <div>
                <p className="font-medium text-foreground">Production de votre œuvre</p>
                <p className="text-sm">Impression Fine Art professionnelle (3-5 jours ouvrés)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📦</span>
              <div>
                <p className="font-medium text-foreground">Expédition sécurisée</p>
                <p className="text-sm">Livraison assurée sous 2-4 jours (France métropolitaine)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✍️</span>
              <div>
                <p className="font-medium text-foreground">Certificat d'authenticité</p>
                <p className="text-sm">Signé par Guillaume Farré, inclus avec votre tirage</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-block px-12 py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-lg transition-all"
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/boutique"
            className="inline-block px-12 py-5 border-2 border-border hover:border-primary text-foreground font-light tracking-wide rounded-lg text-lg transition-all"
          >
            Continuer mes achats
          </Link>
        </div>

        <p className="text-sm text-muted-foreground mt-12">
          Une question ? Contactez-nous à <a href="mailto:contact@guillaumefarre.com" className="underline hover:text-primary">contact@guillaumefarre.com</a>
        </p>
      </div>
    );
  }

  // Page panier annule
  if (canceled === 'true') {
    return (
      <div className="text-center py-16 sm:py-28 max-w-3xl mx-auto px-4">
        <div className="text-5xl sm:text-6xl mb-6 sm:mb-8">⚠️</div>
        <h2 className="text-3xl sm:text-4xl font-light mb-4 sm:mb-6">Paiement annule</h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12">
          Votre commande n'a pas ete finalisee. Vos articles sont toujours dans votre panier.
        </p>
        <Link
          href="/panier"
          className="inline-block px-8 sm:px-12 py-4 sm:py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-base sm:text-lg transition-all min-h-[48px]"
        >
          Retour au panier
        </Link>
      </div>
    );
  }

  // Page panier vide (normal)
  if (items.length === 0) {
    return (
      <div className="text-center py-16 sm:py-28 max-w-3xl mx-auto px-4">
        <div className="text-5xl sm:text-6xl mb-6 sm:mb-8">🛒</div>
        <h2 className="text-3xl sm:text-4xl font-light mb-4 sm:mb-6">Votre panier est vide</h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12">
          Decouvrez nos oeuvres disponibles
        </p>
        <Link
          href="/boutique"
          className="inline-block px-8 sm:px-12 py-4 sm:py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-base sm:text-lg transition-all min-h-[48px]"
        >
          Voir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-0">
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
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
            <div
              key={`${item.id}-${item.format}`}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 bg-card border rounded-lg hover:border-primary/50 transition-colors"
            >
              {/* Image */}
              <div className="w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details + Prix */}
              <div className="flex-1 min-w-0 flex flex-row sm:flex-col justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-light tracking-wide mb-1 sm:mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1 sm:mb-3">
                    {item.category}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    Format: <span className="text-foreground font-medium">{item.format}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <div className="text-xl sm:text-2xl font-light">{item.price.toLocaleString('fr-FR')} €</div>
                  <button
                    onClick={() => removeItem(`${item.id}-${item.format}`)}
                    className="text-sm text-muted-foreground hover:text-destructive transition-colors min-h-[44px] flex items-center"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resume et checkout */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-lg p-4 sm:p-8 sticky top-24">
            {/* Indicateur panier persistant */}
            {daysUntilExpiration !== null && (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>🕐</span>
                  <span>
                    Panier conservé {daysUntilExpiration === 30 ? '' : `encore `}
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

              {/* Privilège Early Collector - Réduction -25% */}
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

            {/* Section Alma - Paiement 3x/4x sans frais */}
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

            {/* Section Virement bancaire — pour montants >= 1000€ */}
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

            {/* Section KYC — vérification d'identité pour montants >= 10 000€ */}
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
                        <p className="font-medium text-green-900 dark:text-green-100 mb-1">
                          Identité vérifiée
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Votre vérification d'identité a été validée. Vous pouvez procéder au paiement.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                          Vérification d'identité requise
                        </p>
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

            {/* Bouton principal : KYC si nécessaire, sinon checkout */}
            {needsKyc && !identityVerified ? (
              <button
                onClick={handleVerifyIdentity}
                disabled={verifying}
                className="w-full px-6 sm:px-12 py-4 sm:py-5 bg-amber-600 hover:bg-amber-700 text-white font-light tracking-wide rounded-lg text-base sm:text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4 min-h-[48px]"
              >
                {verifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Vérification en cours...
                  </span>
                ) : (
                  'Vérifier mon identité'
                )}
              </button>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full px-6 sm:px-12 py-4 sm:py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-base sm:text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4 min-h-[48px]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Chargement...
                  </span>
                ) : (
                  earlyAccess ? 'Réserver l\'œuvre' : 'Procéder au paiement'
                )}
              </button>
            )}

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span>✓</span>
                <span>Paiement sécurisé par Stripe</span>
              </div>
              <div className="flex items-start gap-2">
                <span>✓</span>
                <span>Certificat d'authenticité inclus</span>
              </div>
              <div className="flex items-start gap-2">
                <span>✓</span>
                <span>Livraison assurée offerte</span>
              </div>
              <div className="flex items-start gap-2">
                <span>✓</span>
                <span>Retour 14 jours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="mt-12 sm:mt-20 border-t pt-12 sm:pt-20">
        <h3 className="text-2xl sm:text-3xl font-light mb-6 sm:mb-8">Vous pourriez aussi aimer</h3>
        <div className="text-center text-muted-foreground">
          <Link href="/boutique" className="hover:text-primary transition-colors">
            Découvrir d'autres œuvres →
          </Link>
        </div>
      </div>
    </div>
  );
}
