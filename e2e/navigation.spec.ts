import { test, expect } from '@playwright/test';

/**
 * Tests E2E - Navigation site
 * Guillaume Farré
 *
 * Teste la navigation entre les pages principales
 */

test.describe('Navigation globale', () => {

  test('devrait naviguer homepage → boutique → galerie → contact', async ({ page }) => {
    // Homepage
    await page.goto('/fr');
    await expect(page.locator('h1')).toBeVisible();

    // Boutique
    await page.click('a[href*="/boutique"]');
    await page.waitForURL('**/boutique');
    await expect(page).toHaveURL(/boutique/);

    // Galerie
    await page.click('a[href*="/galerie"]');
    await page.waitForURL('**/galerie');
    await expect(page).toHaveURL(/galerie/);

    // Contact
    await page.click('a[href*="/contact"]');
    await page.waitForURL('**/contact');
    await expect(page).toHaveURL(/contact/);
  });

  test('devrait switcher de langue FR → EN → IT', async ({ page }) => {
    await page.goto('/fr');

    // Switch EN
    const enLink = page.locator('a[href^="/en"]').first();
    if (await enLink.isVisible()) {
      await enLink.click();
      await expect(page).toHaveURL(/\/en\//);
    }

    // Switch IT
    const itLink = page.locator('a[href^="/it"]').first();
    if (await itLink.isVisible()) {
      await itLink.click();
      await expect(page).toHaveURL(/\/it\//);
    }
  });

});

// Lalou
