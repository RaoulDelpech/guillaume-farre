#!/bin/bash
# Script de déploiement automatique pour guillaumefarre.com

echo "🚀 Déploiement sur guillaumefarre.com..."
echo ""

# Connexion SSH et déploiement
ssh root@87.106.40.44 << 'ENDSSH'
cd /var/www/guillaumefarre.com
echo "📦 Git pull..."
git pull origin main
echo "📦 npm install..."
npm install
echo "🔨 Build..."
npm run build
echo "♻️ Restart PM2..."
pm2 restart guillaumefarre
echo ""
echo "✅ Déploiement terminé !"
exit
ENDSSH

echo ""
echo "✅ Le site est maintenant live sur https://guillaumefarre.com"
