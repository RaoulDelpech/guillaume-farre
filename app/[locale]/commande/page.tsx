/**
 * Page suivi de commande
 *
 * Permet au client de suivre sa commande en entrant:
 * - Numéro de commande (GF-XXXXXX)
 * - Email
 *
 * Affiche timeline visuelle du statut
 *
 * @author Lalou
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Package, Mail, CheckCircle, Truck, Home, AlertCircle, Search, FileText } from 'lucide-react';

interface OrderItem {
  title: string;
  format: string;
  frame: string;
  price: number;
}

interface Order {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'problem';
  createdAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  isEarlyCollector?: boolean;
}

export default function CommandePage() {
  const t = useTranslations();

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

  const getStatusLabel = (status: Order['status']) => {
    const labels = {
      pending: 'En attente',
      paid: 'Paiement reçu',
      processing: 'En cours d\'impression',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      problem: 'Problème technique',
    };
    return labels[status];
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'text-zinc-500',
      paid: 'text-blue-600',
      processing: 'text-yellow-600',
      shipped: 'text-purple-600',
      delivered: 'text-green-600',
      problem: 'text-red-600',
    };
    return colors[status];
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isStepComplete = (step: Order['status']) => {
    if (!order) return false;
    const steps: Order['status'][] = ['paid', 'processing', 'shipped', 'delivered'];
    const currentIndex = steps.indexOf(order.status);
    const stepIndex = steps.indexOf(step);
    return stepIndex <= currentIndex;
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-zinc-900 mb-4">
            Suivre ma commande
          </h1>
          <p className="text-lg text-zinc-600">
            Entrez votre numéro de commande et email pour suivre votre livraison
          </p>
        </div>

        {/* Formulaire recherche */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-zinc-700 mb-2">
                Numéro de commande
              </label>
              <input
                id="orderNumber"
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                placeholder="GF-123456789"
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                required
              />
              <p className="mt-2 text-sm text-zinc-500">
                Format: GF-XXXXXXXXX (trouvé dans votre email de confirmation)
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 text-white py-3 px-6 rounded-lg hover:bg-zinc-800 transition-colors disabled:bg-zinc-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
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

        {/* Résultat: Timeline commande */}
        {order && (
          <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-8">
            {/* En-tête commande */}
            <div className="pb-6 border-b border-zinc-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-light text-zinc-900">
                  Commande {order.orderNumber}
                </h2>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)} bg-opacity-10`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <p className="text-zinc-600">
                Commandée le {formatDate(order.createdAt)}
              </p>
            </div>

            {/* Timeline */}
            <div className="space-y-8 mb-8">
              {/* Étape 1: Paiement */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isStepComplete('paid') ? 'bg-green-100' : 'bg-zinc-100'
                  }`}>
                    <CheckCircle className={`w-6 h-6 ${
                      isStepComplete('paid') ? 'text-green-600' : 'text-zinc-400'
                    }`} />
                  </div>
                  {order.status !== 'paid' && (
                    <div className="w-0.5 h-16 bg-zinc-200 my-2" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className={`text-lg font-medium ${
                    isStepComplete('paid') ? 'text-zinc-900' : 'text-zinc-400'
                  }`}>
                    Paiement reçu
                  </h3>
                  {order.paidAt && (
                    <p className="text-sm text-zinc-600 mt-1">
                      {formatDate(order.paidAt)}
                    </p>
                  )}
                </div>
              </div>

              {/* Étape 2: Impression */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isStepComplete('processing') ? 'bg-yellow-100' : 'bg-zinc-100'
                  }`}>
                    <Package className={`w-6 h-6 ${
                      isStepComplete('processing') ? 'text-yellow-600' : 'text-zinc-400'
                    }`} />
                  </div>
                  {order.status !== 'processing' && order.status !== 'paid' && (
                    <div className="w-0.5 h-16 bg-zinc-200 my-2" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className={`text-lg font-medium ${
                    isStepComplete('processing') ? 'text-zinc-900' : 'text-zinc-400'
                  }`}>
                    Impression en cours
                  </h3>
                  <p className="text-sm text-zinc-600 mt-1">
                    Impression Fine Art 12 couleurs sur papier d'art
                  </p>
                </div>
              </div>

              {/* Étape 3: Expédition */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isStepComplete('shipped') ? 'bg-purple-100' : 'bg-zinc-100'
                  }`}>
                    <Truck className={`w-6 h-6 ${
                      isStepComplete('shipped') ? 'text-purple-600' : 'text-zinc-400'
                    }`} />
                  </div>
                  {order.status !== 'shipped' && (
                    <div className="w-0.5 h-16 bg-zinc-200 my-2" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className={`text-lg font-medium ${
                    isStepComplete('shipped') ? 'text-zinc-900' : 'text-zinc-400'
                  }`}>
                    Expédition
                  </h3>
                  {order.shippedAt && (
                    <p className="text-sm text-zinc-600 mt-1">
                      Expédiée le {formatDate(order.shippedAt)}
                    </p>
                  )}
                  {order.trackingNumber && (
                    <div className="mt-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-sm font-medium text-purple-900 mb-2">
                        Informations de suivi
                      </p>
                      <div className="space-y-1 text-sm text-purple-800">
                        {order.carrier && (
                          <p><span className="font-medium">Transporteur:</span> {order.carrier}</p>
                        )}
                        <p><span className="font-medium">Numéro de suivi:</span> {order.trackingNumber}</p>
                      </div>
                      {order.trackingUrl && (
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-3 text-sm font-medium text-purple-600 hover:text-purple-700 underline"
                        >
                          Suivre mon colis en temps réel →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Étape 4: Livraison */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isStepComplete('delivered') ? 'bg-green-100' : 'bg-zinc-100'
                  }`}>
                    <Home className={`w-6 h-6 ${
                      isStepComplete('delivered') ? 'text-green-600' : 'text-zinc-400'
                    }`} />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className={`text-lg font-medium ${
                    isStepComplete('delivered') ? 'text-zinc-900' : 'text-zinc-400'
                  }`}>
                    Livraison
                  </h3>
                  {order.deliveredAt ? (
                    <p className="text-sm text-zinc-600 mt-1">
                      Livrée le {formatDate(order.deliveredAt)}
                    </p>
                  ) : (
                    <p className="text-sm text-zinc-600 mt-1">
                      Estimée 2-3 jours ouvrés après expédition
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Certificat d'authenticité */}
            {(order.status === 'paid' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') && (
              <div className="pt-8 border-t border-zinc-200">
                <a
                  href={`/api/orders/certificate?order=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(order.customerEmail)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  Télécharger le certificat d'authenticité
                </a>
                <p className="mt-2 text-sm text-zinc-600">
                  Certificat officiel signé par l'artiste, attestant l'authenticité de votre œuvre
                </p>
              </div>
            )}

            {/* Récapitulatif commande */}
            <div className="pt-8 border-t border-zinc-200">
              <h3 className="text-lg font-medium text-zinc-900 mb-4">
                Contenu de la commande
              </h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-zinc-900">{item.title}</p>
                      <p className="text-sm text-zinc-600">
                        Format {item.format} · {item.frame}
                      </p>
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
                <p className="text-sm font-medium text-amber-900">
                  🎭 Early Collector
                </p>
                <p className="text-sm text-amber-800 mt-1">
                  Vous serez convié en tant qu'hôte d'honneur à la première exposition de Guillaume Farré
                </p>
              </div>
            )}

            {/* Contact support */}
            <div className="mt-8 pt-6 border-t border-zinc-200">
              <p className="text-sm text-zinc-600 text-center">
                Une question sur votre commande ?{' '}
                <a href="mailto:contact@guillaumefarre.com" className="text-zinc-900 underline hover:no-underline">
                  Contactez-nous
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Lalou
