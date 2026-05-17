import { test, expect } from '@playwright/test';

/**
 * E2E — Balance HMAC token : refus si lien invalide ou expire.
 *
 * Sprint 8 — Tests skippes par defaut (RUN_E2E=true).
 *
 * Strategie :
 *  - On force le test sans fixture en utilisant un token volontairement
 *    invalide ; le backend doit rendre un message d'erreur clair sans
 *    leak d'info (status 4xx + page sobre).
 *  - Si une reservation `partial_paid` avec balanceDueAt forced past existe
 *    (TEST_EXPIRED_RESA_ID + TEST_EXPIRED_TOKEN), on peut tester le cas
 *    "lien legitime mais expire".
 *
 * @author Lalou
 */

const RUN = process.env.RUN_E2E === 'true';
const EXPIRED_RESA = process.env.TEST_EXPIRED_RESA_ID || '';
const EXPIRED_TOKEN = process.env.TEST_EXPIRED_TOKEN || '';

test.describe('Balance - lien invalide / expire', () => {
  test.skip(!RUN, 'RUN_E2E=true requis');

  test('lien balance avec token invalide -> message d erreur', async ({ page }) => {
    // ID factice + token factice
    await page.goto(
      '/fr/vip/reservation/reservation-invalid-id/balance?token=invalid-token-xxx',
    );

    // On accepte 2 comportements valides :
    //  1. Page d'erreur 4xx avec contenu sobre
    //  2. Page rendue avec message "Lien invalide" ou "Lien expire"
    const body = page.locator('body');
    await expect(body).toContainText(
      /(invalide|expir|erreur|introuvable|delai)/i,
      { timeout: 10_000 },
    );
  });

  test('lien balance expire (fixture)', async ({ page }) => {
    test.skip(
      !EXPIRED_RESA || !EXPIRED_TOKEN,
      'Fixture TEST_EXPIRED_RESA_ID + TEST_EXPIRED_TOKEN requise',
    );

    await page.goto(
      `/fr/vip/reservation/${EXPIRED_RESA}/balance?token=${EXPIRED_TOKEN}`,
    );

    const body = page.locator('body');
    await expect(body).toContainText(/(expir|delai|invalide)/i, {
      timeout: 10_000,
    });
  });
});

// Lalou
