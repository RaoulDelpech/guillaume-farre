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
  locale?: 'fr' | 'en' | 'it';
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
  locale = 'fr',
}: ShippingNotificationEmailProps) {
  const t = {
    fr: {
      subtitle: 'Artiste Sculpteur · Fine Art',
      emoji: '📦',
      heading: 'Votre œuvre est en route !',
      hello: 'Bonjour',
      intro: 'Excellente nouvelle : votre commande a été expédiée et est actuellement en chemin vers vous.',
      trackingTitle: 'Informations de suivi',
      order: 'Commande',
      carrier: 'Transporteur',
      trackingNumber: 'Numéro de suivi',
      estimatedDelivery: 'Livraison estimée',
      trackButton: 'Suivre mon colis en temps réel',
      orderLink: 'Voir le statut de ma commande',
      itemsTitle: 'Contenu du colis',
      format: 'Format',
      infoTitle: 'Conseils de réception',
      infoText: '• Vérifiez l\'emballage à la réception (avant signature)\n• En cas de dommage visible, refusez le colis\n• Conservez l\'emballage 48h pour toute réclamation\n• Votre œuvre est assurée pendant le transport',
      question: 'Vous avez une question sur votre livraison ?',
      contactText: 'Contactez-moi à',
      orderNumberText: 'En indiquant votre numéro de commande :',
      footer: '© 2025 Guillaume Farré - Artiste Sculpteur',
    },
    en: {
      subtitle: 'Sculptor Artist · Fine Art',
      emoji: '📦',
      heading: 'Your artwork is on its way!',
      hello: 'Hello',
      intro: 'Great news: your order has been shipped and is currently on its way to you.',
      trackingTitle: 'Tracking information',
      order: 'Order',
      carrier: 'Carrier',
      trackingNumber: 'Tracking number',
      estimatedDelivery: 'Estimated delivery',
      trackButton: 'Track my package in real time',
      orderLink: 'View my order status',
      itemsTitle: 'Package contents',
      format: 'Format',
      infoTitle: 'Delivery tips',
      infoText: '• Check the packaging upon receipt (before signing)\n• In case of visible damage, refuse the package\n• Keep the packaging for 48h for any claim\n• Your artwork is insured during transport',
      question: 'Do you have a question about your delivery?',
      contactText: 'Contact me at',
      orderNumberText: 'Indicating your order number:',
      footer: '© 2025 Guillaume Farré - Sculptor Artist',
    },
    it: {
      subtitle: 'Artista Scultore · Fine Art',
      emoji: '📦',
      heading: 'La tua opera è in viaggio!',
      hello: 'Ciao',
      intro: 'Ottima notizia: il tuo ordine è stato spedito ed è attualmente in viaggio verso di te.',
      trackingTitle: 'Informazioni di tracciamento',
      order: 'Ordine',
      carrier: 'Corriere',
      trackingNumber: 'Numero di tracciamento',
      estimatedDelivery: 'Consegna stimata',
      trackButton: 'Traccia il mio pacco in tempo reale',
      orderLink: 'Visualizza lo stato del mio ordine',
      itemsTitle: 'Contenuto del pacco',
      format: 'Formato',
      infoTitle: 'Consigli per la ricezione',
      infoText: '• Controlla l\'imballaggio al ricevimento (prima della firma)\n• In caso di danni visibili, rifiuta il pacco\n• Conserva l\'imballaggio per 48 ore per eventuali reclami\n• La tua opera è assicurata durante il trasporto',
      question: 'Hai domande sulla tua consegna?',
      contactText: 'Contattami a',
      orderNumberText: 'Indicando il tuo numero d\'ordine:',
      footer: '© 2025 Guillaume Farré - Artista Scultore',
    },
  }[locale];

  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.title}>Guillaume Farré</Heading>
            <Text style={styles.subtitle}>{t.subtitle}</Text>
          </Section>

          {/* Main Content */}
          <Section style={styles.main}>
            <Text style={styles.emoji}>{t.emoji}</Text>

            <Heading style={styles.heading}>
              {t.heading}
            </Heading>

            <Text style={styles.text}>{t.hello} {customerName},</Text>

            <Text style={styles.text}>
              {t.intro}
            </Text>

            {/* Tracking Box */}
            <Section style={styles.trackingBox}>
              <Text style={styles.trackingTitle}>{t.trackingTitle}</Text>

              <Text style={styles.trackingLabel}>{t.order}</Text>
              <Text style={styles.trackingValue}>{orderNumber}</Text>

              <Text style={styles.trackingLabel}>{t.carrier}</Text>
              <Text style={styles.trackingValue}>{carrier}</Text>

              <Text style={styles.trackingLabel}>{t.trackingNumber}</Text>
              <Text style={styles.trackingValueBold}>{trackingNumber}</Text>

              {estimatedDelivery && (
                <>
                  <Text style={styles.trackingLabel}>{t.estimatedDelivery}</Text>
                  <Text style={styles.trackingValue}>{estimatedDelivery}</Text>
                </>
              )}

              <Hr style={styles.divider} />

              <Button href={trackingUrl} style={styles.trackingButton}>
                {t.trackButton}
              </Button>

              <Text style={styles.trackingSecondary}>
                <a href={`https://guillaumefarre.com/${locale}/commande?order=${orderNumber}`} style={styles.linkSecondary}>
                  {t.orderLink}
                </a>
              </Text>
            </Section>

            {/* Items Summary */}
            <Section style={styles.itemsBox}>
              <Text style={styles.itemsTitle}>{t.itemsTitle}</Text>
              {items.map((item, index) => (
                <div key={index} style={styles.item}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDetails}>
                    {t.format} {item.format} · {item.frame}
                  </Text>
                </div>
              ))}
            </Section>

            {/* Delivery Instructions */}
            <Section style={styles.infoBox}>
              <Text style={styles.infoTitle}>{t.infoTitle}</Text>
              <Text style={styles.infoText}>
                {t.infoText.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </Text>
            </Section>

            {/* Footer */}
            <Section style={styles.footer}>
              <Text style={styles.footerText}>
                {t.question}
              </Text>
              <Text style={styles.footerSmall}>
                {t.contactText}{' '}
                <a href="mailto:contact@guillaumefarre.com" style={styles.link}>
                  contact@guillaumefarre.com
                </a>
                <br />
                {t.orderNumberText} {orderNumber}
              </Text>

              <Hr style={styles.divider} />

              <Text style={styles.footerTiny}>
                {t.footer}
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
