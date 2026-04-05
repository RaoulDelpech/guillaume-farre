/**
 * Système de gestion des commandes
 *
 * Stockage simple dans data/orders.json
 * Read/write lock pattern pour éviter races
 *
 * @author Lalou
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * Interface commande complète
 */
export interface Order {
  orderNumber: string;          // Format GF-XXXXXX
  stripeSessionId: string;       // ID Stripe session (ou Invoice ID pour toiles)
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
  type?: 'photo' | 'canvas';     // Type commande (photo ou toile)
  createdAt: string;             // ISO date
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  gelatoOrderId?: string;
  isEarlyCollector?: boolean;
  certificateId?: string;        // ID unique du certificat (CERT-GF-XXXXXX-timestamp)
}

/**
 * Chemin fichier JSON
 */
const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

/**
 * Mutex simple pour éviter races
 */
let writeLock: Promise<void> = Promise.resolve();

/**
 * Lire toutes les commandes depuis le fichier JSON
 */
async function readOrders(): Promise<Order[]> {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    // Si fichier n'existe pas, retourner tableau vide
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('[Orders] Erreur lecture fichier:', error);
    throw error;
  }
}

/**
 * Écrire toutes les commandes dans le fichier JSON
 */
async function writeOrders(orders: Order[]): Promise<void> {
  // Attendre que le lock précédent soit libéré
  await writeLock;

  // Créer un nouveau lock
  writeLock = (async () => {
    try {
      // Créer répertoire data s'il n'existe pas
      const dataDir = path.dirname(ORDERS_FILE);
      await fs.mkdir(dataDir, { recursive: true });

      // Écrire fichier avec formatage lisible
      await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
    } catch (error) {
      console.error('[Orders] Erreur écriture fichier:', error);
      throw error;
    }
  })();

  await writeLock;
}

/**
 * Générer un numéro de commande unique (format GF-XXXXXX)
 */
function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `GF-${timestamp}${random}`;
}

/**
 * Récupérer une commande par son numéro
 */
export async function getOrder(orderNumber: string): Promise<Order | null> {
  const orders = await readOrders();
  return orders.find(o => o.orderNumber === orderNumber) || null;
}

/**
 * Récupérer une commande par l'ID de session Stripe
 */
export async function getOrderByStripeSession(sessionId: string): Promise<Order | null> {
  const orders = await readOrders();
  return orders.find(o => o.stripeSessionId === sessionId) || null;
}

/**
 * Créer une nouvelle commande
 */
export async function createOrder(data: Partial<Order>): Promise<Order> {
  const orders = await readOrders();

  // Vérifier si commande existe déjà (via Stripe session ID)
  if (data.stripeSessionId) {
    const existing = orders.find(o => o.stripeSessionId === data.stripeSessionId);
    if (existing) {
      return existing;
    }
  }

  // Créer nouvelle commande
  const order: Order = {
    orderNumber: data.orderNumber || generateOrderNumber(),
    stripeSessionId: data.stripeSessionId || '',
    customerEmail: data.customerEmail || '',
    customerName: data.customerName || '',
    items: data.items || [],
    totalAmount: data.totalAmount || 0,
    status: data.status || 'pending',
    createdAt: data.createdAt || new Date().toISOString(),
    paidAt: data.paidAt,
    shippedAt: data.shippedAt,
    deliveredAt: data.deliveredAt,
    trackingNumber: data.trackingNumber,
    trackingUrl: data.trackingUrl,
    carrier: data.carrier,
    gelatoOrderId: data.gelatoOrderId,
    isEarlyCollector: data.isEarlyCollector,
  };

  orders.push(order);
  await writeOrders(orders);

  return order;
}

/**
 * Mettre à jour une commande existante
 */
export async function updateOrder(orderNumber: string, data: Partial<Order>): Promise<Order> {
  const orders = await readOrders();
  const index = orders.findIndex(o => o.orderNumber === orderNumber);

  if (index === -1) {
    throw new Error(`Commande ${orderNumber} introuvable`);
  }

  // Mettre à jour commande
  orders[index] = {
    ...orders[index],
    ...data,
    orderNumber, // Empêcher changement du numéro
  };

  await writeOrders(orders);

  return orders[index];
}

/**
 * Récupérer toutes les commandes d'un client par email
 */
export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const orders = await readOrders();
  return orders.filter(o => o.customerEmail.toLowerCase() === email.toLowerCase());
}

/**
 * Obtenir statistiques des commandes (pour debug/admin)
 */
export async function getOrderStats(): Promise<{
  total: number;
  byStatus: Record<string, number>;
}> {
  const orders = await readOrders();

  const byStatus: Record<string, number> = {};
  for (const order of orders) {
    byStatus[order.status] = (byStatus[order.status] || 0) + 1;
  }

  return {
    total: orders.length,
    byStatus,
  };
}

// Lalou
