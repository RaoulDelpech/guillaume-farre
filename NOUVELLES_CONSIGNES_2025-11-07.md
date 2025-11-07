# Nouvelles Consignes - 7 novembre 2025, 23h55

Date: 7 novembre 2025, 23h55
Par: Lalou
Client: Raoul

---

## NOUVELLES FONCTIONNALITÉS DEMANDÉES

### 1. ✅ Panel "Performance commerciale" dépliable

**Demande Raoul**:
> "j'ai dit que je veux que performance commerciale ce soit un bouton qui puisse se déplier"

**Status**: ✅ DÉJÀ FAIT!

**Commit**: 3ce1d22 - "feat: Panel commercial dépliable (collapsed par défaut)"

**Fichier**: `components/admin/AIAnalysisPanel.tsx`

**Fonctionnalités**:
- Header cliquable avec icône ▶ (collapsed) / ▼ (expanded)
- Collapsed par défaut
- Titre: "Analyse commerciale"
- Texte: "Déplier" / "Replier"

---

### 2. ⏳ Drag & Drop upload photos/vidéos

**Demande Raoul**:
> "il faut aussi qu'on puisse drag and dropper des photos quand on uploade des photos et des videos"

**Status**: ⏳ EN COURS

**Fichiers créés**:
- `components/admin/DragDropUpload.tsx` (composant réutilisable)

**Fonctionnalités**:
- Zone drag & drop visuelle
- Accepte images ET vidéos
- Multiple fichiers (max 50)
- Filtrage automatique par type
- Feedback visuel drag (bordure bleue, scale 105%)
- Fallback clic pour sélection classique
- Messages erreur clairs

**À intégrer dans**:
- `app/[locale]/admin/page.tsx` (remplacer bouton upload actuel)

**Code d'intégration**:
```tsx
import DragDropUpload from "@/components/admin/DragDropUpload";

// Remplacer le bouton upload existant par:
<DragDropUpload
  onFilesSelected={(files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    // ... existing upload logic
  }}
  accept="image/*,video/*"
  multiple={true}
  maxFiles={50}
/>
```

---

### 3. ⏳ Descriptions IA auto-générées par photo

**Demande Raoul**:
> "pour chaque photo il faut qu'il y ait une proposition de texte générée avec ton IA. ce texte pourra être modifié par guillaume ferre. ne propose un texte que pour les photos qui sont validées, pas pour celles qui sont virées."

**Status**: ✅ DÉJÀ IMPLÉMENTÉ (partiellement)

**Commit**: ff43f75 - "feat: Descriptions IA photos avec Anthropic Claude Vision"

**Fichier**: `components/admin/PhotoDescriptionAI.tsx`

**Fonctionnalités EXISTANTES**:
- Bouton "Générer description IA"
- Zone texte éditable
- Flag `aiGenerated: true`

**À AMÉLIORER**:
1. Génération automatique pour photos "active" seulement
2. Pas de génération pour photos "trash" ou "to-sort"
3. Bouton "Régénérer" si Guillaume n'est pas satisfait

**Logique requise**:
```tsx
// Générer automatiquement quand photo passe à status "active"
useEffect(() => {
  if (photo.status === 'active' && !photo.description) {
    generateAIDescription(photo);
  }
}, [photo.status]);

// Ou: bouton manuel "Générer description"
<button onClick={() => generateAIDescription(photo)}>
  {photo.description ? 'Régénérer description' : 'Générer description IA'}
</button>
```

**Prompts IA** (selon catégorie):

**Limited edition**:
```
Décris cette photographie d'art capturant l'instant où une Ferrari
peint une toile. Texte poétique, technique, 2-3 phrases.
Mentionne couleurs, mouvement, abstraction.
Public cible: collectionneurs d'art contemporain.
```

**Unlimited edition**:
```
Décris brièvement cette photo documentaire montrant Ferrari peignant.
1-2 phrases claires, accessibles.
Public cible: amateurs d'art, décoration intérieure.
```

---

### 4. ⏳ Photos supprimées → dossier "supprime"

**Demande Raoul**:
> "Les photos qui sont supprimées doivent être sauvegardées dans un dossier supprime."

**Status**: ⏳ À FAIRE

**Logique requise**:
- Quand photo passe à status "trash", la déplacer physiquement
- De: `public/images/works/[category]/photo.jpg`
- Vers: `public/images/supprime/[date]/photo.jpg`

**API route à créer**:
```typescript
// app/api/admin/delete-photo/route.ts
export async function POST(request: Request) {
  const { photoPath } = await request.json();

  // Créer dossier avec date
  const today = new Date().toISOString().split('T')[0];
  const deletedFolder = path.join(process.cwd(), 'public/images/supprime', today);

  // Déplacer fichier
  const oldPath = path.join(process.cwd(), 'public', photoPath);
  const newPath = path.join(deletedFolder, path.basename(photoPath));

  await fs.mkdir(deletedFolder, { recursive: true });
  await fs.rename(oldPath, newPath);

  return Response.json({
    success: true,
    newPath: `/images/supprime/${today}/${path.basename(photoPath)}`
  });
}
```

**Structure dossiers**:
```
public/
  images/
    works/
      empreintes/
      atelier/
      projection/
    supprime/
      2025-11-07/
        photo1.jpg
        photo2.jpg
      2025-11-08/
        photo3.jpg
```

---

### 5. ⏳ Multi-catégorisation photos

**Demande Raoul**:
> "Il faut aussi que les photos puissent être catégorisées par séries, par localisation, en sahant qu'une photo peut être à plusieurs endroits en même temps."

