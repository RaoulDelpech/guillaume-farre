import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * GET /api/art-editions
 * Retourne les disponibilites par edition d'art : { [id]: nbRestant }.
 * Lit le fichier a chaque requete pour refleter les ventes (maj par le webhook Stripe).
 * @author Lalou
 */
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'art-editions.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const editions = JSON.parse(raw) as Array<{
      id: string;
      edition: { total: number; sold: number };
    }>;

    const stock: Record<string, number> = {};
    for (const e of editions) {
      stock[e.id] = Math.max(0, e.edition.total - (e.edition.sold || 0));
    }
    return NextResponse.json(stock);
  } catch (error) {
    console.error('[art-editions] read error', error);
    return NextResponse.json({}, { status: 200 });
  }
}
