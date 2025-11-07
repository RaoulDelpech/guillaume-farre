# Règles Spécifiques Projet Guillaume Farré

Date création: 7 novembre 2025
Maintenu par: Lalou
**À lire au démarrage de CHAQUE session Claude Code**

---

## RÈGLES ABSOLUES

### 1. Validation point par point ⚠️ CRITIQUE

**JAMAIS faire de changements en bloc sans validation**

**TOUJOURS** :
- ✅ Poser UNE question à la fois
- ✅ Attendre la réponse avant de continuer
- ✅ Donner une recommandation claire avec chaque question
- ✅ Format: "Ma recommandation: [avis Lalou] parce que [raison]"

**JAMAIS** :
- ❌ Poser 5+ questions d'un coup
- ❌ Faire des modifications sans validation
- ❌ Présenter en bloc
- ❌ Supposer une réponse

**Exemple bon** :
```
Question 1: La Ferrari était-elle rose ?
Ma recommandation: Si ce n'est pas vrai, dis-moi la vraie couleur.
L'authenticité prime sur le storytelling.
```

**Exemple mauvais** :
```
Questions 1-5: [liste de 5 questions]
Réponds à tout ça SVP
```

---

### 2. Sauvegardes régulières ⚠️ CRITIQUE

**TOUJOURS sauvegarder tous les 10-15 minutes ou après chaque validation importante**

**Fichiers à maintenir à jour** :
- `SESSION_[DATE]_VALIDATION_EN_COURS.md` : État actuel de la session
- `.claude/REGLES_PROJET.md` : Ce fichier (règles projet)
- Commit Git toutes les heures ou après bloc de travail terminé

**Quand sauvegarder** :
- ✅ Après chaque question validée
- ✅ Après chaque décision importante
- ✅ Avant de poser une nouvelle question
- ✅ À la fin de chaque bloc de travail

---

### 3. Authenticité à 100% ⚠️ CRITIQUE

**ZÉRO MENSONGE sauf autorisation explicite Guillaume**

**Ce qui est validé comme VRAI** :
- ✅ Enfant 4 ans, Ferrari rose n°20
- ✅ 4 Ferrari (couleurs diverses, au moins 2 grises)
- ✅ Moteur V12
- ✅ Basé à Toulouse

