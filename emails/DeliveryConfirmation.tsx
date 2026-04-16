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
  locale?: 'fr' | 'en' | 'it';
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
  locale = 'fr',
}: DeliveryConfirmationEmailProps) {
  const t = {
    fr: {
      subtitle: 'Artiste Sculpteur · Fine Art',
      emoji: '🎉',
      heading: 'Votre œuvre est arrivée !',
      hello: 'Bonjour',
      intro: 'Excellente nouvelle : votre commande a été livrée avec succès. Nous espérons que votre œuvre d\'art vous plaît et trouvera une place de choix dans votre intérieur.',
      orderTitle: 'Votre commande',
      orderNumber: 'N°',
      format: 'Format',
      careTitle: 'Conseils de conservation',
      careIntro: 'Votre tirage Fine Art Giclee est imprimé sur papier archival 300g/m² garanti 100 ans. Pour préserver sa qualité :',
      careItems: '• Évitez l\'exposition directe au soleil\n• Maintenez une humidité entre 40-60%\n• Nettoyez avec un chiffon doux et sec\n• Conservation garantie 100 ans dans ces conditions',
      satisfactionTitle: 'Nous aimerions votre avis',
      satisfactionText: 'Votre satisfaction est notre priorité. Prenez quelques instants pour partager votre expérience :',
      ratingButton: '⭐ Très satisfait',
      problemButton: '📧 Signaler un problème',
      shareTitle: 'Partagez votre nouvelle œuvre',
      shareText: 'Taguez-nous sur Instagram @guillaume_farre pour être reposté sur notre galerie !',
      ctaTitle: 'Découvrez nos autres créations',
      ctaText: 'Explorez notre collection complète de photographies d\'art et trouvez votre prochaine pièce favorite.',
      ctaButton: 'Voir la boutique',
      helpTitle: 'Besoin d\'aide ?',
      helpText: 'Contactez-moi à',
      helpExtra: 'Nous sommes là pour vous accompagner.',
      footer: '© 2025 Guillaume Farré - Artiste Sculpteur',
    },
    en: {
      subtitle: 'Sculptor Artist · Fine Art',
      emoji: '🎉',
      heading: 'Your artwork has arrived!',
      hello: 'Hello',
      intro: 'Great news: your order has been successfully delivered. We hope you enjoy your artwork and that it will find a place of honor in your home.',
      orderTitle: 'Your order',
      orderNumber: 'No.',
      format: 'Format',
      careTitle: 'Care instructions',
      careIntro: 'Your Fine Art Giclee print is printed on archival 300g/m² paper guaranteed for 100 years. To preserve its quality:',
      careItems: '• Avoid direct sunlight exposure\n• Maintain humidity between 40-60%\n• Clean with a soft, dry cloth\n• 100-year preservation guaranteed under these conditions',
      satisfactionTitle: 'We\'d love your feedback',
      satisfactionText: 'Your satisfaction is our priority. Take a few moments to share your experience:',
      ratingButton: '⭐ Very satisfied',
      problemButton: '📧 Report an issue',
      shareTitle: 'Share your new artwork',
      shareText: 'Tag us on Instagram @guillaume_farre to be reposted in our gallery!',
      ctaTitle: 'Discover our other creations',
      ctaText: 'Explore our complete collection of fine art photography and find your next favorite piece.',
      ctaButton: 'View the shop',
      helpTitle: 'Need help?',
      helpText: 'Contact me at',
      helpExtra: 'We\'re here to support you.',
      footer: '© 2025 Guillaume Farré - Sculptor Artist',
    },
    it: {
      subtitle: 'Artista Scultore · Fine Art',
      emoji: '🎉',
      heading: 'La tua opera è arrivata!',
      hello: 'Ciao',
      intro: 'Ottima notizia: il tuo ordine è stato consegnato con successo. Speriamo che la tua opera d\'arte ti piaccia e trovi un posto d\'onore nella tua casa.',
      orderTitle: 'Il tuo ordine',
      orderNumber: 'N.',
      format: 'Formato',
      careTitle: 'Consigli per la conservazione',
      careIntro: 'La tua stampa Fine Art Giclee è stampata su carta archival 300g/m² garantita per 100 anni. Per preservarne la qualità:',
      careItems: '• Evita l\'esposizione diretta al sole\n• Mantieni un\'umidità tra il 40-60%\n• Pulisci con un panno morbido e asciutto\n• Conservazione garantita per 100 anni in queste condizioni',
      satisfactionTitle: 'Ci piacerebbe avere il tuo feedback',
      satisfactionText: 'La tua soddisfazione è la nostra priorità. Dedica qualche istante a condividere la tua esperienza:',
      ratingButton: '⭐ Molto soddisfatto',
      problemButton: '📧 Segnala un problema',
      shareTitle: 'Condividi la tua nuova opera',
      shareText: 'Taggaci su Instagram @guillaume_farre per essere ripubblicato nella nostra galleria!',
      ctaTitle: 'Scopri le nostre altre creazioni',
      ctaText: 'Esplora la nostra collezione completa di fotografia d\'arte e trova il tuo prossimo pezzo preferito.',
      ctaButton: 'Visualizza il negozio',
      helpTitle: 'Hai bisogno di aiuto?',
      helpText: 'Contattami a',
      helpExtra: 'Siamo qui per supportarti.',
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

            {/* Order Summary */}
            <Section style={styles.orderBox}>
              <Text style={styles.orderTitle}>{t.orderTitle}</Text>
              <Text style={styles.orderNumber}>
                {t.orderNumber} {orderNumber}
              </Text>

              <Hr style={styles.divider} />

              {items.map((item, index) => (
                <div key={index} style={styles.item}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDetails}>
                    {t.format} {item.format} · {item.frame}
                  </Text>
                </div>
              ))}
            </Section>

            {/* Care Instructions */}
            <Section style={styles.careBox}>
              <Text style={styles.careTitle}>{t.careTitle}</Text>
              <Text style={styles.careText}>
                <strong>{t.careIntro}</strong>
              </Text>
              <Text style={styles.careList}>
                {t.careItems.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </Text>
            </Section>

            {/* Satisfaction Check */}
            <Section style={styles.satisfactionBox}>
              <Text style={styles.satisfactionTitle}>
                {t.satisfactionTitle}
              </Text>
              <Text style={styles.satisfactionText}>
                {t.satisfactionText}
              </Text>

              <div style={styles.buttonGroup}>
                <Button
                  href={`https://guillaumefarre.com/${locale}/avis?rating=5`}
                  style={styles.buttonPositive}
                >
                  {t.ratingButton}
                </Button>
                <Button
                  href={`mailto:contact@guillaumefarre.com?subject=${orderNumber}`}
                  style={styles.buttonNeutral}
                >
                  {t.problemButton}
                </Button>
              </div>
            </Section>

            {/* Share */}
            <Section style={styles.shareBox}>
              <Text style={styles.shareTitle}>{t.shareTitle}</Text>
              <Text style={styles.shareText}>
                {t.shareText.includes('@') ? (
                  <>
                    {t.shareText.split('@')[0]}
                    <a href="https://instagram.com/guillaume_farre" style={styles.link}>
                      @guillaume_farre
                    </a>
                    {t.shareText.split('@guillaume_farre')[1]}
                  </>
                ) : (
                  t.shareText
                )}
              </Text>
            </Section>

            {/* Next Purchase Incentive */}
            <Section style={styles.ctaBox}>
              <Text style={styles.ctaTitle}>{t.ctaTitle}</Text>
              <Text style={styles.ctaText}>
                {t.ctaText}
              </Text>
              <Button
                href={`https://guillaumefarre.com/${locale}/galerie`}
                style={styles.ctaButton}
              >
                {t.ctaButton}
              </Button>
            </Section>

            {/* Footer */}
            <Section style={styles.footer}>
              <Text style={styles.footerText}>
                <strong>{t.helpTitle}</strong>
              </Text>
              <Text style={styles.footerSmall}>
                {t.helpText}{' '}
                <a href="mailto:contact@guillaumefarre.com" style={styles.link}>
                  contact@guillaumefarre.com
                </a>
                <br />
                {t.helpExtra}
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
