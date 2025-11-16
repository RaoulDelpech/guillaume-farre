/**
 * Email confirmation commande
 * Envoyé immédiatement après paiement Stripe réussi
 *
 * @author Lalou
 */

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
} from '@react-email/components';
import { EmailOrderItem } from '@/lib/resend-client';

interface OrderConfirmationEmailProps {
  customerName: string;
  orderNumber: string;
  items: EmailOrderItem[];
  totalAmount: number;
  shippingAddress: {
    line1: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export default function OrderConfirmationEmail({
  customerName = 'Client',
  orderNumber = 'GF-2025-001',
  items = [
    {
      title: 'Ferrari Noir Atelier',
      format: 'A3',
      frame: 'Cadre noir',
      price: 650,
    },
  ],
  totalAmount = 650,
  shippingAddress = {
    line1: '123 rue Example',
    city: 'Paris',
    postalCode: '75001',
    country: 'France',
  },
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.title}>Guillaume Farré</Heading>
            <Text style={styles.subtitle}>Artiste Sculpteur · Fine Art</Text>
          </Section>

          {/* Main Content */}
          <Section style={styles.main}>
            <Heading style={styles.heading}>
              Merci pour votre commande !
            </Heading>

            <Text style={styles.text}>
              Bonjour {customerName},
            </Text>

            <Text style={styles.text}>
              Votre commande a été confirmée. Nous commençons immédiatement
              l'impression de votre œuvre d'art avec la plus grande attention.
            </Text>

            {/* Order Details */}
            <Section style={styles.orderBox}>
              <Text style={styles.orderNumber}>
                Commande : <strong>{orderNumber}</strong>
              </Text>

              <Hr style={styles.divider} />

              {/* Items */}
              {items.map((item, index) => (
                <div key={index} style={styles.item}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDetails}>
                    Format {item.format} · {item.frame}
                  </Text>
                  <Text style={styles.itemPrice}>{item.price}€</Text>
                </div>
              ))}

              <Hr style={styles.divider} />

              {/* Total */}
              <div style={styles.total}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>{totalAmount}€</Text>
              </div>
            </Section>

            {/* Shipping Address */}
            <Section style={styles.addressBox}>
              <Text style={styles.addressTitle}>Adresse de livraison</Text>
              <Text style={styles.addressText}>
                {shippingAddress.line1}
                <br />
                {shippingAddress.postalCode} {shippingAddress.city}
                <br />
                {shippingAddress.country}
              </Text>
            </Section>

            {/* Timeline */}
            <Section style={styles.timeline}>
              <Text style={styles.timelineTitle}>Prochaines étapes</Text>
              <Text style={styles.timelineStep}>
                ✅ <strong>Paiement reçu</strong> - Aujourd'hui
              </Text>
              <Text style={styles.timelineStep}>
                🖨️ <strong>Impression Fine Art</strong> - 2-3 jours
              </Text>
              <Text style={styles.timelineStep}>
                📦 <strong>Expédition sécurisée</strong> - 1 semaine
              </Text>
              <Text style={styles.timelineStep}>
                🎨 <strong>Livraison chez vous</strong> - 2-3 semaines
              </Text>
            </Section>

            {/* CTA */}
            <Section style={styles.cta}>
              <Button
                href="https://guillaumefarre.com/boutique"
                style={styles.button}
              >
                Continuer mes achats
              </Button>
            </Section>

            {/* Footer Info */}
            <Section style={styles.footer}>
              <Text style={styles.footerText}>
                <strong>Qualité garantie</strong>
              </Text>
              <Text style={styles.footerSmall}>
                • Tirage numéroté et signé par l'artiste
                <br />
                • Papier Fine Art Giclee 300g/m² - Garantie 100 ans
                <br />
                • Certificat d'authenticité inclus
                <br />• Livraison sécurisée avec tracking
              </Text>

              <Hr style={styles.divider} />

              <Text style={styles.footerSmall}>
                Une question ? Contactez-nous à{' '}
                <a href="mailto:contact@guillaumefarre.com" style={styles.link}>
                  contact@guillaumefarre.com
                </a>
              </Text>

              <Text style={styles.footerTiny}>
                © 2025 Guillaume Farré - Artiste Sculpteur
                <br />
                www.guillaumefarre.com
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles inline (requis pour emails)
const styles = {
  body: {
    backgroundColor: '#f6f6f6',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    margin: 0,
    padding: 0,
  },
  container: {
    margin: '0 auto',
    padding: '20px',
    maxWidth: '600px',
  },
  header: {
    backgroundColor: '#000000',
    padding: '30px 20px',
    textAlign: 'center' as const,
    borderRadius: '8px 8px 0 0',
  },
  title: {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '300',
    margin: '0',
    letterSpacing: '2px',
  },
  subtitle: {
    color: '#cccccc',
    fontSize: '14px',
    fontWeight: '300',
    margin: '10px 0 0',
    letterSpacing: '1px',
  },
  main: {
    backgroundColor: '#ffffff',
    padding: '40px 30px',
    borderRadius: '0 0 8px 8px',
  },
  heading: {
    color: '#333333',
    fontSize: '24px',
    fontWeight: '300',
    margin: '0 0 20px',
  },
  text: {
    color: '#555555',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '0 0 15px',
  },
  orderBox: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #eeeeee',
    borderRadius: '6px',
    padding: '20px',
    margin: '30px 0',
  },
  orderNumber: {
    color: '#333333',
    fontSize: '14px',
    margin: '0 0 15px',
  },
  item: {
    margin: '15px 0',
  },
  itemTitle: {
    color: '#333333',
    fontSize: '16px',
    fontWeight: '500',
    margin: '0 0 5px',
  },
  itemDetails: {
    color: '#777777',
    fontSize: '14px',
    margin: '0',
  },
  itemPrice: {
    color: '#000000',
    fontSize: '16px',
    fontWeight: '500',
    margin: '5px 0 0',
  },
  total: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15px',
  },
  totalLabel: {
    color: '#333333',
    fontSize: '18px',
    fontWeight: '500',
    margin: '0',
  },
  totalAmount: {
    color: '#000000',
    fontSize: '24px',
    fontWeight: '500',
    margin: '0',
  },
  addressBox: {
    margin: '20px 0',
  },
  addressTitle: {
    color: '#333333',
    fontSize: '14px',
    fontWeight: '500',
    margin: '0 0 10px',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  addressText: {
    color: '#555555',
    fontSize: '15px',
    lineHeight: '1.5',
    margin: '0',
  },
  timeline: {
    margin: '30px 0',
  },
  timelineTitle: {
    color: '#333333',
    fontSize: '16px',
    fontWeight: '500',
    margin: '0 0 15px',
  },
  timelineStep: {
    color: '#666666',
    fontSize: '14px',
    lineHeight: '1.8',
    margin: '8px 0',
  },
  cta: {
    textAlign: 'center' as const,
    margin: '30px 0',
  },
  button: {
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: '14px 30px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '400',
    display: 'inline-block',
  },
  footer: {
    marginTop: '40px',
    textAlign: 'center' as const,
  },
  footerText: {
    color: '#333333',
    fontSize: '15px',
    margin: '0 0 10px',
  },
  footerSmall: {
    color: '#777777',
    fontSize: '13px',
    lineHeight: '1.6',
    margin: '10px 0',
  },
  footerTiny: {
    color: '#999999',
    fontSize: '11px',
    lineHeight: '1.5',
    margin: '20px 0 0',
  },
  divider: {
    borderColor: '#eeeeee',
    margin: '20px 0',
  },
  link: {
    color: '#000000',
    textDecoration: 'underline',
  },
};

// Lalou
