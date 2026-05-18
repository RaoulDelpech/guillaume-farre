# Feature VIP — Zone privee toiles + signature + paiement

Date de specification : 2026-05-14
Auteur des decisions : Raoul (pilote) / Lalou (architecte)
Statut : specifications verrouillees, sprints en cours

---

## 1. But de la feature

Permettre a Guillaume Farre de generer une invitation VIP via QR code donnant acces, pendant 24h, a une zone privee de son site ou les invites peuvent :
- Voir les toiles (uniquement les toiles, pas les photographies) avec leurs prix
- Reserver une toile
- Signer un contrat d'acquisition en ligne
- Payer (CB integral en priorite, acompte 30% en fallback si CB plafonnee, facture par email en dernier recours)

Le site public ordinaire continue d'exister en parallele : photographies + toiles **sans prix** + histoire + contact. La zone privee est strictement orthogonale.

---

## 2. Decisions structurantes (verrouillees)

| # | Sujet | Decision retenue |
|---|---|---|
| 1 | Mode du site | `SITE_MODE=public` + zone privee VIP en parallele (bascule prevue Sprint 8) |
| 2 | Structure zone privee | Route privee dediee (= `/vip` en mode tout-en-un, contenu adapte au cookie) |
| 3 | Code VIP | Reutilisable 24h, poly-use (cookie pose a chaque scan) |
| 4 | Techno e-signature | Canvas + PDF embarque (`react-signature-canvas`), eIDAS simple, zero service tiers |
| 5 | Moment signature | Immediate au moment de la reservation |
| 6 | Paiement | 3 niveaux : CB integral d'abord → decline → acompte 30% ou facture par email |
| 7 | Cadre juridique | Mention 14j legaux + arrhes art. 1590 + frais forfaitaires 300 EUR post-14j |
| 8 | Affichage toile reservee | Visible + prix + bouton desactive + mention "Reservee jusqu'au {date}" |
| 9 | Champs formulaire | Minimum legal : nom complet, email, telephone, adresse complete, type acheteur (particulier/pro), SIRET si pro + message libre 500 chars |
| 10 | Multi-toiles | Achat individuel + bouton "Continuer la visite" apres paiement reussi |
| 11 | Notifications Guillaume | Email uniquement via Resend (variable d'env `WHATSAPP_NOTIFICATIONS=false` reservee pour activation future) |
| 12 | Cookie expiration | Strict 24h zone privee + token HMAC transaction (lifetime separe) pour finaliser proprement les transactions en cours |
| 13 | Reservations non payees | Auto-relances Stripe a J+3 et J+7 (natives) → decision manuelle Guillaume a J+14 (relancer / annuler+liberer / encaisser+finaliser) |
| 14 | Concurrence | Verification atomique cote API + verrou optimiste, mutex via fichier `data/lock.json` |

---

## 3. Statuts reservation (modele de donnees)

Sequence cible :

```
pending → signed → partial_paid (optionnel) → paid
                ↘ expired (J+7 ou J+14 sans paiement)
                ↘ cancelled (annulation manuelle Guillaume)
                ↘ refunded (retractation pendant 14j legaux)
```

Champs ajoutes/modifies dans `data/reservations.json` :

| Champ | Type | Description |
|---|---|---|
| `id` | string (UUID) | Existant |
| `canvasTitle` | string | Existant |
| `name` | string | Existant — etendu : prenom + nom complet |
| `email` | string | Existant |
| `phone` | string | Existant |
| `address` | object | NOUVEAU : `{ line1, line2?, city, postalCode, country }` |
| `buyerType` | enum | NOUVEAU : `particulier` ou `professionnel` |
| `siret` | string | NOUVEAU : optionnel, requis si `professionnel` |
| `companyName` | string | NOUVEAU : optionnel, requis si `professionnel` |
| `message` | string | Existant — optionnel, max 500 chars |
| `createdAt` | string (ISO) | Existant |
| `status` | enum | Existant — etendu : pending / signed / partial_paid / paid / expired / cancelled / refunded |
| `signedAt` | string (ISO) | NOUVEAU |
| `signatureIp` | string | NOUVEAU |
| `signatureUserAgent` | string | NOUVEAU |
| `contractHash` | string (SHA256) | NOUVEAU |
| `contractHmac` | string | NOUVEAU |
| `contractPath` | string | NOUVEAU : chemin vers PDF signe |
| `paymentMode` | enum | NOUVEAU : `integral`, `deposit_balance`, `invoice_email` |
| `depositAmount` | number | NOUVEAU : montant acompte en EUR (si applicable) |
| `depositPaidAt` | string (ISO) | NOUVEAU |
| `balanceDueAt` | string (ISO) | NOUVEAU : date limite paiement solde (J+14 apres acompte) |
| `expiresAt` | string (ISO) | NOUVEAU : date limite globale paiement (J+7 sans paiement, J+14 si acompte) |
| `stripeInvoiceId` | string | Existant |
| `stripeInvoiceUrl` | string | Existant |
| `stripeCustomerId` | string | Existant |
| `stripePaymentIntentId` | string | NOUVEAU |
| `paidAt` | string (ISO) | Existant |
| `orderNumber` | string | Existant |
| `certificatePath` | string | NOUVEAU : chemin vers PDF certificat genere apres paid |

Champ ajoute dans `data/toiles.json` (pour chaque toile) :

| Champ | Type | Valeurs |
|---|---|---|
| `status` | enum | `available` (defaut) / `reserved_pending` / `reserved_signed` / `partial_paid` / `paid` / `unavailable` (sortie de vente manuelle Guillaume) |
| `reservationId` | string | UUID de la reservation active si statut != available |
| `reservedUntil` | string (ISO) | Date limite affichee aux autres VIP |

---

## 4. Architecture des routes

### Routes publiques (mode `public`)
- `/` : home
- `/galerie` : photographies (sans changement)
- `/toiles` : toiles publiques (sans prix, comme aujourd'hui)
- `/histoire`, `/contact`, etc. : inchanges
- `/login` : page de login `gf_auth` (resiste pour le mode pre-launch s'il revient)

### Routes VIP (toujours dispo, controle par cookie `gf_vip`)
- `/vip` : tout-en-un — porte d'entree si pas de cookie, contenu prive si cookie valide
- `/vip/reservation/{id}/sign` : ecran signature contrat (token HMAC requis)
- `/vip/reservation/{id}/checkout` : ecran paiement Stripe niveau 1 + decline + niveau 2
- `/vip/reservation/{id}/confirmation` : ecran final apres paiement
- `/vip/reservation/{id}/decline-fallback` : ecran fallback paiement decline (3 options)

### Routes admin (cookie admin requis)
- `/admin/vip` : generation invitations (existant, OK)
- `/admin/reservations` : liste + actions (etoffer)
- `/admin/reservations/{id}` : detail + timeline + boutons d'action

### Routes API
- `POST /api/vip/generate` : existant
- `POST /api/vip/validate` : existant (modif Sprint 1 : retirer markCodeUsed)
- `GET /api/vip/list` : existant
- `GET /api/toiles` : NOUVEAU — expose statut + reservedUntil pour le front
- `POST /api/reservations` : existant (modif Sprint 2 : nouveaux champs)
- `POST /api/reservations/{id}/sign` : NOUVEAU
- `POST /api/stripe/checkout/canvas` : NOUVEAU ou extension
- `POST /api/stripe/checkout/canvas-deposit` : NOUVEAU
- `GET /api/admin/reservations/{id}/contract` : NOUVEAU (download PDF)
- `GET /api/admin/reservations/{id}/certificate` : NOUVEAU
- `POST /api/admin/reservations/{id}/action` : NOUVEAU (relancer / annuler / encaisser-manuel / refuser)

---

## 5. Roadmap sprints

| Sprint | Titre | Effort | Branche feature |
|---|---|---|---|
| 0 | Infrastructure pre-requise | 1-2h | `lab/vip-sprint-0-infra` |
| 1 | Refonte `/vip` tout-en-un + code poly-use 24h | 3-4h | `lab/vip-sprint-1-route` |
| 2 | Formulaire reservation + verrouillage toile | 4-5h | `lab/vip-sprint-2-reservation` |
| 3 | Signature canvas + PDF embarque + emails | 5-6h | `lab/vip-sprint-3-signature` |
| 4 | Stripe paiement niveau 1 (CB integral) | 4-5h | `lab/vip-sprint-4-payment-1` |
| 5 | Stripe paiement niveau 2 (decline → acompte / facture) | 5-6h | `lab/vip-sprint-5-payment-2` |
| 6 | Token transaction HMAC + expiration intelligente | 3-4h | `lab/vip-sprint-6-token-expiration` |
| 7 | Admin reservations enrichie | 3-4h | `lab/vip-sprint-7-admin` |
| 8 | Tests E2E + audit final + mise en prod | 4-5h | `lab/vip-sprint-8-prod` |

Apres chaque sprint :
- Audit hostile externe via `~/.claude/bin/audit-hostile`
- `codex review --base main` sur la branche feature
- Verification visuelle exhaustive selon protocole `~/.claude/rules/verification-visuelle-exhaustive.md`
- Si audit OK → merge vers main + nouveau sprint
- Si audit pas OK → 1 sprint fix max → STOP (regle depth-limit)

---

## 6. Contrat juridique — contenu cible du PDF

Page 1 — Identification + objet
- Entete : Guillaume Farre, artiste plasticien, [adresse atelier], [SIRET]
- Acheteur : nom complet, adresse, email, telephone, qualite (particulier / professionnel + SIRET)
- Objet : titre oeuvre, dimensions, technique, annee, numero ou unicite
- Prix de vente TTC : montant en chiffres et en lettres
- Mode de paiement convenu : integral CB / acompte 30% + solde / facture
- Date et lieu

Page 2 — Conditions
- Garantie d'authenticite : certificat distinct fourni apres paiement integral
- Droit de retractation 14 jours (art. L221-18 et suivants Code conso) — applicable aux acheteurs particuliers uniquement
- Qualification arrhes : "Les sommes versees a la signature du present contrat constituent des arrhes au sens de l'article 1590 du Code civil. Au-dela du delai legal de retractation de 14 jours, en cas de renonciation de l'acheteur, lesdites arrhes resteront acquises au vendeur."
- Frais de gestion forfaitaires post-14j : "En cas de retractation au-dela des 14 jours legaux, une indemnite forfaitaire de 300 EUR sera retenue au titre des frais de gestion, frais bancaires non recuperables et preparation du certificat."
- Mode de retrait : atelier ou livraison professionnelle (devis distinct)
- Risque transport : a la charge de l'acheteur des sortie de l'atelier
- Loi applicable : droit francais
- Juridiction competente : tribunal de [lieu] (a definir par Guillaume)
- Signature acheteur + nom dactylographie + date

Footer technique (en pied de page 2)
- IP signature : x.x.x.x
- User agent : ...
- Horodatage UTC : ISO
- Hash SHA256 du document : ...
- HMAC integrite : ...
- "Ce document constitue une signature electronique simple au sens du Reglement eIDAS (UE) n°910/2014 et de l'article 1367 du Code civil."

---

## 7. Variables d'environnement requises

Existantes (a verifier) :
- `STRIPE_SECRET_KEY` : LIVE
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` : LIVE
- `STRIPE_WEBHOOK_SECRET` : configure
- `AUTH_SECRET` : pour `gf_auth` (mode pre-launch)
- `ADMIN_PASSWORD` : admin login
- `SITE_PASSWORD` : `gf_auth` mot de passe
- `MAGIC_LINK_SECRET` : HMAC token
- `RESEND_API_KEY` : envoi emails
- `ANTHROPIC_API_KEY` : descriptions IA admin
- `SITE_MODE` : `pre-launch` | `public`

A ajouter pour la feature VIP :
- `WHATSAPP_NOTIFICATIONS` : `false` par defaut, prevu pour activation future
- `BACKUP_RETENTION_COUNT` : `30` par defaut (nombre de backups data conserves)

---

## 8. Regles de gouvernance pour les sprints

Pour chaque sprint, la session dediee qui le prend :
- Reçoit un prompt complet (objectif, scope, criteres d'acceptance, contraintes, format rapport)
- N'a pas le droit de coder hors scope
- N'a pas le droit d'ouvrir d'autres sessions Claude (`open-terminal` interdit)
- N'a pas le droit de s'auto-evaluer (pas de score dans le rapport)
- Doit committer regulierement (toutes les 30-45min) avec messages conventional commits
- Doit produire le rapport standardise (cf. `~/.claude/rules/session-governance.md` section 3)

Apres chaque sprint, la pilote :
- Lit le rapport
- Lance `codex review --base main`
- Lance une session audit hostile via `~/.claude/bin/audit-hostile`
- Lance verification visuelle exhaustive
- Si OK → merge feature → main + ouvre sprint suivant
- Si pas OK → 1 sprint fix max → re-audit → si OK merge, si pas OK STOP et reflexion architecturale

---

## 9. Decision technique — Runtime middleware & revocation

**Decision (Sprint 0 fix, 2026-05-14)** : le middleware Next.js tourne en
runtime Node.js (`experimental.nodeMiddleware: true` dans next.config.mjs +
`export const config = { runtime: 'nodejs' }` dans middleware.ts).

### Motivation

L'option initiale Edge runtime + cookie HMAC auto-portant (commit bcbbda0)
ne permettait PAS de revoquer un code en cours d'utilisation : un cookie
HMAC valide restait accepte jusqu'a son expiresAt naturel (24h), meme si
Guillaume avait marque le code comme compromis dans `data/vip-codes.json`.
Le middleware Edge ne pouvant pas lire le disque, il ignorait simplement
le drapeau `revoked`.

### Trade-offs assumes

| Aspect | Edge runtime (initial) | Node.js runtime (retenu) |
|---|---|---|
| Lecture disque par req | impossible | possible — mitigee par cache 5s (TTL court) |
| Revocation effective | NON (cookie reste valide 24h) | OUI (effet sous 5s + invalidation explicite) |
| Latence middleware | ~2ms | ~5-10ms sur VPS PM2 (negligeable) |
| Statut Next.js | stable | `experimental.nodeMiddleware` flag actif |
| Memoire partagee API/middleware | impossible | OUI (single process PM2) |

### Mecanisme de revocation effectif (Sprint 0)

1. `data/vip-codes.json` accueille deux nouveaux champs optionnels par code :
   `revoked: boolean`, `revokedAt: string` (ISO).
2. `lib/vip-codes.ts` : nouvelle fonction `revokeCode(code)` qui met a jour
   ces champs et persiste le fichier (idempotente).
3. `lib/vip-revocation.ts` : helper `isCodeRevoked(code)` lu par le
   middleware Node.js. Cache module-level avec TTL 5s pour eviter une lecture
   disque par requete. `invalidateRevocationCache()` force le rafraichissement.
4. `app/api/admin/vip/revoke/route.ts` : route POST protegee par cookie
   `gf_admin`, appelle `revokeCode` + `invalidateRevocationCache`. Le cookie
   compromis est rejete immediatement par le middleware au prochain hit.
5. Le middleware appelle `isVipCookieAccepted(cookieValue)` qui combine
   verification HMAC (`verifyVipCookie`) + check revocation (`isCodeRevoked`).

### Limites assumees

- Delai maximum de propagation : 5s en l'absence d'appel a
  `invalidateRevocationCache()`. Acceptable pour le cas d'usage (revocation
  manuelle de Guillaume, pas anti-DoS).
- Dependance au flag `experimental.nodeMiddleware` (Next 15.5+). Si Next
  change l'API avant stabilisation, migration necessaire (Vercel KV ou Redis
  comme alternative cible). Pas de changement attendu avant Next 16.
- Pas de propagation cross-process : on suppose PM2 mono-process sur le VPS.
  En cas de cluster (pm2 cluster mode), chaque worker aurait son propre cache
  jusqu'a 5s de divergence — egalement acceptable.

### Alternatives ecartees

- **Edge + rotation MAGIC_LINK_SECRET pour revoquer** : invalide TOUS les
  cookies VIP a chaque revocation. Trop fort.
- **Edge + version bumped dans HMAC** : meme probleme, granularite globale.
- **Edge + Vercel KV / Upstash Redis** : ajoute une dependance externe et
  un point de defaillance pour une feature dont le trafic reste tres faible.
  Garde en reserve si on migre du VPS vers une infra serverless.

---

## 11. Baseline tests automatises

Etat post-Sprint 8 + security-fix + cleanup imperfections :

- **31 fichiers de tests** (`bunx vitest run`)
- **342 tests passants**
- Couverture : flow VIP end-to-end (codes magic link, reservation, signature,
  Stripe webhook acompte/integral, admin cookie HMAC, IDOR contract/sign,
  helpers reservations, regenerate balance link, refund, cancel).

Le brief initial Sprint 8 mentionnait 319 tests. La cible a evolue suite au
fix securite (commits `3acc776` cookie admin HMAC, `9eb0b62` IDOR closure,
`dcb9a3f` coverage securite) qui a ajoute 23 tests supplementaires.

Toute regression sous 342 doit etre traitee avant merge.

---

Signature : Lalou
