import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E — Audit accessibilite axe-core sur les pages cles publiques.
 *
 * Sprint 8 — Inactivable. Tourne sur pages publiques sans auth (sauf admin
 * qui requiert ADMIN_PASSWORD et est skip si absent).
 *
 * Bareme : echec si violation `critical` ou `serious`. Les violations
 * `moderate` et `minor` sont loggees mais ne font pas echouer le test
 * (objectif Sprint 8 = baseline propre, scope sprint ulterieur = perfection).
 *
 * @author Lalou
 */

const PUBLIC_PAGES = [
  { path: '/fr', name: 'Homepage FR' },
  { path: '/fr/toiles', name: 'Toiles' },
  { path: '/fr/vip', name: 'VIP (form code)' },
  { path: '/fr/contact', name: 'Contact' },
  { path: '/fr/galerie', name: 'Galerie' },
];

const BLOCKING_IMPACTS = ['critical', 'serious'] as const;
type Impact = (typeof BLOCKING_IMPACTS)[number] | 'moderate' | 'minor';

for (const { path, name } of PUBLIC_PAGES) {
  test(`a11y — ${name} (${path}) sans violations critical/serious`, async ({
    page,
  }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const blocking = results.violations.filter((v) =>
      (BLOCKING_IMPACTS as readonly Impact[]).includes(v.impact as Impact),
    );

    if (results.violations.length > 0) {
      console.log(`\n[a11y] ${name} — ${results.violations.length} violation(s) :`);
      for (const v of results.violations) {
        console.log(`  [${v.impact}] ${v.id} — ${v.description} (${v.nodes.length} node(s))`);
      }
    }

    expect(
      blocking,
      `${blocking.length} violation(s) bloquante(s) sur ${name}`,
    ).toEqual([]);
  });
}

test('a11y — admin reservations (optionnel)', async ({ page }) => {
  const pwd = process.env.ADMIN_PASSWORD || 'Guillaumedinoman2025!';

  await page.goto('/fr/admin');
  const pwdInput = page.locator('input[type="password"]').first();
  if (await pwdInput.isVisible().catch(() => false)) {
    await pwdInput.fill(pwd);
    await page
      .getByRole('button', { name: /se connecter|connexion|login/i })
      .first()
      .click()
      .catch(() => null);
    await page.waitForLoadState('networkidle');
  }

  await page.goto('/fr/admin/vip/reservations');
  await page.waitForLoadState('networkidle');

  // Si redirige vers login (auth pas valide), skip
  if (page.url().includes('/login') || page.url().endsWith('/admin')) {
    test.skip(true, 'Admin auth requise');
    return;
  }

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  const blocking = results.violations.filter((v) =>
    (BLOCKING_IMPACTS as readonly Impact[]).includes(v.impact as Impact),
  );

  if (results.violations.length > 0) {
    console.log(`\n[a11y] Admin reservations — ${results.violations.length} violation(s)`);
    for (const v of results.violations) {
      console.log(`  [${v.impact}] ${v.id} — ${v.description}`);
    }
  }

  expect(blocking).toEqual([]);
});

// Lalou
