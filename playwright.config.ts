import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for E2E tests
 * Guillaume Farré - Site artiste
 *
 * Variables d'env :
 *   - PLAYWRIGHT_BASE_URL : override la baseURL (defaut localhost:3000)
 *   - PLAYWRIGHT_SKIP_WEBSERVER=1 : ne pas demarrer le dev server
 *     (utile pour run contre prod ou environnement deja demarre)
 *
 * @see https://playwright.dev/docs/test-configuration
 */
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const SKIP_WEBSERVER = process.env.PLAYWRIGHT_SKIP_WEBSERVER === '1';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: SKIP_WEBSERVER
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
      },
});

// Lalou
