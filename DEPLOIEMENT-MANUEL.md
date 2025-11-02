# 🚀 Déploiement Manuel (Alternative)

Si l'authentification GitHub dans Same ne fonctionne pas, voici la méthode alternative :

## Option 1 : Via Terminal SSH

1. **Connectez-vous à votre VPS IONOS** :

```bash
ssh root@guillaumefarre.com
```

2. **Clonez ou mettez à jour le repository** :

```bash
cd /root
rm -rf guillaume-farre  # Si existe déjà
git clone https://github.com/RaoulDelpech/guillaume-farre.git
cd guillaume-farre
```

3. **Installez et buildez** :

```bash
bun install
bun run build
```

4. **Démarrez avec PM2** :

```bash
pm2 delete guillaume-farre 2>/dev/null || true
pm2 start bun --name "guillaume-farre" -- run start
pm2 save
```

5. **Vérifiez** :

```bash
pm2 status
pm2 logs guillaume-farre
```

## Option 2 : Pousser manuellement avec git

Si vous avez accès au terminal local :

```bash
cd guillaume-farre-work

# Ajouter le remote
git remote add origin https://github.com/RaoulDelpech/guillaume-farre.git

# Pousser avec vos credentials GitHub
git push -u origin main --force
```

Il vous demandera votre nom d'utilisateur et mot de passe GitHub (ou token).

## Option 3 : Créer un ZIP et uploader

1. **Créer un ZIP du projet** :

```bash
cd guillaume-farre-work
zip -r ../guillaume-farre.zip . -x "node_modules/*" -x ".next/*"
```

2. **Transférer sur le VPS** :

```bash
scp ../guillaume-farre.zip root@guillaumefarre.com:/root/
```

3. **Sur le VPS, décompresser et installer** :

```bash
ssh root@guillaumefarre.com
cd /root
unzip guillaume-farre.zip -d guillaume-farre
cd guillaume-farre
bun install
bun run build
pm2 start bun --name "guillaume-farre" -- run start
```

## 🎯 URLs après déploiement

- Site principal : https://guillaumefarre.com
- Admin : https://guillaumefarre.com/fr/admin
- Mot de passe admin : `guillaume2025`

## ✅ Vérifications

Après déploiement, testez :

- [ ] Le site s'affiche
- [ ] Les 3 langues fonctionnent (FR/EN/IT)
- [ ] L'admin a un fond noir
- [ ] Les photos se chargent
- [ ] Le sélecteur de langue marche

---

**Besoin d'aide ?** Contactez support@same.new
