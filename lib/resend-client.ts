/**
 * Resend Client - Facade re-export
 *
 * @author Lalou
 */

export type { EmailOrderItem } from './resend/client';
export { sendOrderConfirmationEmail, sendOrderProblemEmail, sendPaymentPendingEmail } from './resend/order-emails';
export { sendShippingNotificationEmail, sendDeliveryConfirmationEmail } from './resend/shipping-emails';
export { sendMagicLinkEmail, sendTestEmail } from './resend/auth-emails';
