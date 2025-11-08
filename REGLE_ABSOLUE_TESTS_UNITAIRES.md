# RÈGLE ABSOLUE : Tests Unitaires Réguliers

**Date** : 2025-11-08
**Auteur** : Lalou
**Demandée par** : Raoul (utilisateur)

---

## Contexte

Lors de la session du 2025-11-08, Raoul a exprimé une nouvelle exigence absolue concernant les tests unitaires :

> "En règle absolue pour améliorer ton prompt. je veux aussi que tu fasses régulièrement des tests unitaires"

Cette règle s'ajoute aux 31 règles absolues déjà définies dans `~/.claude-global-rules.md`.

---

## La Règle

**Écrire systématiquement des tests unitaires pour tout nouveau code significatif, en particulier :**
- Fonctions de calcul
- Logique métier
- Utilitaires
- Transformations de données
- API handlers

---

## Application au Projet Guillaume Farré

### Infrastructure de Tests

**Framework** : Vitest 4.0.8
**Testing Library** : @testing-library/react 16.3.0
**Environnement** : jsdom

### Configuration

Fichiers de configuration :
- `vitest.config.ts` - Configuration Vitest
- `vitest.setup.ts` - Setup tests (jest-dom)
- `package.json` - Scripts de tests

### Scripts Disponibles

```bash
# Exécuter tests en mode watch
npm test

# Exécuter tests avec interface UI
npm run test:ui

# Exécuter tests avec rapport coverage
npm run test:coverage
```

### Organisation des Tests

```
/lib/
  pricing-calculator.ts          # Code source
  __tests__/
    pricing-calculator.test.ts   # Tests unitaires
```

Convention de nommage :
- Fichier de test : `{nom-fichier}.test.ts`
- Répertoire : `__tests__/` au même niveau que le code source

---

## Exemple Concret : Tests Pricing Calculator

### Code Testé (`lib/pricing-calculator.ts`)

Fonctions testées :
- `calculatePrice()` - Calcul prix selon catégorie/format
- `updateBasePrice()` - Mise à jour prix de base
- `setManualPrice()` - Définition prix manuel
- `clearManualPrice()` - Suppression override manuel
- `updateMultiplier()` - Mise à jour multiplicateur
- `formatPrice()` - Formatage prix en euros
- `calculatePercentageIncrease()` - Calcul pourcentage augmentation

### Tests Écrits (`lib/__tests__/pricing-calculator.test.ts`)

**238 lignes de tests** couvrant :
- Calculs pour tous formats (A4/A3/A2/A1)
- Catégories unlimited et limited
- Prix manuels (overrides)
- Préservation données lors updates
- Formatage prix français (espaces insécables)
- Arrondis prix
- Calculs pourcentages
- Workflow complet (intégration)
- Stratégie pricing Peter Lik

**Résultats** : 25 tests, 100% passing

---

## Quand Écrire des Tests

### TOUJOURS Tester

1. **Fonctions de calcul** (pricing, taxes, conversions)
2. **Logique métier complexe** (règles business, validations)
3. **Utilitaires critiques** (formatage, transformations)
4. **API handlers** (requêtes, réponses, erreurs)
5. **Algorithmes** (tri, filtrage, recherche)

### PEUT-ÊTRE Tester

1. Composants UI simples (affichage uniquement)
2. Wrappers minimes
3. Code trivial (getters/setters simples)

### NE PAS Tester

1. Code externe (bibliothèques)
2. Configuration pure
3. Types TypeScript
4. Styling CSS/Tailwind

---

## Workflow de Développement avec Tests

### Étape 1 : Écrire le Code

Implémenter la fonctionnalité demandée.

### Étape 2 : Écrire les Tests

Créer fichier `__tests__/{nom}.test.ts` avec :
```typescript
import { describe, it, expect } from 'vitest';
import { maFonction } from '../mon-fichier';

describe('mon-fichier', () => {
  describe('maFonction', () => {
    it('should handle basic case', () => {
      const result = maFonction(input);
      expect(result).toBe(expectedOutput);
    });

    it('should handle edge case', () => {
      // ...
    });
  });
});
```

