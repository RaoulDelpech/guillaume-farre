/**
 * Backup automatique des fichiers data critiques.
 *
 * - Copie data/toiles.json, data/reservations.json, data/vip-codes.json
 *   vers data/backups/{ISO_timestamp}/
 * - Rotation : conserve N backups les plus recents (defaut 30, env BACKUP_RETENTION_COUNT)
 * - Si un fichier source n'existe pas (cas vip-codes.json/reservations.json en debut de feature),
 *   il est simplement skippe sans erreur.
 *
 * Utilisation :
 *   bun run backup:data
 *
 * Variable d'env :
 *   BACKUP_RETENTION_COUNT (defaut: 30)
 *
 * @author Lalou
 */

import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');

const TARGET_FILES = ['toiles.json', 'reservations.json', 'vip-codes.json'];

const DEFAULT_RETENTION = 30;

function parseRetention(): number {
  const raw = process.env.BACKUP_RETENTION_COUNT;
  if (!raw) return DEFAULT_RETENTION;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n) || n < 1) {
    console.warn(
      `[backup] BACKUP_RETENTION_COUNT invalide ("${raw}"), fallback ${DEFAULT_RETENTION}`,
    );
    return DEFAULT_RETENTION;
  }
  return n;
}

// Timestamp ISO sans caracteres invalides en nom de dossier sur tous les OS.
// "2026-05-14T20:18:42.123Z" -> "2026-05-14T20-18-42-123Z"
function formatTimestamp(date: Date): string {
  return date.toISOString().replace(/[:.]/g, '-');
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function copyTargets(destDir: string): Promise<string[]> {
  const copied: string[] = [];
  for (const filename of TARGET_FILES) {
    const src = path.join(DATA_DIR, filename);
    if (!(await fileExists(src))) continue;
    const dst = path.join(destDir, filename);
    await fs.copyFile(src, dst);
    copied.push(filename);
  }
  return copied;
}

async function listBackupDirs(): Promise<string[]> {
  if (!(await fileExists(BACKUPS_DIR))) return [];
  const entries = await fs.readdir(BACKUPS_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort(); // ISO -> tri lexicographique = tri chronologique
}

async function rotate(retention: number): Promise<{ kept: number; removed: number }> {
  const dirs = await listBackupDirs();
  if (dirs.length <= retention) {
    return { kept: dirs.length, removed: 0 };
  }
  const toRemove = dirs.slice(0, dirs.length - retention);
  for (const name of toRemove) {
    await fs.rm(path.join(BACKUPS_DIR, name), { recursive: true, force: true });
  }
  return { kept: retention, removed: toRemove.length };
}

async function main(): Promise<void> {
  const retention = parseRetention();
  await ensureDir(BACKUPS_DIR);

  const timestamp = formatTimestamp(new Date());
  const destDir = path.join(BACKUPS_DIR, timestamp);
  await ensureDir(destDir);

  const copied = await copyTargets(destDir);

  if (copied.length === 0) {
    // Aucun fichier a backuper : on supprime le dossier vide pour ne pas polluer.
    await fs.rm(destDir, { recursive: true, force: true });
    console.log(
      `[backup] aucun fichier source trouve dans ${DATA_DIR} (${TARGET_FILES.join(', ')}), backup skippe`,
    );
    return;
  }

  const { kept, removed } = await rotate(retention);

  console.log(`[backup] dossier cree     : ${destDir}`);
  console.log(`[backup] fichiers backupes: ${copied.length} (${copied.join(', ')})`);
  console.log(`[backup] retention        : ${retention} (kept=${kept}, removed=${removed})`);
}

main().catch((err) => {
  console.error('[backup] echec :', err);
  process.exit(1);
});