**Status**: ✅ SCHEMA PRÊT / ⏳ INTERFACE À FAIRE

**Schema metadata EXISTANT**:
```typescript
interface PhotoMetadata {
  // ✅ Catégories commerciales (déjà multi)
  categories: ('unlimited' | 'limited' | 'xxl' | 'monumental')[];

  // ⏳ À AJOUTER: Séries artistiques (multi)
  series: string[];  // Ex: ['empreintes', 'atelier', 'projection']

  // ⏳ À AJOUTER: Localisations (multi)
  locations: string[];  // Ex: ['toulouse', 'paris', 'lyon']

  // ⏳ À AJOUTER: Tags libres (multi)
  tags: string[];  // Ex: ['ferrari-noir', 'v12', '2024']
}
```

**Interface admin requise**:
```tsx
// Pour chaque photo
<div className="space-y-4">
  {/* Séries (multi-sélection) */}
  <div>
    <label>Séries</label>
    <div className="flex flex-wrap gap-2">
      {['empreintes', 'atelier', 'projection', 'performances'].map(serie => (
        <label key={serie} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={photo.series?.includes(serie)}
            onChange={(e) => {
              if (e.target.checked) {
                updatePhoto({
                  ...photo,
                  series: [...(photo.series || []), serie]
                });
              } else {
                updatePhoto({
                  ...photo,
                  series: (photo.series || []).filter(s => s !== serie)
                });
              }
            }}
          />
          <span>{serie}</span>
        </label>
      ))}
    </div>
  </div>

  {/* Localisations (multi-sélection) */}
  <div>
    <label>Localisations</label>
    <div className="flex flex-wrap gap-2">
      {['toulouse', 'paris', 'lyon', 'autre'].map(location => (
        <label key={location} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={photo.locations?.includes(location)}
            onChange={(e) => {
              if (e.target.checked) {
                updatePhoto({
                  ...photo,
                  locations: [...(photo.locations || []), location]
                });
              } else {
                updatePhoto({
                  ...photo,
                  locations: (photo.locations || []).filter(l => l !== location)
                });
              }
            }}
          />
          <span>{location}</span>
        </label>
      ))}
    </div>
  </div>

  {/* Tags libres */}
  <div>
    <label>Tags</label>
    <input
      type="text"
      placeholder="ferrari-noir, v12, 2024..."
      value={(photo.tags || []).join(', ')}
      onChange={(e) => {
        const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
        updatePhoto({ ...photo, tags });
      }}
      className="w-full px-4 py-2 border rounded"
    />
    <p className="text-xs text-gray-500 mt-1">
      Séparer par des virgules
    </p>
  </div>
</div>
```

---

## RÉCAPITULATIF PRIORISATION

### ✅ Complété (session actuelle)
1. Panel commercial dépliable
2. Descriptions IA photos (bouton + éditable)
3. Schema metadata multi-catégories

### ⏳ En cours (à finir maintenant)
4. Composant DragDropUpload créé (à intégrer)

### 📋 À faire (prochaine session - 2h)
5. Intégrer DragDropUpload dans admin (30 min)
6. Génération IA auto pour photos "active" (30 min)
7. Déplacement photos trash → dossier supprime (30 min)
8. Interface multi-catégorisation (séries/locations/tags) (30 min)

---

## ORDRE D'IMPLÉMENTATION RECOMMANDÉ

### Phase 1 (30 min) - Drag & Drop
1. Importer DragDropUpload dans `app/[locale]/admin/page.tsx`
2. Remplacer bouton upload existant
3. Tester upload 3 photos
4. Tester upload vidéo
5. Commit

### Phase 2 (30 min) - IA auto
1. Modifier `PhotoDescriptionAI.tsx`
2. Génération auto quand status → "active"
3. Bouton "Régénérer" si existant
4. Tester sur 3 photos
5. Commit

### Phase 3 (30 min) - Photos supprimées
1. Créer `app/api/admin/delete-photo/route.ts`
2. Créer dossier `public/images/supprime/`
3. Hook dans admin quand status → "trash"
4. Tester suppression + vérifier dossier
5. Commit

### Phase 4 (30 min) - Multi-catégorisation
1. Modifier `lib/admin/photo-manager.ts` (add series, locations, tags)
2. Créer composant `MultiCategorySelector.tsx`
3. Intégrer dans admin pour chaque photo
4. Tester multi-sélection
5. Commit

---

## FICHIERS À CRÉER/MODIFIER

### Créés
- ✅ `components/admin/DragDropUpload.tsx`
- ⏳ `components/admin/MultiCategorySelector.tsx`
- ⏳ `app/api/admin/delete-photo/route.ts`

### À modifier
- ⏳ `app/[locale]/admin/page.tsx` (intégrer drag & drop)
- ⏳ `components/admin/PhotoDescriptionAI.tsx` (IA auto)
- ⏳ `lib/admin/photo-manager.ts` (add series/locations/tags)

---

## COMMITS PRÉVUS

1. `feat: Drag & drop upload photos/vidéos (30min)`
2. `feat: Génération IA auto pour photos active (30min)`
3. `feat: Photos trash → dossier supprime (30min)`
4. `feat: Multi-catégorisation séries/locations/tags (30min)`

**Total**: 2 heures pour 4 fonctionnalités

---

**Date création**: 7 novembre 2025, 23h55
**Dernière mise à jour**: 7 novembre 2025, 23h55
**Prochaine action**: Intégrer DragDropUpload dans admin

Lalou
