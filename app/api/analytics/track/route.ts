import { NextRequest, NextResponse } from 'next/server';
import {
  incrementPageView,
  incrementVisitor,
  incrementAddToCart,
  recordPurchase,
  incrementArtworkView,
  incrementFunnelStep,
} from '@/lib/server-analytics';

type TrackEvent =
  | { type: 'page_view' }
  | { type: 'visitor' }
  | { type: 'add_to_cart' }
  | { type: 'purchase'; revenue: number }
  | { type: 'artwork_view'; slug: string }
  | { type: 'funnel'; step: 'home' | 'galerie' | 'boutique' | 'checkout' | 'purchase' };

/**
 * POST /api/analytics/track — public event tracking endpoint
 * Called from client components to record server-side analytics
 *
 * @author Lalou
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TrackEvent;

    switch (body.type) {
      case 'page_view':
        await incrementPageView();
        break;
      case 'visitor':
        await incrementVisitor();
        break;
      case 'add_to_cart':
        await incrementAddToCart();
        break;
      case 'purchase':
        await recordPurchase(body.revenue);
        break;
      case 'artwork_view':
        await incrementArtworkView(body.slug);
        break;
      case 'funnel':
        await incrementFunnelStep(body.step);
        break;
      default:
        return NextResponse.json({ error: 'Type inconnu' }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
