import { test, expect, Page } from '@playwright/test';

/**
 * E2E — Parcours VIP complet : auth → reservation → signature → checkout
 *
 * Sprint 8 — Tests skippes par defaut, actives via RUN_E2E=true.
 *
 * Pre-requis pour activer :
 *  - Dev server lance (bun run dev sur :3000)
 *  - Un code VIP valide en base : TEST_VIP_CODE=XXXXXXXX
 *  - Une toile reservable (ex : TEST_TOILE_ID=1)
 *  - Stripe en mode test (cle pk_test_*)
 *
 * Strategie : on s'arrete a l'URL Stripe Checkout (pas de saisie carte).
 *
 * @author Lalou
 */

const RUN = process.env.RUN_E2E === 'true';
const VIP_CODE = process.env.TEST_VIP_CODE || '';
const TOILE_ID = process.env.TEST_TOILE_ID || '1';

test.describe('VIP - flow complet auth + reservation + signature + checkout', () => {
  test.skip(!RUN || !VIP_CODE, 'RUN_E2E=true + TEST_VIP_CODE requis');

  test('auth VIP via formulaire code 8 chars', async ({ page }) => {
    await page.goto('/fr/vip');

    const codeInput = page.locator('input[name="code"]');
    await expect(codeInput).toBeVisible();

    await codeInput.fill(VIP_CODE);

    const submit = page.getByRole('button', { name: /entrer|enter/i });
    await submit.click();

    // Apres validation, reload : on doit voir l'entree VIP (titre ou bouton sortir)
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/GUILLAUME FARR/i)).toBeVisible({ timeout: 10_000 });
  });

  test('reservation form + signature + Stripe Checkout (paiement integral)', async ({
    page,
  }) => {
    await authenticateVip(page, VIP_CODE);

    // Naviguer vers une toile reservable. Selon UI :
    // - ToilesContent expose un bouton "Reserver" / "Reservation"
    await page.goto('/fr/vip');
    await page.waitForLoadState('networkidle');

    const reserveBtn = page
      .getByRole('button', { name: /reserver|reservation/i })
      .first();

    // Si pas de bouton Reserver visible (toutes deja vendues), skip
    if ((await reserveBtn.count()) === 0) {
      test.skip(true, 'Aucune toile reservable trouvee');
      return;
    }
    await reserveBtn.click();

    // Form de reservation
    await page.waitForURL(/\/vip\/reservation\//);

    // Remplir form Particulier
    const particulierRadio = page
      .getByRole('radio', { name: /particulier/i })
      .or(page.getByLabel(/particulier/i))
      .first();
    if (await particulierRadio.isVisible().catch(() => false)) {
      await particulierRadio.click();
    }

    await fillIfVisible(page, 'input[name="firstName"], [name="prenom"]', 'Jean');
    await fillIfVisible(page, 'input[name="lastName"], [name="nom"]', 'Dupont');
    await fillIfVisible(page, 'input[name="email"]', 'test-e2e@example.com');
    await fillIfVisible(page, 'input[name="phone"], [name="telephone"]', '0612345678');
    await fillIfVisible(page, 'input[name="address"], [name="adresse"]', '1 rue Test');
    await fillIfVisible(page, 'input[name="city"], [name="ville"]', 'Paris');
    await fillIfVisible(page, 'input[name="postalCode"], [name="codePostal"]', '75001');

    // Submit form -> step signature
    const submitForm = page.getByRole('button', { name: /suivant|continuer|valider/i });
    await submitForm.first().click().catch(() => null);

    // Signature canvas : dessin minimal
    const canvas = page.locator('canvas').first();
    await canvas.waitFor({ state: 'visible', timeout: 10_000 });

    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + 20, box.y + 20);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width - 20, box.y + box.height - 20);
      await page.mouse.up();
    }

    // Choisir methode paiement integral CB
    const integralBtn = page
      .getByRole('button', { name: /integral|carte bancaire/i })
      .first();
    if (await integralBtn.isVisible().catch(() => false)) {
      await integralBtn.click();
    }

    // Confirmer signature + paiement
    const signSubmit = page.getByRole('button', { name: /signer|finaliser/i });
    await signSubmit.first().click().catch(() => null);

    // Attente redirection Stripe (URL contient checkout.stripe.com ou /checkout)
    await page.waitForURL(
      (url) =>
        url.href.includes('checkout.stripe.com') ||
        url.pathname.includes('/checkout'),
      { timeout: 30_000 },
    );

    expect(page.url()).toMatch(/checkout/);
  });
});

async function authenticateVip(page: Page, code: string) {
  await page.goto('/fr/vip');
  const codeInput = page.locator('input[name="code"]');
  if (await codeInput.isVisible().catch(() => false)) {
    await codeInput.fill(code);
    const submit = page.getByRole('button', { name: /entrer|enter/i });
    await submit.click();
    await page.waitForLoadState('networkidle');
  }
}

async function fillIfVisible(page: Page, selector: string, value: string) {
  const loc = page.locator(selector).first();
  if (await loc.isVisible().catch(() => false)) {
    await loc.fill(value);
  }
}

// Lalou
