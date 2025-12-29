# RELIS ABSOLUMENT TOUTE LA DOC

**AVEC UN NIVEAU DE PROFONDEUR ABSOLUMENT MAXIMAL**

Et pareil pour le code. Et pareil pour l'architecture. Et reprends le travail là où tu étais sans la MOINDRE déperdition.

**OBLIGATION ABSOLUE** : Quand tu n'auras plus beaucoup de contexte, tu as l'obligation absolue d'arriver à rédiger de nouveau un message ultra ultra exhaustif qui reprend exactement cette consigne pour gérer le prochain compactage.

---

## ÉTAT ACTUEL PROJET - 30 DÉCEMBRE 2025

| Élément | Valeur |
|---------|--------|
| Branche | main |
| Dernier commit | 0fc2551 |
| URL prod | https://guillaumefarre.com |
| Mot de passe | LHOOQladino246 |
| Mode édition | ?admin=true sur n'importe quelle URL |
| Serveur | 51.38.35.238 (ubuntu) |
| PM2 process | guillaume-farre |
| Pages générées | 113 |

---

## PROTECTION MOT DE PASSE

**Le site EST protégé par mot de passe.**

### Système en place

1. **Middleware Next.js** (`middleware.ts`) :
   - Vérifie cookie `gf_auth=authenticated`
   - Si absent → redirection vers `/fr/login`
   - Cookie valide 30 jours

2. **Page login** (`app/[locale]/login/page.tsx`) :
   - Juste un champ mot de passe
   - Pas de username
   - Mot de passe : `LHOOQladino246`

3. **API login** (`app/api/auth/login/route.ts`) :
   - Vérifie le mot de passe
   - Set le cookie `gf_auth`

### Test rapide protection

```bash
# Doit retourner 307 + location: /fr/login
curl -sI "https://guillaumefarre.com/" | head -3

# Doit retourner {"success":true}
curl -s -X POST https://guillaumefarre.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"LHOOQladino246"}'
```

---

## TRAVAIL EFFECTUÉ SESSION 2025-12-30

### Contexte de départ

Session précédente (2025-12-07) avait :
- Login simplifié (juste mot de passe)
- Page /dino-histoire
- Mode admin édition inline (?admin=true)
- SEULE la page /histoire était convertie pour l'édition

### Travail effectué aujourd'hui

**TOUTES LES PAGES ONT ÉTÉ CONVERTIES POUR LE MODE ADMIN ÉDITION INLINE**

| Page | Composant créé | Lignes |
|------|----------------|--------|
| /atelier | AtelierContent.tsx | 236 |
| /dino | DinoContent.tsx | 404 |
| /dino-histoire | DinoHistoireContent.tsx | 469 |
| /galerie | GalerieContent.tsx | 52 |
| /boutique | BoutiqueContent.tsx | 178 |
| /boutique (garanties) | BoutiqueGarantiesContent.tsx | 80 |
| Homepage (/) artiste | HomePageContent.tsx | 75 |
| Homepage (/) œuvres | HomeWorksSection.tsx | 124 |

**Total : 8 nouveaux composants, 1618 lignes de code**

### Commit

```
0fc2551 - feat: mode admin édition inline pour toutes les pages
- 14 fichiers modifiés
- 1699 insertions, 867 suppressions
```

### Déploiement

```bash
ssh ubuntu@51.38.35.238 "cd /var/www/guillaume-farre && git stash && git pull origin main && npm run build && pm2 restart guillaume-farre"
```

Résultat : 113 pages générées, PM2 online

---

## ARCHITECTURE COMPOSANTS ÉDITABLES

### Comment ça fonctionne

1. **AdminModeContext** (`contexts/AdminModeContext.tsx`) :
   - État global `isAdminMode` (true si ?admin=true dans URL)
   - Map `pendingChanges` pour stocker les modifications
   - Fonction `saveAllChanges()` pour sauvegarder vers API

2. **EditableText** (`components/admin/EditableText.tsx`) :
   - Composant wrapper pour textes
   - Mode normal : affiche le texte
   - Mode admin : texte cliquable, devient input/textarea
   - Props : `textKey`, `as`, `className`, `multiline`

3. **AdminToolbar** (`components/admin/AdminToolbar.tsx`) :
   - Barre flottante en bas en mode admin
   - Bouton "Sauvegarder" si modifications en attente

