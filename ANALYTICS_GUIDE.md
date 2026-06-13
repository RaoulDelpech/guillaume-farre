# Analytics & Heatmap — Guide de configuration

Maintenu par : Lalou
Dernière mise à jour : 2026-06-13

Ce guide explique comment **activer** la visibilité analytics du site Guillaume Farré :
fréquentation du site **et** carte de chaleur « où cliquent les visiteurs ».

---

## 1. Stack en place

Le code est **déjà implémenté et monté** (branche `main`). Rien à coder, il reste seulement
à fournir deux identifiants et à les déployer.

| Besoin | Outil | Fichier | Gratuit | RGPD |
|--------|-------|---------|---------|------|
| Fréquentation + events e-commerce | **Google Analytics 4** | `components/GoogleAnalytics.tsx` | Oui | Chargé après consentement |
| Heatmap clics + enregistrements de session | **Microsoft Clarity** | `components/ClarityAnalytics.tsx` | Oui | Chargé après consentement |

Composants montés dans `components/ClientShell.tsx` (lui-même dans `app/[locale]/layout.tsx`).
Les events e-commerce GA4 (`trackViewItem`, `trackAddToCart`, `trackBeginCheckout`,
`trackPurchase`, `trackClickArtwork`, `trackLightbox*`) sont définis dans `lib/analytics.ts`
et réellement appelés dans la galerie, la fiche œuvre et la page de confirmation de commande.

> **Comparaison Juris-Power / Mediane** : leur stack est **Matomo auto-hébergé**
> (`matomo.juris-power.com`, voir `front/index.html` du repo `mediane-dev`). Matomo de base ne
> fait pas de heatmap sans plugin payant, et exige une instance serveur + base de données.
> GF couvre le même besoin (fréquentation + heatmap) avec GA4 + Clarity, **gratuit et sans infra
> dédiée**. Migrer GF vers Matomo serait un downgrade fonctionnel (heatmap) et un surcoût infra
> injustifié pour un site portfolio/boutique. À reconsidérer seulement si l'on veut héberger
> soi-même la donnée (avantage RGPD de Matomo).

---

## 2. Activation (2 variables d'environnement)

Les deux composants restent **inactifs tant que leur identifiant n'est pas défini**
(`return null` si la variable est absente). Il faut donc renseigner :

```bash
# Google Analytics 4 — format G-XXXXXXXXXX
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# Microsoft Clarity — ID alphanumérique court (ex. abcdef1234)
NEXT_PUBLIC_CLARITY_PROJECT_ID=
```

- **En local** : ajouter ces lignes à `.env.local`.
- **En production (VPS)** : ajouter ces lignes au `.env.local` du serveur, puis redémarrer
  l'app (`pm2 restart …`). Comme ce sont des variables `NEXT_PUBLIC_*`, elles sont injectées
  **au build** : un nouveau build/déploiement est nécessaire pour qu'elles prennent effet.

> Les fichiers `.env.example`, `.env.local.example` et `.env.template` devraient lister ces deux
> variables (non fait automatiquement : l'édition des fichiers `.env*` est bloquée côté outillage).

---

## 3. Créer les comptes

### Google Analytics 4
1. Aller sur https://analytics.google.com
2. Créer une propriété pour `guillaumefarre.com`
3. Créer un flux de données « Web »
4. Copier l'**ID de mesure** (format `G-XXXXXXXXXX`) → `NEXT_PUBLIC_GA_MEASUREMENT_ID`

### Microsoft Clarity
1. Aller sur https://clarity.microsoft.com
2. Se connecter (compte Microsoft / Google / email)
3. Créer un projet pour `guillaumefarre.com`
4. Copier l'**ID de projet** (chaîne alphanumérique courte) → `NEXT_PUBLIC_CLARITY_PROJECT_ID`

Les heatmaps et enregistrements de session apparaissent dans le tableau de bord Clarity après
quelques visites réelles (avec consentement cookie).

---

## 4. Vérifier que ça marche

1. Définir les deux variables, builder, lancer le site.
2. Sur le site, **accepter** la bannière cookie.
3. Onglet **Network** des DevTools : vérifier les requêtes
   - `https://www.googletagmanager.com/gtag/js?id=G-…` (GA4)
   - `https://www.clarity.ms/tag/…` (Clarity)
4. **Refuser** la bannière (ou réinitialiser via `resetConsent()`), recharger :
   aucune de ces deux requêtes ne doit partir.
5. GA4 : voir les utilisateurs en temps réel dans la console Analytics.
6. Clarity : les sessions remontent dans le dashboard Clarity sous quelques minutes.

---

## 5. RGPD

- Les scripts GA4 et Clarity **ne se chargent qu'après consentement** explicite via la bannière
  (`components/CookieConsent.tsx` → `lib/cookie-consent.ts`, `hasConsent()`).
- Consentement conservé 13 mois (recommandation CNIL), retrait possible à tout moment.
- GA4 utilise le **Consent Mode** (`analytics_storage: denied` par défaut).
- La page `/politique-de-confidentialite` déclare désormais GA4 et Clarity
  (finalités, destinataires Google/Microsoft, transferts hors UE, cookies `_ga`, `_ga_*`,
  `_clck`, `_clsk`).
