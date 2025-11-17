#!/bin/bash
# Script de validation complète du projet
# Usage: ./scripts/validate-project.sh

set -e

echo "🔍 VALIDATION PROJET - GUILLAUME FARRÉ"
echo "======================================"
echo ""

ERRORS=0
WARNINGS=0

# 1. TypeScript
echo "📝 1. Compilation TypeScript..."
if npx tsc --noEmit 2>/dev/null; then
  echo "   ✅ TypeScript : 0 erreurs"
else
  echo "   ❌ TypeScript : Erreurs détectées"
  ((ERRORS++))
fi
echo ""

# 2. Git
echo "📦 2. État Git..."
if git diff --quiet && git diff --cached --quiet; then
  echo "   ✅ Git : Working directory propre"
else
  echo "   ⚠️  Git : Modifications non committées"
  ((WARNINGS++))
fi

UNPUSHED=$(git log origin/main..HEAD --oneline 2>/dev/null | wc -l | tr -d ' ')
if [ "$UNPUSHED" -gt 0 ]; then
  echo "   ⚠️  Git : $UNPUSHED commit(s) non pushés"
  ((WARNINGS++))
else
  echo "   ✅ Git : Tous les commits pushés"
fi
echo ""

# 3. Clés API
echo "🔑 3. Clés API..."
if ./scripts/check-api-keys.sh > /dev/null 2>&1; then
  echo "   ✅ Clés API : Toutes présentes"
else
  MISSING=$(./scripts/check-api-keys.sh 2>&1 | grep "Manquantes:" | awk '{print $3}')
  echo "   ⚠️  Clés API : $MISSING manquantes"
  ((WARNINGS++))
fi
echo ""

# 4. Dépendances
echo "📦 4. Dépendances..."
if [ -f "package-lock.json" ]; then
  echo "   ✅ package-lock.json présent"
else
  echo "   ❌ package-lock.json manquant"
  ((ERRORS++))
fi

if [ -d "node_modules" ]; then
  echo "   ✅ node_modules installé"
else
  echo "   ⚠️  node_modules manquant (npm install requis)"
  ((WARNINGS++))
fi
echo ""

# 5. Fichiers critiques
echo "📄 5. Fichiers critiques..."
CRITICAL_FILES=(
  ".env.local"
  "next.config.mjs"
  "package.json"
  "tsconfig.json"
)

for file in "${CRITICAL_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "   ✅ $file"
  else
    echo "   ❌ $file manquant"
    ((ERRORS++))
  fi
done
echo ""

# 6. Documentation
echo "📚 6. Documentation..."
if [ -f "COMMENCE_ICI.md" ]; then
  echo "   ✅ COMMENCE_ICI.md"
else
  echo "   ⚠️  COMMENCE_ICI.md manquant"
  ((WARNINGS++))
fi

if [ -f "ACTIVATION_COMPLETE_GUILLAUME.md" ]; then
  echo "   ✅ ACTIVATION_COMPLETE_GUILLAUME.md"
else
  echo "   ⚠️  ACTIVATION_COMPLETE_GUILLAUME.md manquant"
  ((WARNINGS++))
fi

if [ -f "INDEX_DOCUMENTATION.md" ]; then
  echo "   ✅ INDEX_DOCUMENTATION.md"
else
  echo "   ⚠️  INDEX_DOCUMENTATION.md manquant"
  ((WARNINGS++))
fi
echo ""

# 7. Structure dossiers
echo "📁 7. Structure projet..."
REQUIRED_DIRS=(
  "app"
  "components"
  "lib"
  "public"
  "scripts"
)

for dir in "${REQUIRED_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    echo "   ✅ $dir/"
  else
    echo "   ❌ $dir/ manquant"
    ((ERRORS++))
  fi
done
echo ""

# 8. Build test (optionnel, désactivé par défaut pour rapidité)
# echo "🏗️  8. Test build production..."
# if npm run build > /dev/null 2>&1; then
#   echo "   ✅ Build : Succès"
# else
#   echo "   ❌ Build : Échec"
#   ((ERRORS++))
# fi
# echo ""

# Résumé
echo "======================================"
echo ""
echo "📊 RÉSUMÉ:"
echo "  ❌ Erreurs: $ERRORS"
echo "  ⚠️  Warnings: $WARNINGS"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo "🎉 Projet validé : Prêt pour production !"
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo "✅ Projet fonctionnel avec $WARNINGS warning(s)"
  echo "   (Principalement clés API manquantes)"
  exit 0
else
  echo "❌ Projet incomplet : $ERRORS erreur(s) critique(s)"
  exit 1
fi

# Lalou
