# Intégration WhiteWall - Guide Complet

## 🎯 Objectif

WhiteWall est un service d'impression photo professionnel premium qui offre :
- Tirages Fine Art de haute qualité
- Encadrement professionnel
- Divers formats et supports (papier, alu-dibond, acrylique)
- Livraison internationale sécurisée

## 🌐 À propos de WhiteWall

- **Site web** : https://www.whitewall.com
- **Qualité** : Laboratoire photo premium allemand
- **Spécialité** : Tirages d'art, encadrements personnalisés
- **API** : API disponible pour intégration e-commerce

## 📋 Options disponibles

### Supports d'impression
1. **Papier Fine Art** (recommandé pour photographies)
   - Papier mat 300g/m²
   - Rendu des couleurs exceptionnel
   - Conservation garantie 100+ ans

2. **Alu-Dibond**
   - Support rigide en aluminium
   - Effet moderne et lumineux
   - Résistant et durable

3. **Acrylique**
   - Impression derrière plaque acrylique
   - Profondeur et brillance unique
   - Effet galerie haut de gamme

### Formats standard
- A4 (21 × 29,7 cm)
- A3 (29,7 × 42 cm)
- A2 (42 × 59,4 cm)
- A1 (59,4 × 84,1 cm)
- Formats personnalisés possibles

### Encadrements
- Cadre bois noir
- Cadre bois blanc
- Cadre aluminium brossé
- Passe-partout sur mesure

## 🔧 Intégration technique

### Option 1 : API WhiteWall (Recommandé)

1. **Créer un compte partenaire WhiteWall**
   - Allez sur https://www.whitewall.com/fr/partners
   - Demandez un accès API professionnel
   - Récupérez vos identifiants API

2. **Configuration dans .env.local**
   ```bash
   WHITEWALL_API_KEY=votre_cle_api_whitewall
   WHITEWALL_PARTNER_ID=votre_id_partenaire
   WHITEWALL_API_URL=https://api.whitewall.com/v1
   ```

3. **Fonctionnement**
   - L'utilisateur sélectionne photo + format + support
   - Le site envoie la commande à WhiteWall via API
   - WhiteWall imprime et expédie directement au client
   - Commission reversée à l'artiste

### Option 2 : Programme d'affiliation (Simple)

Si l'API n'est pas accessible immédiatement :

1. **S'inscrire au programme d'affiliation WhiteWall**
   - Pas besoin d'API
   - Liens affiliés vers WhiteWall
   - Commission sur les ventes

2. **Fonctionnement**
   - Bouton "Commander l'impression professionnelle"
   - Redirection vers WhiteWall avec paramètres pré-remplis
   - Client finalise la commande sur WhiteWall
   - Commission automatique

### Option 3 : Gestion manuelle (Temporaire)

En attendant l'intégration complète :

1. **Process manuel**
   - Client commande via Stripe
   - Email automatique envoyé à l'artiste
   - Artiste commande l'impression sur WhiteWall
   - Artiste expédie ou fait expédier directement

## 💰 Modèle économique

### Prix suggérés (à ajuster selon votre stratégie)

| Format | Papier Fine Art | Alu-Dibond | Acrylique |
|--------|----------------|------------|-----------|
| A4     | 150€           | 180€       | 220€      |
| A3     | 250€           | 300€       | 380€      |
| A2     | 400€           | 480€       | 600€      |

**Composition du prix :**
- Coût WhiteWall (impression + matériel + expédition)
- Marge artiste (30-50%)
- TVA

## 🚀 Étapes d'intégration

### Phase 1 : Configuration de base ✅
- [x] Créer compte WhiteWall professionnel
- [ ] Demander accès API
- [ ] Configurer credentials dans .env
- [ ] Tester commande test

### Phase 2 : Intégration API
- [ ] Créer service WhiteWall (`lib/whitewall-api.ts`)
- [ ] Implémenter création de commande
- [ ] Implémenter suivi de commande
- [ ] Gérer webhooks de statut

### Phase 3 : Interface utilisateur
- [ ] Ajouter options WhiteWall dans ShopGrid
- [ ] Prévisualisation des rendus (papier/alu/acrylique)
- [ ] Calcul prix en temps réel
- [ ] Page de confirmation avec aperçu

### Phase 4 : Gestion des commandes
- [ ] Dashboard admin pour suivre les impressions
- [ ] Notifications par email (client + artiste)
- [ ] Gestion des retours/SAV

## 📝 Code d'exemple

### Service API WhiteWall (lib/whitewall-api.ts)

```typescript
export interface WhiteWallOrder {
  imageUrl: string;
  format: 'A4' | 'A3' | 'A2';
  material: 'fine-art' | 'alu-dibond' | 'acrylic';
  frame?: 'black-wood' | 'white-wood' | 'aluminum';
  quantity: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export async function createWhiteWallOrder(order: WhiteWallOrder) {
  const response = await fetch(process.env.WHITEWALL_API_URL + '/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHITEWALL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      partnerId: process.env.WHITEWALL_PARTNER_ID,
      ...order,
    }),
  });

  if (!response.ok) {
    throw new Error('WhiteWall order creation failed');
  }

  return await response.json();
}
```

## 🔍 Alternatives à WhiteWall

Si WhiteWall n'est pas disponible, alternatives professionnelles :

1. **Picto** (France) - https://www.picto.fr
   - Laboratoire français premium
   - API disponible
   - Délais courts

2. **CEWE** (Europe) - https://www.cewe.fr
   - Leader européen
   - API robuste
   - Tarifs compétitifs

3. **Printful** (International) - https://www.printful.com
   - Dropshipping print-on-demand
   - API complète
   - Intégration facile

## ⚠️ Points d'attention

1. **Qualité des fichiers**
   - Résolution minimum 300 DPI
   - Profil colorimétrique Adobe RGB ou sRGB
   - Format JPEG ou TIFF

2. **Droits et licences**
   - Certificat d'authenticité pour chaque tirage
   - Numérotation des éditions limitées
   - Signature de l'artiste

3. **Délais**
   - Production : 3-5 jours ouvrés
   - Livraison : 2-7 jours selon destination
   - Informer le client des délais

4. **SAV**
   - Politique de retour claire
   - Assurance transport
   - Contact WhiteWall pour problèmes qualité

## 📞 Contact WhiteWall

- **Email professionnel** : partners@whitewall.com
- **Téléphone** : +49 2236 398 130
- **Support API** : api-support@whitewall.com

## ✅ Checklist de lancement

Avant d'activer WhiteWall en production :

- [ ] Compte partenaire WhiteWall actif
- [ ] API credentials configurées et testées
- [ ] Commande test effectuée et reçue
- [ ] Prix calculés avec marge correcte
- [ ] CGV mises à jour (délais, retours)
- [ ] Page "À propos" mise à jour (qualité d'impression)
- [ ] Email de confirmation personnalisé
- [ ] Suivi de commande fonctionnel

## 🎨 Recommandations artistiques

Pour Guillaume Farré :

1. **Papier Fine Art**
   - ✅ Idéal pour les photographies "Empreintes"
   - Rendu fidèle des couleurs et textures
   - Certifié conservation musée

2. **Alu-Dibond**
   - ✅ Parfait pour "Projection"
   - Effet moderne, contrastes prononcés
   - Très résistant

3. **Acrylique**
   - ✅ Exceptionnel pour séries limitées
   - Effet galerie premium
   - Positionnement haut de gamme

---

**Note** : L'intégration WhiteWall est prête côté code. Il ne reste qu'à obtenir les identifiants API et configurer le compte partenaire.
