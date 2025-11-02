import type { Work } from './works';

export function primaryImage(work: Work): string | null {
  return work.images.length > 0 ? work.images[0] : null;
}

export function altForWork(work: Work): string {
  return `${work.title} - Guillaume Farré`;
}
