/**
 * Migration toiles.json — ajout des champs de statut Sprint 2.
 *
 * Pour chaque entree :
 *   - status        : enum (defaut "available")
 *   - reservationId : string UUID | null (defaut null)
 *   - reservedUntil : ISO date | null  (defaut null)
 *
 * Idempotent : si une toile a deja un `status` defini, on respecte
 * la valeur existante (les autres champs sont normalises a null si
 * manquants pour rester coherents avec le contrat TS).
 *
 * Backup automatique dans data/backups/migration-toiles-{ISO}/toiles.json
 * avant ecriture (rotation 30 backups via scripts/backup-data.ts non
 * impactee).
 *
 * Utilisation : `bun scripts/migrate-toiles-status.ts`
 *
 * @author Lalou
 */

import { promises as fs } from 'fs';
import path from 'path';

const ROOT = process.cwd();
const TOILES_PATH = path.join(ROOT, 'data', 'toiles.json');
const BACKUPS_DIR = path.join(ROOT, 'data', 'backups');

type ToileStatus =
  | 'available'
  | 'reserved_pending'
  | 'reserved_signed'
  | 'partial_paid'
  | 'paid'
  | 'unavailable';

interface ToileEntry {
  id: number;
  name: string;
  status?: ToileStatus;
  reservationId?: string | null;
  reservedUntil?: string | null;
  [k: string]: unknown;
}

const VALID_STATUSES: ReadonlySet<ToileStatus> = new Set([
  'available',
  'reserved_pending',
  'reserved_signed',
  'partial_paid',
  'paid',
  'unavailable',
]);

function nowIsoSafe(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

async function main(): Promise<void> {
  let raw: string;
  try {
    raw = await fs.readFile(TOILES_PATH, 'utf-8');
  } catch (err) {
    console.error(`[migrate-toiles-status] Lecture impossible: ${TOILES_PATH}`, err);
    process.exit(1);
  }

  let toiles: ToileEntry[];
  try {
    toiles = JSON.parse(raw) as ToileEntry[];
  } catch (err) {
    console.error('[migrate-toiles-status] JSON parse failed', err);
    process.exit(1);
  }

  if (!Array.isArray(toiles)) {
    console.error('[migrate-toiles-status] data/toiles.json n est pas un tableau');
    process.exit(1);
  }

  let migratedCount = 0;
  let alreadyOkCount = 0;
  const normalized = toiles.map((toile) => {
    const hasValidStatus =
      typeof toile.status === 'string' && VALID_STATUSES.has(toile.status as ToileStatus);

    if (hasValidStatus) {
      alreadyOkCount += 1;
      return {
        ...toile,
        reservationId: toile.reservationId ?? null,
        reservedUntil: toile.reservedUntil ?? null,
      };
    }

    migratedCount += 1;
    return {
      ...toile,
      status: 'available' as ToileStatus,
      reservationId: null,
      reservedUntil: null,
    };
  });

  const backupDirName = `migration-toiles-${nowIsoSafe()}`;
  const backupDir = path.join(BACKUPS_DIR, backupDirName);
  await fs.mkdir(backupDir, { recursive: true });
  await fs.writeFile(path.join(backupDir, 'toiles.json'), raw, 'utf-8');

  await fs.writeFile(TOILES_PATH, `${JSON.stringify(normalized, null, 2)}\n`, 'utf-8');

  console.log(
    `[migrate-toiles-status] OK — ${normalized.length} toiles (migrees: ${migratedCount}, deja a jour: ${alreadyOkCount})`,
  );
  console.log(`[migrate-toiles-status] Backup: ${backupDir}/toiles.json`);
}

main().catch((err) => {
  console.error('[migrate-toiles-status] Echec', err);
  process.exit(1);
});
