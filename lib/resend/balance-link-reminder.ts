/**
 * Resend - Email "lien de paiement solde regenere" envoye depuis l'admin.
 *
 * Sprint 7 : Guillaume peut declencher la regeneration du lien token HMAC
 * depuis la page detail reservation. Cet email rappelle au client le solde
 * restant + nouveau lien de paiement.
 *
 * Comportement degrade : si RESEND_API_KEY manque, retourne
 * `{ success: false, error }` sans throw. La route admin gere ce cas et
 * renvoie quand meme le lien au front pour copy/paste manuel.
 *
 * @author Lalou
 */

import { getResendClient, FROM_EMAIL, type EmailResult } from './client';

export interface BalanceLinkReminderParams {
  to: string;
  buyerName: string;
  canvasTitle: string;
  reservationId: string;
  balanceAmount: number;
  balanceDueAt: string;
  balanceCheckoutUrl: string;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatEur(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function buildHtml(p: BalanceLinkReminderParams): string {
  const dueDate = formatDate(p.balanceDueAt);
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
      <h1 style="font-weight: 300; font-size: 22px; letter-spacing: 0.05em; text-transform: uppercase; color: #1a1a1a;">
        Lien de paiement renouvele
      </h1>
      <p style="color: #333; line-height: 1.6;">Bonjour ${escapeHtml(p.buyerName)},</p>
      <p style="color: #333; line-height: 1.6;">
        Guillaume Farre a regenere votre lien de paiement pour le solde de
        <strong>« ${escapeHtml(p.canvasTitle)} »</strong>. Voici le nouveau lien securise :
      </p>

      <table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #555;">Solde a regler</td>
          <td style="padding: 8px 0; text-align: right; color: #1a1a1a;"><strong>${escapeHtml(formatEur(p.balanceAmount))}</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #555;">Date limite</td>
          <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${escapeHtml(dueDate)}</td>
        </tr>
      </table>

      <p style="text-align: center; margin: 32px 0;">
        <a href="${escapeHtml(p.balanceCheckoutUrl)}"
           style="display: inline-block; padding: 14px 28px; background: #1a1a1a; color: #fff;
                  text-decoration: none; letter-spacing: 0.15em; text-transform: uppercase;
                  font-size: 13px; font-weight: 400;">
          Regler le solde
        </a>
      </p>

      <p style="color: #555; font-size: 12px; line-height: 1.6;">
        Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br />
        <code style="background: #f4f4f4; padding: 2px 4px;">${escapeHtml(p.balanceCheckoutUrl)}</code>
      </p>
      <p style="color: #555; font-size: 12px; line-height: 1.6;">
        Reference reservation : <code>${escapeHtml(p.reservationId)}</code>
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #888; font-size: 11px; line-height: 1.6;">
        Ce nouveau lien remplace le precedent qui devient inactif. Pour toute
        question, contactez Guillaume Farre directement.
      </p>
    </div>
  `;
}

function buildText(p: BalanceLinkReminderParams): string {
  const dueDate = formatDate(p.balanceDueAt);
  return [
    `Bonjour ${p.buyerName},`,
    '',
    `Guillaume Farre a regenere votre lien de paiement pour le solde de`,
    `« ${p.canvasTitle} ». Voici le nouveau lien securise :`,
    '',
    `Solde a regler : ${formatEur(p.balanceAmount)}`,
    `Date limite :    ${dueDate}`,
    '',
    `Reglez le solde par carte bancaire avant le ${dueDate} :`,
    p.balanceCheckoutUrl,
    '',
    `Reference reservation : ${p.reservationId}`,
    '',
    'Ce nouveau lien remplace le precedent qui devient inactif. Pour toute',
    'question, contactez Guillaume Farre directement.',
  ].join('\n');
}

export async function sendBalanceLinkReminderEmail(
  params: BalanceLinkReminderParams,
): Promise<EmailResult> {
  const client = getResendClient();
  if (!client) {
    return { success: false, error: 'Resend API key missing' };
  }

  try {
    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: 'Nouveau lien de paiement — solde a regler',
      html: buildHtml(params),
      text: buildText(params),
    });

    if (error) {
      return { success: false, error: error.message ?? 'Resend error' };
    }
    return { success: true, messageId: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    return { success: false, error: message };
  }
}
