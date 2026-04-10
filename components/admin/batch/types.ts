export interface BatchOperation {
  id: string;
  label: string;
  icon: string;
  description: string;
  category: "edit" | "organize" | "publish" | "export";
  requiresConfirmation?: boolean;
  dangerLevel?: "low" | "medium" | "high";
}

export interface BatchOperationsProps {
  selectedItems: string[];
  onOperation: (operationId: string, items: string[]) => Promise<void>;
  totalItems: number;
}

// Lalou
