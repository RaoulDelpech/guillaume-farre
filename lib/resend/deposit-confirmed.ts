/**
 * Resend - Email post-acompte avec rappel solde 70%.
 *
 * Envoye apres le webhook `checkout.session.completed` de type
 * `vip-canvas-deposit` (Sprint 5). Recap des montants, echeance du solde
 * (balanceDueAt = J+14) et lien direct vers la page de paiement du solde.
 *
 * Comportement degrade : si RESEND_API_KEY n'est pas configure, retourne
 * `{ success: false, error: 'Resend API key missing' }` sans throw. Le
 * webhook continue son flow nominal — la reservation reste correctement
 * persistee en partial_paid.
 *
 * @author Lalou
 */

import { getResendClient, FROM_EMAIL, type EmailResult } from './client';

export interface DepositConfirmedParams {
  to: string;
  buyerName: string;
  canvasTitle: string;
  reservationId: string;
  depositAmount: number;
  balanceAmount: number;
  totalAmount: number;
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

function buildHtml(p: DepositConfirmedParams): string {
  const dueDate = formatDate(p.balanceDueAt);
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
      <h1 style="font-weight: 300; font-size: 22px; letter-spacing: 0.05em; text-transform: uppercase; color: #1a1a1a;">
        Acompte recu — merci
      </h1>
      <p style="color: #333; line-height: 1.6;">Bonjour ${escapeHtml(p.buyerName)},</p>
      <p style="color: #333; line-height: 1.6;">
        Nous avons bien recu votre acompte de 30% pour l'oeuvre
        <strong>« ${escapeHtml(p.canvasTitle)} »</strong>. Votre acquisition est en cours.
      </p>

      <table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #555;">Prix total</td>
          <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${escapeHtml(formatEur(p.totalAmount))}</td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 8px 0; color: #555;">Acompte verse (30%)</td>
          <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${escapeHtml(formatEur(p.depositAmount))}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #1a1a1a; font-weight: 600;">Solde restant (70%)</td>
          <td style="padding: 12px 0; text-align: right; color: #1a1a1a; font-weight: 600;">${escapeHtml(formatEur(p.balanceAmount))}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #555;">Date limite de paiement</td>
          <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${escapeHtml(dueDate)}</td>
        </tr>
      </table>

      <p style="color: #333; line-height: 1.6;">
        Vous pouvez regler le solde de <strong>${escapeHtml(formatEur(p.balanceAmount))}</strong>
        par carte bancaire securisee jusqu'au <strong>${escapeHtml(dueDate)}</strong>.
      </p>

      <p style="margin: 32px 0; text-align: center;">
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
        Passe cette date, la reservation expirera automatiquement et la toile sera
        remise en vente. Pour toute question, contactez Guillaume Farre directement.
      </p>
    </div>
  `;
}

function buildText(p: DepositConfirmedParams): string {
  const dueDate = formatDate(p.balanceDueAt);
  return [
    `Bonjour ${p.buyerName},`,
    '',
    `Nous avons bien recu votre acompte de 30% pour l'oeuvre « ${p.canvasTitle} ».`,
    '',
    `Prix total :        ${formatEur(p.totalAmount)}`,
    `Acompte verse :     ${formatEur(p.depositAmount)} (30%)`,
    `Solde restant :     ${formatEur(p.balanceAmount)} (70%)`,
    `Date limite :       ${dueDate}`,
    '',
    `Reglez le solde par carte bancaire avant le ${dueDate} :`,
    p.balanceCheckoutUrl,
    '',
    `Reference reservation : ${p.reservationId}`,
    '',
    'Passe cette date, la reservation expirera automatiquement et la toile',
    'sera remise en vente. Pour toute question, contactez Guillaume Farre.',
  ].join('\n');
}

export async function sendDepositConfirmedEmail(
  params: DepositConfirmedParams,
): Promise<EmailResult> {
  const client = getResendClient();
  if (!client) {
    return { success: false, error: 'Resend API key missing' };
  }

  try {
    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: 'Acompte 30% recu — solde 70% a regler',
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

// Lalou
