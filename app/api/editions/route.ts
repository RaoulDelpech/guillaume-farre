import { NextResponse } from 'next/server';
import { loadEditions } from '@/lib/editions';

/**
 * GET /api/editions
 * Retourne toutes les editions (nombre de tirages vendus/disponibles par photo et format).
 * Donnees publiques — pas d'auth requise.
 */
export async function GET() {
  const editions = loadEditions();

  // Transformer en format leger pour le client : { photo_X: { format: available } }
  const result: Record<string, Record<string, number>> = {};
  for (const [photoKey, formats] of Object.entries(editions)) {
    result[photoKey] = {};
    for (const [format, slot] of Object.entries(formats as Record<string, any>)) {
      result[photoKey][format] = slot.total - slot.sold;
    }
  }

  return NextResponse.json(result);
}
