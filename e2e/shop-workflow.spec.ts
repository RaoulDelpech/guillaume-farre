import { test, expect } from '@playwright/test';

/**
 * Tests E2E - Workflow boutique complet
 * Guillaume Farré - Site artiste
 *
 * Teste le parcours client A→Z:
 * - Navigation boutique
 * - Sélection photo
 * - Choix format (Limited/Unlimited)
 * - Ajout panier
 * - Checkout Stripe
 */

test.describe('Boutique - Workflow complet client', () => {

  test('devrait afficher la boutique avec photos disponibles', async ({ page }) => {
    await page.goto('/fr/boutique');

    // Vérifier titre page
    await expect(page.locator('h1')).toContainText('Boutique');

    // Vérifier présence de photos
    const photos = page.locator('[data-testid="photo-card"]');
    await expect(photos.first()).toBeVisible();

    // Vérifier métadonnées photo (titre, prix, format)
    await expect(photos.first().locator('[data-testid="photo-title"]')).toBeVisible();
    await expect(photos.first().locator('[data-testid="photo-price"]')).toBeVisible();
  });

  test('devrait ouvrir modal détails photo et choisir format', async ({ page }) => {
    await page.goto('/fr/boutique');

    // Cliquer sur première photo
    await page.locator('[data-testid="photo-card"]').first().click();

    // Vérifier modal ouverte
    await expect(page.locator('[data-testid="photo-modal"]')).toBeVisible();

    // Vérifier options format (Limited/Unlimited)
    await expect(page.locator('[data-testid="format-selector"]')).toBeVisible();

    // Sélectionner format Limited
    await page.locator('[data-testid="format-limited"]').click();

    // Vérifier tailles disponibles (Small, Medium, Large)
    await expect(page.locator('[data-testid="size-small"]')).toBeVisible();
    await expect(page.locator('[data-testid="size-medium"]')).toBeVisible();
    await expect(page.locator('[data-testid="size-large"]')).toBeVisible();
  });

  test('devrait ajouter photo au panier avec format choisi', async ({ page }) => {
    await page.goto('/fr/boutique');

    // Ouvrir modal
    await page.locator('[data-testid="photo-card"]').first().click();

    // Choisir format Limited + taille Medium
    await page.locator('[data-testid="format-limited"]').click();
    await page.locator('[data-testid="size-medium"]').click();

    // Ajouter au panier
    await page.locator('[data-testid="add-to-cart"]').click();

    // Vérifier confirmation
    await expect(page.locator('[data-testid="cart-confirmation"]')).toContainText('Ajouté au panier');

    // Vérifier badge panier (1 article)
    await expect(page.locator('[data-testid="cart-badge"]')).toContainText('1');
  });

  test('devrait afficher panier avec articles sélectionnés', async ({ page }) => {
    await page.goto('/fr/boutique');

    // Ajouter 2 photos au panier
    const photos = page.locator('[data-testid="photo-card"]');

    // Photo 1: Limited Medium
    await photos.nth(0).click();
    await page.locator('[data-testid="format-limited"]').click();
    await page.locator('[data-testid="size-medium"]').click();
    await page.locator('[data-testid="add-to-cart"]').click();
    await page.locator('[data-testid="close-modal"]').click();

    // Photo 2: Unlimited Large
    await photos.nth(1).click();
    await page.locator('[data-testid="format-unlimited"]').click();
    await page.locator('[data-testid="size-large"]').click();
    await page.locator('[data-testid="add-to-cart"]').click();

    // Aller au panier
    await page.locator('[data-testid="cart-icon"]').click();
    await page.goto('/fr/panier');

    // Vérifier 2 articles dans panier
    const cartItems = page.locator('[data-testid="cart-item"]');
    await expect(cartItems).toHaveCount(2);

    // Vérifier détails articles
    await expect(cartItems.nth(0)).toContainText('Limited');
    await expect(cartItems.nth(0)).toContainText('Medium');
    await expect(cartItems.nth(1)).toContainText('Unlimited');
    await expect(cartItems.nth(1)).toContainText('Large');

    // Vérifier total
    await expect(page.locator('[data-testid="cart-total"]')).toBeVisible();
  });

  test('devrait permettre de modifier quantité dans panier', async ({ page }) => {
    await page.goto('/fr/panier');

    // Vérifier boutons +/-
    const firstItem = page.locator('[data-testid="cart-item"]').first();
    await expect(firstItem.locator('[data-testid="quantity-decrease"]')).toBeVisible();
    await expect(firstItem.locator('[data-testid="quantity-increase"]')).toBeVisible();

    // Augmenter quantité
    await firstItem.locator('[data-testid="quantity-increase"]').click();
    await expect(firstItem.locator('[data-testid="quantity"]')).toContainText('2');

    // Diminuer quantité
    await firstItem.locator('[data-testid="quantity-decrease"]').click();
    await expect(firstItem.locator('[data-testid="quantity"]')).toContainText('1');
  });

  test('devrait permettre de supprimer article du panier', async ({ page }) => {
    await page.goto('/fr/panier');

    const initialCount = await page.locator('[data-testid="cart-item"]').count();

    // Supprimer premier article
    await page.locator('[data-testid="cart-item"]').first().locator('[data-testid="remove-item"]').click();

    // Vérifier confirmation
    await expect(page.locator('[data-testid="remove-confirmation"]')).toBeVisible();
    await page.locator('[data-testid="confirm-remove"]').click();

    // Vérifier article supprimé
    const newCount = await page.locator('[data-testid="cart-item"]').count();
    expect(newCount).toBe(initialCount - 1);
  });

  test('devrait rediriger vers checkout Stripe au paiement', async ({ page }) => {
    await page.goto('/fr/panier');

    // Cliquer bouton paiement
    await page.locator('[data-testid="checkout-button"]').click();

    // En mode test: vérifier redirection vers page checkout
    // (En production: vérifierait redirection Stripe)
    await expect(page).toHaveURL(/checkout/);
  });

  test('devrait afficher panier vide si aucun article', async ({ page }) => {
    // Vider localStorage (panier stocké localement)
    await page.goto('/fr/panier');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Vérifier message panier vide
    await expect(page.locator('[data-testid="empty-cart"]')).toContainText('Votre panier est vide');

    // Vérifier lien retour boutique
    await expect(page.locator('[data-testid="back-to-shop"]')).toBeVisible();
  });
});

