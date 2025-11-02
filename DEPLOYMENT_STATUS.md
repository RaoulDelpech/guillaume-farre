# État du Déploiement

## 🚀 Déploiement Automatique

Le site utilise GitHub Actions pour se déployer automatiquement sur le VPS IONOS à chaque push sur `main`.

### Workflow
- **Fichier** : `.github/workflows/deploy.yml`
- **Déclencheur** : Push sur branch `main`
- **Actions** :
  1. Git pull sur le VPS
  2. Installation des dépendances (bun install)
  3. Configuration .env.local
  4. Build de production (bun run build)
  5. Redémarrage PM2

### Derniers Commits
```
1526d0f - Ajustements majeurs selon feedback JM - Ton et contenu
0e9b7b8 - Intégration WhiteWall - Service d'impression professionnel
13ca120 - Intégration Stripe complète + Page Boutique fonctionnelle
82a03d3 - Ajout Footer professionnel avec design cohérent
d3becde - Fix design - Ajout thème rouge/gris anthracite professionnel
```

## 📝 Vérifications

### Pour vérifier le déploiement sur GitHub :
1. Aller sur https://github.com/RaoulDelpech/guillaume-farre/actions
2. Voir l'état du dernier workflow
3. Vérifier qu'il est en "Success" (✓ vert)

### Si le déploiement échoue :
- Vérifier les logs du workflow sur GitHub Actions
- Les secrets doivent être configurés :
  - `SSH_HOST`
  - `SSH_USER`
  - `SSH_PRIVATE_KEY`
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `ADMIN_PASSWORD`

## 🌐 URLs

- **Production** : https://guillaumefarre.com
- **Développement** : http://localhost:3001

## ⏱️ Délai de Déploiement

Typiquement 2-5 minutes après le push :
- Pull du code : ~30s
- Installation : ~1-2min
- Build : ~1-2min
- Redémarrage : ~10s

**Total : ~3-5 minutes**

## 🔧 Forcer un Déploiement

Si le déploiement automatique ne fonctionne pas, faire un commit vide :
```bash
git commit --allow-empty -m "Force redeploy"
git push origin main
```

Cela relancera le workflow GitHub Actions.
