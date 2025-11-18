import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-10-29.clover',
});

export async function POST(request: Request) {
  try {
    const { items, locale = 'fr' } = await request.json();

    // Validation items
    if (!items || items.length === 0) {
      console.error('[Stripe] Panier vide');
      return NextResponse.json(
        { error: 'Le panier est vide' },
        { status: 400 }
      );
    }

    // Validation et logs détaillés
    const validatedItems = items.map((item: any, index: number) => {
      console.log(`[Stripe] Item ${index + 1}:`, {
        title: item.title,
        price: item.price,
        category: item.category,
        hasImages: !!item.images?.length,
      });

      // Validation prix
      if (!item.price || item.price <= 0) {
        throw new Error(`Prix invalide pour "${item.title || `Item ${index + 1}`}": ${item.price}€`);
      }

      // Convertir images relatives en absolues HTTPS (requis par Stripe)
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://guillaumefarre.com';
      const absoluteImages = (item.images || []).map((img: string) => {
        if (img.startsWith('http')) return img;
        return `${baseUrl}${img.startsWith('/') ? '' : '/'}${img}`;
      }).filter((img: string) => {
        // Stripe n'accepte que les URLs HTTPS publiques
        // En dev local (localhost), on retire les images pour éviter les erreurs
        if (img.includes('localhost') || img.startsWith('http://')) {
          return false;
        }
        return true;
      });

      return {
        title: item.title || item.filename || 'Œuvre sans titre',
        price: item.price,
        category: item.category || 'Non catégorisé',
        images: absoluteImages,
        format: item.format || 'A2',
        material: item.material || 'semi-glossy',
        orientation: item.orientation || 'vertical',
        frame: item.frame || 'none',
        photoPath: item.photoPath || item.path || '',
      };
    });

    console.log(`[Stripe] Création session pour ${validatedItems.length} item(s)`);

    // Créer une session de paiement Stripe avec support Alma (3x/4x sans frais)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'alma'], // Alma activé pour paiement fractionné 3x/4x
      line_items: validatedItems.map((item: any) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.title,
            description: item.category,
            images: item.images.slice(0, 8), // Stripe limite à 8 images max
            metadata: {
              format: item.format,
              material: item.material,
              orientation: item.orientation,
              frame: item.frame,
              photoPath: item.photoPath,
            },
          },
          unit_amount: Math.round(item.price * 100), // Prix validé > 0
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://guillaumefarre.com'}/${locale}/panier?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://guillaumefarre.com'}/${locale}/panier?canceled=true`,
      locale: locale as Stripe.Checkout.SessionCreateParams.Locale,
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC', 'IT', 'ES', 'DE', 'GB', 'US'],
      },
      metadata: {
        items_formats: validatedItems.map((item: any) => item.format).join(','),
        items_materials: validatedItems.map((item: any) => item.material).join(','),
        items_orientations: validatedItems.map((item: any) => item.orientation).join(','),
        items_frames: validatedItems.map((item: any) => item.frame).join(','),
      },
    });

    console.log('[Stripe] Session créée:', session.id);
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('[Stripe] Erreur complète:', {
      message: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        error: error.message || 'Erreur lors de la création de la session de paiement',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
