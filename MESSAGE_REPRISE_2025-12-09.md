# MESSAGE REPRISE SESSION 2025-12-09

---

## RESUME EXECUTIF (30 secondes)

**3 FONCTIONNALITES DEPLOYEES EN PRODUCTION**
- Login simplifié (juste mot de passe, plus de username)
- Page /dino-histoire (histoire de la Dino avec images Wikipedia)
- Mode admin édition inline (?admin=true)

| Element           | Valeur                              |
|-------------------|-------------------------------------|
| Branche           | main                                |
| Dernier commit    | c56131a                             |
| URL prod          | https://guillaumefarre.com          |
| Mot de passe      | LHOOQladino246                      |
| Mode édition      | ?admin=true sur n'importe quelle URL|

**VOCABULAIRE IMPORTANT** : On dit "Dino", pas "Ferrari". La voiture s'appelle Dino.

---

## TEST RAPIDE PRODUCTION

```bash
# Vérifier que le site redirige vers login
curl -sI "https://guillaumefarre.com/" | head -3
# Doit retourner: HTTP/2 307 + location: /fr/login

# Vérifier API login
curl -s -X POST https://guillaumefarre.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"LHOOQladino246"}'
# Doit retourner: {"success":true}
```

---

## ETAT ACTUEL

| Element              | Valeur                                 |
|----------------------|----------------------------------------|
| Branche              | main                                   |
| Dernier commit       | c56131a                                |
| IP serveur           | 51.38.35.238                           |
| User SSH             | ubuntu                                 |
| Path serveur         | /var/www/guillaume-farre               |
| PM2 process          | guillaume-farre                        |
| Next.js              | 15.5.6                                 |
| Pages générées       | 113                                    |

---

## FONCTIONNALITE 1 : LOGIN SIMPLIFIE

### Avant (supprimé)
- HTTP Basic Auth nginx (popup navigateur)
- Username + password

### Maintenant
- Page Next.js `/fr/login`
- **Juste un champ mot de passe**
- Cookie `gf_auth=authenticated` (30 jours)
- Middleware redirige vers /login si pas de cookie

### Credentials

| Element         | Valeur           |
|-----------------|------------------|
| Mot de passe    | LHOOQladino246   |
| Cookie name     | gf_auth          |
| Cookie value    | authenticated    |
| Durée cookie    | 30 jours         |

### Fichiers créés

| Fichier                          | Lignes | Description              |
|----------------------------------|--------|--------------------------|
| app/[locale]/login/page.tsx      | 68     | Page login UI            |
| app/api/auth/login/route.ts      | 35     | API vérification mdp     |
| middleware.ts                    | 50     | Auth + redirection i18n  |

### Config nginx (HTTP Basic désactivé)
```nginx
# /etc/nginx/sites-available/guillaumefarre
# Ces lignes sont commentées :
#auth_basic "Site Guillaume Farré - Accès Restreint";
#auth_basic_user_file /etc/nginx/.htpasswd;
```

---

## FONCTIONNALITE 2 : PAGE /DINO-HISTOIRE

### Description
Page complète sur l'histoire de la Dino dans le monde automobile :
- Alfredo "Dino" Ferrari (1932-1956)
- Moteur V6 Dino
- Dino 206 GT (1967-1969)
- Dino 246 GT & GTS (1969-1974)
- La Dino de Guillaume

### Images utilisées (WIKIPEDIA COMMONS)

| Section          | URL Wikipedia                                                    |
|------------------|------------------------------------------------------------------|
| Hero             | upload.wikimedia.org/.../Dino_246_GT_(24627987921).jpg           |
| Alfredo          | upload.wikimedia.org/.../Dino_206_GT_(15406731344).jpg           |
| 206 GT           | upload.wikimedia.org/.../Petersen_Museum_(52042599362).jpg       |
| 246 GTS          | upload.wikimedia.org/.../1973_Dino_246GTS.jpg                    |
| Guillaume        | upload.wikimedia.org/.../1972_Ferrari_Dino_246_GTS_2.4_Interior.jpg |

