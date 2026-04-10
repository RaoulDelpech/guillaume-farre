"use client";

import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import type { Order } from './types';
import { formatDate, isStepComplete } from './types';

interface OrderTimelineProps {
  order: Order;
}

export default function OrderTimeline({ order }: OrderTimelineProps) {
  const steps = [
    {
      key: 'paid' as const,
      icon: CheckCircle,
      label: 'Paiement reçu',
      date: order.paidAt,
      bgActive: 'bg-green-100', colorActive: 'text-green-600',
    },
    {
      key: 'processing' as const,
      icon: Package,
      label: 'Impression en cours',
      subtitle: "Impression Fine Art 12 couleurs sur papier d'art",
      bgActive: 'bg-yellow-100', colorActive: 'text-yellow-600',
    },
    {
      key: 'shipped' as const,
      icon: Truck,
      label: 'Expédition',
      date: order.shippedAt ? `Expédiée le ${formatDate(order.shippedAt)}` : undefined,
      bgActive: 'bg-purple-100', colorActive: 'text-purple-600',
    },
    {
      key: 'delivered' as const,
      icon: Home,
      label: 'Livraison',
      date: order.deliveredAt ? `Livrée le ${formatDate(order.deliveredAt)}` : undefined,
      subtitle: !order.deliveredAt ? 'Estimée 2-3 jours ouvrés après expédition' : undefined,
      bgActive: 'bg-green-100', colorActive: 'text-green-600',
      isLast: true,
    },
  ];

  return (
    <div className="space-y-8 mb-8">
      {steps.map((step) => {
        const complete = isStepComplete(order, step.key);
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                complete ? step.bgActive : 'bg-zinc-100'
              }`}>
                <Icon className={`w-6 h-6 ${complete ? step.colorActive : 'text-zinc-400'}`} />
              </div>
              {!step.isLast && <div className="w-0.5 h-16 bg-zinc-200 my-2" />}
            </div>
            <div className="flex-1 pt-1">
              <h3 className={`text-lg font-medium ${complete ? 'text-zinc-900' : 'text-zinc-400'}`}>
                {step.label}
              </h3>
              {step.date && <p className="text-sm text-zinc-600 mt-1">{step.date}</p>}
              {step.subtitle && <p className="text-sm text-zinc-600 mt-1">{step.subtitle}</p>}

              {/* Tracking info for shipped step */}
              {step.key === 'shipped' && order.trackingNumber && (
                <div className="mt-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm font-medium text-purple-900 mb-2">Informations de suivi</p>
                  <div className="space-y-1 text-sm text-purple-800">
                    {order.carrier && <p><span className="font-medium">Transporteur:</span> {order.carrier}</p>}
                    <p><span className="font-medium">Numéro de suivi:</span> {order.trackingNumber}</p>
                  </div>
                  {order.trackingUrl && (
                    <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-block mt-3 text-sm font-medium text-purple-600 hover:text-purple-700 underline">
                      Suivre mon colis en temps réel →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Lalou
