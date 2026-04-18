# Load test k6 — Resultats

Date : 2026-04-18
Scope : lecture seule, serveur local.

## Setup

| Element       | Valeur                                            |
|---------------|---------------------------------------------------|
| k6 version    | 1.7.1                                             |
| Machine       | MacBook Pro M1, 8 GB RAM, 8 CPU cores             |
| OS            | Darwin 24.6.0                                     |
| Node server   | Next.js 15.5.15 (production build)                |
| Runtime       | Bun                                               |
| BASE_URL      | http://localhost:3000                             |
| NODE_ENV      | production                                        |
| NEXT_TELEMETRY_DISABLED | 1                                       |
| Cache state   | warm (uptime ~49s avant smoke, pas de cold-start) |

## Methode

Serveur lance via `NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production bun run start`.
Trois scripts executes sequentiellement :
- `k6 run tests/load/smoke.js` — 1 VU, 1 min
- `k6 run tests/load/load.js` — ramp 0→10 VU sur 30s, 10 VU pendant 2 min, ramp 10→0 sur 30s
- `k6 run tests/load/stress.js` — ramp 0→20 VU sur 1 min, puis 20→50 VU sur 2 min, palier 50 VU 1 min, ramp 50→0 sur 1 min

Endpoints cibles (GET uniquement) :
- `/fr` (homepage, SSG)
- `/fr/galerie` (SSG)
- `/fr/galerie-item/photos-1` (SSG via `generateStaticParams`)
- `/api/health` (route dynamique)

Aucun POST/PUT/DELETE. Aucune route admin/auth/stripe/contact.

## Resultats

### Smoke test (1 VU, 1 min)

| Metrique                       | Valeur            |
|--------------------------------|-------------------|
| Requetes totales               | 60                |
| Req/s                          | ~1.0              |
| Error rate                     | 0.00 %            |
| Checks passed                  | 60 / 60           |
| http_req_duration avg          | 15.92 ms          |
| http_req_duration p(95)        | 25.74 ms          |
| http_req_duration max          | 27.66 ms          |

Par endpoint (ms) :

| Endpoint           | min  | avg  | med  | p(90) | p(95) | max  |
|--------------------|-----:|-----:|-----:|------:|------:|-----:|
| `/fr`              | 15.0 | 21.7 | 20.9 |  26.5 |  26.9 | 27.7 |
| `/fr/galerie`      | 13.4 | 18.5 | 19.5 |  22.5 |  23.2 | 23.5 |
| `/fr/galerie-item` | 12.0 | 18.7 | 18.6 |  24.1 |  25.0 | 25.7 |
| `/api/health`      |  2.6 |  4.8 |  5.1 |   6.5 |   6.8 |  7.5 |

### Load test (10 VU, 3 min)

| Metrique                       | Valeur    |
|--------------------------------|-----------|
| Requetes totales               | 766       |
| Req/s                          | 4.24      |
| Error rate                     | 0.00 %    |
| Checks passed                  | 766 / 766 |
| Data received                  | 58.14 MB  |
| http_req_duration avg          | 14.76 ms  |
| http_req_duration p(95)        | 23.29 ms  |
| http_req_duration p(99)        | 28.89 ms  |
| http_req_duration max          | 31.66 ms  |
| http_req_waiting (TTFB) avg    | 10.58 ms  |
| http_req_waiting (TTFB) p(95)  | 17.74 ms  |

Par endpoint (ms) :

| Endpoint           | min | avg  | med  | p(90) | p(95) | p(99) | max  |
|--------------------|----:|-----:|-----:|------:|------:|------:|-----:|
| `/fr`              | 9.6 | 16.9 | 16.7 |  20.9 |  23.7 |  30.5 | 31.7 |
| `/fr/galerie`      | 9.5 | 16.2 | 15.9 |  20.9 |  24.2 |  29.1 | 30.7 |
| `/fr/galerie-item` | 9.2 | 15.2 | 14.9 |  19.4 |  22.5 |  27.0 | 27.8 |
| `/api/health`      | 1.9 |  3.9 |  3.7 |   5.4 |   6.7 |   8.9 |  9.6 |

### Stress test (jusqu'a 50 VU, 5 min)

