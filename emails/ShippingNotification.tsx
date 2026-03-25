/**
 * Email notification d'expédition
 * Envoyé quand Gelato webhook order.shipped est reçu
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

interface ShippingNotificationEmailProps {
  customerName: string;
  orderNumber: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  estimatedDelivery?: string;
  items: {
    title: string;
    format: string;
    frame: string;
  }[];
}

export default function ShippingNotificationEmail({
  customerName = 'Client',
  orderNumber = 'GF-2025-001',
  carrier = 'Chronopost',
  trackingNumber = '1234567890',
  trackingUrl = 'https://tracking.example.com',
  estimatedDelivery = '2-3 jours',
  items = [
    {
      title: 'Ferrari Noir Atelier',
      format: 'A3',
      frame: 'Cadre noir',
    },
  ],
}: ShippingNotificationEmailProps) {
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
            <Text style={styles.emoji}>📦</Text>

            <Heading style={styles.heading}>
              Votre œuvre est en route !
            </Heading>

            <Text style={styles.text}>Bonjour {customerName},</Text>

            <Text style={styles.text}>
              Excellente nouvelle : votre commande a été expédiée et est
              actuellement en chemin vers vous.
            </Text>

            {/* Tracking Box */}
            <Section style={styles.trackingBox}>
              <Text style={styles.trackingTitle}>Informations de suivi</Text>

              <Text style={styles.trackingLabel}>Commande</Text>
              <Text style={styles.trackingValue}>{orderNumber}</Text>

              <Text style={styles.trackingLabel}>Transporteur</Text>
              <Text style={styles.trackingValue}>{carrier}</Text>

              <Text style={styles.trackingLabel}>Numéro de suivi</Text>
              <Text style={styles.trackingValueBold}>{trackingNumber}</Text>

              {estimatedDelivery && (
                <>
                  <Text style={styles.trackingLabel}>Livraison estimée</Text>
                  <Text style={styles.trackingValue}>{estimatedDelivery}</Text>
                </>
              )}

              <Hr style={styles.divider} />

              <Button href={trackingUrl} style={styles.trackingButton}>
                Suivre mon colis en temps réel
              </Button>

              <Text style={styles.trackingSecondary}>
                <a href={`https://guillaumefarre.com/fr/commande?order=${orderNumber}`} style={styles.linkSecondary}>
                  Voir le statut de ma commande
                </a>
              </Text>
            </Section>

            {/* Items Summary */}
            <Section style={styles.itemsBox}>
              <Text style={styles.itemsTitle}>Contenu du colis</Text>
              {items.map((item, index) => (
                <div key={index} style={styles.item}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDetails}>
                    Format {item.format} · {item.frame}
                  </Text>
                </div>
              ))}
            </Section>

            {/* Delivery Instructions */}
            <Section style={styles.infoBox}>
              <Text style={styles.infoTitle}>Conseils de réception</Text>
              <Text style={styles.infoText}>
                • Vérifiez l'emballage à la réception (avant signature)
                <br />
                • En cas de dommage visible, refusez le colis
                <br />
                • Conservez l'emballage 48h pour toute réclamation
                <br />• Votre œuvre est assurée pendant le transport
              </Text>
            </Section>

            {/* Footer */}
            <Section style={styles.footer}>
              <Text style={styles.footerText}>
                Vous avez une question sur votre livraison ?
              </Text>
              <Text style={styles.footerSmall}>
                Contactez-nous à{' '}
                <a href="mailto:contact@guillaumefarre.com" style={styles.link}>
                  contact@guillaumefarre.com
                </a>
                <br />
                En indiquant votre numéro de commande : {orderNumber}
              </Text>

              <Hr style={styles.divider} />

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
  emoji: {
    fontSize: '48px',
    textAlign: 'center' as const,
    margin: '0 0 20px',
  },
  heading: {
    color: '#333333',
    fontSize: '24px',
    fontWeight: '300',
    margin: '0 0 20px',
    textAlign: 'center' as const,
  },
  text: {
    color: '#555555',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '0 0 15px',
  },
  trackingBox: {
    backgroundColor: '#f0f9ff',
    border: '2px solid #3b82f6',
    borderRadius: '8px',
    padding: '25px',
    margin: '30px 0',
  },
  trackingTitle: {
    color: '#1e40af',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 20px',
    textAlign: 'center' as const,
  },
  trackingLabel: {
    color: '#64748b',
    fontSize: '12px',
    fontWeight: '500',
    margin: '15px 0 5px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  trackingValue: {
    color: '#333333',
    fontSize: '15px',
    margin: '0 0 10px',
  },
  trackingValueBold: {
    color: '#000000',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 10px',
    fontFamily: 'monospace',
  },
  trackingButton: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '14px 30px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    display: 'block',
    textAlign: 'center' as const,
    margin: '20px 0 0',
  },
  itemsBox: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #eeeeee',
    borderRadius: '6px',
    padding: '20px',
    margin: '20px 0',
  },
  itemsTitle: {
    color: '#333333',
    fontSize: '14px',
    fontWeight: '500',
    margin: '0 0 15px',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  item: {
    margin: '10px 0',
  },
  itemTitle: {
    color: '#333333',
    fontSize: '15px',
    fontWeight: '500',
    margin: '0 0 5px',
  },
  itemDetails: {
    color: '#777777',
    fontSize: '13px',
    margin: '0',
  },
  infoBox: {
    backgroundColor: '#fffbeb',
    border: '1px solid #fbbf24',
    borderRadius: '6px',
    padding: '20px',
    margin: '20px 0',
  },
  infoTitle: {
    color: '#92400e',
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 10px',
  },
  infoText: {
    color: '#78350f',
    fontSize: '13px',
    lineHeight: '1.6',
    margin: '0',
  },
  footer: {
    marginTop: '40px',
    textAlign: 'center' as const,
  },
  footerText: {
    color: '#333333',
    fontSize: '15px',
    fontWeight: '500',
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
    color: '#3b82f6',
    textDecoration: 'underline',
  },
  trackingSecondary: {
    textAlign: 'center' as const,
    margin: '15px 0 0',
    fontSize: '14px',
    color: '#666666',
  },
  linkSecondary: {
    color: '#666666',
    textDecoration: 'underline',
  },
};

// Lalou
