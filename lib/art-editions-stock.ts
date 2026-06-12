import { promises as fs } from 'fs';
import path from 'path';

/**
 * Decremente le stock d'une edition d'art apres paiement (sold += quantity).
 * Source de verite : data/art-editions.json (cote serveur).
 * @author Lalou
 */
export async function updateArtEditionStock(id: string, quantity = 1): Promise<void> {
  const filePath = path.join(process.cwd(), 'data', 'art-editions.json');
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const editions = JSON.parse(raw) as Array<{
      id: string;
      edition: { total: number; sold: number };
    }>;
    const e = editions.find((x) => x.id === id);
    if (!e) {
      console.error(`[art-editions] id inconnu au decompte stock: ${id}`);
      return;
    }
    e.edition.sold = Math.min(e.edition.total, (e.edition.sold || 0) + quantity);
    await fs.writeFile(filePath, JSON.stringify(editions, null, 2) + '\n', 'utf-8');
    console.log(`[art-editions] ${id}: sold=${e.edition.sold}/${e.edition.total}`);
  } catch (error) {
    console.error(`[art-editions] echec maj stock ${id}`, error);
  }
}
