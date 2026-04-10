export interface Suggestion {
  id: string;
  type: "pricing" | "description" | "category" | "seo" | "trend";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  action?: string;
  icon: string;
  autoApply?: boolean;
}

export interface PhotoItem {
  description?: string;
  price?: number;
  categories?: string[];
  alt?: string;
}

export interface PhotoAnalysis {
  quality: number;
  composition: string;
  lighting: string;
  marketValue: string;
  suggestedCategories: string[];
  suggestedTags: string[];
  similarPhotos: number;
  salesPotential: string;
}

export interface AIAssistantProps {
  photos?: PhotoItem[];
  onApplySuggestion?: (suggestion: Suggestion) => void;
}

// Lalou
