import toilesJson from '@/data/toiles.json';
import type { Toile } from '@/components/toiles/types';

/**
 * Acces type-safe au catalogue de toiles.
 *
 * Le JSON est importe avec son type litteral (les statuts sont inferes
 * comme `string`), on caste vers `Toile[]` au seul point d'entree pour
 * eviter de polluer chaque consommateur avec un `as`. La migration
 * `scripts/migrate-toiles-status.ts` garantit la presence des champs.
 *
 * @author Lalou
 */
export const TOILES: Toile[] = toilesJson as Toile[];
