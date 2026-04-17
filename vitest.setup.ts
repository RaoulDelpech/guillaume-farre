/**
 * Setup file pour Vitest
 *
 * @author Lalou
 * @date 2025-11-08
 */

import '@testing-library/jest-dom';

process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'stripe-key-placeholder';
process.env.STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'webhook-secret-placeholder';
process.env.SITE_PASSWORD = process.env.SITE_PASSWORD || 'test_site_password';
process.env.AUTH_SECRET = process.env.AUTH_SECRET || 'test_auth_secret';
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test_admin_password';
