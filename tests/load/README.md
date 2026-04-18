# Load tests k6 (lecture seule)

Tests de charge en lecture seule pour le site Guillaume Farre. Ciblent uniquement
les endpoints GET publics (pas d'ecriture, pas d'auth, pas de Stripe).

## Prerequis

```bash
brew install k6
```

Verification : `k6 version` (teste avec k6 1.7.1).

## Endpoints cibles

- `GET /fr` — homepage
- `GET /fr/galerie` — page galerie
- `GET /fr/galerie-item/:slug` — detail photo (slug par defaut : `photos-1`)
- `GET /api/health` — healthcheck JSON

## Execution

1. Lancer un serveur local en production :
   ```bash
   bun run build
   bun run start
   ```
2. Dans un autre terminal, lancer le test :
   ```bash
   bun run load:smoke    # 1 VU, 1 min — validation rapide
   bun run load:load     # 10 VU, 3 min — charge realiste
   bun run load:stress   # jusqu'a 50 VU, 5 min — stress
   ```

## Variables d'environnement

| Variable     | Defaut                   | Description                          |
|--------------|--------------------------|--------------------------------------|
| `BASE_URL`   | `http://localhost:3000`  | URL cible                            |
| `PHOTO_SLUG` | `photos-1`               | Slug photo pour /fr/galerie-item/... |

Exemple : `BASE_URL=http://localhost:3000 k6 run tests/load/smoke.js`.

## Sorties

Chaque test ecrit un JSON dans `tests/load/reports/<nom>-summary.json`.

## Scope

- **Lecture seule** : aucun POST/PUT/DELETE.
- **Pas de prod** : `guillaumefarre.com` n'est jamais cible.
- **Pas d'auth ni Stripe** : `/api/auth/*`, `/api/admin/*`, `/api/stripe/*`,
  `/api/contact` exclus (effets de bord : sessions, mails).

## Limites machine

Tests calibres pour MacBook Pro M1 8 GB : smoke 1 VU, load 10 VU, stress 50 VU max.
