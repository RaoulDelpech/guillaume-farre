/**
 * API endpoint for retrieving user orders
 * GET /api/account/orders
 *
 * Requires authentication via gf_account_email cookie
 *
 * @author Lalou
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getOrdersByEmail } from '@/lib/orders';

/**
 * GET /api/account/orders
 * Get all orders for authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get('gf_account_email')?.value;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }

    console.log(`[Orders] Récupération commandes pour ${email}`);

    // Get orders for this email
    const orders = await getOrdersByEmail(email);

    // Remove sensitive fields before sending to client
    const sanitizedOrders = orders.map((order) => ({
      orderNumber: order.orderNumber,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      paidAt: order.paidAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      trackingNumber: order.trackingNumber,
      trackingUrl: order.trackingUrl,
      carrier: order.carrier,
      isEarlyCollector: order.isEarlyCollector,
      certificateId: order.certificateId,
      // DO NOT send: stripeSessionId, gelatoOrderId
    }));

    console.log(`[Orders] ✅ ${sanitizedOrders.length} commandes trouvées`);

    return NextResponse.json({
      success: true,
      orders: sanitizedOrders,
    });
  } catch (error: any) {
    console.error('[Orders] Erreur serveur:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Lalou
