import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { isRateLimited, getClientIP } from '@/lib/rate-limit';
import { CANONICAL_PRICES } from '@/lib/pricing-calculator';
import { calculateShippingFee, getShippingLabel, taxBreakdown, TVA_RATE } from '@/lib/shipping-config';

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

    // Limite quantité max
    if (items.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 articles par commande' },
        { status: 400 }
      );
    }

    // Vérifier le stock pour chaque item (éditions limitées uniquement)
    const { loadPhotoMetadata } = await import('@/lib/admin/photo-manager');
    const allPhotos = await loadPhotoMetadata();

    for (const item of items) {
      const photo = allPhotos.find(p => p.path === item.photoPath || p.filename === item.filename);
      if (!photo) continue;

      // Verifier le stock par format
      if (photo.editions) {
        const format = item.format || '24x36';
        const edition = (photo.editions as Record<string, any>)[format];

        if (edition && (edition.available <= 0)) {
          console.error(`[Stripe] Edition epuisee: ${photo.filename} (${format})`);
          return NextResponse.json(
            { error: `Cette edition est epuisee (${photo.title || photo.filename})` },
            { status: 400 }
          );
        }
      }
    }

    // Prix canoniques importes depuis pricing-calculator (source de verite)

    // Validation et logs détaillés
    const validatedItems = items.map((item: any, index: number) => {
      // Validation prix
      if (!item.price || item.price <= 0) {
        throw new Error(`Prix invalide pour "${item.title || `Item ${index + 1}`}": ${item.price}€`);
      }

      // Validation prix serveur : recalculer à partir du format
      const format = item.format || 'A2';
      const expectedPrice = CANONICAL_PRICES[format];
      if (!expectedPrice) {
        console.error(`[Stripe] Format inconnu: ${format}`);
        throw new Error(`Format non reconnu: ${format}`);
      }
      if (Math.abs(item.price - expectedPrice) > 0.01) {
        console.error(`[Stripe] Prix manipulé détecté: ${item.price}€ vs ${expectedPrice}€ (${format})`);
        throw new Error(`Prix incorrect pour format ${format}`);
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

    const totalAmount = validatedItems.reduce((sum: number, item: any) => sum + item.price, 0);
    const isHighValue = totalAmount >= BANK_TRANSFER_THRESHOLD;

    // Vérification KYC serveur : si > 10K EUR et pas de vérification d'identité
    // Pour l'instant on accepte sans vérification stricte côté serveur
    // La vérification KYC sera faite via Stripe Identity avant le paiement

    // Pour les gros montants, créer un Customer Stripe (requis pour bank transfers)
    let customer: string | undefined;
    if (isHighValue) {
      const stripeCustomer = await stripe.customers.create({
        metadata: { source: 'guillaumefarre.com' },
      });
      customer = stripeCustomer.id;
    }

    // Payment methods selon le montant
    const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = isHighValue
      ? ['card', 'customer_balance']
      : ['card'];

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

    // Calcul frais de livraison (basé sur le plus grand format du panier)
    const itemFormats = validatedItems.map((item: any) => item.format);
    const shippingFeeCents = calculateShippingFee(itemFormats);
    const shippingOnRequest = shippingFeeCents === null;
    const shippingLabel = getShippingLabel(shippingFeeCents);

    // Calcul TVA pour metadata comptable (prix TTC → HT + TVA 5,5%)
    const tax = taxBreakdown(totalAmount);

    // Créer une session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      ...(customer ? { customer } : {}),
      payment_method_types: paymentMethodTypes,
      ...(paymentMethodOptions ? { payment_method_options: paymentMethodOptions } : {}),
      line_items: validatedItems.map((item: any) => {
        return {
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.title,
              description: item.category,
              images: item.images.slice(0, 8),
              metadata: {
                format: item.format,
                material: item.material,
                orientation: item.orientation,
                frame: item.frame,
                photoPath: item.photoPath,
              },
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: 1,
        };
      }),
      // Frais de livraison : fixe pour petits formats, 0 EUR + message pour grands formats (sur devis)
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount' as const,
            fixed_amount: {
              amount: shippingOnRequest ? 0 : shippingFeeCents,
              currency: 'eur',
            },
            display_name: shippingLabel,
            ...(shippingOnRequest
              ? {}
              : {
                  delivery_estimate: {
                    minimum: { unit: 'business_day' as const, value: 5 },
                    maximum: { unit: 'business_day' as const, value: 10 },
                  },
                }),
          },
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/${locale}/commande/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${locale}/boutique?canceled=true`,
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
        // Fiscalite (TVA 5,5% oeuvres d'art)
        tva_rate: `${TVA_RATE * 100}%`,
        total_ht: tax.totalHt.toString(),
        total_tva: tax.tvaAmount.toString(),
        total_ttc: tax.totalTtc.toString(),
        shipping_fee_ttc: shippingOnRequest ? 'sur_devis' : (shippingFeeCents / 100).toString(),
      },
    });

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
