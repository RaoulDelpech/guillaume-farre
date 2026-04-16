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
  isEarlyCollector?: boolean;
  locale?: 'fr' | 'en' | 'it';
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
  isEarlyCollector = false,
  locale = 'fr',
}: OrderConfirmationEmailProps) {
  const t = {
    fr: {
      subtitle: 'Artiste Sculpteur · Fine Art',
      heading: 'Merci pour votre commande !',
      hello: 'Bonjour',
      intro: 'Votre commande a été confirmée. Nous commençons immédiatement l\'impression de votre œuvre d\'art avec la plus grande attention.',
      order: 'Commande',
      format: 'Format',
      total: 'Total',
      shippingTitle: 'Adresse de livraison',
      vipTitle: '🎭 Votre invitation VIP',
      vipText1: 'En tant qu\'Early Collector, vous serez convié en tant qu\'hôte d\'honneur à la première exposition de Guillaume Farré.',
      vipText2: 'Nous vous contacterons dès que les détails seront annoncés.',
      timelineTitle: 'Prochaines étapes',
      timelinePayment: 'Paiement reçu',
      timelineToday: 'Aujourd\'hui',
      timelinePrinting: 'Impression Fine Art',
      timelinePrintingDuration: '2-3 jours',
      timelineShipping: 'Expédition sécurisée',
      timelineShippingDuration: '1 semaine',
      timelineDelivery: 'Livraison chez vous',
      timelineDeliveryDuration: '2-3 semaines',
      trackButton: 'Suivre ma commande',
      shopLink: 'Continuer mes achats',
      certificateTitle: '📜 Certificat d\'authenticité',
      certificateText1: 'Votre certificat d\'authenticité est disponible au téléchargement depuis votre page de suivi de commande.',
      certificateText2: 'Ce document officiel, signé par l\'artiste, atteste de l\'authenticité et de l\'édition limitée de votre œuvre.',
      qualityTitle: 'Qualité garantie',
      qualityItem1: 'Tirage numéroté et signé par l\'artiste',
      qualityItem2: 'Papier Fine Art Giclee 300g/m² - Garantie 100 ans',
      qualityItem3: 'Certificat d\'authenticité inclus',
      qualityItem4: 'Livraison sécurisée avec tracking',
      question: 'Une question ? Contactez-moi à',
      footer: '© 2025 Guillaume Farré - Artiste Sculpteur',
    },
    en: {
      subtitle: 'Sculptor Artist · Fine Art',
      heading: 'Thank you for your order!',
      hello: 'Hello',
      intro: 'Your order has been confirmed. We are immediately starting the printing of your artwork with the utmost care.',
      order: 'Order',
      format: 'Format',
      total: 'Total',
      shippingTitle: 'Shipping address',
      vipTitle: '🎭 Your VIP invitation',
      vipText1: 'As an Early Collector, you will be invited as a guest of honor to Guillaume Farré\'s first exhibition.',
      vipText2: 'We will contact you as soon as the details are announced.',
      timelineTitle: 'Next steps',
      timelinePayment: 'Payment received',
      timelineToday: 'Today',
      timelinePrinting: 'Fine Art printing',
      timelinePrintingDuration: '2-3 days',
      timelineShipping: 'Secure shipping',
      timelineShippingDuration: '1 week',
      timelineDelivery: 'Delivery to you',
      timelineDeliveryDuration: '2-3 weeks',
      trackButton: 'Track my order',
      shopLink: 'Continue shopping',
      certificateTitle: '📜 Certificate of authenticity',
      certificateText1: 'Your certificate of authenticity is available for download from your order tracking page.',
      certificateText2: 'This official document, signed by the artist, certifies the authenticity and limited edition of your artwork.',
      qualityTitle: 'Guaranteed quality',
      qualityItem1: 'Numbered and signed by the artist',
      qualityItem2: 'Fine Art Giclee paper 300g/m² - 100 year guarantee',
      qualityItem3: 'Certificate of authenticity included',
      qualityItem4: 'Secure delivery with tracking',
      question: 'Any questions? Contact me at',
      footer: '© 2025 Guillaume Farré - Sculptor Artist',
    },
    it: {
      subtitle: 'Artista Scultore · Fine Art',
      heading: 'Grazie per il tuo ordine!',
      hello: 'Ciao',
      intro: 'Il tuo ordine è stato confermato. Iniziamo immediatamente la stampa della tua opera d\'arte con la massima attenzione.',
      order: 'Ordine',
      format: 'Formato',
      total: 'Totale',
      shippingTitle: 'Indirizzo di spedizione',
      vipTitle: '🎭 Il tuo invito VIP',
      vipText1: 'In qualità di Early Collector, sarai invitato come ospite d\'onore alla prima mostra di Guillaume Farré.',
      vipText2: 'Ti contatteremo non appena verranno annunciati i dettagli.',
      timelineTitle: 'Prossimi passi',
      timelinePayment: 'Pagamento ricevuto',
      timelineToday: 'Oggi',
      timelinePrinting: 'Stampa Fine Art',
      timelinePrintingDuration: '2-3 giorni',
      timelineShipping: 'Spedizione sicura',
      timelineShippingDuration: '1 settimana',
      timelineDelivery: 'Consegna a casa tua',
      timelineDeliveryDuration: '2-3 settimane',
      trackButton: 'Traccia il mio ordine',
      shopLink: 'Continua a fare acquisti',
      certificateTitle: '📜 Certificato di autenticità',
      certificateText1: 'Il certificato di autenticità è disponibile per il download dalla pagina di tracciamento dell\'ordine.',
      certificateText2: 'Questo documento ufficiale, firmato dall\'artista, certifica l\'autenticità e l\'edizione limitata della tua opera.',
      qualityTitle: 'Qualità garantita',
      qualityItem1: 'Numerato e firmato dall\'artista',
      qualityItem2: 'Carta Fine Art Giclee 300g/m² - Garanzia 100 anni',
      qualityItem3: 'Certificato di autenticità incluso',
      qualityItem4: 'Consegna sicura con tracciamento',
      question: 'Hai domande? Contattami a',
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
            <Heading style={styles.heading}>
              {t.heading}
            </Heading>

            <Text style={styles.text}>
              {t.hello} {customerName},
            </Text>

            <Text style={styles.text}>
              {t.intro}
            </Text>

            {/* Order Details */}
            <Section style={styles.orderBox}>
              <Text style={styles.orderNumber}>
                {t.order} : <strong>{orderNumber}</strong>
              </Text>

              <Hr style={styles.divider} />

              {/* Items */}
              {items.map((item, index) => (
                <div key={index} style={styles.item}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDetails}>
                    {t.format} {item.format} · {item.frame}
                  </Text>
                  <Text style={styles.itemPrice}>{item.price}€</Text>
                </div>
              ))}

              <Hr style={styles.divider} />

              {/* Total */}
              <div style={styles.total}>
                <Text style={styles.totalLabel}>{t.total}</Text>
                <Text style={styles.totalAmount}>{totalAmount}€</Text>
              </div>
            </Section>

            {/* Shipping Address */}
            <Section style={styles.addressBox}>
              <Text style={styles.addressTitle}>{t.shippingTitle}</Text>
              <Text style={styles.addressText}>
                {shippingAddress.line1}
                <br />
                {shippingAddress.postalCode} {shippingAddress.city}
                <br />
                {shippingAddress.country}
              </Text>
            </Section>

            {/* Early Collector VIP Invitation */}
            {isEarlyCollector && (
              <Section style={styles.vipBox}>
                <Text style={styles.vipTitle}>{t.vipTitle}</Text>
                <Text style={styles.vipText}>
                  {t.vipText1}
                </Text>
                <Text style={styles.vipText}>
                  {t.vipText2}
                </Text>
              </Section>
            )}

            {/* Timeline */}
            <Section style={styles.timeline}>
              <Text style={styles.timelineTitle}>{t.timelineTitle}</Text>
              <Text style={styles.timelineStep}>
                ✅ <strong>{t.timelinePayment}</strong> - {t.timelineToday}
              </Text>
              <Text style={styles.timelineStep}>
                🖨️ <strong>{t.timelinePrinting}</strong> - {t.timelinePrintingDuration}
              </Text>
              <Text style={styles.timelineStep}>
                📦 <strong>{t.timelineShipping}</strong> - {t.timelineShippingDuration}
              </Text>
              <Text style={styles.timelineStep}>
                🎨 <strong>{t.timelineDelivery}</strong> - {t.timelineDeliveryDuration}
              </Text>
            </Section>

            {/* CTA */}
            <Section style={styles.cta}>
              <Button
                href={`https://guillaumefarre.com/${locale}/commande?order=${orderNumber}`}
                style={styles.button}
              >
                {t.trackButton}
              </Button>
              <Text style={styles.ctaSecondary}>
                <a href={`https://guillaumefarre.com/${locale}/galerie`} style={styles.linkSecondary}>
                  {t.shopLink}
                </a>
              </Text>
            </Section>

            {/* Certificat d'authenticité */}
            <Section style={styles.certificateBox}>
              <Text style={styles.certificateTitle}>
                {t.certificateTitle}
              </Text>
              <Text style={styles.certificateText}>
                {t.certificateText1}
              </Text>
              <Text style={styles.certificateText}>
                {t.certificateText2}
              </Text>
            </Section>

            {/* Footer Info */}
            <Section style={styles.footer}>
              <Text style={styles.footerText}>
                <strong>{t.qualityTitle}</strong>
              </Text>
              <Text style={styles.footerSmall}>
                • {t.qualityItem1}
                <br />
                • {t.qualityItem2}
                <br />
                • {t.qualityItem3}
                <br />• {t.qualityItem4}
              </Text>

              <Hr style={styles.divider} />

              <Text style={styles.footerSmall}>
                {t.question}{' '}
                <a href="mailto:contact@guillaumefarre.com" style={styles.link}>
                  contact@guillaumefarre.com
                </a>
              </Text>

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
  vipBox: {
    backgroundColor: '#fef3c7',
    border: '2px solid #fbbf24',
    borderRadius: '8px',
    padding: '25px',
    margin: '30px 0',
  },
  vipTitle: {
    color: '#92400e',
    fontSize: '18px',
    fontWeight: '500',
    margin: '0 0 15px',
    textAlign: 'center' as const,
  },
  vipText: {
    color: '#78350f',
    fontSize: '15px',
    lineHeight: '1.6',
    margin: '10px 0',
    textAlign: 'center' as const,
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
  ctaSecondary: {
    textAlign: 'center' as const,
    margin: '15px 0 0',
    fontSize: '14px',
    color: '#666666',
  },
  linkSecondary: {
    color: '#666666',
    textDecoration: 'underline',
  },
  certificateBox: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '25px',
    margin: '30px 0',
  },
  certificateTitle: {
    color: '#333333',
    fontSize: '16px',
    fontWeight: '500',
    margin: '0 0 15px',
    textAlign: 'center' as const,
  },
  certificateText: {
    color: '#555555',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '10px 0',
    textAlign: 'center' as const,
  },
};

// Lalou