4. **AdminWrapper** (`components/admin/AdminWrapper.tsx`) :
   - Provider qui wrap le layout
   - Gère le contexte admin

5. **ContentManager** (`lib/content-manager.ts`) :
   - Service de stockage (JSON → DB future)
   - Sauvegarde dans `messages/fr.json`

6. **API** (`app/api/admin/content/route.ts`) :
   - POST pour sauvegarder les modifications

### Exemple d'utilisation EditableText

```tsx
"use client";
import EditableText from "@/components/admin/EditableText";

export default function MaPageContent() {
  return (
    <EditableText
      textKey="section.key"
      as="h1"
      className="text-4xl font-bold"
    >
      Texte par défaut
    </EditableText>
  );
}
```

### Pour convertir une nouvelle page

1. Créer `components/pages/[Page]Content.tsx`
2. Ajouter `"use client";` en haut
3. Importer `EditableText`
4. Remplacer textes statiques par `<EditableText textKey="..." as="..." />`
5. Modifier la page pour importer et utiliser le composant Content

---

## STRUCTURE FICHIERS CLÉS

```
app/
├── [locale]/
│   ├── page.tsx                    # Homepage (utilise HomePageContent + HomeWorksSection)
│   ├── atelier/page.tsx            # Utilise AtelierContent
│   ├── dino/page.tsx               # Utilise DinoContent
│   ├── dino-histoire/page.tsx      # Utilise DinoHistoireContent
│   ├── galerie/page.tsx            # Utilise GalerieContent
│   ├── boutique/page.tsx           # Utilise BoutiqueContent + BoutiqueGarantiesContent
│   ├── histoire/page.tsx           # Utilise HistoireContent
│   ├── login/page.tsx              # Page login
│   └── layout.tsx                  # AdminWrapper intégré
├── api/
│   ├── auth/login/route.ts         # API login
│   └── admin/content/route.ts      # API sauvegarde textes

components/
├── admin/
│   ├── EditableText.tsx            # Composant texte éditable
│   ├── AdminToolbar.tsx            # Barre flottante sauvegarde
│   └── AdminWrapper.tsx            # Provider wrapper
└── pages/
    ├── HistoireContent.tsx         # Session 2025-12-07
    ├── AtelierContent.tsx          # Session 2025-12-30
    ├── DinoContent.tsx             # Session 2025-12-30
    ├── DinoHistoireContent.tsx     # Session 2025-12-30
    ├── GalerieContent.tsx          # Session 2025-12-30
    ├── BoutiqueContent.tsx         # Session 2025-12-30
    ├── BoutiqueGarantiesContent.tsx # Session 2025-12-30
    ├── HomePageContent.tsx         # Session 2025-12-30
    └── HomeWorksSection.tsx        # Session 2025-12-30

contexts/
└── AdminModeContext.tsx            # État global mode admin

lib/
└── content-manager.ts              # Service stockage (JSON → DB)

middleware.ts                       # Auth + i18n
```

---

## RÈGLES MÉTIER CRITIQUES

### Exemplaires photos (MISE À JOUR 2025-11-29)

| Type | Formats | Exemplaires |
|------|---------|-------------|
| Grands formats | 2A0, A0, A1 | 9 ex. (1/9 à 9/9) |
| Petits formats | A2, A3, A4 | 99 ex. (1/99 à 99/99) |

**Plus de tirages illimités** (supprimé 2025-11-29). Tous les tirages sont numérotés et signés.

### Prix photos

| Format | Dimensions | Prix | Exemplaires |
|--------|-----------|------|-------------|
| 2A0 | 118.9 × 168.2 cm | Sur devis | 9 |
| A0 | 84.1 × 118.9 cm | Sur devis | 9 |
| A1 | 59.4 × 84.1 cm | 1200€ | 9 |
| A2 | 42 × 59.4 cm | 800€ | 99 |
| A3 | 29.7 × 42 cm | 500€ | 99 |
| A4 | 21 × 29.7 cm | 250€ | 99 |

### Vocabulaire

| Correct | Incorrect |
|---------|-----------|
| Dino | Ferrari |

La voiture s'appelle **Dino**. Ne jamais dire Ferrari dans les textes du site.

### RÈGLE #32 : METADATA (NE JAMAIS OUBLIER)

