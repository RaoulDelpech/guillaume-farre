export interface OrderItem {
  title: string;
  format: string;
  frame: string;
  price: number;
}

export interface Order {
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

export const STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'En attente',
  paid: 'Paiement reçu',
  processing: "En cours d'impression",
  shipped: 'Expédiée',
  delivered: 'Livrée',
  problem: 'Problème technique',
};

export const STATUS_COLORS: Record<Order['status'], string> = {
  pending: 'text-zinc-500',
  paid: 'text-blue-600',
  processing: 'text-yellow-600',
  shipped: 'text-purple-600',
  delivered: 'text-green-600',
  problem: 'text-red-600',
};

export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function isStepComplete(order: Order, step: Order['status']): boolean {
  const steps: Order['status'][] = ['paid', 'processing', 'shipped', 'delivered'];
  return steps.indexOf(step) <= steps.indexOf(order.status);
}

// Lalou
