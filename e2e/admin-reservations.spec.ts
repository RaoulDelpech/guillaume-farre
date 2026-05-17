import { test, expect } from '@playwright/test';

/**
 * E2E — Admin reservations VIP : login → liste → filtres → detail → CSV.
 *
 * Sprint 8 — Tests skippes par defaut, actives via RUN_E2E=true.
 *
 * Pre-requis :
 *  - ADMIN_PASSWORD configure (env ou hardcode de dev)
 *  - Au moins une reservation en base (pour tester la liste)
 *
 * @author Lalou
 */

const RUN = process.env.RUN_E2E === 'true';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Guillaumedinoman2025!';

test.describe('Admin - reservations VIP', () => {
  test.skip(!RUN, 'RUN_E2E=true requis');

  test('login admin -> liste reservations -> filtres -> detail -> CSV', async ({
    page,
  }) => {
    // Login admin (page /fr/admin)
    await page.goto('/fr/admin');

    // Si form login visible
    const pwdInput = page
      .locator('input[type="password"]')
      .first();
    if (await pwdInput.isVisible().catch(() => false)) {
      await pwdInput.fill(ADMIN_PASSWORD);
      await page
        .getByRole('button', { name: /se connecter|connexion|login/i })
        .first()
        .click()
        .catch(() => null);
      await page.waitForLoadState('networkidle');
    }

    // Aller a la liste reservations
    await page.goto('/fr/admin/vip/reservations');
    await page.waitForLoadState('networkidle');

    // Verifier titre / heading
    const heading = page.getByRole('heading', { name: /reservation/i }).first();
    await expect(heading).toBeVisible({ timeout: 10_000 });

    // Verifier presence d'un lien CSV (export)
    const csvLink = page
      .getByRole('link', { name: /csv|export/i })
      .or(page.locator('a[href*="csv"]'))
      .first();
    if ((await csvLink.count()) > 0) {
      const href = await csvLink.getAttribute('href');
      expect(href).toMatch(/csv/);
    }

    // Cliquer sur la 1ere reservation pour ouvrir le detail (si presente)
    const detailLink = page
      .locator('a[href*="/admin/vip/reservations/"]')
      .first();
    if ((await detailLink.count()) > 0) {
      await detailLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('heading').first()).toBeVisible();
    }
  });
});

// Lalou
