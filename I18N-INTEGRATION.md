# Intégration i18n - Guillaume Farré

## ✅ Système Multilingue Installé

Le site Guillaume Farré supporte maintenant **3 langues**:
- 🇫🇷 **Français** (par défaut)
- 🇬🇧 **English**
- 🇮🇹 **Italiano**

## 🎯 Ce qui a été fait

### 1. Installation de next-intl
```bash
bun add next-intl
```

### 2. Structure des Routes
Les routes sont maintenant préfixées par la langue:

**Français (défaut)**:
- `https://guillaumefarre.com/` → français
- `https://guillaumefarre.com/galerie` → galerie en français
- `https://guillaumefarre.com/boutique` → boutique en français

**Anglais**:
- `https://guillaumefarre.com/en/` → english
- `https://guillaumefarre.com/en/galerie` → gallery in english
- `https://guillaumefarre.com/en/boutique` → shop in english

**Italien**:
- `https://guillaumefarre.com/it/` → italiano
- `https://guillaumefarre.com/it/galerie` → galleria in italiano
- `https://guillaumefarre.com/it/boutique` → negozio in italiano

### 3. Configuration Créée

#### `i18n/routing.ts`
Définit les langues supportées et la langue par défaut:
```typescript
locales: ['fr', 'en', 'it']
defaultLocale: 'fr'
```

#### `middleware.ts`
Gère automatiquement le routage multilingue.

#### `messages/`
Fichiers de traduction pour chaque langue:
- `fr.json` - Toutes les traductions françaises
- `en.json` - Toutes les traductions anglaises
- `it.json` - Toutes les traductions italiennes

### 4. Composants Traduits

#### Navigation
- Menu complet traduit dans les 3 langues
- Sélecteur de langue avec drapeaux
- Navigation mobile responsive

#### Pages
Toutes les pages sont traduites:
- ✅ Accueil / Home / Home
- ✅ Galerie / Gallery / Galleria
- ✅ Boutique / Shop / Negozio
- ✅ Histoire / Story / Storia
- ✅ Atelier / Workshop / Laboratorio
- ✅ Concept car art (identique)
- ✅ Presse / Press / Stampa
- ✅ Contact (identique)
- ✅ Panier / Cart / Carrello

## 🔧 Comment Utiliser

### Dans les Composants

#### Serveur Component (Page)
```tsx
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("nav");

  return <h1>{t("accueil")}</h1>;
  // FR: "Accueil"
  // EN: "Home"
  // IT: "Home"
}
```

#### Client Component
```tsx
"use client";
import { useTranslations } from "next-intl";

export default function Component() {
  const t = useTranslations("shop");

  return <button>{t("addToCart")}</button>;
  // FR: "Ajouter au panier"
  // EN: "Add to cart"
  // IT: "Aggiungi al carrello"
}
```

### Liens Internationalisés

Toujours utiliser le `Link` de `@/i18n/routing`:

```tsx
import { Link } from "@/i18n/routing";

<Link href="/galerie">Galerie</Link>
// Génère automatiquement:
// /galerie (FR)
// /en/galerie (EN)
// /it/galerie (IT)
```

### Navigation Programmatique

```tsx
import { useRouter } from "@/i18n/routing";

const router = useRouter();
router.push("/galerie");
// Préserve automatiquement la langue actuelle
```

## 📝 Ajouter une Nouvelle Traduction

1. **Ajouter dans `messages/fr.json`**:
```json
{
  "section": {
    "nouveauTexte": "Nouveau texte en français"
  }
}
```

2. **Ajouter dans `messages/en.json`**:
```json
{
  "section": {
    "nouveauTexte": "New text in English"
  }
}
```

3. **Ajouter dans `messages/it.json`**:
```json
{
  "section": {
    "nouveauTexte": "Nuovo testo in italiano"
  }
}
```

4. **Utiliser dans le code**:
```tsx
const t = useTranslations("section");
<p>{t("nouveauTexte")}</p>
```

## 🌐 Sélecteur de Langue

Le composant `LanguageSwitcher` permet de changer de langue:
- Affiche le drapeau et le nom de la langue actuelle
- Menu déroulant avec les 3 langues
- Change automatiquement l'URL et le contenu
- Préserve la page actuelle

```tsx
import LanguageSwitcher from "@/components/LanguageSwitcher";

<LanguageSwitcher />
```

## 🎨 Sections de Traduction

Les traductions sont organisées par section:

### `nav` - Navigation
```json
{
  "nav": {
    "accueil": "...",
    "galerie": "...",
    "boutique": "...",
    ...
  }
}
```

### `hero` - Hero Carousel
```json
{
  "hero": {
    "atelier": {
      "title": "...",
      "subtitle": "...",
      "description": "...",
      "cta": "..."
    }
  }
}
```

### `home` - Page d'accueil
```json
{
  "home": {
    "nextEvent": "...",
    "selectionTitle": "...",
    "shopTitle": "..."
  }
}
```

### `gallery`, `shop`, `contact`, `footer`
Voir les fichiers messages pour toutes les sections.

## 🚀 Build et Déploiement

Le système i18n est complètement intégré au build Next.js:

```bash
bun run build
```

Génère automatiquement:
- Pages statiques pour les 3 langues
- Routes préfixées
- Sitemap multilingue
- SEO optimisé par langue

## 📱 Responsive

Le sélecteur de langue est responsive:
- **Desktop**: Affiche le drapeau + nom de la langue
- **Mobile**: Affiche uniquement le drapeau
- Menu déroulant adaptatif

## ✨ Avantages

1. **SEO Multilingue**
   - URLs séparées par langue
   - Indexation indépendante par Google
   - Meta tags traduits

2. **Performance**
   - Pages pré-rendues (SSG)
   - Pas de requête réseau pour les traductions
   - Changement de langue instantané

3. **Maintenabilité**
   - Traductions centralisées dans messages/
   - TypeScript pour la sécurité des types
   - Facile d'ajouter une nouvelle langue

4. **UX**
   - Détection automatique de la langue du navigateur (optionnel)
   - Changement de langue sans rechargement complet
   - Préservation de la page actuelle

## 🔜 Prochaines Étapes

Pour améliorer encore le système i18n:

1. **Détection de langue automatique**
   - Utiliser `Accept-Language` du navigateur
   - Rediriger vers la langue préférée

2. **Images localisées**
   - Images différentes selon la langue si nécessaire
   - Textes dans les images traduits

3. **Dates et nombres**
   - Formatage selon la locale (FR: 1 000 €, EN: €1,000)
   - Dates (FR: 01/12/2024, EN: 12/01/2024)

4. **CMS Multilingue**
   - Permettre l'édition des traductions via interface admin
   - Synchronisation avec une base de données

---

**Le site est maintenant complètement multilingue ! 🎉**

Toutes les modifications futures doivent maintenir les 3 langues à jour.
