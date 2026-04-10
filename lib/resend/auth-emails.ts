/**
 * Resend - Emails d'authentification et tests
 *
 * @author Lalou
 */

import MagicLinkEmail from '@/emails/MagicLink';
import { getResendClient, FROM_EMAIL, type EmailResult } from './client';

/**
 * Email magic link (connexion sans mot de passe)
 */
export async function sendMagicLinkEmail(params: {
  to: string;
  magicLink: string;
}): Promise<EmailResult> {
  const resend = getResendClient();

  if (!resend) {
    return { success: false, error: 'Resend API key missing' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: 'Votre lien de connexion - Guillaume Farré',
      react: MagicLinkEmail({
        magicLink: params.magicLink,
        email: params.to,
      }),
    });

    if (error) {
      console.error('[Resend] Erreur envoi magic link:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Resend] Exception envoi magic link:', error);
    return { success: false, error: message };
  }
}

/**
 * Email de test (developpement)
 */
export async function sendTestEmail(to: string): Promise<EmailResult> {
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}
