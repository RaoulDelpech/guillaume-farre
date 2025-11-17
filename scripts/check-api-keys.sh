#!/bin/bash
# Script de vérification des clés API
# Usage: ./scripts/check-api-keys.sh

set -e

ENV_FILE=".env.local"

echo "🔍 Vérification des clés API - Guillaume Farré"
echo "=============================================="
echo ""

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Fichier $ENV_FILE introuvable"
  exit 1
fi

# Fonction pour vérifier une clé
check_key() {
  local key=$1
  local service=$2
  local url=$3

  if grep -q "^${key}=" "$ENV_FILE"; then
    local value=$(grep "^${key}=" "$ENV_FILE" | cut -d'=' -f2)
    if [ -n "$value" ] && [ "$value" != "" ]; then
      echo "✅ $service ($key)"
      return 0
    else
      echo "⚠️  $service ($key) - Présente mais vide"
      echo "   → $url"
      return 1
    fi
  else
    echo "❌ $service ($key) - Manquante"
    echo "   → $url"
    return 1
  fi
}

# Compteurs
TOTAL=0
PRESENT=0
MISSING=0

echo "🔑 Clés critiques pour e-commerce:"
echo ""

# Stripe (obligatoire)
if check_key "STRIPE_SECRET_KEY" "Stripe Secret" "https://dashboard.stripe.com/"; then
  ((PRESENT++))
else
  ((MISSING++))
fi
((TOTAL++))

if check_key "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "Stripe Publishable" "https://dashboard.stripe.com/"; then
  ((PRESENT++))
else
  ((MISSING++))
fi
((TOTAL++))

echo ""
echo "📧 Clés emails automatiques:"
echo ""

# Resend (pour emails)
if check_key "RESEND_API_KEY" "Resend" "https://resend.com/"; then
  ((PRESENT++))
else
  ((MISSING++))
fi
((TOTAL++))

if check_key "RESEND_FROM_EMAIL" "Resend From Email" "https://resend.com/"; then
  ((PRESENT++))
else
  ((MISSING++))
fi
((TOTAL++))

echo ""
echo "🖨️ Clés impression automatique:"
echo ""

# Gelato (pour impression)
if check_key "GELATO_API_KEY" "Gelato" "https://www.gelato.com/"; then
  ((PRESENT++))
else
  ((MISSING++))
fi
((TOTAL++))

if check_key "GELATO_ENVIRONMENT" "Gelato Environment (test/live)" "https://www.gelato.com/"; then
  ((PRESENT++))
else
  ((MISSING++))
fi
((TOTAL++))

echo ""
echo "🌍 Clés traductions automatiques:"
echo ""

# DeepL (pour traductions)
if check_key "DEEPL_API_KEY" "DeepL" "https://www.deepl.com/pro-api"; then
  ((PRESENT++))
else
  ((MISSING++))
fi
((TOTAL++))

echo ""
echo "🤖 Clés IA:"
echo ""

# Anthropic (pour descriptions IA)
if check_key "ANTHROPIC_API_KEY" "Anthropic Claude" "https://console.anthropic.com/"; then
  ((PRESENT++))
else
  ((MISSING++))
fi
((TOTAL++))

echo ""
echo "=============================================="
echo ""
echo "📊 Résumé:"
echo "  Total clés: $TOTAL"
echo "  ✅ Présentes: $PRESENT"
echo "  ❌ Manquantes: $MISSING"
echo ""

if [ $MISSING -eq 0 ]; then
  echo "🎉 Toutes les clés API sont configurées !"
  echo ""
  echo "🚀 Prochaine étape:"
  echo "   npm run dev"
  exit 0
else
  echo "⚠️  Il manque $MISSING clé(s) API"
  echo ""
  echo "📖 Guide complet:"
  echo "   ACTIVATION_COMPLETE_GUILLAUME.md"
  echo ""
  exit 1
fi

# Lalou