test.describe('Boutique - Traductions multilingues', () => {

  test('devrait afficher boutique en français', async ({ page }) => {
    await page.goto('/fr/boutique');
    await expect(page.locator('h1')).toContainText('Boutique');
    await expect(page.locator('[data-testid="add-to-cart"]').first()).toContainText('Ajouter');
  });

  test('devrait afficher boutique en anglais', async ({ page }) => {
    await page.goto('/en/boutique');
    await expect(page.locator('h1')).toContainText('Shop');
    await expect(page.locator('[data-testid="add-to-cart"]').first()).toContainText('Add');
  });

  test('devrait afficher boutique en italien', async ({ page }) => {
    await page.goto('/it/boutique');
    await expect(page.locator('h1')).toContainText('Negozio');
    await expect(page.locator('[data-testid="add-to-cart"]').first()).toContainText('Aggiungi');
  });

  test('devrait changer langue via sélecteur', async ({ page }) => {
    await page.goto('/fr/boutique');

    // Vérifier titre FR
    await expect(page.locator('h1')).toContainText('Boutique');

    // Changer vers EN
    await page.locator('[data-testid="language-switcher"]').click();
    await page.locator('[data-testid="lang-en"]').click();

    // Vérifier changement URL et contenu
    await expect(page).toHaveURL(/\/en\//);
    await expect(page.locator('h1')).toContainText('Shop');
  });
});

test.describe('Boutique - Éditions limitées', () => {

  test('devrait afficher badge "Édition limitée" sur photos limited', async ({ page }) => {
    await page.goto('/fr/boutique');

    // Trouver première photo Limited
    const limitedPhoto = page.locator('[data-testid="photo-card"][data-edition="limited"]').first();
    await expect(limitedPhoto.locator('[data-testid="limited-badge"]')).toContainText('Édition limitée');
  });

  test('devrait afficher compteur exemplaires restants', async ({ page }) => {
    await page.goto('/fr/boutique');

    // Ouvrir photo Limited
    await page.locator('[data-testid="photo-card"][data-edition="limited"]').first().click();

    // Vérifier compteur (ex: "3/7 disponibles")
    await expect(page.locator('[data-testid="edition-counter"]')).toBeVisible();
    await expect(page.locator('[data-testid="edition-counter"]')).toContainText('/7');
  });

  test('devrait désactiver achat si édition épuisée', async ({ page }) => {
    await page.goto('/fr/boutique');

    // Simuler photo épuisée (0/7)
    // Note: nécessite mock ou fixture avec édition épuisée
    const soldOutPhoto = page.locator('[data-testid="photo-card"][data-sold-out="true"]').first();

    if (await soldOutPhoto.isVisible()) {
      await soldOutPhoto.click();

      // Vérifier bouton désactivé
      await expect(page.locator('[data-testid="add-to-cart"]')).toBeDisabled();
      await expect(page.locator('[data-testid="sold-out-message"]')).toContainText('Épuisé');
    }
  });
});

// Lalou
