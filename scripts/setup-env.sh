#!/bin/bash
# Script de configuration rapide des clés API
# Usage: ./scripts/setup-env.sh

set -e

ENV_FILE=".env.local"

echo "🔧 Configuration des clés API - Guillaume Farré"
echo "================================================"
echo ""

# Créer .env.local s'il n'existe pas
if [ ! -f "$ENV_FILE" ]; then
  echo "📝 Création de $ENV_FILE..."
  touch "$ENV_FILE"
fi

# Fonction pour ajouter/mettre à jour une clé
update_env_key() {
  local key=$1
  local value=$2

  if grep -q "^${key}=" "$ENV_FILE"; then
    # La clé existe déjà, la mettre à jour
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' "s|^${key}=.*|${key}=${value}|" "$ENV_FILE"
    else
      sed -i "s|^${key}=.*|${key}=${value}|" "$ENV_FILE"
    fi
    echo "✅ $key mise à jour"
  else
    # Ajouter la clé
    echo "${key}=${value}" >> "$ENV_FILE"
    echo "✅ $key ajoutée"
  fi
}

# Vérifier les clés existantes
echo "🔍 Vérification des clés existantes..."
echo ""

if grep -q "GELATO_API_KEY" "$ENV_FILE"; then
  echo "✅ GELATO_API_KEY : Configurée"
else
  echo "⏳ GELATO_API_KEY : Manquante"
  echo "   → Obtenir sur: https://www.gelato.com/ → Settings → API Keys"
fi

if grep -q "RESEND_API_KEY" "$ENV_FILE"; then
  echo "✅ RESEND_API_KEY : Configurée"
else
  echo "⏳ RESEND_API_KEY : Manquante"
  echo "   → Obtenir sur: https://resend.com/ → API Keys"
fi

if grep -q "DEEPL_API_KEY" "$ENV_FILE"; then
  echo "✅ DEEPL_API_KEY : Configurée"
else
  echo "⏳ DEEPL_API_KEY : Manquante"
  echo "   → Obtenir sur: https://www.deepl.com/pro-api → Account"
fi

if grep -q "ANTHROPIC_API_KEY" "$ENV_FILE"; then
  echo "✅ ANTHROPIC_API_KEY : Configurée"
else
  echo "⏳ ANTHROPIC_API_KEY : Manquante"
  echo "   → Obtenir sur: https://console.anthropic.com/ → Settings"
fi

echo ""
echo "================================================"
echo ""
echo "📖 Pour ajouter une clé manuellement:"
echo "   nano $ENV_FILE"
echo ""
echo "📖 Guides complets:"
echo "   - ACTIVATION_COMPLETE_GUILLAUME.md"
echo "   - GELATO_SETUP_FINAL.md"
echo "   - RESEND_EMAILS_SETUP.md"
echo ""
echo "🚀 Après ajout des clés, redémarrer le serveur:"
echo "   npm run dev"
echo ""

# Lalou
