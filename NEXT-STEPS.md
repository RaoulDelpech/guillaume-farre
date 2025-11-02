# Prochaines Étapes - Déploiement

## ✅ Ce qui est fait

L'intégration i18n est **complète** ! Le site supporte maintenant 3 langues (FR/EN/IT).

Tous les fichiers sont commités localement dans git.

## 🔐 Étape 1: Authentifier GitHub

Pour pousser le code vers GitHub, vous devez authentifier GitHub CLI:

1. Cliquez sur le bouton **"Tools"** en haut à droite de Same
2. Connectez-vous à votre compte GitHub
3. Autorisez l'accès à Same

## 📤 Étape 2: Pousser vers GitHub

Une fois authentifié, exécutez dans le terminal:

```bash
cd guillaume-farre-work
git push -u origin main
```

Cela enverra tout le code vers le repository `RaoulDelpech/guillaume-farre`.

## 🚀 Étape 3: Déploiement Automatique

Le workflow GitHub Actions (`.github/workflows/deploy.yml`) déploiera automatiquement sur le VPS IONOS:

1. **Déclenchement**: Push sur `main`
2. **Actions**:
   - Build de l'application Next.js
   - Transfert via SSH vers le VPS
   - Installation des dépendances avec Bun
   - Build production
   - Redémarrage avec PM2

## 🌐 URLs du Site

Après le déploiement, le site sera accessible sur:

### Français (par défaut)
- https://guillaumefarre.com/
- https://guillaumefarre.com/galerie
- https://guillaumefarre.com/boutique
- https://guillaumefarre.com/histoire
- https://guillaumefarre.com/atelier
- etc.

### English
- https://guillaumefarre.com/en/
- https://guillaumefarre.com/en/galerie
- https://guillaumefarre.com/en/boutique
- etc.

### Italiano
- https://guillaumefarre.com/it/
- https://guillaumefarre.com/it/galerie
- https://guillaumefarre.com/it/boutique
- etc.

## 📝 Modifier le Site

Pour faire des modifications:

1. **Éditer les fichiers dans Same**
   - Composants dans `components/`
   - Pages dans `app/[locale]/`
   - Traductions dans `messages/`

2. **Tester localement**
   ```bash
   cd guillaume-farre-work
   bun run dev
   ```
   Ouvrez http://localhost:3000

3. **Commiter les changements**
   ```bash
   git add .
   git commit -m "Description des changements"
   git push origin main
   ```

4. **Déploiement automatique**
   GitHub Actions déploiera automatiquement sur le VPS

## 🎨 Personnaliser les Traductions

Modifiez les fichiers dans `messages/`:

**`messages/fr.json`**:
```json
{
  "nav": {
    "nouveauLien": "Nouveau Lien"
  }
}
```

**`messages/en.json`**:
```json
{
  "nav": {
    "nouveauLien": "New Link"
  }
}
```

**`messages/it.json`**:
```json
{
  "nav": {
    "nouveauLien": "Nuovo Link"
  }
}
```

Puis utilisez dans un composant:
```tsx
const t = useTranslations('nav');
<a>{t('nouveauLien')}</a>
```

## 🖼️ Ajouter des Œuvres

Modifiez `lib/works.ts`:

```typescript
export const works: Work[] = [
  ...generateSeriesWorks('empreintes', 'Empreintes', 17),
  ...generateSeriesWorks('atelier', 'Atelier', 10),
  ...generateSeriesWorks('projection', 'Projection', 14),
  // Ajouter une nouvelle série:
  ...generateSeriesWorks('nouvelle-serie', 'Nouvelle Série', 5),
];
```

Placez les images dans `public/images/works/nouvelle-serie/`.

## 📱 Tester les Langues

Pour tester chaque langue localement:

1. **Français**: http://localhost:3000/
2. **English**: http://localhost:3000/en/
3. **Italiano**: http://localhost:3000/it/

Le sélecteur de langue dans la navigation permet de changer facilement.

## 🔧 En Cas de Problème

### Le build échoue
```bash
cd guillaume-farre-work
bun run build
```
Vérifiez les erreurs TypeScript.

### Les traductions ne s'affichent pas
Vérifiez que:
- Les clés existent dans les 3 fichiers (`fr.json`, `en.json`, `it.json`)
- Le namespace correspond (`useTranslations('nav')` → `nav` dans les JSON)

### Le déploiement échoue
Vérifiez les logs GitHub Actions:
1. Allez sur https://github.com/RaoulDelpech/guillaume-farre/actions
2. Cliquez sur le dernier workflow
3. Consultez les logs d'erreur

## 📚 Documentation

- **README.md**: Documentation générale du projet
- **I18N-INTEGRATION.md**: Détails sur le système multilingue
- **DEPLOIEMENT-IONOS-VPS.md**: Configuration du VPS IONOS

## 🎉 Le Site est Prêt !

Une fois poussé sur GitHub, le site sera automatiquement déployé et accessible en 3 langues sur guillaumefarre.com.

---

**Workflow Simplifié**:
1. Modifier le code dans Same
2. `git add . && git commit -m "message"`
3. `git push origin main`
4. GitHub Actions déploie automatiquement
5. Le site est à jour sur guillaumefarre.com ✅
