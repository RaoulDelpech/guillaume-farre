import { promises as fs } from 'fs';
import path from 'path';

/**
 * Gestion du stock des editions d'art (data/art-editions.json, source de verite serveur).
 *
 * Decrement serialise par un mutex en memoire (meme pattern que lib/orders.ts) pour
 * eviter la corruption du fichier sous ecritures concurrentes (checkout + webhook).
 * Detecte les surventes (deux paiements pour le dernier exemplaire) et alerte sans
 * depasser le total. Retourne un booleen plutot que de throw : le webhook ne doit
 * pas echouer et declencher un retry Stripe (qui serait deja couvert par l'idempotence
 * cote order-handler), mais une erreur de stock doit rester visible/loggee.
 *
 * @author Lalou
 */

const FILE = path.join(process.cwd(), 'data', 'art-editions.json');

// Mutex : serialise les ecritures concurrentes du fichier dans ce processus.
let writeLock: Promise<unknown> = Promise.resolve();

interface ArtEditionEntry {
  id: string;
  name?: string;
  edition: { total: number; sold: number };
}

export async function updateArtEditionStock(id: string, quantity = 1): Promise<boolean> {
  const run = writeLock.then(async (): Promise<boolean> => {
    let editions: ArtEditionEntry[];
    try {
      editions = JSON.parse(await fs.readFile(FILE, 'utf-8'));
    } catch (error) {
      console.error(`[art-editions] echec lecture fichier (stock ${id})`, error);
      return false;
    }

    const e = editions.find((x) => x.id === id);
    if (!e) {
      console.error(`[art-editions] id inconnu au decompte stock: ${id}`);
      return false;
    }

    const current = e.edition.sold || 0;
    if (current >= e.edition.total) {
      // Deux paiements pour le meme dernier exemplaire : stock deja epuise.
      console.error(
        `[art-editions] SURVENTE DETECTEE ${id} (${e.name || ''}): sold=${current}/${e.edition.total} — remboursement requis.`,
      );
      return false;
    }

    e.edition.sold = Math.min(e.edition.total, current + quantity);
    try {
      await fs.writeFile(FILE, JSON.stringify(editions, null, 2) + '\n', 'utf-8');
    } catch (error) {
      console.error(`[art-editions] echec ecriture stock ${id}`, error);
      return false;
    }
    console.log(`[art-editions] ${id}: sold=${e.edition.sold}/${e.edition.total}`);
    return true;
  });

  // Maintenir la chaine du mutex meme si l'operation echoue.
  writeLock = run.catch(() => undefined);
  return run;
}
