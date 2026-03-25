"use client";

import { useEffect } from "react";
import { trackViewItem } from "@/lib/analytics";

/**
 * Client component pour tracking GA4 sur les pages produit
 * Lalou
 */
interface GalerieItemClientProps {
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemCategory: string;
}

export default function GalerieItemClient({
  itemId,
  itemName,
  itemPrice,
  itemCategory,
}: GalerieItemClientProps) {
  useEffect(() => {
    // GA4 tracking - View item on page load
    trackViewItem({
      id: itemId,
      name: itemName,
      price: itemPrice,
      category: itemCategory,
    });
  }, [itemId, itemName, itemPrice, itemCategory]);

  return null; // Pas de rendu visuel, juste tracking
}
