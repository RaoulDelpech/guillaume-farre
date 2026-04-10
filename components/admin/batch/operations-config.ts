import type { BatchOperation } from "./types";

export const batchOperations: BatchOperation[] = [
  // Edit Operations
  {
    id: "resize",
    label: "Redimensionner",
    icon: "📐",
    description: "Ajuster la taille de toutes les images sélectionnées",
    category: "edit",
    dangerLevel: "low"
  },
  {
    id: "watermark",
    label: "Filigrane",
    icon: "💧",
    description: "Ajouter votre signature sur les photos",
    category: "edit",
    dangerLevel: "low"
  },
  {
    id: "compress",
    label: "Compresser",
    icon: "📦",
    description: "Optimiser le poids des images pour le web",
    category: "edit",
    dangerLevel: "low"
  },
  {
    id: "convert",
    label: "Convertir format",
    icon: "🔄",
    description: "Changer le format (JPG, PNG, WebP)",
    category: "edit",
    dangerLevel: "medium"
  },

  // Organize Operations
  {
    id: "categorize",
    label: "Catégoriser",
    icon: "🏷️",
    description: "Assigner des catégories en masse",
    category: "organize",
    dangerLevel: "low"
  },
  {
    id: "add-tags",
    label: "Ajouter tags",
    icon: "🔖",
    description: "Ajouter des mots-clés pour le référencement",
    category: "organize",
    dangerLevel: "low"
  },
  {
    id: "move-series",
    label: "Déplacer série",
    icon: "📂",
    description: "Déplacer vers une autre série",
    category: "organize",
    dangerLevel: "medium"
  },
  {
    id: "set-price",
    label: "Définir prix",
    icon: "💶",
    description: "Appliquer un prix uniforme",
    category: "organize",
    dangerLevel: "medium"
  },

  // Publish Operations
  {
    id: "publish",
    label: "Publier",
    icon: "🚀",
    description: "Rendre visible sur le site",
    category: "publish",
    dangerLevel: "medium",
    requiresConfirmation: true
  },
  {
    id: "unpublish",
    label: "Dépublier",
    icon: "👁️‍🗨️",
    description: "Masquer temporairement du site",
    category: "publish",
    dangerLevel: "medium",
    requiresConfirmation: true
  },
  {
    id: "schedule",
    label: "Planifier",
    icon: "📅",
    description: "Programmer la publication",
    category: "publish",
    dangerLevel: "low"
  },
  {
    id: "feature",
    label: "Mettre en avant",
    icon: "⭐",
    description: "Marquer comme œuvre phare",
    category: "publish",
    dangerLevel: "low"
  },

  // Export Operations
  {
    id: "export-zip",
    label: "Export ZIP",
    icon: "📦",
    description: "Télécharger en archive compressée",
    category: "export",
    dangerLevel: "low"
  },
  {
    id: "generate-pdf",
    label: "Créer PDF",
    icon: "📄",
    description: "Générer un portfolio PDF",
    category: "export",
    dangerLevel: "low"
  },
  {
    id: "export-metadata",
    label: "Export données",
    icon: "📊",
    description: "Exporter les métadonnées CSV",
    category: "export",
    dangerLevel: "low"
  },
  {
    id: "delete",
    label: "Supprimer",
    icon: "🗑️",
    description: "Mettre à la corbeille",
    category: "export",
    dangerLevel: "high",
    requiresConfirmation: true
  }
];

export function groupOperationsByCategory(operations: BatchOperation[]) {
  return operations.reduce((acc, op) => {
    if (!acc[op.category]) acc[op.category] = [];
    acc[op.category].push(op);
    return acc;
  }, {} as Record<string, BatchOperation[]>);
}

export function getCategoryLabel(category: string) {
  switch (category) {
    case "edit": return "Édition";
    case "organize": return "Organisation";
    case "publish": return "Publication";
    default: return "Export";
  }
}

export function getDangerColor(level?: string) {
  switch (level) {
    case "high": return "text-red-600 hover:bg-red-50";
    case "medium": return "text-orange-600 hover:bg-orange-50";
    default: return "text-gray-700 hover:bg-gray-50";
  }
}

// Lalou
