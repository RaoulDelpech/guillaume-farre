/**
 * Gelato API Types
 *
 * Documentation: https://connect-api.live.gelato.tech/docs/
 * Base URL (Live): https://connect.live.gelato.tech/
 * Base URL (Test): https://connect.test.gelato.tech/
 *
 * @author Lalou
 */

// ============================================================================
// REQUEST TYPES
// ============================================================================

/**
 * Format d'une adresse de livraison Gelato
 */
export interface GelatoShippingAddress {
  firstName: string;
  lastName: string;
  companyName?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string; // Requis pour US/CA/AU
  postCode: string;
  country: string; // ISO 3166-1 alpha-2 (ex: "FR", "US", "IT")
  email?: string;
  phone?: string;
}

/**
 * Fichier artwork à imprimer
 */
export interface GelatoFile {
  type: 'default' | 'preview'; // default = fichier impression, preview = aperçu
  url: string; // URL publique du fichier (PDF/PNG/JPG haute résolution)
}

/**
 * Item d'une commande (photo à imprimer)
 */
export interface GelatoOrderItem {
  itemReferenceId: string; // Notre ID unique (ex: Stripe line_item.id)
  productUid: string; // UID produit Gelato (ex: "flat_a3_fine-art-giclee")
  files: GelatoFile[];
  quantity: number;
}

/**
 * Payload création commande Gelato
 */
export interface GelatoCreateOrderRequest {
  orderType: 'order' | 'draft'; // 'order' = commande réelle, 'draft' = test
  orderReferenceId: string; // Notre ID commande (ex: Stripe payment_intent.id)
  customerReferenceId: string; // Notre ID client (ex: Stripe customer.id)
  currency: 'EUR' | 'USD' | 'GBP'; // Devise
  items: GelatoOrderItem[];
  shipmentMethodUid?: string; // 'standard' (défaut) | 'express'
  shippingAddress: GelatoShippingAddress;
  metadata?: Record<string, string>; // Métadonnées custom (optionnel)
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

/**
 * Statut commande Gelato
 */
export type GelatoOrderStatus =
  | 'draft' // Brouillon (non soumis)
  | 'pending' // En attente traitement
  | 'approved' // Approuvé pour production
  | 'production' // En cours d'impression
  | 'shipped' // Expédié
  | 'delivered' // Livré
  | 'cancelled' // Annulé
  | 'on-hold' // En attente (problème qualité/fichier)
  | 'error'; // Erreur

/**
 * Item dans la réponse commande
 */
export interface GelatoOrderItemResponse {
  id: string; // ID Gelato de l'item
  itemReferenceId: string; // Notre ID
  productUid: string;
  quantity: number;
  status: GelatoOrderStatus;
  tracking?: {
    carrier?: string; // Ex: "DHL", "UPS"
    trackingNumber?: string;
    trackingUrl?: string;
  };
}

/**
 * Réponse création commande
 */
export interface GelatoCreateOrderResponse {
  id: string; // ID commande Gelato
  orderReferenceId: string; // Notre ID
  status: GelatoOrderStatus;
  items: GelatoOrderItemResponse[];
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string;
  shipmentMethodUid?: string;
  shippingAddress: GelatoShippingAddress;
  tracking?: {
    carrier?: string;
    trackingNumber?: string;
    trackingUrl?: string;
  };
}

/**
 * Réponse erreur API Gelato
 */
export interface GelatoErrorResponse {
  error: {
    code: string; // Ex: "INVALID_PRODUCT_UID"
    message: string;
    details?: Record<string, unknown>;
  };
}

// ============================================================================
// WEBHOOK TYPES
// ============================================================================

/**
 * Événement webhook Gelato
 */
export type GelatoWebhookEvent =
  | 'order.created' // Commande créée
  | 'order.approved' // Commande approuvée pour production
  | 'order.production' // En cours d'impression
  | 'order.shipped' // Expédié
  | 'order.delivered' // Livré
  | 'order.cancelled' // Annulé
  | 'order.on-hold' // En attente (problème)
  | 'order.error'; // Erreur

/**
 * Payload webhook Gelato
 */
export interface GelatoWebhookPayload {
  event: GelatoWebhookEvent;
  orderId: string; // ID commande Gelato
  orderReferenceId: string; // Notre ID commande
  status: GelatoOrderStatus;
  timestamp: string; // ISO 8601
  data: {
    items?: GelatoOrderItemResponse[];
    tracking?: {
      carrier?: string;
      trackingNumber?: string;
      trackingUrl?: string;
    };
    error?: {
      code: string;
      message: string;
    };
  };
}

// ============================================================================
// PRODUCT CATALOG TYPES
// ============================================================================

/**
 * Mapping nos formats → UIDs Gelato
 *
 * À configurer selon catalogue Gelato disponible pour France
 */
export interface GelatoProductMapping {
  // Tirages illimités (papier photo standard)
  unlimited: {
    A4: string; // Ex: "flat_a4_photo-paper-standard"
    A3: string;
    A2: string;
  };
  // Éditions limitées (Fine Art Giclee)
  limited: {
    A3: string; // Ex: "flat_a3_fine-art-giclee-12color"
    A2: string;
    A1: string;
  };
}

/**
 * Configuration produit Gelato (exemple)
 */
export const GELATO_PRODUCT_UIDS: GelatoProductMapping = {
  unlimited: {
    A4: 'flat_a4_photo-paper-170gsm', // À remplacer par vrais UIDs
    A3: 'flat_a3_photo-paper-170gsm',
    A2: 'flat_a2_photo-paper-170gsm',
  },
  limited: {
    A3: 'flat_a3_fine-art-giclee-300gsm', // À remplacer par vrais UIDs
    A2: 'flat_a2_fine-art-giclee-300gsm',
    A1: 'flat_a1_fine-art-giclee-300gsm',
  },
};

// ============================================================================
// CLIENT CONFIGURATION
// ============================================================================

/**
 * Configuration client Gelato API
 */
export interface GelatoClientConfig {
  apiKey: string; // API key Gelato (depuis .env.local)
  environment: 'test' | 'live'; // Environnement
  webhookSecret?: string; // Secret JWT pour valider webhooks
}

/**
 * Options requête API Gelato
 */
export interface GelatoRequestOptions {
  timeout?: number; // Timeout en ms (défaut: 30000)
  retries?: number; // Nombre retries si rate limit (défaut: 3)
}

// Lalou
