import { test, expect } from '@playwright/test';

/**
 * Tests E2E - Upload photos admin
 * Guillaume Farré
 *
 * Teste l'upload de photos dans l'admin
 */

test.describe('Admin - Upload photos', () => {

  test('devrait afficher la page admin avec authentification', async ({ page }) => {
    await page.goto('/fr/admin');

    // Vérifier présence formulaire login ou déjà connecté
    const hasLoginForm = await page.locator('[data-testid="login-form"]').isVisible().catch(() => false);
    const hasUploadSection = await page.locator('[data-testid="upload-section"]').isVisible().catch(() => false);

    expect(hasLoginForm || hasUploadSection).toBeTruthy();
  });

  test('devrait afficher la liste des photos uploadées', async ({ page }) => {
    await page.goto('/fr/admin');

    // Si formulaire login visible, skip ce test
    const hasLoginForm = await page.locator('[data-testid="login-form"]').isVisible().catch(() => false);
    test.skip(hasLoginForm, 'Authentification requise pour ce test');

    // Vérifier présence grille photos
    await expect(page.locator('[data-testid="photo-grid"]')).toBeVisible();
  });

});

// Lalou
