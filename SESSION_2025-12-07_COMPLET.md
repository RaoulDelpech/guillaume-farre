# SESSION 2025-12-07 - SAUVEGARDE COMPLÈTE AVANT COMPACTAGE

**Date** : 2025-12-07
**Par** : Lalou
**Statut** : Terminé - Prêt pour compactage

---

## RÉSUMÉ EXÉCUTIF

Cette session a implémenté :
1. **Système de login simplifié** - juste mot de passe, plus de username
2. **Page /dino-histoire** - histoire complète de la Ferrari Dino avec images Wikipedia
3. **Mode admin avec édition inline** - Guillaume peut modifier les textes directement sur le site

---

## 1. SYSTÈME D'AUTHENTIFICATION

### Ancien système (supprimé)
- HTTP Basic Auth nginx (username + password popup navigateur)

### Nouveau système (actuel)
- Page de login Next.js custom `/fr/login`
- Juste un champ mot de passe (pas de username)
- Cookie `gf_auth` valide 30 jours
- Middleware Next.js qui redirige vers /login si pas authentifié

### Fichiers créés/modifiés
```
app/[locale]/login/page.tsx         # Page login (nouveau)
app/api/auth/login/route.ts         # API login (nouveau)
middleware.ts                       # Modifié pour auth + i18n
```

### Accès au site
- **URL** : https://guillaumefarre.com
- **Mot de passe** : `LHOOQladino246`
- **Admin photos** : https://guillaumefarre.com/fr/admin (même mot de passe)

### Config nginx (HTTP Basic désactivé)
```nginx
# Commenté dans /etc/nginx/sites-available/guillaumefarre
#auth_basic "Site Guillaume Farré - Accès Restreint";
#auth_basic_user_file /etc/nginx/.htpasswd;
```

---

## 2. PAGE /DINO-HISTOIRE

### Description
Page complète sur l'histoire de la Ferrari Dino dans le monde automobile :
- Alfredo "Dino" Ferrari (1932-1956)
- Le moteur V6 Dino (F2, F1, route)
- Dino 206 GT (1967-1969)
- Dino 246 GT & GTS (1969-1974)
- L'héritage et la Dino de Guillaume

### Images utilisées
**IMAGES WIKIPEDIA COMMONS** (pas Unsplash, pas galerie Guillaume) :
```
Hero: upload.wikimedia.org/.../Dino_246_GT_(24627987921).jpg
Section Alfredo: upload.wikimedia.org/.../Dino_206_GT_(15406731344).jpg
Section 206 GT: upload.wikimedia.org/.../Petersen_Museum_(52042599362).jpg
Section 246 GTS: upload.wikimedia.org/.../1973_Dino_246GTS.jpg
Section Guillaume: upload.wikimedia.org/.../1972_Ferrari_Dino_246_GTS_2.4_Interior.jpg
```

### Fichiers
```
app/[locale]/dino-histoire/page.tsx  # Page complète (nouveau)
app/[locale]/dino/page.tsx           # Modifié - ajout lien vers /dino-histoire
```

### Lien depuis /dino
```tsx
<Link href="/dino-histoire">
  L'histoire de la Dino →
</Link>
```

---

## 3. MODE ADMIN ÉDITION INLINE

### Fonctionnement
1. Guillaume ajoute `?admin=true` à n'importe quelle URL
2. Une barre noire apparaît en bas "Mode Édition"
3. Il clique sur un texte pour le modifier
4. Les textes modifiés sont surlignés en jaune avec *
5. Il clique "Sauvegarder" pour enregistrer dans messages/fr.json

### Architecture (préparée pour DB future)
```
contexts/AdminModeContext.tsx      # État global mode admin
components/admin/EditableText.tsx  # Composant texte éditable
components/admin/AdminToolbar.tsx  # Barre flottante sauvegarde
components/admin/AdminWrapper.tsx  # Provider wrapper
lib/content-manager.ts             # Service stockage (JSON → DB plus tard)
app/api/admin/content/route.ts     # API sauvegarde textes
```

### Page convertie
Seule la page `/histoire` est convertie pour l'instant :
```
app/[locale]/histoire/page.tsx           # Simplifié
components/pages/HistoireContent.tsx     # Contenu avec EditableText
```

### Comment convertir une autre page
1. Créer `components/pages/[NomPage]Content.tsx`
2. Remplacer les textes par `<EditableText textKey="..." as="p">Texte</EditableText>`
3. Importer dans la page : `import [NomPage]Content from "@/components/pages/[NomPage]Content"`

### Exemple EditableText
```tsx
<EditableText
  textKey="histoire.hero.title"
  as="h1"
  className="text-4xl font-bold"
>
  L'Histoire
</EditableText>
```

