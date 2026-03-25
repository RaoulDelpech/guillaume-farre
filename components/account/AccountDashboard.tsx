/**
 * Account Dashboard - Authenticated user view
 *
 * State B: Authenticated
 * Shows user orders and account information
 *
 * @author Lalou
 */

'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useRouter } from '@/i18n/routing';

interface Order {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: {
    title: string;
    format: string;
    frame: string;
    price: number;
  }[];
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
  certificateId?: string;
}

interface AccountDashboardProps {
  email: string;
}

export default function AccountDashboard({ email }: AccountDashboardProps) {
  const t = useTranslations('account');
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract first name from email or full name
  const getFirstName = (email: string, fullName?: string): string => {
    if (fullName) {
      return fullName.split(' ')[0];
    }
    return email.split('@')[0];
  };

  const firstName = getFirstName(email, orders[0]?.customerName);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/account/orders');

      if (response.status === 401) {
        // Not authenticated, reload page
        router.push('/compte');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(t('errors.loadFailed'));
      }
    } catch (err) {
      console.error('[Dashboard] Error loading orders:', err);
      setError(t('errors.network'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/account/logout', { method: 'POST' });
      router.push('/compte');
    } catch (err) {
      console.error('[Dashboard] Logout error:', err);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const badges = {
      pending: { label: t('status.pending'), color: 'bg-gray-100 text-gray-700' },
      paid: { label: t('status.paid'), color: 'bg-green-100 text-green-700' },
      processing: { label: t('status.processing'), color: 'bg-blue-100 text-blue-700' },
      shipped: { label: t('status.shipped'), color: 'bg-purple-100 text-purple-700' },
      delivered: { label: t('status.delivered'), color: 'bg-green-100 text-green-700' },
      problem: { label: t('status.problem'), color: 'bg-red-100 text-red-700' },
    };

    const badge = badges[status] || badges.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-2">
            {t('dashboard.greeting', { name: firstName })}
          </h1>
          <p className="text-muted-foreground text-sm">{email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
        >
          {t('dashboard.logout')}
        </button>
      </div>

      {/* Orders section */}
      <div>
        <h2 className="text-2xl font-light tracking-wide mb-6">
          {t('dashboard.ordersTitle')}
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('dashboard.loading')}</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground mb-4">{t('dashboard.noOrders')}</p>
            <Link
              href="/boutique"
              className="inline-block bg-foreground text-background px-6 py-2 rounded-lg hover:bg-foreground/90 transition-colors text-sm font-light"
            >
              {t('dashboard.browseShop')}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.orderNumber}
                className="border border-border rounded-lg p-6 hover:border-foreground/30 transition-colors"
              >
                {/* Order header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t('dashboard.orderNumber')}
                    </p>
                    <p className="font-medium">{order.orderNumber}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Order date */}
                <p className="text-sm text-muted-foreground mb-4">
                  {t('dashboard.orderDate', { date: formatDate(order.createdAt) })}
                </p>

                {/* Items list */}
                <div className="space-y-3 mb-4 pb-4 border-b border-border">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.format} · {item.frame}
                        </p>
                      </div>
                      <p className="font-medium">{item.price.toLocaleString('fr-FR')} €</p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-medium">{t('dashboard.total')}</p>
                  <p className="text-xl font-medium">
                    {order.totalAmount.toLocaleString('fr-FR')} €
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <Link
                    href={`/commande?order=${order.orderNumber}&email=${order.customerEmail}`}
                    className="flex-1 bg-foreground text-background text-center py-2 px-4 rounded-lg hover:bg-foreground/90 transition-colors text-sm font-light"
                  >
                    {t('dashboard.trackOrder')}
                  </Link>
                  {order.status === 'paid' && order.certificateId && (
                    <Link
                      href={`/api/orders/certificate?order=${order.orderNumber}&email=${order.customerEmail}`}
                      target="_blank"
                      className="flex-1 border border-border text-center py-2 px-4 rounded-lg hover:border-foreground/50 transition-colors text-sm font-light"
                    >
                      {t('dashboard.certificate')}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Lalou
