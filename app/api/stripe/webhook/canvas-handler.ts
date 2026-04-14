import Stripe from 'stripe';

export async function processCanvasInvoicePaid(invoice: Stripe.Invoice) {
  const { promises: fs } = await import('fs');
  const path = await import('path');

  const RESERVATIONS_PATH = path.join(process.cwd(), 'data', 'reservations.json');
  const TOILES_PATH = path.join(process.cwd(), 'data', 'toiles.json');

  // Lire réservations
  let reservations: Record<string, unknown>[] = [];
  try {
    const data = await fs.readFile(RESERVATIONS_PATH, 'utf-8');
    reservations = JSON.parse(data);
  } catch {
    console.error('Cannot read reservations.json');
    return;
  }

  const reservationId = invoice.metadata?.reservationId;
  const reservationIndex = reservations.findIndex((r) => r.id === reservationId);

  if (reservationIndex === -1) {
    console.error(`Reservation ${reservationId} not found`);
    return;
  }

  const reservation = reservations[reservationIndex] as Record<string, unknown>;

  // Lire toiles pour dimensions
  let toiles: Record<string, unknown>[] = [];
  try {
    const data = await fs.readFile(TOILES_PATH, 'utf-8');
    toiles = JSON.parse(data);
  } catch {
    console.error('Cannot read toiles.json');
  }

  const toile = toiles.find((t) => t.name === reservation.canvasTitle) as Record<string, unknown> | undefined;

  // Mettre à jour réservation → paid
  reservations[reservationIndex] = {
    ...reservation,
    status: 'paid',
    paidAt: new Date().toISOString(),
  };

  try {
    await fs.writeFile(RESERVATIONS_PATH, JSON.stringify(reservations, null, 2), 'utf-8');
  } catch (error) {
    console.error('Cannot save reservations.json:', error);
  }

  // Créer commande
  try {
    const { createOrder } = await import('@/lib/orders');

    const order = await createOrder({
      stripeSessionId: invoice.id,
      customerEmail: reservation.email as string,
      customerName: reservation.name as string,
      type: 'canvas',
      items: [
        {
          title: reservation.canvasTitle as string,
          format: (toile?.dimensions as string) || 'N/A',
          frame: 'Toile originale',
          price: (invoice.amount_paid || 0) / 100,
        },
      ],
      totalAmount: (invoice.amount_paid || 0) / 100,
      status: 'paid',
      paidAt: new Date().toISOString(),
    });

    reservations[reservationIndex] = { ...reservations[reservationIndex], orderNumber: order.orderNumber };
    await fs.writeFile(RESERVATIONS_PATH, JSON.stringify(reservations, null, 2), 'utf-8');
  } catch (error) {
    console.error('Cannot create order:', error);
  }

  // Email confirmation acheteur
  try {
    const { sendOrderConfirmationEmail } = await import('@/lib/resend-client');

    await sendOrderConfirmationEmail({
      to: reservation.email as string,
      customerName: reservation.name as string,
      orderNumber: (reservations[reservationIndex] as Record<string, unknown>).orderNumber as string || invoice.id,
      items: [
        {
          title: reservation.canvasTitle as string,
          format: (toile?.dimensions as string) || 'N/A',
          frame: 'Toile originale',
          price: (invoice.amount_paid || 0) / 100,
        },
      ],
      totalAmount: (invoice.amount_paid || 0) / 100,
      shippingAddress: {
        line1: "Toile retirée à l'atelier",
        city: '',
        postalCode: '',
        country: 'FR',
      },
    });
  } catch (error) {
    console.error('Cannot send confirmation email:', error);
  }

  // Notification Guillaume
  try {
    const { sendTestEmail } = await import('@/lib/resend-client');
    await sendTestEmail('contact@guillaumefarre.com');
  } catch (error) {
    console.error('Cannot send notification to Guillaume:', error);
  }

  // Canvas invoice paid — no-op in production
}
