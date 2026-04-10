import type { Suggestion, PhotoItem } from "./types";

export function buildSuggestions(photos: PhotoItem[]): Suggestion[] {
  const suggestions: Suggestion[] = [];

  const photosWithoutDescription = photos.filter((p) => !p.description);
  if (photosWithoutDescription.length > 0) {
    suggestions.push({
      id: "desc-1",
      type: "description",
      priority: "high",
      title: `${photosWithoutDescription.length} photos sans description`,
      description: "Les descriptions augmentent les ventes de 40%. Je peux les générer automatiquement.",
      action: "generate-descriptions",
      icon: "✍️",
      autoApply: true
    });
  }

  const avgPrice = photos.reduce((sum: number, p) => sum + (p.price || 0), 0) / photos.length;
  if (avgPrice < 300) {
    suggestions.push({
      id: "price-1",
      type: "pricing",
      priority: "medium",
      title: "Prix moyens bas détectés",
      description: `Prix moyen: ${avgPrice.toFixed(0)}€. Les œuvres similaires se vendent entre 400-600€.`,
      action: "adjust-prices",
      icon: "💶",
      autoApply: false
    });
  }

  const uncategorized = photos.filter((p) => !p.categories || p.categories.length === 0);
  if (uncategorized.length > 0) {
    suggestions.push({
      id: "cat-1",
      type: "category",
      priority: "medium",
      title: `${uncategorized.length} photos non catégorisées`,
      description: "Je peux analyser et suggérer des catégories automatiquement.",
      action: "auto-categorize",
      icon: "🏷️",
      autoApply: true
    });
  }

  suggestions.push({
    id: "trend-1",
    type: "trend",
    priority: "low",
    title: "Tendance: Art automobile en hausse",
    description: "Les œuvres Ferrari se vendent +23% ce mois. Moment idéal pour publier.",
    icon: "📈",
    autoApply: false
  });

  const photosWithoutAlt = photos.filter((p) => !p.alt);
  if (photosWithoutAlt.length > 0) {
    suggestions.push({
      id: "seo-1",
      type: "seo",
      priority: "low",
      title: "Optimisation SEO disponible",
      description: `${photosWithoutAlt.length} photos sans texte alternatif. Important pour le référencement.`,
      action: "generate-alt",
      icon: "🔍",
      autoApply: true
    });
  }

  return suggestions;
}

export const assistantMessages = [
  "Je remarque que certaines photos n'ont pas de description...",
  "Les prix de vos éditions limitées sont très compétitifs!",
  "Voulez-vous que je génère des tags Instagram?",
  "J'ai détecté 3 photos similaires, voulez-vous créer une série?",
  "Conseil: Les photos avec descriptions détaillées se vendent 40% mieux",
];

// Lalou
