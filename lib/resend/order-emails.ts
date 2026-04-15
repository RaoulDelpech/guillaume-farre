/**
 * Resend - Emails de commande (avec fallback postfix)
 *
 * @author Lalou
 */

import nodemailer from 'nodemailer';
import OrderConfirmationEmail from '@/emails/OrderConfirmation';
import { getResendClient, FROM_EMAIL, type EmailOrderItem, type ShippingAddress, type EmailResult } from './client';

/** Fallback postfix localhost:25 (pas d'auth) */
function getPostfixTransport() {
  return nodemailer.createTransport({
    host: '127.0.0.1',
    port: 25,
    secure: false,
    tls: { rejectUnauthorized: false },
  });
}

/** Build order confirmation HTML (for postfix fallback) */
function buildConfirmationHtml(params: {
  customerName: string;
  orderNumber: string;
  items: EmailOrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
}): string {
  const itemsHtml = params.items.map(item => `
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
        <strong>${item.title}</strong><br/>
        <span style="color: #777; font-size: 14px;">Format ${item.format} · ${item.frame}</span>
      </td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">
        ${item.price.toLocaleString('fr-FR')} &euro;
      </td>
    </tr>
  `).join('');

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #000; padding: 30px 20px; text-align: center;">
        <h1 style="color: #fff; font-size: 28px; font-weight: 300; margin: 0; letter-spacing: 2px;">Guillaume Farr&eacute;</h1>
      </div>
      <div style="padding: 40px 30px;">
        <h2 style="color: #333; font-size: 24px; font-weight: 300;">Commande confirm&eacute;e</h2>
        <p>Bonjour ${params.customerName},</p>
        <p>Merci pour votre commande <strong>${params.orderNumber}</strong>.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">${itemsHtml}</table>
        <p style="font-size: 18px; font-weight: 500;">Total : ${params.totalAmount.toLocaleString('fr-FR')} &euro;</p>
        <p style="color: #777; font-size: 13px;">Livraison : ${params.shippingAddress.line1}, ${params.shippingAddress.postalCode} ${params.shippingAddress.city}</p>
        <hr style="margin: 30px 0;"/>
        <p style="color: #777; font-size: 13px; text-align: center;">contact@guillaumefarre.com &middot; www.guillaumefarre.com</p>
      </div>
    </div>
  `;
}

/**
 * Email confirmation commande (apres paiement Stripe)
 * Utilise Resend si configure, sinon fallback postfix localhost:25
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

  if (resend) {
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
      console.error('[Resend] Exception, fallback postfix:', message);
    }
  }

  // Fallback: postfix local
  try {
    const transporter = getPostfixTransport();
    const info = await transporter.sendMail({
      from: 'noreply@guillaumefarre.com',
      to: params.to,
      subject: `Commande confirmée ${params.orderNumber} - Guillaume Farré`,
      html: buildConfirmationHtml(params),
    });
    console.log('[Postfix] Email confirmation envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Postfix] Erreur envoi email:', message);
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

  const itemsHtml = params.items.map(item => `
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
        <strong>${item.title}</strong><br/>
        <span style="color: #777; font-size: 14px;">Format ${item.format} &middot; ${item.frame}</span>
      </td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 500;">
        ${item.price.toLocaleString('fr-FR')} &euro;
      </td>
    </tr>
  `).join('');

  const pendingHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
      <div style="background: #000; padding: 30px 20px; text-align: center;">
        <h1 style="color: #fff; font-size: 28px; font-weight: 300; margin: 0; letter-spacing: 2px;">Guillaume Farr&eacute;</h1>
      </div>
      <div style="padding: 40px 30px;">
        <h2 style="color: #333; font-size: 24px; font-weight: 300;">Votre commande est r&eacute;serv&eacute;e</h2>
        <p>Bonjour ${params.customerName},</p>
        <p>Nous avons bien enregistr&eacute; votre commande. Les &oelig;uvres sont r&eacute;serv&eacute;es en attendant votre virement.</p>
        <div style="background: #f9f9f9; border: 1px solid #eee; padding: 20px; margin: 25px 0;">
          <p>Commande : <strong>${params.orderNumber}</strong></p>
          <table style="width: 100%; border-collapse: collapse;">${itemsHtml}</table>
          <p style="font-size: 18px; font-weight: 500; margin-top: 15px;">Total : ${params.totalAmount.toLocaleString('fr-FR')} &euro;</p>
        </div>
        <p style="color: #777; font-size: 13px; text-align: center;">contact@guillaumefarre.com &middot; www.guillaumefarre.com</p>
      </div>
    </div>
  `;

  const subject = `Commande réservée — Virement en attente · ${params.orderNumber}`;

  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: params.to,
        subject,
        html: pendingHtml,
      });

      if (error) {
        console.error('[Resend] Erreur envoi email:', error);
        return { success: false, error: error.message };
      }

      return { success: true, messageId: data?.id };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Resend] Exception, fallback postfix:', message);
    }
  }

  // Fallback: postfix local
  try {
    const transporter = getPostfixTransport();
    const info = await transporter.sendMail({
      from: 'noreply@guillaumefarre.com',
      to: params.to,
      subject,
      html: pendingHtml,
    });
    console.log('[Postfix] Email pending envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Postfix] Erreur envoi email:', message);
    return { success: false, error: message };
  }
}