**IMPORTANT** : Utiliser images Wikipedia, PAS images de la galerie de Guillaume, PAS Unsplash.

### Fichiers

| Fichier                           | Lignes | Description           |
|-----------------------------------|--------|-----------------------|
| app/[locale]/dino-histoire/page.tsx | 391  | Page complète         |
| app/[locale]/dino/page.tsx        | +10    | Ajout lien vers page  |

### Lien depuis /dino
```tsx
<Link href="/dino-histoire">
  L'histoire de la Dino →
</Link>
```

---

## FONCTIONNALITE 3 : MODE ADMIN EDITION INLINE

### Utilisation par Guillaume

1. Aller sur n'importe quelle page
2. Ajouter `?admin=true` à l'URL
3. Barre noire apparaît en bas "Mode Édition"
4. Cliquer sur un texte → devient éditable
5. Modifier le texte
6. Textes modifiés = fond jaune + astérisque
7. Cliquer "Sauvegarder"
8. Modifications enregistrées dans messages/fr.json

### Architecture (préparée pour DB future)

| Fichier                           | Lignes | Description                    |
|-----------------------------------|--------|--------------------------------|
| contexts/AdminModeContext.tsx     | 91     | État global mode admin         |
| components/admin/EditableText.tsx | 105    | Composant texte éditable       |
| components/admin/AdminToolbar.tsx | 54     | Barre flottante sauvegarde     |
| components/admin/AdminWrapper.tsx | 23     | Provider wrapper               |
| lib/content-manager.ts            | 110    | Service stockage (JSON → DB)   |
| app/api/admin/content/route.ts    | 90     | API sauvegarde textes          |
| components/pages/HistoireContent.tsx | 248 | Page histoire éditable         |

### Page convertie

**SEULE /histoire EST CONVERTIE**. Les autres pages à faire :
- /atelier
- /dino
- /dino-histoire
- /galerie
- /boutique
- Homepage (/)

### Comment convertir une page

1. Créer `components/pages/[Page]Content.tsx`
2. Ajouter `"use client";` en haut
3. Importer `EditableText`
4. Remplacer textes par :
```tsx
<EditableText textKey="section.key" as="p" className="...">
  Texte original
</EditableText>
```
5. Modifier page pour importer le composant Content

---

## COMMITS SESSION

| Hash      | Message                                                    |
|-----------|------------------------------------------------------------|
| c56131a   | docs: message exhaustif compactage avec toutes les infos   |
| 7131bed   | docs: sauvegarde complète session 2025-12-07               |
| e99a7d5   | feat: mode admin avec édition inline des textes            |
| 5b3572e   | fix: images Wikipedia historiques Ferrari Dino             |
| efe53ab   | fix: utiliser photos atelier Guillaume                     |
| a5806c2   | fix: remplacer images par vraies Ferrari                   |
| eda8b6c   | fix: exclure API du middleware i18n                        |
| a4e11e8   | fix: déplacer login dans [locale] pour layout              |
| 1894cd2   | feat: page login simple avec juste mot de passe            |
| d4c26df   | feat: page histoire Dino dans le monde automobile          |

---

## DEPLOIEMENT

### Commande complète
```bash
ssh ubuntu@51.38.35.238 "cd /var/www/guillaume-farre && git stash && git pull && npm run build && pm2 restart guillaume-farre"
```

### Vérification status
```bash
ssh ubuntu@51.38.35.238 "pm2 status && curl -s -o /dev/null -w '%{http_code}' http://localhost:3000"
```

### Logs PM2
```bash
ssh ubuntu@51.38.35.238 "pm2 logs guillaume-farre --lines 50 --nostream"
```

---

## REGLES CRITIQUES

### REGLE #32 : METADATA (NE JAMAIS OUBLIER)

```
❌ INTERDIT : Copier data/photo-metadata.json LOCAL → PRODUCTION
✅ AUTORISE : Copier data/photo-metadata.json PRODUCTION → LOCAL

Le fichier du SERVEUR est la SOURCE DE VERITE.
```

