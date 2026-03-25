/**
 * API: Téléchargement certificat d'authenticité
 *
 * GET /api/orders/certificate?order=GF-XXXXXX&email=xxx@xxx.com
 *
 * Sécurité: Requiert numéro commande ET email client
 * Génère PDF à la volée avec certificat d'authenticité
 *
 * @author Lalou
 */

import { NextResponse } from 'next/server';
import { getOrder } from '@/lib/orders';
import { generateCertificatePDF } from '@/lib/pdf-generator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('order');
    const email = searchParams.get('email');

    // Validation paramètres
    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: 'Paramètres manquants: order et email requis' },
        { status: 400 }
      );
    }

    // Récupérer commande
    const order = await getOrder(orderNumber);

    if (!order) {
      return NextResponse.json(
        { error: 'Commande introuvable' },
        { status: 404 }
      );
    }

    // Vérifier que l'email correspond (sécurité)
    if (order.customerEmail.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email incorrect pour cette commande' },
        { status: 403 }
      );
    }

    // Vérifier que la commande est payée
    if (order.status === 'pending') {
      return NextResponse.json(
        { error: 'Commande non encore payée' },
        { status: 403 }
      );
    }

    // Générer ID certificat si absent (anciennes commandes)
    const certificateId = order.certificateId || generateCertificateId(order.orderNumber);

    // Préparer données pour PDF
    const certificateData = {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      items: order.items.map(item => ({
        title: item.title,
        format: item.format,
        edition: undefined, // TODO: Récupérer numéro édition depuis metadata photo
      })),
      purchaseDate: order.paidAt || order.createdAt,
      certificateId,
    };

    // Générer PDF
    const pdfBuffer = generateCertificatePDF(certificateData);

    // Retourner PDF en téléchargement (convertir Buffer en Uint8Array pour NextResponse)
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificat-authenticite-${order.orderNumber}.pdf"`,
        'Cache-Control': 'private, max-age=3600', // Cache 1h côté client
      },
    });
  } catch (error: any) {
    console.error('[Certificate] Erreur génération:', error);
    return NextResponse.json(
      { error: 'Erreur interne serveur' },
      { status: 500 }
    );
  }
}

/**
 * Génère un ID unique pour le certificat
 * Format: CERT-{orderNumber}-{timestamp}
 */
function generateCertificateId(orderNumber: string): string {
  const timestamp = Date.now();
  return `CERT-${orderNumber}-${timestamp}`;
}

// Lalou
