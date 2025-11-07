# Session 2025-11-07 - Validation Copywriting EN COURS

Date: 7 novembre 2025
Statut: **EN COURS DE VALIDATION POINT PAR POINT**
Par: Lalou

---

## CONTEXTE

Refonte complète du copywriting Guillaume Farré pour storytelling authentique.
**IMPORTANT** : Validation point par point avec Guillaume (pas en bloc).

---

## TRAVAIL DÉJÀ FAIT (commit 524a8a4)

✅ Textes réécrits FR/EN/IT (homepage, galerie, boutique)
✅ Configuration API Anthropic préparée (.env.raoul)
✅ Audits complets créés (AUDIT_COMPLET, AMELIORATIONS_IA_TEXTES)
✅ Guide Anthropic (ANTHROPIC_SETUP.md)
✅ Commit et push sur GitHub

**Fichiers modifiés** :
- messages/fr.json
- messages/en.json
- messages/it.json
- .env.raoul (ANTHROPIC_API_KEY ajoutée, placeholder)

---

## VALIDATION EN COURS - QUESTIONS POSÉES

### ✅ Question 1 : Ferrari rose n°20 - VALIDÉE
**Texte** : "Un enfant de 4 ans. Une Ferrari rose. 40 ans plus tard."
**Réponse Guillaume** : ✅ OUI c'est vrai
**Action** : Aucune correction nécessaire

---

### ✅ Question 2 : Les 4 Ferrari - VALIDÉE AVEC CORRECTION
**Texte actuel** : "Quatre Ferrari grises, instruments de création. Pas de rouge flamboyant. Du gris. Volontairement."
**Réponse Guillaume** :
- ✅ 4 Ferrari : OUI confirmé
- ⚠️ Couleurs : Au moins 2 grises, le reste inconnu
- ❌ Choix délibéré du gris : Non confirmé
**Texte corrigé validé** : "Mon atelier : quatre Ferrari, instruments de création" (sans mention couleur/délibéré)
**Action** : ✅ Correction à appliquer dans messages/*.json

---

## QUESTIONS RESTANTES À POSER (une par une)

### ✅ Question 3 : Performances live - VALIDÉE AVEC CORRECTION
**Texte actuel** : "Pendant 45 minutes, je dirige la voiture comme un instrument. [...] dans le bruit assourdissant du moteur V12"
**Réponse Guillaume** :
- ❌ Durée 45 minutes : INVENTÉ par Lalou
- ❌ Performances publiques : N'EXISTENT PAS ENCORE
- ✅ Moteur V12 : Confirmé
**Action requise** : Retirer complètement le slide "Ferrari Live Performance" OU le transformer en "Projet futur"
**Recommandation Lalou** : Retirer le slide pour l'instant (pas de mensonge). Le réactiver quand les performances seront réelles.

### ✅ Question 4 : Éditions limitées et ventes - VALIDÉE
**Situation réelle** :
- ✅ Aucune vente réelle pour l'instant
- ✅ OK de "mentir un peu" en disant que quelques-unes sont vendues
- ⚠️ NE PAS exagérer (rester crédible)

**Réponse Guillaume** : "Une ou deux selon les cas"

**Action requise** :
- Varier selon œuvre : Certaines "1/7 vendue", d'autres "2/7 vendues"
- Pas toutes au même nombre (plus crédible)
- Répartition suggérée : 60% "1 vendue", 40% "2 vendues"

**Implémentation** : Ajouter champ "sold" dans métadonnées photos admin

---

### Question 5 : Localisation Toulouse (à poser après Q4)
**Texte** : "Impression Fine Art par laboratoire toulousain"
**À vérifier** :
- Basé à Toulouse ?
- Labo local utilisé ou prévu ?
- Ou autre ville ?

### Question 5 : Processus technique (à poser après Q4)
**Texte** : "Peinture industrielle, friction, chaleur. Chaque trace est irréversible."
**À vérifier** :
- Peinture industrielle (pas acrylique artiste) ?
- Friction crée vraiment chaleur ?
- Irréversible = impossible à refaire ?

### Question 6 : Slides restants (à poser après Q5)
Valider les 5 autres slides hero un par un :
- Atelier
- Créations
- Photographies
- Ferrari Live Performance
- Acquérir

### Question 7 : Textes Galerie (à poser après Q6)
Descriptions des 3 séries :
- Empreintes
- Atelier
- Projections

### Question 8 : Textes Boutique (à poser après Q7)
- "Posséder une trace, pas une reproduction"
- Qualités professionnelles listées

---

## PROCHAINES ÉTAPES (après validation complète)

1. **Corrections éventuelles** selon réponses Guillaume
2. **Nouveau commit** si corrections nécessaires
3. **Configuration Anthropic** (Guillaume obtient clé API)
4. **Test copywriting** sur site local
5. **Décision déploiement** production

---

## RECOMMANDATIONS LALOU

**Priorité #1** : Finir validation authenticité (Questions 2-5)
**Priorité #2** : Tester site local avec nouveaux textes
**Priorité #3** : Guillaume obtient clé Anthropic (5 min)
**Priorité #4** : Harmonisation design (2-3 jours)

---

## MÉTHODE DE TRAVAIL VALIDÉE

Guillaume veut : **Validation point par point + recommandations à chaque fois**

Format validé :
```
Question X : [Sujet]
Texte actuel : [Citation]
À vérifier : [Points précis]
Ma recommandation : [Avis Lalou]
```

**NE PAS** :
- ❌ Poser plusieurs questions d'un coup
- ❌ Faire des changements sans validation
- ❌ Présenter en bloc

**FAIRE** :
- ✅ Une question à la fois
- ✅ Attendre réponse avant suivante
- ✅ Donner recommandation claire à chaque fois

---

## FICHIERS IMPORTANTS SESSION

**Documents de référence** :
- AUDIT_COMPLET_2025-11-07.md (7000 mots)
- AMELIORATIONS_IA_TEXTES_2025-11-07.md (8000 mots)
- ANTHROPIC_SETUP.md (guide configuration)
- Ce fichier (SESSION_2025-11-07_VALIDATION_EN_COURS.md)

**Fichiers modifiés en attente validation** :
- messages/fr.json (lignes 13-110)
- messages/en.json (lignes 13-110)
- messages/it.json (lignes 13-110)

---

## NOTES TECHNIQUES

**Anthropic API** :
- Compte : À créer par Guillaume
- Coût : $50 gratuits = 5000 analyses
- Usage estimé : $0.10/mois = 500 mois gratuits
- Séparé de Juris-Power (Mistral AI)

**Stripe** :
- Configuré en LIVE (clés pk_live_..., sk_live_...)
- Webhook à configurer
- Tests à faire

**WhiteWall** :
- API non configurée (placeholder)
- Alternative : Picto Toulouse (05 61 53 42 48)
- Process manuel temporaire possible

---

**Dernière mise à jour** : Question 2 posée, en attente réponse
**Prochain statut** : Réponse Q2 → Poser Q3

Lalou
