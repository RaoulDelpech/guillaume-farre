/**
 * Magic Link email template
 * Sent when user requests access to their account
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

interface MagicLinkEmailProps {
  magicLink: string;
  email: string;
}

export default function MagicLinkEmail({
  magicLink = 'https://guillaumefarre.com/fr/compte?token=xxx',
  email = 'client@example.com',
}: MagicLinkEmailProps) {
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
              Votre lien de connexion
            </Heading>

            <Text style={styles.text}>
              Bonjour,
            </Text>

            <Text style={styles.text}>
              Vous avez demandé à accéder à votre espace personnel sur guillaumefarre.com.
            </Text>

            <Text style={styles.text}>
              Cliquez sur le bouton ci-dessous pour vous connecter :
            </Text>

            {/* CTA Button */}
            <Section style={styles.buttonContainer}>
              <Button href={magicLink} style={styles.button}>
                Accéder à mon compte
              </Button>
            </Section>

            {/* Security notice */}
            <Section style={styles.noticeBox}>
              <Text style={styles.noticeText}>
                🔒 <strong>Ce lien expire dans 1 heure</strong>
              </Text>
              <Text style={styles.noticeText}>
                Si vous n'avez pas demandé cet accès, ignorez simplement cet email.
              </Text>
            </Section>

            <Hr style={styles.divider} />

            {/* Footer */}
            <Section style={styles.footer}>
              <Text style={styles.footerText}>
                Vous recevez cet email car une demande d'accès a été faite pour {email}.
              </Text>
              <Text style={styles.footerText}>
                Pour toute question, contactez-nous à{' '}
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

// Styles inline (required for emails)
const styles = {
  body: {
    backgroundColor: '#f6f6f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
    textAlign: 'center' as const,
  },
  text: {
    color: '#555555',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '0 0 15px',
  },
  buttonContainer: {
    textAlign: 'center' as const,
    margin: '35px 0',
  },
  button: {
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: '16px 40px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '400',
    display: 'inline-block',
  },
  noticeBox: {
    backgroundColor: '#f0f7ff',
    border: '1px solid #d0e3ff',
    borderRadius: '8px',
    padding: '20px',
    margin: '25px 0',
  },
  noticeText: {
    color: '#1a56db',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '8px 0',
    textAlign: 'center' as const,
  },
  divider: {
    borderColor: '#eeeeee',
    margin: '30px 0',
  },
  footer: {
    textAlign: 'center' as const,
    marginTop: '20px',
  },
  footerText: {
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
  link: {
    color: '#000000',
    textDecoration: 'underline',
  },
};

// Lalou
