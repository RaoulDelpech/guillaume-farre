/**
 * Resend - Email post-signature avec lien direct vers la page checkout.
 *
 * Envoye juste apres la signature electronique reussie (Sprint 4). L'objectif
 * est de garantir que l'acheteur retrouve son chemin vers le paiement meme
 * s'il ferme la modal post-signature sans cliquer "Procéder au paiement".
 *
 * Sans cet email, un acheteur perdu n'a plus aucun moyen de retrouver la page
 * checkout : l'URL `/vip/reservation/[id]/checkout` est protegee par cookie
 * VIP et la liste des reservations en attente n'est exposee nulle part dans
 * l'UI. C'etait un trou UX critique du Sprint 4 (note dans le rapport partial
 * du merge 4cf9018).
 *
 * Comportement degrade : si RESEND_API_KEY n'est pas configure, retourne
 * `{ success: false, error: 'Resend API key missing' }` sans throw. La route
 * /sign continue son flow nominal — l'absence d'email post-signature n'est
 * pas bloquante (l'acheteur a deja le CTA "Proceder au paiement" dans la
 * modal qu'il vient de fermer).
 *
 * @author Lalou
 */

import { getResendClient, FROM_EMAIL, type EmailResult } from './client';

export interface PostSignatureCheckoutLinkParams {
  to: string;
  buyerName: string;
  canvasTitle: string;
  reservationId: string;
  checkoutUrl: string;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildHtml(p: PostSignatureCheckoutLinkParams): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
      <h1 style="font-weight: 300; font-size: 22px; letter-spacing: 0.05em; text-transform: uppercase; color: #1a1a1a;">
        Finalisez votre acquisition
      </h1>
      <p style="color: #333; line-height: 1.6;">Bonjour ${escapeHtml(p.buyerName)},</p>
      <p style="color: #333; line-height: 1.6;">
        Votre signature electronique pour l'oeuvre <strong>« ${escapeHtml(p.canvasTitle)} »</strong>
        a bien ete enregistree. Vous trouverez en piece jointe une copie de votre contrat signe.
      </p>
      <p style="color: #333; line-height: 1.6;">
        Pour finaliser votre acquisition, reglez en toute securite par carte bancaire via le lien
        ci-dessous :
      </p>
      <p style="margin: 32px 0; text-align: center;">
        <a href="${escapeHtml(p.checkoutUrl)}"
           style="display: inline-block; padding: 14px 28px; background: #1a1a1a; color: #fff;
                  text-decoration: none; letter-spacing: 0.15em; text-transform: uppercase;
                  font-size: 13px; font-weight: 400;">
          Proceder au paiement
        </a>
      </p>
      <p style="color: #555; font-size: 12px; line-height: 1.6;">
        Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br />
        <code style="background: #f4f4f4; padding: 2px 4px;">${escapeHtml(p.checkoutUrl)}</code>
      </p>
      <p style="color: #555; font-size: 12px; line-height: 1.6;">
        Reference reservation : <code>${escapeHtml(p.reservationId)}</code>
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #888; font-size: 11px;">
        Le lien de paiement reste valide tant que la reservation est active. Vous pouvez aussi
        regler plus tard ; Guillaume Farre vous recontactera si necessaire.
      </p>
    </div>
  `;
}

function buildText(p: PostSignatureCheckoutLinkParams): string {
  return [
    `Bonjour ${p.buyerName},`,
    '',
    `Votre signature electronique pour l'oeuvre « ${p.canvasTitle} » a bien ete enregistree.`,
    'Vous trouverez en piece jointe une copie de votre contrat signe.',
    '',
    'Pour finaliser votre acquisition, reglez par carte bancaire via le lien :',
    p.checkoutUrl,
    '',
    `Reference reservation : ${p.reservationId}`,
    '',
    'Le lien de paiement reste valide tant que la reservation est active.',
    'Guillaume Farre vous recontactera si necessaire.',
  ].join('\n');
}

export async function sendPostSignatureCheckoutLink(
  params: PostSignatureCheckoutLinkParams,
): Promise<EmailResult> {
  const client = getResendClient();
  if (!client) {
    return { success: false, error: 'Resend API key missing' };
  }

  try {
    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: 'Finalisez votre acquisition — paiement par carte',
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
