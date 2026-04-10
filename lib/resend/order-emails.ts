/**
 * Resend - Emails de commande
 *
 * @author Lalou
 */

import OrderConfirmationEmail from '@/emails/OrderConfirmation';
import { getResendClient, FROM_EMAIL, type EmailOrderItem, type ShippingAddress, type EmailResult } from './client';

/**
 * Email confirmation commande (apres paiement Stripe)
 */
export async function sendOrderConfirmationEmail(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  items: EmailOrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  isEarlyCollector?: boolean;
}): Promise<EmailResult> {
  const resend = getResendClient();

  if (!resend) {
    return { success: false, error: 'Resend API key missing' };
  }

  try {
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
        isEarlyCollector: params.isEarlyCollector,
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
 * Email probleme commande (webhook Gelato order.on-hold)
 */
export async function sendOrderProblemEmail(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  problemDescription: string;
}): Promise<EmailResult> {
  const resend = getResendClient();

  if (!resend) {
    return { success: false, error: 'Resend API key missing' };
  }

  try {
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

    return { success: true, messageId: data?.id };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Resend] Exception envoi email:', error);
    return { success: false, error: message };
  }
}

/**
 * Email "virement en attente" (apres checkout SEPA bank transfer)
 */
export async function sendPaymentPendingEmail(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  items: EmailOrderItem[];
  totalAmount: number;
}): Promise<EmailResult> {
  const resend = getResendClient();

  if (!resend) {
    return { success: false, error: 'Resend API key missing' };
  }

  try {
    const itemsHtml = params.items.map(item => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
          <strong>${item.title}</strong><br/>
          <span style="color: #777; font-size: 14px;">Format ${item.format} · ${item.frame}</span>
        </td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 500;">
          ${item.price.toLocaleString('fr-FR')} €
        </td>
      </tr>
    `).join('');

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `Commande réservée — Virement en attente · ${params.orderNumber}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
          <div style="background: #000; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #fff; font-size: 28px; font-weight: 300; margin: 0; letter-spacing: 2px;">Guillaume Farré</h1>
            <p style="color: #ccc; font-size: 14px; margin: 10px 0 0; letter-spacing: 1px;">Artiste Sculpteur · Fine Art</p>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; font-size: 24px; font-weight: 300; margin: 0 0 20px;">Votre commande est réservée</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">Bonjour ${params.customerName},</p>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">Nous avons bien enregistré votre commande. Les œuvres sont réservées à votre nom en attendant la réception de votre virement bancaire.</p>
            <div style="background: #f0f7ff; border: 1px solid #d0e3ff; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h3 style="color: #1a56db; font-size: 16px; margin: 0 0 12px;">Virement en cours de traitement</h3>
              <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0;">Votre virement sera traité sous <strong>1 à 2 jours ouvrés</strong>. Vous recevrez un email de confirmation dès réception du paiement.</p>
            </div>
            <div style="background: #f9f9f9; border: 1px solid #eee; border-radius: 6px; padding: 20px; margin: 25px 0;">
              <p style="color: #333; font-size: 14px; margin: 0 0 15px;">Commande : <strong>${params.orderNumber}</strong></p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
              <table style="width: 100%; border-collapse: collapse;">${itemsHtml}</table>
              <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
              <table style="width: 100%;"><tr><td style="font-size: 18px; font-weight: 500; color: #333;">Total</td><td style="font-size: 24px; font-weight: 500; color: #000; text-align: right;">${params.totalAmount.toLocaleString('fr-FR')} €</td></tr></table>
            </div>
            <div style="margin: 30px 0;">
              <h3 style="color: #333; font-size: 16px; font-weight: 500; margin: 0 0 15px;">Prochaines étapes</h3>
              <p style="color: #666; font-size: 14px; line-height: 1.8; margin: 8px 0;">🏦 <strong>Virement en attente</strong> — 1 à 2 jours ouvrés</p>
              <p style="color: #666; font-size: 14px; line-height: 1.8; margin: 8px 0;">✅ <strong>Confirmation de réception</strong> — Email automatique</p>
              <p style="color: #666; font-size: 14px; line-height: 1.8; margin: 8px 0;">🖨️ <strong>Impression Fine Art</strong> — Dès réception du paiement</p>
              <p style="color: #666; font-size: 14px; line-height: 1.8; margin: 8px 0;">📦 <strong>Expédition sécurisée</strong> — 1 à 2 semaines</p>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="color: #777; font-size: 13px; text-align: center; line-height: 1.6;">Une question ? Contactez-nous à <a href="mailto:contact@guillaumefarre.com" style="color: #000; text-decoration: underline;">contact@guillaumefarre.com</a></p>
            <p style="color: #999; font-size: 11px; text-align: center; margin: 20px 0 0;">© 2025 Guillaume Farré — Artiste Sculpteur<br/>www.guillaumefarre.com</p>
          </div>
        </div>
      `,
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
