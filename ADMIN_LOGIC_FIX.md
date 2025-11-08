# Corrections de logique interface admin

## Problèmes identifiés par l'utilisateur

1. **Incohérence Corbeille + Visible** : Une photo dans la corbeille ne devrait PAS pouvoir être marquée visible
2. **Confusion terme "Active"** : Le terme n'est pas clair pour l'utilisateur
3. **Options inutiles** : Les options de tirage (limité/illimité) ne devraient pas apparaître pour les photos non visibles

## Nouvelle logique simplifiée

### Statuts principaux (mutuellement exclusifs)
```
1. PUBLIÉ - Photo visible sur le site (galerie + boutique)
2. BROUILLON - Photo uploadée mais pas encore prête
3. CORBEILLE - Photo supprimée (peut être restaurée)
```

### Règles de cohérence

#### Si statut = CORBEILLE
- ❌ Impossible de marquer visible
- ❌ Impossible de marquer en vente
- ❌ Options de tirage masquées
- ❌ Prix masqués
- ❌ Catégories masquées
- ✅ Seulement : Restaurer ou Supprimer définitivement

#### Si statut = BROUILLON
- ⚠️ Peut préparer les métadonnées (prix, catégories)
- ❌ PAS visible sur le site
- ❌ PAS en vente
- ✅ Peut éditer toutes les infos
- ✅ Action : "Publier" pour passer en PUBLIÉ

#### Si statut = PUBLIÉ
- ✅ Visible sur le site (galerie)
- ✅ Peut être en vente (si prix définis)
- ✅ Toutes les options disponibles
- ✅ Action : "Dépublier" pour passer en BROUILLON

### Interface simplifiée

```tsx
// Pour chaque photo
<div className="photo-card">
  {/* Badge de statut principal */}
  <select value={photo.status}>
    <option value="published">📢 Publié</option>
    <option value="draft">📝 Brouillon</option>
    <option value="trash">🗑️ Corbeille</option>
  </select>

  {/* Options conditionnelles */}
  {photo.status === 'published' && (
    <>
      <checkbox> En vente dans la boutique</checkbox>
      <select> Catégories (limité, illimité, xxl...)</select>
      <input> Prix </input>
    </>
  )}

  {photo.status === 'draft' && (
    <>
      <p>⚠️ Photo non visible sur le site</p>
      <button>Publier maintenant</button>
      {/* Peut quand même préparer les métadonnées */}
      <select> Catégories (limité, illimité, xxl...)</select>
      <input> Prix </input>
    </>
  )}

  {photo.status === 'trash' && (
    <>
      <p>🗑️ Photo dans la corbeille</p>
      <button>Restaurer</button>
      <button className="danger">Supprimer définitivement</button>
    </>
  )}
</div>
```

## Migration des données existantes

```javascript
// Ancien système → Nouveau système
if (photo.status === 'trash') {
  newStatus = 'trash';
  visible = false;
  forSale = false;
} else if (photo.visible) {
  newStatus = 'published';
} else {
  newStatus = 'draft';
}
```

## Avantages de cette approche

1. **Plus clair** : 3 statuts simples au lieu de multiples toggles confus
2. **Cohérent** : Impossible d'avoir des états contradictoires
3. **Intuitif** : Les termes correspondent aux attentes (Publié/Brouillon/Corbeille)
4. **Workflow naturel** : Upload → Brouillon → Publié → (Corbeille)

## À faire

1. [ ] Remplacer "status: active/to-sort/trash" par "status: published/draft/trash"
2. [ ] Supprimer les toggles "visible" redondants
3. [ ] Conditionner l'affichage des options selon le statut
4. [ ] Ajouter validation côté serveur pour empêcher les incohérences
5. [ ] Migration automatique des données existantes

// Lalou