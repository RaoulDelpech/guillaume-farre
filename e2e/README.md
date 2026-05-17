# Tests E2E — Guillaume Farré

Playwright `@playwright/test` + `@axe-core/playwright`.

## Lancer en local

```bash
# Pre-requis : dev server lance
bun run dev

# Tous les E2E (sans VIP/admin fixtures, juste smoke)
bunx playwright test

# Avec VIP flow complet (auth → reservation → signature → Stripe URL)
RUN_E2E=true TEST_VIP_CODE=XXXXXXXX bunx playwright test

# Avec admin
RUN_E2E=true ADMIN_PASSWORD=xxx bunx playwright test admin-reservations

# Avec expiration solde (fixture)
RUN_E2E=true \
  TEST_EXPIRED_RESA_ID=resa-... \
  TEST_EXPIRED_TOKEN=eyJhbGc... \
  bunx playwright test balance-expiration

# A11y uniquement
bunx playwright test a11y
```

## Strategie

- **`RUN_E2E=true`** active les scenarios qui exigent un dev server avec
  donnees test. Sans cette var, les tests sont skip (CI safe).
- Les scenarios VIP s'arretent a l'URL Stripe Checkout (mode test). On ne
  saisit aucune carte (pas de side effect sur le compte Stripe).
- Les expectations sont volontairement tolerantes (selectors role/text
  plutot que data-testid) pour resister aux refactors UI.

## Scenarios couverts (Sprint 8)

| Fichier | Scenario | Fixture requise |
|---------|----------|-----------------|
| `vip-flow.spec.ts` | Auth + reservation + signature + checkout integral | `TEST_VIP_CODE` |
| `deposit-balance.spec.ts` | Acompte 30% Stripe Checkout | `TEST_VIP_CODE` |
| `admin-reservations.spec.ts` | Login admin + liste + filtres + detail + CSV | `ADMIN_PASSWORD` |
| `balance-expiration.spec.ts` | Lien solde invalide / expire | optionnelle |
| `a11y.spec.ts` | axe-core sur 6 pages publiques | aucune |
| `navigation.spec.ts` | Smoke nav globale (legacy) | aucune |
| `admin-upload.spec.ts` | Smoke admin upload (legacy) | aucune |

## A11y — bareme

`a11y.spec.ts` echoue si une page contient une violation `critical` ou
`serious`. Les violations `moderate` / `minor` sont loggees en warning
mais ne bloquent pas la CI. La liste complete est imprimee a la fin de
chaque test pour suivi.

---

Lalou
