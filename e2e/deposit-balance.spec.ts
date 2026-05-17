import { test, expect, Page } from '@playwright/test';

/**
 * E2E — Parcours acompte 30% + lien paiement solde via email.
 *
 * Sprint 8 — Tests skippes par defaut, actives via RUN_E2E=true.
 *
 * Strategie :
 *  - Selection du mode `deposit_balance` au moment de la signature.
 *  - Redirection vers Stripe Checkout (acompte 30% en mode test).
 *  - On NE saisit PAS la carte, on s'arrete a l'URL Stripe.
 *
 * @author Lalou
 */

const RUN = process.env.RUN_E2E === 'true';
const VIP_CODE = process.env.TEST_VIP_CODE || '';

test.describe('VIP - acompte 30% + solde 70% via lien email', () => {
  test.skip(!RUN || !VIP_CODE, 'RUN_E2E=true + TEST_VIP_CODE requis');

  test('parcours acompte 30% redirige vers Stripe', async ({ page }) => {
    await authenticateVip(page, VIP_CODE);

    await page.goto('/fr/vip');
    const reserveBtn = page
      .getByRole('button', { name: /reserver|reservation/i })
      .first();

    if ((await reserveBtn.count()) === 0) {
      test.skip(true, 'Aucune toile reservable trouvee');
      return;
    }
    await reserveBtn.click();

    await page.waitForURL(/\/vip\/reservation\//);

    // Minimum form
    await fillIfVisible(page, 'input[name="firstName"]', 'Jean');
    await fillIfVisible(page, 'input[name="lastName"]', 'Dupont');
    await fillIfVisible(page, 'input[name="email"]', 'test-acompte@example.com');
    await fillIfVisible(page, 'input[name="phone"]', '0612345678');
    await fillIfVisible(page, 'input[name="address"]', '1 rue Test');
    await fillIfVisible(page, 'input[name="city"]', 'Paris');
    await fillIfVisible(page, 'input[name="postalCode"]', '75001');

    await page
      .getByRole('button', { name: /suivant|continuer|valider/i })
      .first()
      .click()
      .catch(() => null);

    // Signature
    const canvas = page.locator('canvas').first();
    await canvas.waitFor({ state: 'visible', timeout: 10_000 });
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + 20, box.y + 20);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width - 20, box.y + box.height - 20);
      await page.mouse.up();
    }

    // Choisir mode "acompte" / "deposit_balance"
    const depositBtn = page
      .getByRole('button', { name: /acompte|deposit|30/i })
      .first();
    if (await depositBtn.isVisible().catch(() => false)) {
      await depositBtn.click();
    }

    await page
      .getByRole('button', { name: /signer|finaliser/i })
      .first()
      .click()
      .catch(() => null);

    // Stripe Checkout pour l'acompte
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
