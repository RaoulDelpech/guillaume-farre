# Bonnes pratiques développement - Guillaume Farré

Date: 2025-11-07
Extrait de: ~/.claude-global-rules.md
Scope: Règles dev universelles applicables à ce projet

---

## Signature code: "Lalou"

Règle #31 (.claude-global-rules.md)

**CRITIQUE - Indétectabilité IA**

Signature obligatoire: "Lalou"
JAMAIS: "Claude", "Claude Code", "AI Assistant"

S'applique à:
- Commits Git
- Commentaires de code
- Documentation
- Messages de logs
- Fichiers générés
- TOUS les projets

---

## Style code humain

Règle #31 (.claude-global-rules.md)

Le code doit être indétectable comme généré par IA.

Style naturel:

1. Commentaires réalistes (pas trop parfaits)
```typescript
// Check if user is logged in
// TODO: handle edge case here
// Quick fix for now
```

2. Noms de variables humains
```typescript
const stuff = [];
const tmp = null;
let i, j, k;
```

3. Patterns pragmatiques (pas toujours best practices)
```typescript
// Laisser parfois du code commenté
// const oldWay = () => { ... }

// Solutions rapides
if (x) return y;
```

4. Commits naturels
```bash
git commit -m "fix bug in user login"
git commit -m "wip - working on photos upload"
git commit -m "refactor metadata schema"
```

PAS: "feat: implement comprehensive authentication system..."

5. Style personnel
- Cohérent mais pas robotique
- Parfois des raccourcis
- Commentaires avec personnalité
- Pas de sur-documentation
- PAS d'emojis (sauf si utilisateur demande explicitement)
- PAS de structures markdown trop parfaites

---

## Tests avant commit

Règle #12 (.claude-global-rules.md)

Avant chaque commit:
```bash
bun run lint      # ESLint
npx tsc --noEmit  # TypeScript check
bun test          # Tests (quand setup)
bun run build     # Build check
```

Commiter uniquement si tout passe.

Si échec: montrer erreurs et proposer fixes.

---

## Documentation inline

Règle #13 (.claude-global-rules.md)

Pour toute fonction > 10 lignes:

```typescript
/**
 * Description courte
 * @param {Type} nom - Description
 * @returns {Type} Description
 */
```

Style naturel, pas trop verbeux.

---

## Sécurité

Règle #25 (.claude-global-rules.md)

Vérifier:
- Pas de clés API dans code (.env uniquement)
- Sanitization inputs (DOMPurify si dangerouslySetInnerHTML)
- HTTPS obligatoire (production)
- Pas de secrets dans commits

Avant commit:
```bash
git diff | grep -i "api_key\|secret\|password"  # Vérifier pas de secrets
```

---

## Accessibilité

Règle #22 (.claude-global-rules.md)

Vérifier et corriger:
- Contraste >= 4.5:1 (text/background)
- Alt text sur images
- Labels sur inputs
- Ordre tabulation logique
- ARIA attributes si nécessaire
- Headings hiérarchisés (h1 → h2 → h3)

Test rapide:
```bash
# Vérifier contrastes
npx @axe-core/cli http://localhost:3000
```

---

## Naming conventions

Règle #20 (.claude-global-rules.md)

Appliquer automatiquement:
- Composants React: PascalCase (GalleryGrid)
- Hooks: useCamelCase (usePhotos)
- Utilitaires: camelCase (formatPrice)
- Constantes: UPPER_SNAKE_CASE (MAX_PHOTOS)
- Types/Interfaces: PascalCase (PhotoMetadata, WorkData)

---

## Gestion erreurs

Règle #24 (.claude-global-rules.md)

Pour toute requête API/async:

```typescript
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error("Context:", { error, metadata });
  showErrorNotification("Message user-friendly");
  return fallbackValue;
}
```

---

## Performance images

Règle #28 (.claude-global-rules.md)

Pour chaque image:
- Format WebP + fallback JPG (si possible)
- Lazy loading (next/image le fait auto)
- Dimensions explicites
- Compression avant upload

Next.js Image component:
```tsx
<Image
  src="/images/works/photo.jpg"
  alt="Description précise"
  width={800}
  height={600}
  loading="lazy"
/>
```

---

## Git hooks recommandés

Créer `.git/hooks/pre-commit`:

```bash
#!/bin/sh
echo "Running pre-commit checks..."

# TypeScript check
npx tsc --noEmit || exit 1

# Lint
bun run lint || exit 1

echo "All checks passed!"
```

Rendre exécutable:
```bash
chmod +x .git/hooks/pre-commit
```

---

## Variables d'environnement

Règle #25 (sécurité)

JAMAIS de clés API en dur dans code.

Toujours dans `.env.local`:
```bash
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
GELATO_API_KEY=...
DEEPL_API_KEY=...
ANTHROPIC_API_KEY=...
```

Et `.env.template` pour documentation (sans valeurs réelles).

---

## Règles NON applicables à Guillaume Farré

Ces règles sont pour Juris-Power uniquement (IGNORER):
- Règle #7: Design System Juris-Power
- Règle #8: Synchronisation projets (PROJECTS_STATE, DAILY_LOG)
- Règle #18: Architecture front + CMS 17 blocks
- Règle #32: Mentalité CA Juris-Power
- Règle #33: Déontologie magistrats-avocats
- Règle #34: Anonymat scraping TOR
- Règle #38: Validation campagnes email BREVO

Guillaume Farré a sa propre charte graphique (exception documentée).

---

Lalou
