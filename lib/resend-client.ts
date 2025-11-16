/**
 * Client Resend pour emails transactionnels
 *
 * Resend permet d'envoyer des emails avec React Email templates
 * Documentation: https://resend.com/docs
 *
 * Emails envoyés:
 * - OrderConfirmation: Immédiatement après paiement Stripe
 * - ShippingNotification: Quand Gelato webhook order.shipped
 * - DeliveryConfirmation: Quand Gelato webhook order.delivered
 *
 * @author Lalou
 */

import { Resend } from 'resend';
import { render } from '@react-email/components';
import OrderConfirmationEmail from '@/emails/OrderConfirmation';
import ShippingNotificationEmail from '@/emails/ShippingNotification';
import DeliveryConfirmationEmail from '@/emails/DeliveryConfirmation';

/**
 * Initialiser client Resend
 */
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY manquante - Emails désactivés');
    return null;
  }

  return new Resend(apiKey);
}

/**
 * Adresse email expéditeur
 */
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Guillaume Farré <noreply@guillaumefarre.com>';

/**
 * Interface item commande (partagée entre tous les emails)
 */
export interface EmailOrderItem {
  title: string;
  format: string;
  frame: string;
  price: number;
}

/**
 * Interface adresse livraison
 */
interface ShippingAddress {
  line1: string;
  city: string;
  postalCode: string;
  country: string;
}

/**
 * Envoyer email confirmation commande (après paiement Stripe)
 */
export async function sendOrderConfirmationEmail(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  items: EmailOrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const resend = getResendClient();

  if (!resend) {
    console.log('[Resend] Emails désactivés (pas d\'API key)');
    return { success: false, error: 'Resend API key missing' };
  }

  try {
    console.log('[Resend] Envoi email confirmation commande:', params.orderNumber);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `Commande confirmée ${params.orderNumber} - Guillaume Farré`,
      react: OrderConfirmationEmail({
        customerName: params.customerName,
        orderNumber: params.orderNumber,
        items: params.items,
        totalAmount: params.totalAmount,
        shippingAddress: params.shippingAddress,
      }),
    });

    if (error) {
      console.error('[Resend] Erreur envoi email:', error);
      return { success: false, error: error.message };
    }

    console.log('[Resend] ✅ Email envoyé:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error: any) {
    console.error('[Resend] Exception envoi email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoyer email notification expédition (webhook Gelato order.shipped)
 */
export async function sendShippingNotificationEmail(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  estimatedDelivery?: string;
  items: Omit<EmailOrderItem, 'price'>[];
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const resend = getResendClient();

  if (!resend) {
    console.log('[Resend] Emails désactivés (pas d\'API key)');
    return { success: false, error: 'Resend API key missing' };
  }

  try {
    console.log('[Resend] Envoi email expédition:', params.orderNumber);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `📦 Votre commande ${params.orderNumber} a été expédiée !`,
      react: ShippingNotificationEmail({
        customerName: params.customerName,
        orderNumber: params.orderNumber,
        carrier: params.carrier,
        trackingNumber: params.trackingNumber,
        trackingUrl: params.trackingUrl,
        estimatedDelivery: params.estimatedDelivery,
        items: params.items,
      }),
    });

    if (error) {
      console.error('[Resend] Erreur envoi email:', error);
      return { success: false, error: error.message };
    }

    console.log('[Resend] ✅ Email envoyé:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error: any) {
    console.error('[Resend] Exception envoi email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoyer email confirmation livraison (webhook Gelato order.delivered)
 */
export async function sendDeliveryConfirmationEmail(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  items: Omit<EmailOrderItem, 'price'>[];
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const resend = getResendClient();

  if (!resend) {
    console.log('[Resend] Emails désactivés (pas d\'API key)');
    return { success: false, error: 'Resend API key missing' };
  }

  try {
    console.log('[Resend] Envoi email livraison:', params.orderNumber);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `🎉 Votre commande ${params.orderNumber} est arrivée !`,
      react: DeliveryConfirmationEmail({
        customerName: params.customerName,
        orderNumber: params.orderNumber,
        items: params.items,
      }),
    });

    if (error) {
      console.error('[Resend] Erreur envoi email:', error);
      return { success: false, error: error.message };
    }

    console.log('[Resend] ✅ Email envoyé:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error: any) {
    console.error('[Resend] Exception envoi email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoyer email problème commande (webhook Gelato order.on-hold)
 */
export async function sendOrderProblemEmail(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  problemDescription: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const resend = getResendClient();

  if (!resend) {
    console.log('[Resend] Emails désactivés (pas d\'API key)');
    return { success: false, error: 'Resend API key missing' };
  }

  try {
    console.log('[Resend] Envoi email problème commande:', params.orderNumber);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `Mise à jour commande ${params.orderNumber}`,
      html: `
        <h1>Bonjour ${params.customerName},</h1>
        <p>Nous vous contactons au sujet de votre commande <strong>${params.orderNumber}</strong>.</p>
        <p><strong>Statut actuel :</strong> En attente de résolution</p>
        <p><strong>Détails :</strong> ${params.problemDescription}</p>
        <p>Notre équipe travaille activement pour résoudre ce problème. Nous vous recontacterons dans les plus brefs délais.</p>
        <p>Si vous avez des questions, n'hésitez pas à nous contacter à contact@guillaumefarre.com</p>
        <p>Cordialement,<br>Guillaume Farré</p>
      `,
    });

    if (error) {
      console.error('[Resend] Erreur envoi email:', error);
      return { success: false, error: error.message };
    }

    console.log('[Resend] ✅ Email envoyé:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error: any) {
    console.error('[Resend] Exception envoi email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Tester envoi email (développement)
 */
export async function sendTestEmail(to: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const resend = getResendClient();

  if (!resend) {
    return { success: false, error: 'Resend API key missing' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Test email - Guillaume Farré',
      html: '<h1>Test email Resend</h1><p>Si vous recevez ceci, Resend fonctionne ✅</p>',
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Lalou
