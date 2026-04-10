import Stripe from 'stripe';

export function extractFormatFromDescription(description: string): string {
  const formats = ['A4', 'A3', 'A2', 'A1', 'XXL', 'MONUMENTAL'];
  const found = formats.find(f => description.toUpperCase().includes(f));
  return found || 'A3';
}

export function extractFrameFromDescription(description: string): string {
  const lowerDesc = description.toLowerCase();
  if (lowerDesc.includes('cadre noir') || lowerDesc.includes('black frame')) return 'Cadre noir';
  if (lowerDesc.includes('cadre blanc') || lowerDesc.includes('white frame')) return 'Cadre blanc';
  return 'Sans cadre';
}

export function extractPhotoFilename(item: Stripe.LineItem): string | null {
  const description = item.description || '';
  const match = description.match(/([^\/]+\.(jpg|jpeg|png|webp))/i);
  return match ? match[1] : null;
}

export function isLimitedEdition(item: Stripe.LineItem): boolean {
  const description = (item.description || '').toLowerCase();
  return description.includes('limitée') || description.includes('limited') || description.includes('edition');
}

export function extractImageUrl(_item: Stripe.LineItem): string {
  return process.env.NEXT_PUBLIC_SITE_URL + '/images/works/default.jpg';
}
