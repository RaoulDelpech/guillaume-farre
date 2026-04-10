/**
 * Resend - Client et configuration
 *
 * @author Lalou
 */

import { Resend } from 'resend';

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Guillaume Farré <noreply@guillaumefarre.com>';

export interface EmailOrderItem {
  title: string;
  format: string;
  frame: string;
  price: number;
}

export interface ShippingAddress {
  line1: string;
  city: string;
  postalCode: string;
  country: string;
}

export type EmailResult = { success: boolean; messageId?: string; error?: string };
