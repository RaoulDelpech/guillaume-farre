/**
 * Tests unitaires du verrou file-based.
 *
 * @author Lalou
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { acquireLock, STALE_LOCK_TTL_MS } from '../locks';

const LOCKS_DIR = path.join(process.cwd(), 'data', 'locks');

async function cleanupLockFile(key: string): Promise<void> {
  try {
    await fs.unlink(path.join(LOCKS_DIR, `${key}.lock`));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
  }
}

describe('acquireLock', () => {
  const baseKey = `lock-test-${process.pid}`;

  beforeEach(async () => {
    await cleanupLockFile(baseKey);
  });

  afterEach(async () => {
    await cleanupLockFile(baseKey);
  });

  it('acquiert et libere un verrou disponible', async () => {
    const handle = await acquireLock(baseKey, 1000);
    expect(handle).not.toBeNull();
    if (!handle) return;

    const lockPath = path.join(LOCKS_DIR, `${baseKey}.lock`);
    const stat = await fs.stat(lockPath);
    expect(stat.isFile()).toBe(true);

    await handle.release();
    await expect(fs.access(lockPath)).rejects.toThrow();
  });

  it('release est idempotent (deuxieme appel sans throw)', async () => {
    const handle = await acquireLock(baseKey, 1000);
    expect(handle).not.toBeNull();
    if (!handle) return;

    await handle.release();
    await handle.release(); // ne doit pas throw
    expect(true).toBe(true);
  });

  it('serialise deux acquireLock concurrents sur la meme cle', async () => {
    const events: string[] = [];

    const first = (async () => {
      const handle = await acquireLock(baseKey, 2000);
      expect(handle).not.toBeNull();
      if (!handle) return;
      events.push('A_acquired');
      await new Promise((resolve) => setTimeout(resolve, 120));
      events.push('A_releasing');
      await handle.release();
    })();

    // Laisser A acquerir d'abord
    await new Promise((resolve) => setTimeout(resolve, 20));

    const second = (async () => {
      const handle = await acquireLock(baseKey, 2000);
      expect(handle).not.toBeNull();
      if (!handle) return;
      events.push('B_acquired');
      await handle.release();
    })();

    await Promise.all([first, second]);

    expect(events).toEqual(['A_acquired', 'A_releasing', 'B_acquired']);
  });

  it('retourne null si le timeout est depasse', async () => {
    const blocker = await acquireLock(baseKey, 1000);
    expect(blocker).not.toBeNull();
    if (!blocker) return;

    const start = Date.now();
    const handle = await acquireLock(baseKey, 200);
    const elapsed = Date.now() - start;

    expect(handle).toBeNull();
    expect(elapsed).toBeGreaterThanOrEqual(180);
    expect(elapsed).toBeLessThan(1500);

    await blocker.release();
  });

  it('considere un lock orphelin (> TTL) comme stale et l ecrase', async () => {
    await fs.mkdir(LOCKS_DIR, { recursive: true });
    const lockPath = path.join(LOCKS_DIR, `${baseKey}.lock`);
    await fs.writeFile(lockPath, 'zombie');

    // Vieillir le fichier de TTL + 1s pour eviter le flake
    const past = (Date.now() - STALE_LOCK_TTL_MS - 1000) / 1000;
    await fs.utimes(lockPath, past, past);

    const handle = await acquireLock(baseKey, 500);
    expect(handle).not.toBeNull();
    if (!handle) return;

    await handle.release();
  });

  it('rejette les cles vides', async () => {
    await expect(acquireLock('', 100)).rejects.toThrow();
  });
});
