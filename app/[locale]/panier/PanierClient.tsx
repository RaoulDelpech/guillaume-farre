"use client";

import { useCart } from "@/contexts/CartContext";
import { Link } from "@/i18n/routing";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function PanierClient() {
  const { items, removeItem, clearCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  // Vider le panier après un paiement réussi
  useEffect(() => {
    if (success === 'true') {
      clearCart();
    }
  }, [success]);

  const handleCheckout = async () => {
    if (items.length === 0) return;

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

  // Page de confirmation après paiement réussi
  if (success === 'true') {
    return (
      <div className="text-center py-28 max-w-4xl mx-auto">
        <div className="text-6xl mb-8">✅</div>
        <h2 className="text-5xl font-light mb-6">Merci pour votre commande !</h2>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Votre paiement a été confirmé avec succès.
        </p>

        <div className="bg-card border border-border rounded-xl p-8 mb-12 text-left max-w-2xl mx-auto">
          <h3 className="text-2xl font-light mb-6">Prochaines étapes</h3>
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

  // Page panier annulé
  if (canceled === 'true') {
    return (
      <div className="text-center py-28 max-w-3xl mx-auto">
        <div className="text-6xl mb-8">⚠️</div>
        <h2 className="text-4xl font-light mb-6">Paiement annulé</h2>
        <p className="text-xl text-muted-foreground mb-12">
          Votre commande n'a pas été finalisée. Vos articles sont toujours dans votre panier.
        </p>
        <Link
          href="/panier"
          className="inline-block px-12 py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-lg transition-all"
        >
          Retour au panier
        </Link>
      </div>
    );
  }

  // Page panier vide (normal)
  if (items.length === 0) {
    return (
      <div className="text-center py-28 max-w-3xl mx-auto">
        <div className="text-6xl mb-8">🛒</div>
        <h2 className="text-4xl font-light mb-6">Votre panier est vide</h2>
        <p className="text-xl text-muted-foreground mb-12">
          Découvrez nos œuvres disponibles
        </p>
        <Link
          href="/boutique"
          className="inline-block px-12 py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-lg transition-all"
        >
          Voir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Liste des produits */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-light">Votre panier ({items.length})</h2>
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
              className="flex gap-6 p-6 bg-card border rounded-lg hover:border-primary/50 transition-colors"
            >
              {/* Image */}
              <div className="w-32 h-32 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Détails */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-light tracking-wide mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {item.category}
                </p>
                <div className="text-sm text-muted-foreground">
                  Format: <span className="text-foreground font-medium">{item.format}</span>
                </div>
              </div>

              {/* Prix et suppression */}
              <div className="flex flex-col items-end justify-between">
                <div className="text-2xl font-light">{item.price.toLocaleString('fr-FR')} €</div>
                <button
                  onClick={() => removeItem(`${item.id}-${item.format}`)}
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  Retirer
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé et checkout */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-lg p-8 sticky top-24">
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
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-light">
                  <span>Total</span>
                  <span>{totalPrice.toLocaleString('fr-FR')} €</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full px-12 py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
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
                'Procéder au paiement'
              )}
            </button>

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
      <div className="mt-20 border-t pt-20">
        <h3 className="text-3xl font-light mb-8">Vous pourriez aussi aimer</h3>
        <div className="text-center text-muted-foreground">
          <Link href="/boutique" className="hover:text-primary transition-colors">
            Découvrir d'autres œuvres →
          </Link>
        </div>
      </div>
    </div>
  );
}
