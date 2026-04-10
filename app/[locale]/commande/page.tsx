/**
 * Page suivi de commande
 *
 * Permet au client de suivre sa commande en entrant:
 * - Numéro de commande (GF-XXXXXX)
 * - Email
 *
 * @author Lalou
 */

'use client';

import { useState } from 'react';
import { AlertCircle, Search, FileText } from 'lucide-react';
import type { Order } from './types';
import { STATUS_LABELS, STATUS_COLORS, formatDate } from './types';
import OrderTimeline from './OrderTimeline';

export default function CommandePage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<Order | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setLoading(true);

    try {
      const response = await fetch(
        `/api/orders/track?order=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError('Commande introuvable. Vérifiez votre numéro de commande et votre email.');
        } else {
          setError('Une erreur est survenue. Veuillez réessayer.');
        }
        return;
      }

      const data = await response.json();
      setOrder(data.order);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error('Erreur recherche commande:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-4xl font-light text-foreground mb-4">Suivre ma commande</h1>
          <p className="text-lg text-muted-foreground">Entrez votre numéro de commande et email pour suivre votre livraison</p>
        </div>

        {/* Formulaire recherche */}
        <div className="bg-background rounded-lg shadow-sm border border-border p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-muted-foreground mb-2">Numéro de commande</label>
              <input id="orderNumber" type="text" value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                placeholder="GF-123456789"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-foreground focus:border-transparent min-h-[44px]"
                required />
              <p className="mt-2 text-sm text-muted-foreground">Format: GF-XXXXXXXXX (trouvé dans votre email de confirmation)</p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
              <input id="email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-foreground focus:border-transparent min-h-[44px]"
                required />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-foreground text-background py-3 px-6 rounded-lg hover:bg-foreground/90 transition-colors disabled:bg-muted disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px]">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Recherche en cours...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Rechercher ma commande
                </>
              )}
            </button>
          </form>
        </div>

        {/* Résultat: détails commande */}
        {order && (
          <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-8">
            {/* En-tête commande */}
            <div className="pb-6 border-b border-zinc-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-light text-zinc-900">Commande {order.orderNumber}</h2>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${STATUS_COLORS[order.status]} bg-opacity-10`}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
              <p className="text-zinc-600">Commandée le {formatDate(order.createdAt)}</p>
            </div>

            {/* Timeline */}
            <OrderTimeline order={order} />

            {/* Certificat d'authenticité */}
            {(order.status === 'paid' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') && (
              <div className="pt-8 border-t border-zinc-200">
                <a href={`/api/orders/certificate?order=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(order.customerEmail)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors">
                  <FileText className="w-5 h-5" />
                  Télécharger le certificat d'authenticité
                </a>
                <p className="mt-2 text-sm text-zinc-600">Certificat officiel signé par l'artiste, attestant l'authenticité de votre œuvre</p>
              </div>
            )}

            {/* Récapitulatif commande */}
            <div className="pt-8 border-t border-zinc-200">
              <h3 className="text-lg font-medium text-zinc-900 mb-4">Contenu de la commande</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-zinc-900">{item.title}</p>
                      <p className="text-sm text-zinc-600">Format {item.format} · {item.frame}</p>
                    </div>
                    <p className="font-medium text-zinc-900">{item.price}€</p>
                  </div>
                ))}
                <div className="pt-3 border-t border-zinc-200 flex justify-between items-center">
                  <p className="text-lg font-medium text-zinc-900">Total</p>
                  <p className="text-xl font-medium text-zinc-900">{order.totalAmount}€</p>
                </div>
              </div>
            </div>

            {/* Badge Early Collector */}
            {order.isEarlyCollector && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-medium text-amber-900">Early Collector</p>
                <p className="text-sm text-amber-800 mt-1">Vous serez convié en tant qu'hôte d'honneur à la première exposition de Guillaume Farré</p>
              </div>
            )}

            {/* Contact support */}
            <div className="mt-8 pt-6 border-t border-zinc-200">
              <p className="text-sm text-zinc-600 text-center">
                Une question sur votre commande ?{' '}
                <a href="mailto:contact@guillaumefarre.com" className="text-zinc-900 underline hover:no-underline">Contactez-nous</a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Lalou
