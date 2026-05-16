/**
 * Verrou file-based simple pour serialiser les ecritures concurrentes
 * sur des fichiers `data/*.json` (toiles, reservations).
 *
 * - Cree `data/locks/{key}.lock` en mode atomique (O_CREAT | O_EXCL).
 * - Si le fichier existe deja, retry avec backoff borne jusqu'a
 *   `timeoutMs` ; si le verrou existant est plus vieux que la duree
 *   de zombie (`STALE_LOCK_TTL_MS`), il est considere comme orphelin
 *   et ecrase.
 * - `release()` est idempotent (un seul `unlink`).
 *
 * Ce module est volontairement minimaliste : un seul processus Next.js
 * tourne en prod via PM2 (single instance), donc une exclusion mutuelle
 * file-based suffit. Si demain on passe a plusieurs workers, il
 * faudra revoir vers un lock plus robuste (proper-lockfile, redlock).
 *
 * @author Lalou
 */

import { promises as fs } from 'fs';
import path from 'path';

const LOCKS_DIR = path.join(process.cwd(), 'data', 'locks');

/** Au-dela de cette duree, un fichier lock est considere orphelin. */
export const STALE_LOCK_TTL_MS = 30_000;
const INITIAL_RETRY_MS = 25;
const MAX_RETRY_MS = 500;

export interface LockHandle {
  release: () => Promise<void>;
}

function sanitizeKey(key: string): string {
  // On force un sous-ensemble safe pour les noms de fichiers cross-platform.
  if (!key) throw new Error('lock key vide');
  const cleaned = key.replace(/[^a-zA-Z0-9._-]/g, '_');
  if (!cleaned) throw new Error('lock key invalide apres normalisation');
  return cleaned;
}

async function ensureLocksDir(): Promise<void> {
  await fs.mkdir(LOCKS_DIR, { recursive: true });
}

async function tryCreateLockFile(lockPath: string): Promise<boolean> {
  try {
    const handle = await fs.open(lockPath, 'wx');
    try {
      await handle.writeFile(`${process.pid}|${Date.now()}`);
    } finally {
      await handle.close();
    }
    return true;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === 'EEXIST') return false;
    throw err;
  }
}

async function isStaleLock(lockPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(lockPath);
    const ageMs = Date.now() - stat.mtimeMs;
    return ageMs > STALE_LOCK_TTL_MS;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return false;
    return false;
  }
}

async function clearStaleLock(lockPath: string): Promise<void> {
  try {
    await fs.unlink(lockPath);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code !== 'ENOENT') throw err;
  }
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Acquiert un lock identifie par `key`. Retourne un handle dont
 * `release()` supprime le fichier. Renvoie `null` si le verrou
 * ne peut pas etre obtenu avant `timeoutMs`.
 */
export async function acquireLock(
  key: string,
  timeoutMs: number,
): Promise<LockHandle | null> {
  const safeKey = sanitizeKey(key);
  await ensureLocksDir();
  const lockPath = path.join(LOCKS_DIR, `${safeKey}.lock`);

  const deadline = Date.now() + Math.max(0, timeoutMs);
  let backoff = INITIAL_RETRY_MS;

  while (true) {
    const created = await tryCreateLockFile(lockPath);
    if (created) {
      let released = false;
      const release = async (): Promise<void> => {
        if (released) return;
        released = true;
        try {
          await fs.unlink(lockPath);
        } catch (err) {
          const code = (err as NodeJS.ErrnoException).code;
          if (code !== 'ENOENT') throw err;
        }
      };
      return { release };
    }

    if (await isStaleLock(lockPath)) {
      await clearStaleLock(lockPath);
      continue;
    }

    if (Date.now() >= deadline) return null;

    const remaining = Math.max(0, deadline - Date.now());
    const wait = Math.min(backoff, MAX_RETRY_MS, remaining);
    if (wait <= 0) return null;
    await sleep(wait);
    backoff = Math.min(backoff * 2, MAX_RETRY_MS);
  }
}
