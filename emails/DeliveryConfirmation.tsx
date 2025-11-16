/**
 * Email confirmation de livraison
 * Envoyé quand Gelato webhook order.delivered est reçu
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

interface DeliveryConfirmationEmailProps {
  customerName: string;
  orderNumber: string;
  items: {
    title: string;
    format: string;
    frame: string;
  }[];
}

export default function DeliveryConfirmationEmail({
  customerName = 'Client',
  orderNumber = 'GF-2025-001',
  items = [
    {
      title: 'Ferrari Noir Atelier',
      format: 'A3',
      frame: 'Cadre noir',
    },
  ],
}: DeliveryConfirmationEmailProps) {
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
            <Text style={styles.emoji}>🎉</Text>

            <Heading style={styles.heading}>
              Votre œuvre est arrivée !
            </Heading>

            <Text style={styles.text}>Bonjour {customerName},</Text>

            <Text style={styles.text}>
              Excellente nouvelle : votre commande a été livrée avec succès.
              Nous espérons que votre œuvre d'art vous plaît et trouvera une
              place de choix dans votre intérieur.
            </Text>

            {/* Order Summary */}
            <Section style={styles.orderBox}>
              <Text style={styles.orderTitle}>Votre commande</Text>
              <Text style={styles.orderNumber}>
                N° {orderNumber}
              </Text>

              <Hr style={styles.divider} />

              {items.map((item, index) => (
                <div key={index} style={styles.item}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDetails}>
                    Format {item.format} · {item.frame}
                  </Text>
                </div>
              ))}
            </Section>

            {/* Care Instructions */}
            <Section style={styles.careBox}>
              <Text style={styles.careTitle}>Conseils de conservation</Text>
              <Text style={styles.careText}>
                <strong>Votre tirage Fine Art Giclee</strong> est imprimé sur
                papier archival 300g/m² garanti 100 ans. Pour préserver sa
                qualité :
              </Text>
              <Text style={styles.careList}>
                • Évitez l'exposition directe au soleil
                <br />
                • Maintenez une humidité entre 40-60%
                <br />
                • Nettoyez avec un chiffon doux et sec
                <br />• Conservation garantie 100 ans dans ces conditions
              </Text>
            </Section>

            {/* Satisfaction Check */}
            <Section style={styles.satisfactionBox}>
              <Text style={styles.satisfactionTitle}>
                Nous aimerions votre avis
              </Text>
              <Text style={styles.satisfactionText}>
                Votre satisfaction est notre priorité. Prenez quelques instants
                pour partager votre expérience :
              </Text>

              <div style={styles.buttonGroup}>
                <Button
                  href="https://guillaumefarre.com/avis?rating=5"
                  style={styles.buttonPositive}
                >
                  ⭐ Très satisfait
                </Button>
                <Button
                  href={`mailto:contact@guillaumefarre.com?subject=Commande ${orderNumber}`}
                  style={styles.buttonNeutral}
                >
                  📧 Signaler un problème
                </Button>
              </div>
            </Section>

            {/* Share */}
            <Section style={styles.shareBox}>
              <Text style={styles.shareTitle}>Partagez votre nouvelle œuvre</Text>
              <Text style={styles.shareText}>
                Taguez-nous sur Instagram{' '}
                <a href="https://instagram.com/guillaumefarre.artist" style={styles.link}>
                  @guillaumefarre.artist
                </a>
                <br />
                pour être reposté sur notre galerie !
              </Text>
            </Section>

            {/* Next Purchase Incentive */}
            <Section style={styles.ctaBox}>
              <Text style={styles.ctaTitle}>Découvrez nos autres créations</Text>
              <Text style={styles.ctaText}>
                Explorez notre collection complète de photographies d'art et
                trouvez votre prochaine pièce favorite.
              </Text>
              <Button
                href="https://guillaumefarre.com/boutique"
                style={styles.ctaButton}
              >
                Voir la boutique
              </Button>
            </Section>

            {/* Footer */}
            <Section style={styles.footer}>
              <Text style={styles.footerText}>
                <strong>Besoin d'aide ?</strong>
              </Text>
              <Text style={styles.footerSmall}>
                Contactez-nous à{' '}
                <a href="mailto:contact@guillaumefarre.com" style={styles.link}>
                  contact@guillaumefarre.com
                </a>
                <br />
                Nous sommes là pour vous accompagner.
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
  orderBox: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #eeeeee',
    borderRadius: '6px',
    padding: '20px',
    margin: '30px 0',
  },
  orderTitle: {
    color: '#333333',
    fontSize: '14px',
    fontWeight: '500',
    margin: '0 0 5px',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  orderNumber: {
    color: '#666666',
    fontSize: '13px',
    margin: '0 0 15px',
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
  careBox: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #86efac',
    borderRadius: '6px',
    padding: '20px',
    margin: '20px 0',
  },
  careTitle: {
    color: '#15803d',
    fontSize: '15px',
    fontWeight: '600',
    margin: '0 0 10px',
  },
  careText: {
    color: '#166534',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '0 0 10px',
  },
  careList: {
    color: '#166534',
    fontSize: '13px',
    lineHeight: '1.8',
    margin: '0',
  },
  satisfactionBox: {
    backgroundColor: '#fef3c7',
    border: '1px solid #fbbf24',
    borderRadius: '6px',
    padding: '25px',
    margin: '30px 0',
    textAlign: 'center' as const,
  },
  satisfactionTitle: {
    color: '#92400e',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 10px',
  },
  satisfactionText: {
    color: '#78350f',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '0 0 20px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexDirection: 'column' as const,
  },
  buttonPositive: {
    backgroundColor: '#22c55e',
    color: '#ffffff',
    padding: '12px 25px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
    display: 'inline-block',
    margin: '5px 0',
  },
  buttonNeutral: {
    backgroundColor: '#6b7280',
    color: '#ffffff',
    padding: '12px 25px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
    display: 'inline-block',
    margin: '5px 0',
  },
  shareBox: {
    textAlign: 'center' as const,
    margin: '30px 0',
    padding: '20px',
    backgroundColor: '#fafafa',
    borderRadius: '6px',
  },
  shareTitle: {
    color: '#333333',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 10px',
  },
  shareText: {
    color: '#666666',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '0',
  },
  ctaBox: {
    textAlign: 'center' as const,
    margin: '30px 0',
    padding: '25px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
  },
  ctaTitle: {
    color: '#111827',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 10px',
  },
  ctaText: {
    color: '#4b5563',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '0 0 20px',
  },
  ctaButton: {
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: '14px 35px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
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
    color: '#3b82f6',
    textDecoration: 'underline',
  },
};

// Lalou
