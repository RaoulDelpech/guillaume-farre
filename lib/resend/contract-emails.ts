/**
 * Resend - Emails de contrat signe (acheteur + Guillaume)
 *
 * - sendSignedContractEmail : envoie le PDF du contrat a l'acheteur.
 * - sendNewSignedReservationEmail : alerte Guillaume avec lien admin.
 *
 * Si RESEND_API_KEY est absent, ces fonctions retournent
 * { success: false, error: 'Resend API key missing' } sans throw, pour
 * que la route /sign reste fonctionnelle en developpement sans Resend.
 *
 * @author Lalou
 */

import { getResendClient, FROM_EMAIL, type EmailResult } from './client';

const GUILLAUME_EMAIL = process.env.GUILLAUME_NOTIFICATION_EMAIL || 'contact@guillaumefarre.com';

interface SignedContractEmailParams {
  to: string;
  buyerName: string;
  canvasTitle: string;
  reservationId: string;
  contractPdfBuffer: Buffer;
}

interface NewSignedReservationEmailParams {
  reservationId: string;
  buyerName: string;
  buyerEmail: string;
  canvasTitle: string;
  pricedEUR: number;
  signedAt: string;
  contractPdfBuffer: Buffer;
}

function buildBuyerHtml(buyerName: string, canvasTitle: string, reservationId: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 560px; margin: 0 auto;">
      <h1 style="font-weight: 300; font-size: 22px; letter-spacing: 0.05em; text-transform: uppercase; color: #1a1a1a;">
        Contrat signé
      </h1>
      <p style="color: #333; line-height: 1.6;">Bonjour ${escapeHtml(buyerName)},</p>
      <p style="color: #333; line-height: 1.6;">
        Vous venez de signer électroniquement le contrat de vente pour l'œuvre
        <strong>« ${escapeHtml(canvasTitle)} »</strong>. Vous trouverez ci-joint
        le PDF du contrat signé, à conserver.
      </p>
      <p style="color: #333; line-height: 1.6;">
        Référence réservation : <code>${escapeHtml(reservationId)}</code>
      </p>
      <p style="color: #555; font-size: 13px; margin-top: 24px;">
        Guillaume Farré vous contactera dans les prochains jours pour organiser le
        paiement et la remise de l'œuvre.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #888; font-size: 11px;">
        Cette signature électronique est conforme au Règlement eIDAS (UE) n° 910/2014
        et à l'article 1367 du Code civil.
      </p>
    </div>
  `;
}

function buildGuillaumeHtml(p: NewSignedReservationEmailParams): string {
  const priceFormatted = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(p.pricedEUR);
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
      <h1 style="font-weight: 400; font-size: 20px;">Nouvelle réservation signée</h1>
      <p><strong>Acheteur :</strong> ${escapeHtml(p.buyerName)} (${escapeHtml(p.buyerEmail)})</p>
      <p><strong>Œuvre :</strong> ${escapeHtml(p.canvasTitle)}</p>
      <p><strong>Prix :</strong> ${escapeHtml(priceFormatted)}</p>
      <p><strong>Signé le :</strong> ${escapeHtml(p.signedAt)}</p>
      <p>
        <a href="https://guillaumefarre.com/fr/admin/reservations/${encodeURIComponent(p.reservationId)}">
          Voir dans l'admin
        </a>
      </p>
      <p>Le PDF du contrat signé est joint à ce message.</p>
    </div>
  `;
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendSignedContractEmail(p: SignedContractEmailParams): Promise<EmailResult> {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, error: 'Resend API key missing' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: p.to,
      subject: `Contrat signé — « ${p.canvasTitle} » — Guillaume Farré`,
      html: buildBuyerHtml(p.buyerName, p.canvasTitle, p.reservationId),
      attachments: [
        {
          filename: `contrat-${p.reservationId.slice(0, 8)}.pdf`,
          content: p.contractPdfBuffer,
        },
      ],
    });
    if (error) {
      return { success: false, error: error.message ?? 'Resend error' };
    }
    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('[contract-emails] buyer send failed', err);
    return { success: false, error: err instanceof Error ? err.message : 'unknown' };
  }
}

export async function sendNewSignedReservationEmail(
  p: NewSignedReservationEmailParams,
): Promise<EmailResult> {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, error: 'Resend API key missing' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: GUILLAUME_EMAIL,
      subject: `Nouvelle réservation signée — ${p.canvasTitle}`,
      html: buildGuillaumeHtml(p),
      attachments: [
        {
          filename: `contrat-${p.reservationId.slice(0, 8)}.pdf`,
          content: p.contractPdfBuffer,
        },
      ],
    });
    if (error) {
      return { success: false, error: error.message ?? 'Resend error' };
    }
    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('[contract-emails] guillaume send failed', err);
    return { success: false, error: err instanceof Error ? err.message : 'unknown' };
  }
}

// Lalou
