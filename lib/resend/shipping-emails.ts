/**
 * Resend - Emails d'expedition et livraison
 *
 * @author Lalou
 */

import ShippingNotificationEmail from '@/emails/ShippingNotification';
import DeliveryConfirmationEmail from '@/emails/DeliveryConfirmation';
import { getResendClient, FROM_EMAIL, type EmailOrderItem, type EmailResult } from './client';

/**
 * Email notification expedition (webhook Gelato order.shipped)
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
}): Promise<EmailResult> {
  const resend = getResendClient();

  if (!resend) {
    return { success: false, error: 'Resend API key missing' };
  }

  try {
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

    return { success: true, messageId: data?.id };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Resend] Exception envoi email:', error);
    return { success: false, error: message };
  }
}

/**
 * Email confirmation livraison (webhook Gelato order.delivered)
 */
export async function sendDeliveryConfirmationEmail(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  items: Omit<EmailOrderItem, 'price'>[];
}): Promise<EmailResult> {
  const resend = getResendClient();

  if (!resend) {
    return { success: false, error: 'Resend API key missing' };
  }

  try {
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

    return { success: true, messageId: data?.id };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Resend] Exception envoi email:', error);
    return { success: false, error: message };
  }
}