---

## 4. COMMITS CETTE SESSION

```
e13a897 - fix: images Unsplash libres de droit pour page dino-histoire
3229b0c - docs: mise à jour session 2025-11-30 - dino-histoire + accès simplifié
1894cd2 - feat: page login simple avec juste mot de passe (plus de username)
a4e11e8 - fix: déplacer login dans [locale] pour layout
eda8b6c - fix: exclure API du middleware i18n
a5806c2 - fix: remplacer images par vraies Ferrari sur page dino-histoire
efe53ab - fix: utiliser photos atelier Guillaume (vraies Ferrari)
5b3572e - fix: images Wikipedia historiques Ferrari Dino
e99a7d5 - feat: mode admin avec édition inline des textes (?admin=true)
```

---

## 5. ÉTAT PRODUCTION ACTUEL

### Git
- **Branche** : main
- **Dernier commit** : e99a7d5
- **Status** : Clean, synchronisé avec origin/main

### Serveur
- **IP** : 51.38.35.238
- **PM2** : guillaume-farre (PID variable après restart)
- **Build** : 113 pages générées
- **Node** : Next.js 15.5.6

### Vérification rapide
```bash
ssh ubuntu@51.38.35.238 "pm2 status && curl -s -o /dev/null -w '%{http_code}' http://localhost:3000"
```

---

## 6. RÈGLES MÉTIER (INCHANGÉES)

### Exemplaires photos
| Type | Formats | Exemplaires |
|------|---------|-------------|
| Grands formats | 2A0, A0, A1 | 9 |
| Petits formats | A2, A3, A4 | 99 |

### Prix
| Format | Prix | Exemplaires |
|--------|------|-------------|
| 2A0 | Sur devis | 9 |
| A0 | Sur devis | 9 |
| A1 | 1200€ | 9 |
| A2 | 800€ | 99 |
| A3 | 500€ | 99 |
| A4 | 250€ | 99 |

### RÈGLE #32 CRITIQUE
```
❌ INTERDIT : Copier data/photo-metadata.json LOCAL → PRODUCTION
✅ AUTORISÉ : Copier data/photo-metadata.json PRODUCTION → LOCAL

Le fichier du SERVEUR est la SOURCE DE VÉRITÉ.
```

---

## 7. COMMANDES UTILES

### Déploiement complet
```bash
ssh ubuntu@51.38.35.238 "cd /var/www/guillaume-farre && git stash && git pull && npm run build && pm2 restart guillaume-farre"
```

### Sync metadata (serveur → local)
```bash
scp ubuntu@51.38.35.238:/var/www/guillaume-farre/data/photo-metadata.json data/photo-metadata.json
```

### Vérifier site
```bash
curl -sI "https://guillaumefarre.com/fr" | head -5
```

---

## 8. CE QUI RESTE À FAIRE

### Priorité haute
1. **Convertir autres pages pour mode admin** - actuellement seule /histoire est éditable
   - /atelier
   - /dino
   - /dino-histoire
   - /galerie
   - /boutique

### Priorité moyenne
2. **Traductions EN/IT** - non demandé pour l'instant

### Priorité basse
3. **Migration ContentManager vers DB** - architecture prête, à faire quand nécessaire

---

## 9. STRUCTURE FICHIERS CRÉÉS/MODIFIÉS

### Nouveaux fichiers
```
app/[locale]/login/page.tsx
app/[locale]/dino-histoire/page.tsx
app/api/auth/login/route.ts
app/api/admin/content/route.ts
components/admin/EditableText.tsx
components/admin/AdminToolbar.tsx
components/admin/AdminWrapper.tsx
components/pages/HistoireContent.tsx
contexts/AdminModeContext.tsx
lib/content-manager.ts
```

### Fichiers modifiés
```
middleware.ts
app/[locale]/layout.tsx
app/[locale]/histoire/page.tsx
app/[locale]/dino/page.tsx
```

---

## 10. POUR LA PROCHAINE SESSION

### À lire en premier
1. Ce fichier `SESSION_2025-12-07_COMPLET.md`
2. `CLAUDE.md` du projet

### Vérifications
```bash
git status && git log -3
ssh ubuntu@51.38.35.238 "pm2 status"
```

### Test rapide site
1. Ouvrir https://guillaumefarre.com en navigation privée
2. Vérifier que la page login s'affiche
3. Taper `LHOOQladino246`
4. Aller sur /fr/histoire?admin=true
5. Vérifier que la barre "Mode Édition" apparaît

---

**Maintenu par** : Lalou
**Sauvegardé** : 2025-12-07
