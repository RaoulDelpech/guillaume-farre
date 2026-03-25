import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { isEarlyAccess, EARLY_ACCESS_DISCOUNT } from '@/lib/early-access';
import { isRateLimited, getClientIP } from '@/lib/rate-limit';

// Stripe initialisé seulement si clé disponible
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
    })
  : null;

// Seuil à partir duquel on propose le virement SEPA (en euros)
const BANK_TRANSFER_THRESHOLD = 1000;

// Seuil KYC (obligation LCB-FT pour vente d'art)
const KYC_THRESHOLD = 10_000;

export async function POST(request: Request) {
  // Si Stripe pas configuré, renvoyer erreur
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe non configuré' },
      { status: 503 }
    );
  }

  // Rate limiting: 10 requêtes par IP par minute
  const clientIP = getClientIP(request);
  const rateLimitKey = `checkout:${clientIP}`;

  if (isRateLimited(rateLimitKey, 10, 60000)) {
    console.warn(`[Stripe Checkout] Rate limit dépassé pour IP ${clientIP}`);
    return NextResponse.json(
      { error: 'Trop de requêtes. Veuillez réessayer dans 1 minute.' },
      { status: 429 }
    );
  }

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

    // Vérifier le stock pour chaque item (éditions limitées uniquement)
    const { loadPhotoMetadata } = await import('@/lib/admin/photo-manager');
    const allPhotos = await loadPhotoMetadata();

    for (const item of items) {
      const photo = allPhotos.find(p => p.path === item.photoPath || p.filename === item.filename);
      if (!photo) continue;

      // Si édition limitée, vérifier le stock
      if (photo.categories?.includes('limited')) {
        const format = item.format || 'A2';
        const isGrandFormat = ['A1', 'A0', '2A0'].includes(format);
        const stock = isGrandFormat ? photo.limitedEditionGrand : photo.limitedEditionPetit;

        if (!stock || stock.available <= 0 || stock.closed) {
          console.error(`[Stripe] Édition épuisée: ${photo.filename} (${format})`);
          return NextResponse.json(
            { error: `Cette édition est épuisée (${photo.title || photo.filename})` },
            { status: 400 }
          );
        }
      }
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

    // Vérifier si en mode early access pour appliquer la réduction
    const earlyCollectorMode = isEarlyAccess();
    const originalTotal = validatedItems.reduce((sum: number, item: any) => sum + item.price, 0);

    // Appliquer la réduction Early Collector si applicable
    const discountAmount = earlyCollectorMode ? originalTotal * EARLY_ACCESS_DISCOUNT : 0;
    const totalAmount = originalTotal - discountAmount;
    const isHighValue = totalAmount >= BANK_TRANSFER_THRESHOLD;

    // Vérification KYC serveur : si > 10K EUR et pas de vérification d'identité
    if (totalAmount >= KYC_THRESHOLD) {
      // Pour l'instant on accepte sans vérification stricte côté serveur
      // La vérification KYC sera faite via Stripe Identity avant le paiement
      console.log(`[Stripe] Commande > ${KYC_THRESHOLD}€ - KYC requis`);
    }

    console.log(`[Stripe] Création session pour ${validatedItems.length} item(s)`);
    console.log(`[Stripe] Total original: ${originalTotal}€`);
    if (earlyCollectorMode) {
      console.log(`[Stripe] Early Collector -25%: -${discountAmount}€`);
      console.log(`[Stripe] Total avec réduction: ${totalAmount}€`);
    }
    console.log(`[Stripe] Virement SEPA: ${isHighValue}`);

    // Pour les gros montants, créer un Customer Stripe (requis pour bank transfers)
    let customer: string | undefined;
    if (isHighValue) {
      const stripeCustomer = await stripe.customers.create({
        metadata: { source: 'guillaumefarre.com' },
      });
      customer = stripeCustomer.id;
      console.log('[Stripe] Customer créé pour virement SEPA:', stripeCustomer.id);
    }

    // Payment methods selon le montant
    const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = isHighValue
      ? ['card', 'alma', 'customer_balance']
      : ['card', 'alma'];

    // Config bank transfer SEPA pour gros montants
    const paymentMethodOptions: Stripe.Checkout.SessionCreateParams.PaymentMethodOptions | undefined = isHighValue
      ? {
          customer_balance: {
            bank_transfer: {
              type: 'eu_bank_transfer',
              eu_bank_transfer: { country: 'FR' },
            },
            funding_type: 'bank_transfer',
          },
        }
      : undefined;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://guillaumefarre.com';

    // Créer une session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      ...(customer ? { customer } : {}),
      payment_method_types: paymentMethodTypes,
      ...(paymentMethodOptions ? { payment_method_options: paymentMethodOptions } : {}),
      line_items: validatedItems.map((item: any) => {
        // Appliquer la réduction Early Collector sur chaque item si applicable
        const finalPrice = earlyCollectorMode
          ? item.price * (1 - EARLY_ACCESS_DISCOUNT)
          : item.price;

        return {
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
                ...(earlyCollectorMode && { original_price: item.price.toString() }),
              },
            },
            unit_amount: Math.round(finalPrice * 100), // Prix avec réduction si applicable
          },
          quantity: 1,
        };
      }),
      mode: 'payment',
      success_url: `${baseUrl}/${locale}/panier?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${locale}/panier?canceled=true`,
      locale: locale as Stripe.Checkout.SessionCreateParams.Locale,
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC', 'IT', 'ES', 'DE', 'GB', 'US'],
      },
      metadata: {
        items_formats: validatedItems.map((item: any) => item.format).join(','),
        items_materials: validatedItems.map((item: any) => item.material).join(','),
        items_orientations: validatedItems.map((item: any) => item.orientation).join(','),
        items_frames: validatedItems.map((item: any) => item.frame).join(','),
        payment_type: isHighValue ? 'high_value' : 'standard',
        ...(earlyCollectorMode && {
          early_collector: 'true',
          early_collector_discount: '25%',
          original_total: originalTotal.toString(),
        }),
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