### Étape 3 : Exécuter les Tests

```bash
npm test
```

Vérifier que tous les tests passent (100% passing).

### Étape 4 : Corriger si Nécessaire

Si tests échouent :
1. Analyser l'erreur
2. Corriger le code ou le test
3. Relancer tests
4. Itérer jusqu'à 100% passing

### Étape 5 : Commit

Committer code + tests ensemble :
```bash
git add lib/mon-fichier.ts lib/__tests__/mon-fichier.test.ts
git commit -m "feat: Ma fonctionnalité + tests unitaires"
```

---

## Bonnes Pratiques

### Structure des Tests

```typescript
describe('Nom du module', () => {
  describe('nomFonction', () => {
    it('should do X when Y', () => {
      // Arrange
      const input = ...;

      // Act
      const result = fonction(input);

      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

### Nommage des Tests

- ✅ `it('should calculate unlimited A4 price correctly')`
- ✅ `it('should handle zero base')`
- ✅ `it('should preserve other manual prices')`
- ❌ `it('test calcul')`
- ❌ `it('works')`

### Couverture de Tests

Tester :
1. **Cas nominal** (usage normal)
2. **Cas limites** (0, null, undefined, empty)
3. **Cas erreurs** (valeurs invalides)
4. **Cas intégration** (workflow complet)

### Tests d'Intégration

Ajouter au moins 1 test d'intégration testant le workflow complet :
```typescript
it('should correctly handle full pricing workflow', () => {
  let config = { ...DEFAULT_CONFIG };

  config = updateBasePrice('unlimited', 200, config);
  let result = calculatePrice('unlimited', 'a3', config);
  expect(result.price).toBe(334);

  config = setManualPrice('unlimited-a3', 400, config);
  result = calculatePrice('unlimited', 'a3', config);
  expect(result.price).toBe(400);

  // etc.
});
```

---

## Métriques de Qualité

### Objectif : 80%+ Coverage

Utiliser `npm run test:coverage` pour vérifier :
- **Statements** : 80%+
- **Branches** : 75%+
- **Functions** : 85%+
- **Lines** : 80%+

### Objectif : 100% Passing

Tous les tests doivent passer avant commit.

Résultat acceptable :
```
✓ lib/__tests__/pricing-calculator.test.ts (25 tests) 69ms

Test Files  1 passed (1)
     Tests  25 passed (25)
```

Résultat inacceptable :
```
❯ lib/__tests__/pricing-calculator.test.ts (25 tests | 2 failed)

Test Files  1 failed (1)
     Tests  2 failed | 23 passed (25)
```

---

## Exceptions

Cette règle peut être temporairement suspendue dans les cas suivants :
1. **Prototypage rapide** validé par l'utilisateur
2. **Code temporaire** marqué `// TODO: tests`
3. **Urgence production** (mais tests requis immédiatement après)

Dans tous les cas, **documenter l'exception** et planifier les tests.

---

## Intégration avec Pre-commit Hooks

Les tests unitaires seront intégrés aux hooks pre-commit :

```bash
# .git/hooks/pre-commit (à créer)
#!/bin/sh
npm run lint && npm test
```

Si tests échouent, commit bloqué.

---

## Historique

### 2025-11-08 : Première Implémentation

**Session pricing dynamique**

Fonctionnalités ajoutées :
- Infrastructure Vitest complète
- Tests pricing-calculator (25 tests, 238 lignes)
- Scripts package.json (test, test:ui, test:coverage)
- Documentation règle absolue

Résultats :
- ✅ 100% tests passing
- ✅ Infrastructure fonctionnelle
- ✅ Workflow documenté

---

## Documentation Complémentaire

- **Vitest** : https://vitest.dev/
- **Testing Library** : https://testing-library.com/
- **Tests Unitaires (Wikipedia)** : https://en.wikipedia.org/wiki/Unit_testing

---

## Signature

Cette règle absolue a été ajoutée au projet par Lalou le 2025-11-08, suite à la demande explicite de Raoul.

Elle complète les 31 règles absolues existantes sans les remplacer.

---

**Lalou**
2025-11-08
