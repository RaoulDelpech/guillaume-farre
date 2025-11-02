#!/bin/bash

# Script pour pousser vers GitHub

echo "🚀 Authentification GitHub CLI..."
gh auth login

echo ""
echo "📤 Push vers GitHub..."
git push -u origin main --force

echo ""
echo "✅ Code poussé vers GitHub !"
echo "🔗 Voir sur: https://github.com/RaoulDelpech/guillaume-farre"
