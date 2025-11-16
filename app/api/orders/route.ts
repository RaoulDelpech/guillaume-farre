import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createWhiteWallOrder, WHITEWALL_FORMATS, WHITEWALL_MATERIALS } from '@/lib/printing/whitewall-api';
import type { WhiteWallOrder, WhiteWallProduct } from '@/lib/printing/whitewall-api';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-10-29.clover',
});

interface OrderItem {
  photoPath: string;
  photoTitle: string;
  format: keyof typeof WHITEWALL_FORMATS;
  material: keyof typeof WHITEWALL_MATERIALS;
  frame?: 'black-wood' | 'white-wood' | 'aluminum' | 'none';
  quantity: number;
}

interface CreateOrderRequest {
  items: OrderItem[];
  customerInfo: {
    email: string;
    name: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
      phone: string;
    };
  };
  locale?: string;
}

/**
 * POST /api/orders
 * Crée une commande complète : Stripe + WhiteWall automatiquement
 */
export async function POST(request: Request) {
  try {
    const { items, customerInfo, locale = 'fr' }: CreateOrderRequest = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Aucun article dans la commande' }, { status: 400 });
    }

    // Calculer le prix total avec tous les détails
    const lineItems = items.map((item) => {
      const format = WHITEWALL_FORMATS[item.format];
      const material = WHITEWALL_MATERIALS[item.material];

      // Prix de base : format + matériau
      let price = format.price;

      // Ajout du coût du cadre
      const framePrices = {
        'black-wood': 80,
        'white-wood': 80,
        'aluminum': 120,
        'none': 0,
      };
      price += framePrices[item.frame || 'none'];

      // Multiplication par matériau (Fine Art = base, autres +20-50%)
      const materialMultipliers = {
        'fine-art': 1.0,
        'alu-dibond': 1.3,
        'acrylic': 1.5,
        'canvas': 1.2,
      };
      price *= materialMultipliers[item.material];

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${item.photoTitle} - ${format.label}`,
            description: `${material.label}${item.frame !== 'none' ? ` + Cadre ${item.frame}` : ''}`,
            images: [
              `${process.env.NEXT_PUBLIC_SITE_URL}${item.photoPath}`,
            ],
            metadata: {
              photoPath: item.photoPath,
              format: item.format,
              material: item.material,
              frame: item.frame || 'none',
            },
          },
          unit_amount: Math.round(price * 100), // Prix en centimes
        },
        quantity: item.quantity,
      };
    });

    // Créer la session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/panier?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/panier?canceled=true`,
      locale: locale as Stripe.Checkout.SessionCreateParams.Locale,
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC', 'IT', 'ES', 'DE', 'GB', 'US', 'CA'],
      },
      customer_email: customerInfo.email,
      metadata: {
        orderType: 'whitewall-print',
        customerName: customerInfo.name,
        itemsCount: items.length.toString(),
      },
    });

    // Stocker les informations de commande pour le webhook
    // (sera automatiquement envoyé à WhiteWall après paiement réussi)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de la commande' },
      { status: 500 }
    );
  }
}
