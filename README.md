# Guillaume Farré - Site Web Multilingue

Site web officiel de l'artiste sculpteur Guillaume Farré avec support multilingue (Français, English, Italiano).

## 🌍 Langues Supportées

- 🇫🇷 Français (par défaut)
- 🇬🇧 English
- 🇮🇹 Italiano

## 🚀 Démarrage Rapide

### Installation

```bash
bun install
```

### Développement

```bash
bun run dev
```

Le site sera accessible sur:
- http://localhost:3000/ (français par défaut)
- http://localhost:3000/en/ (anglais)
- http://localhost:3000/it/ (italien)

### Build Production

```bash
bun run build
bun run start
```

## 📁 Structure du Projet

```
guillaume-farre/
├── app/
│   └── [locale]/          # Pages internationalisées
│       ├── page.tsx       # Accueil
│       ├── galerie/       # Galerie des œuvres
│       ├── boutique/      # Boutique en ligne
│       ├── histoire/      # Histoire de l'artiste
│       ├── atelier/       # L'atelier de création
│       ├── concept-car-art/
│       ├── presse/        # Revue de presse
│       ├── contact/       # Formulaire de contact
│       └── panier/        # Panier d'achats
├── components/
│   ├── navigation/        # Navigation et mobile nav
│   ├── lightbox/          # Lightbox pour les images
│   ├── LanguageSwitcher.tsx
│   └── GalleryGrid.tsx    # Grille de galerie avec bordures alternées
├── i18n/
│   ├── routing.ts         # Configuration des routes i18n
│   └── request.ts         # Configuration des requêtes i18n
├── messages/
│   ├── fr.json            # Traductions françaises
│   ├── en.json            # Traductions anglaises
│   └── it.json            # Traductions italiennes
├── lib/
│   ├── works.ts           # Données des œuvres
│   ├── images.ts          # Utilitaires pour les images
│   └── utils.ts           # Utilitaires généraux
├── public/
│   └── images/
│       ├── origins/       # Photos d'origine
│       └── works/         # Photos des œuvres
│           ├── empreintes/
│           ├── atelier/
│           └── projection/
├── middleware.ts          # Middleware next-intl
├── next.config.mjs        # Configuration Next.js
└── tsconfig.json          # Configuration TypeScript
```

## 🎨 Fonctionnalités

### Multilingue
- Système de traduction complet avec next-intl
- URLs préfixées par la langue (/fr/, /en/, /it/)
- Sélecteur de langue dans la navigation
- Génération statique pour toutes les langues

### Galerie
- Grille masonry responsive
- Bordures blanches alternées (1 sur 2)
- Lightbox pour agrandir les images
- Métadonnées complètes (titre, année, type, prix)

### Navigation
- Navigation desktop sticky
- Menu mobile hamburger responsive
- Traductions automatiques des liens
- Indicateur de page active

### Design
- Thème shadcn/ui zinc
- Tailwind CSS
- Responsive (mobile, tablette, desktop)
- Animations fluides

## 🔧 Technologies

- **Framework**: Next.js 15.3.2
- **Runtime**: Bun
- **Internationalisation**: next-intl
- **Styling**: Tailwind CSS + shadcn/ui
- **TypeScript**: 5.8.3
- **Paiements**: Stripe (intégré)

## 📝 Ajouter du Contenu

### Ajouter une Œuvre

Modifiez `lib/works.ts`:

```typescript
{
  slug: 'nouvelle-oeuvre',
  title: 'Titre de l\'œuvre',
  year: 2024,
  type: 'photo', // ou 'toile'
  edition: { type: 'limited', count: 10 },
  prices: { small: 300, medium: 500, large: 800 },
  images: ['/images/works/serie/image.jpg'],
}
```

### Ajouter une Traduction

Ajoutez la clé dans les 3 fichiers:
- `messages/fr.json`
- `messages/en.json`
- `messages/it.json`

Utilisez dans le code:
```tsx
import { useTranslations } from 'next-intl';

const t = useTranslations('section');
<h1>{t('cle')}</h1>
```

## 🌐 Déploiement

### Déploiement Automatique (VPS)

Le projet utilise GitHub Actions pour le déploiement automatique sur le VPS OVH.

Push sur `main` déclenche automatiquement:
1. Build de l'application
2. Transfert via SSH vers le VPS
3. Redémarrage avec PM2

### Variables d'Environnement

Créez un fichier `.env.local`:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Autres variables selon besoins
```

## 📸 Images

Placez les images dans `public/images/`:
- `origins/` - Photos d'origine et biographie
- `works/empreintes/` - Série Empreintes
- `works/atelier/` - Série Atelier
- `works/projection/` - Série Projection

Format recommandé: JPG, optimisé pour le web

## 🤝 Workflow de Développement

1. **Faire des changements localement**
   ```bash
   # Modifier les fichiers
   bun run dev  # Tester localement
   ```

2. **Commit et push**
   ```bash
   git add .
   git commit -m "Description des changements"
   git push origin main
   ```

3. **Déploiement automatique**
   - GitHub Actions build et déploie automatiquement
   - Le site est mis à jour sur guillaumefarre.com

## 📄 License

© 2024 Guillaume Farré. Tous droits réservés.