| Metrique                       | Valeur       |
|--------------------------------|--------------|
| Requetes totales               | 7 428        |
| Req/s                          | 24.73        |
| Error rate                     | 0.00 %       |
| Checks passed                  | 7428 / 7428  |
| Data received                  | 560.78 MB    |
| http_req_duration avg          | 11.31 ms     |
| http_req_duration p(95)        | 22.68 ms     |
| http_req_duration p(99)        | 30.90 ms     |
| http_req_duration max          | 56.17 ms     |

Par endpoint (ms) :

| Endpoint           | min | avg  | med  | p(90) | p(95) | p(99) | max  |
|--------------------|----:|-----:|-----:|------:|------:|------:|-----:|
| `/fr`              | 7.9 | 13.5 | 11.2 |  21.2 |  25.0 |  34.5 | 56.2 |
| `/fr/galerie`      | 7.5 | 11.8 | 10.4 |  17.1 |  20.2 |  25.7 | 33.5 |
| `/fr/galerie-item` | 6.9 | 12.4 | 10.1 |  19.9 |  23.5 |  31.6 | 51.8 |
| `/api/health`      | 1.1 |  2.7 |  2.1 |   4.5 |   6.0 |   8.8 | 17.4 |

Consommation serveur (next-server) :
- Avant tests : 100 MB RSS
- Apres load  : 270 MB RSS
- Apres stress : 193 MB RSS (stable)
- CPU : ~0% en idle, jamais vu au-dessus de quelques pourcents pendant la charge

## Goulots identifies

Sur la plage de charge testee (jusqu'a 50 VU, 24.73 req/s), **aucun goulot
significatif** n'a ete observe :

1. **`/fr` (homepage) est l'endpoint le plus lent** sous charge :
   - p(95) 25 ms sous 50 VU, max 56 ms isole
   - toujours largement en dessous du seuil de 3000 ms
2. **`/fr/galerie-item` second plus lent** (p95 23.5 ms sous 50 VU)
3. **`/api/health` reste le plus rapide** (~3 ms avg) meme sous charge
4. Aucune erreur HTTP, aucun timeout, aucune connexion refusee sur 7 428 requetes
5. Le serveur ne consomme que ~200 MB RSS et tient la charge sans transpiration

Interpretation :
- Les 3 pages HTML testees sont **SSG (prerendered at build time)** d'apres
  la sortie `next build`, servies depuis le filesystem avec cache in-memory
- `/api/health` est dynamique mais trivial (retourne un JSON constant)
- Le site est sous-teste ici : il faudrait une charge bien superieure (ou des
  endpoints dynamiques reels) pour exhiber un goulot

## Recommandations

1. **Ajouter au scope des tests les endpoints dynamiques qui comptent**.
   Les tests actuels ne mettent en cause que les pages SSG, qui sont par nature
   ultra-rapides. Pour un diagnostic realiste, ajouter en lecture seule :
   - `GET /api/editions` (lecture etat des editions limitees — verifier non cite dans interdits)
   - `GET /api/vip/list` est dans les interdits, ne pas ajouter
   - `GET /sitemap.xml` (genere a la volee, depend de `getWorksFromMetadata`)
   - `GET /robots.txt`
   Ces endpoints touchent potentiellement disk I/O (lecture `photo-metadata.json`).
2. **Tester avec un slug inexistant** pour valider la gestion 404.
   Ajouter un scenario `/fr/galerie-item/slug-inexistant` attendant un 404
   (pas un 500). Actuellement non couvert.
3. **Benchmark cold-start** : le serveur testait avec cache warm (uptime 49s
   avant smoke). Pour une baseline realistique apres deploy, relancer apres
   `pkill next-server && bun run start` et mesurer la premiere minute.
4. **Augmenter la charge** : a 50 VU / 24 req/s la machine ne sue pas. Pour
   trouver le vrai plafond il faudrait pousser a 200-500 VU, mais la contrainte
   8 GB RAM impose de le faire depuis une autre machine (ou en isole).
5. **Monitorer en prod** : ajouter des Real User Monitoring (deja en place
   via web-vitals + Clarity d'apres les memoires projet) pour comparer les
   p(95) observes ici (local, SSG) avec ceux reels sur VPS OVH + reseau.

## Reproduire

Voir `tests/load/README.md`. En bref :

```bash
# Prerequis
brew install k6

# Serveur local
bun run build
NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production bun run start &

# Attendre /api/health=200 puis :
bun run load:smoke
bun run load:load
bun run load:stress   # optionnel, plus long
```

Les rapports JSON bruts sont ecrits dans `tests/load/reports/`
(ignores par git).