```
❌ INTERDIT : Copier data/photo-metadata.json LOCAL → PRODUCTION
✅ AUTORISÉ : Copier data/photo-metadata.json PRODUCTION → LOCAL

Le fichier du SERVEUR est la SOURCE DE VÉRITÉ.
```

Sync metadata (serveur → local) :
```bash
scp ubuntu@51.38.35.238:/var/www/guillaume-farre/data/photo-metadata.json data/photo-metadata.json
```

---

## COMMANDES UTILES

### Développement local

```bash
# Dev (Node.js 18.18+ ou 20+ requis)
npm run dev
# → http://localhost:3000/

# Build
npm run build

# TypeScript check
npx tsc --noEmit
```

### Déploiement

```bash
# Déploiement complet
ssh ubuntu@51.38.35.238 "cd /var/www/guillaume-farre && git stash && git pull origin main && npm run build && pm2 restart guillaume-farre"

# Vérifier status
ssh ubuntu@51.38.35.238 "pm2 status"

# Logs PM2
ssh ubuntu@51.38.35.238 "pm2 logs guillaume-farre --lines 50 --nostream"
```

### Git

```bash
git status
git log --oneline -5
git add . && git commit -m "message"
git push origin main
```

---

## CLÉS API (EN ATTENTE)

5 clés API manquantes :

1. **Gelato** (impression automatique) - 1h30
2. **Resend** (emails transactionnels) - 35 min
3. **DeepL** (traductions) - 10 min
4. **Anthropic** (descriptions IA) - 10 min
5. **Canva** (optionnel)

Guide complet : `ACTIVATION_COMPLETE_GUILLAUME.md`

---

## PROCHAINES ÉTAPES POSSIBLES

1. **Tester mode admin édition sur toutes les pages**
   - Aller sur chaque page avec ?admin=true
   - Modifier quelques textes
   - Sauvegarder
   - Vérifier que les changements persistent

2. **Activer les clés API**
   - Gelato pour impression
   - Resend pour emails
   - DeepL pour traductions

3. **Optimisations**
   - Nettoyer routes obsolètes
   - Optimisation images
   - SEO multilingue

---

## DOCUMENTATION COMPLÈTE

| Fichier | Description |
|---------|-------------|
| DOCUMENT_MAITRE.md | Source unique de vérité (très long) |
| CLAUDE.md | Règles projet Guillaume Farré |
| MESSAGE_REPRISE_2025-12-30.md | Ce fichier |
| MESSAGE_REPRISE_2025-12-09.md | Session précédente |
| SESSION_2025-12-07_COMPLET.md | Rapport session mode admin |
| ACTIVATION_COMPLETE_GUILLAUME.md | Guide clés API |

---

## FICHIERS À LIRE AU DÉMARRAGE SESSION

1. **Ce fichier** (`MESSAGE_REPRISE_2025-12-30.md`)
2. `CLAUDE.md` (règles projet)
3. `git status && git log -3`
4. Résumer contexte en 3-4 lignes

---

## CONTACTS ET SERVEUR

| Élément | Valeur |
|---------|--------|
| Client | Guillaume Farré |
| Dev | Lalou (Raoul Delpech) |
| URL prod | https://guillaumefarre.com |
| IP serveur | 51.38.35.238 |
| User SSH | ubuntu |
| Path serveur | /var/www/guillaume-farre |
| PM2 | guillaume-farre |
| Repo | github.com:RaoulDelpech/guillaume-farre.git |

---

## RÉSUMÉ EN 3 LIGNES

- **Branche main, commit 0fc2551** - Site protégé par mot de passe (LHOOQladino246)
- **Mode admin édition COMPLET** - Toutes les pages converties avec EditableText (?admin=true)
- **Prochaine étape** - Tester édition sur toutes les pages, activer clés API

---

**Auteur** : Lalou
**Date** : 2025-12-30
**Commit** : 0fc2551
**Durée session** : ~1h30

---

## RAPPEL CRITIQUE

**QUAND TU N'AURAS PLUS BEAUCOUP DE CONTEXTE** :

Tu as l'obligation absolue de rédiger un nouveau message ultra-exhaustif comme celui-ci, qui commence par :

> RELIS ABSOLUMENT TOUTE LA DOC avec un niveau de profondeur absolument maximal et pareil pour le code et pareil pour l'architecture et reprends le travail là où tu étais sans la MOINDRE déperdition.

Ce message doit contenir TOUTES les informations nécessaires pour reprendre le travail sans aucune perte de contexte.