### Sync metadata (serveur → local)
```bash
scp ubuntu@51.38.35.238:/var/www/guillaume-farre/data/photo-metadata.json data/photo-metadata.json
```

### VOCABULAIRE

| Correct | Incorrect |
|---------|-----------|
| Dino    | Ferrari   |

La voiture s'appelle **Dino**. Ne jamais dire Ferrari dans les textes du site.

### EXEMPLAIRES PHOTOS

| Type           | Formats      | Exemplaires |
|----------------|--------------|-------------|
| Grands formats | 2A0, A0, A1  | 9 ex.       |
| Petits formats | A2, A3, A4   | 99 ex.      |

Plus de tirages illimités (supprimé 2025-11-29).

---

## PRIX PHOTOS

| Format | Dimensions        | Prix      | Exemplaires |
|--------|-------------------|-----------|-------------|
| 2A0    | 118.9 × 168.2 cm  | Sur devis | 9           |
| A0     | 84.1 × 118.9 cm   | Sur devis | 9           |
| A1     | 59.4 × 84.1 cm    | 1200€     | 9           |
| A2     | 42 × 59.4 cm      | 800€      | 99          |
| A3     | 29.7 × 42 cm      | 500€      | 99          |
| A4     | 21 × 29.7 cm      | 250€      | 99          |

---

## STRUCTURE FICHIERS CLES

```
app/
├── [locale]/
│   ├── login/page.tsx           # Login (NOUVEAU)
│   ├── dino-histoire/page.tsx   # Histoire Dino (NOUVEAU)
│   ├── histoire/page.tsx        # Utilise HistoireContent
│   ├── dino/page.tsx            # Modifié (lien dino-histoire)
│   └── layout.tsx               # AdminWrapper intégré
├── api/
│   ├── auth/login/route.ts      # API login (NOUVEAU)
│   └── admin/content/route.ts   # API contenu (NOUVEAU)

components/
├── admin/
│   ├── EditableText.tsx         # Texte éditable (NOUVEAU)
│   ├── AdminToolbar.tsx         # Barre sauvegarde (NOUVEAU)
│   └── AdminWrapper.tsx         # Provider (NOUVEAU)
└── pages/
    └── HistoireContent.tsx      # Contenu histoire (NOUVEAU)

contexts/
└── AdminModeContext.tsx         # État admin (NOUVEAU)

lib/
└── content-manager.ts           # Service contenu (NOUVEAU)

middleware.ts                    # Auth + i18n (MODIFIE)
```

---

## CONFIGURATION SERVEUR

| Element     | Valeur                    |
|-------------|---------------------------|
| IP          | 51.38.35.238              |
| User        | ubuntu                    |
| Path        | /var/www/guillaume-farre  |
| PM2         | guillaume-farre           |
| Nginx conf  | /etc/nginx/sites-available/guillaumefarre |

### SSH rapide
```bash
ssh ubuntu@51.38.35.238
```

---

## PROCHAINES ETAPES

### Priorité haute
1. Convertir autres pages pour mode admin édition :
   - /atelier
   - /dino
   - /dino-histoire
   - /galerie
   - /boutique
   - Homepage (/)

### Priorité basse
2. Traductions EN/IT (pas demandé)
3. Migration ContentManager vers DB (architecture prête)

---

## DOCUMENTATION COMPLETE

| Fichier                          | Description                    |
|----------------------------------|--------------------------------|
| MESSAGE_REPRISE_2025-12-09.md    | Ce fichier                     |
| SESSION_2025-12-07_COMPLET.md    | Rapport détaillé session       |
| CLAUDE.md                        | Règles projet complètes        |

---

## VERIFICATIONS AU DEMARRAGE

```bash
# 1. État git
git status && git log -3

# 2. État serveur
ssh ubuntu@51.38.35.238 "pm2 status"

# 3. Test site (doit retourner 307)
curl -sI "https://guillaumefarre.com/" | head -3

# 4. Test login
curl -s -X POST https://guillaumefarre.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"LHOOQladino246"}'
```

---

**Auteur** : Lalou
**Date** : 2025-12-09
**Commit** : c56131a
**Durée session** : ~3h
