/**
 * Gestion des editions numerotees
 *
 * Chaque photo a 30 tirages max (9+9+9+3) repartis sur 4 formats.
 * Numerotation : 24x36=n1-9, 40x60=n10-18, 80x120=n19-27, hors-format=n28-30.
 * Photo 16 (Bettejuice) = piece unique monumentale (1 exemplaire).
 *
 * @author Lalou
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { PrintFormat } from './pricing-config';

const EDITIONS_PATH = join(process.cwd(), 'data', 'editions.json');

export interface EditionSlot {
  total: number;
  sold: number;
  nextNumber: number;
}

export type PhotoEditions = Record<string, EditionSlot>;
export type AllEditions = Record<string, PhotoEditions>;

/** Lit le fichier editions.json */
export function loadEditions(): AllEditions {
  const raw = readFileSync(EDITIONS_PATH, 'utf-8');
  return JSON.parse(raw);
}

/** Ecrit le fichier editions.json */
function saveEditions(data: AllEditions): void {
  writeFileSync(EDITIONS_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

/** Nombre de tirages disponibles pour une photo et un format */
export function getAvailable(photoId: number, format: PrintFormat): number {
  const editions = loadEditions();
  const key = `photo_${photoId}`;
  const slot = editions[key]?.[format];
  if (!slot) return 0;
  return slot.total - slot.sold;
}

/** Info complete d'une edition pour affichage */
export function getEditionInfo(photoId: number, format: PrintFormat): EditionSlot | null {
  const editions = loadEditions();
  const key = `photo_${photoId}`;
  return editions[key]?.[format] ?? null;
}

/** Toutes les editions d'une photo (pour affichage galerie) */
export function getPhotoEditions(photoId: number): PhotoEditions | null {
  const editions = loadEditions();
  return editions[`photo_${photoId}`] ?? null;
}

/**
 * Reserve le prochain tirage disponible.
 * Retourne le numero attribue, ou null si epuise.
 * Met a jour editions.json (sold++, nextNumber++).
 */
export function reserveNextEdition(photoId: number, format: PrintFormat): number | null {
  const editions = loadEditions();
  const key = `photo_${photoId}`;
  const slot = editions[key]?.[format];

  if (!slot || slot.sold >= slot.total) return null;

  const assignedNumber = slot.nextNumber;
  slot.sold += 1;
  slot.nextNumber += 1;

  saveEditions(editions);
  return assignedNumber;
}