**Ce qui est FAUX à retirer** :
- ❌ "Quatre Ferrari grises" → "Quatre Ferrari"
- ❌ "Du gris. Volontairement." → Retirer
- ❌ Slide "Ferrari Live Performance 45 minutes" → Retirer (n'existe pas encore)

**Mensonges autorisés (légers)** :
- ⚠️ Éditions limitées : Dire "1-2 vendues" alors que 0 (en attente validation combien)

---

### 4. Séparation projets Guillaume Farré vs Juris-Power

**Guillaume Farré** :
- IA : Anthropic Claude (Vision photos)
- Usage : Suggestions séries photos
- Copywriting : Storytelling authentique artiste
- Pas de design system Juris-Power

**Juris-Power** :
- IA : Mistral AI (Texte juridique)
- Usage : Simulateurs juridiques
- Design system strict à suivre

**JAMAIS mélanger les deux projets**

---

## WORKFLOW SESSION

### Au démarrage de chaque session

1. **Lire ces fichiers dans l'ordre** :
   - `.claude/REGLES_PROJET.md` (ce fichier)
   - `SESSION_[DATE]_VALIDATION_EN_COURS.md` (dernière session)
   - `CLAUDE.md` (contexte projet)

2. **Résumer en 3-4 lignes** :
   - Où on en était
   - Ce qui a été validé
   - Prochaine action

3. **Demander confirmation** avant de continuer

### Pendant la session

1. **Sauvegarder toutes les 10-15 min** :
   - Mettre à jour `SESSION_[DATE]_VALIDATION_EN_COURS.md`
   - Noter décisions validées
   - Noter questions en attente

2. **Validation point par point** :
   - UNE question à la fois
   - Attendre réponse
   - Passer à la suivante

3. **Commit régulier** (toutes les heures) :
   - Avec message détaillé
   - Inclure ce qui a été validé

### Fin de session

1. **Mettre à jour** :
   - `SESSION_[DATE]_VALIDATION_EN_COURS.md` (état final)
   - `.claude/REGLES_PROJET.md` si nouvelles règles
   - `CLAUDE.md` si nouvelles infos projet

2. **Commit final** avec résumé complet

3. **Dire à Guillaume** :
   - Ce qui a été fait
   - Ce qui reste à faire
   - Prochaine session recommandée

---

## DÉCISIONS VALIDÉES (màj au fur et à mesure)

### Session 2025-11-07

**Copywriting** :
- ✅ Q1: Ferrari rose n°20, 4 ans → VRAI, garder
- ✅ Q2: 4 Ferrari, couleurs variées → Corriger "grises" en général
- ✅ Q3: Performances live → N'EXISTENT PAS, retirer slide
- ⏳ Q4: Éditions limitées mensonge → EN ATTENTE (1, 2 ou 0 vendue?)
- ✅ Q5: Basé Toulouse → VRAI
- ⏳ Q6: Labo Picto Toulouse → À contacter (05 61 53 42 48)

**Analyses** :
- ✅ Sites concurrents analysés (ArtPhotoLimited, Peter Lik)
- ✅ Document `INSPIRATION_SITES_CONCURRENTS.md` créé

**À faire** :
- ⏳ Finir validation textes (Questions 7-8)
- ⏳ Corriger fichiers messages/*.json selon validations
- ⏳ Contacter Picto Toulouse
- ⏳ Implémenter améliorations inspirées sites concurrents

---

## PRIORITÉS PROJET

### 🔴 Critique (cette semaine)

1. **Finir validation textes** (en cours)
2. **Corriger textes selon validations** (après validation complète)
3. **Contacter Picto Toulouse** (05 61 53 42 48)
4. **Obtenir clé API Anthropic** (5 min, $50 gratuits)

### 🟠 Haute (mois prochain)

5. **Harmoniser design** (2-3 jours, design system strict)
6. **Trust signals** (témoignages, photos installations)
7. **Éditions limitées visibles** (compteurs "X/7 restants")
8. **Options finitions** (Papier/Alu/Acrylique avec prévisualisations)

### 🟡 Moyenne (3-6 mois)

9. **Merchandising** (livre d'art, calendrier)
10. **IA commerciale réelle** (remplacer simulacre)
11. **Détection doublons visuels** (pHash)

---

## CONTACTS UTILES

**Picto Toulouse** (laboratoire impression) :
- Tél : 05 61 53 42 48
- Adresse : 12 Rue du Poids de l'Huile, 31000 Toulouse

**Anthropic** (API IA) :
- Console : https://console.anthropic.com/
- $50 crédit gratuit
- Coût : ~$0.01/analyse

**Stripe** (déjà configuré) :
- Clés LIVE actives
- Webhook à configurer

---

## FICHIERS IMPORTANTS

**Documentation projet** :
- `CLAUDE.md` : Contexte projet complet
- `.claude/REGLES_PROJET.md` : Ce fichier (règles)
- `SESSION_[DATE]_VALIDATION_EN_COURS.md` : État session

**Audits** :
- `AUDIT_COMPLET_2025-11-07.md` : Audit design/technique (7000 mots)
- `AMELIORATIONS_IA_TEXTES_2025-11-07.md` : Audit IA (8000 mots)
- `INSPIRATION_SITES_CONCURRENTS.md` : Analyse sites inspirants

**Configuration** :
- `.env.raoul` : Variables environnement (SENSIBLE, pas commit)
- `ANTHROPIC_SETUP.md` : Guide config API (5 min)

**Traductions** :
- `messages/fr.json` : Textes français
- `messages/en.json` : Textes anglais
- `messages/it.json` : Textes italien

---

## RAPPELS TECHNIQUES

**Anthropic API** :
- Utilisé UNIQUEMENT pour Guillaume Farré
- Suggestions séries photos automatiques
- $50 gratuits = 5000 analyses = 500 mois

**Stripe** :
- Mode LIVE (clés production)
- Webhook non configuré (à faire)
- Tests à faire avec carte 4242 4242 4242 4242

**WhiteWall/Picto** :
- API non configurée
- Process manuel temporaire possible
- Picto Toulouse à contacter

---

## NOTES IMPORTANTES

1. **Guillaume veut validation point par point** - Respecter à 100%
2. **Authenticité > Marketing** - Zéro mensonge sauf autorisé
3. **Sauvegardes régulières** - Commit toutes les heures
4. **Séparation projets** - Guillaume Farré ≠ Juris-Power
5. **Recommandations claires** - Toujours donner avis motivé

---

**Dernière mise à jour** : 7 novembre 2025, 23h
**Prochaine màj** : Après fin validation textes

Lalou
