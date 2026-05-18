"use client";

import { Download } from "lucide-react";

/**
 * Bouton de declenchement du download CSV des reservations filtrees.
 *
 * @author Lalou
 */
export function ReservationsExportButton({ exportUrl }: { exportUrl: string }) {
  return (
    <a
      href={exportUrl}
      className="ml-auto text-xs px-4 py-2 bg-[#C4A570] text-[#0A0A0A] hover:bg-[#d4b580] transition-colors rounded flex items-center gap-2 font-medium"
    >
      <Download className="h-3 w-3" />
      Export CSV
    </a>
  );
}

// Lalou
