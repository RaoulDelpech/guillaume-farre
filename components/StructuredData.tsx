/**
 * Structured Data (JSON-LD) pour SEO
 * Schema.org markup pour Organisation, WebSite, et Products
 *
 * @author Lalou
 */

import { safeJsonLd } from '@/lib/safe-json-ld';

interface ProductData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  price?: number;
  inStock?: boolean;
}

interface StructuredDataProps {
  type?: 'organization' | 'website' | 'product';
  data?: ProductData;
}

export default function StructuredData({ type = 'organization', data }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://guillaumefarre.com';

  // Schema.org Organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Guillaume Farré',
    url: baseUrl,
    logo: `${baseUrl}/favicon.svg`,
    description: 'Guillaume Farré — artiste créateur de toiles abstraites réalisées par le passage direct de la Dino sur toile vierge. Photographies d\'art en éditions limitées.',
    founder: {
      '@type': 'Person',
      name: 'Guillaume Farré',
      jobTitle: 'Artiste',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contact@guillaumefarre.com',
      availableLanguage: ['French', 'English', 'Italian'],
    },
    sameAs: [
      'https://www.instagram.com/el_infernale_guigui',
    ],
  };

  // Schema.org WebSite
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Guillaume Farré',
    url: baseUrl,
    description: 'Site officiel de Guillaume Farré — toiles abstraites et photographies d\'art en éditions limitées',
    inLanguage: ['fr', 'en', 'it'],
  };

  // Schema.org Product (pour photos)
  const productSchema = data ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.title || 'Photographie d\'art',
    description: data.description || 'Photographie d\'art — tirage numéroté et signé',
    image: `${baseUrl}${data.image}`,
    brand: {
      '@type': 'Brand',
      name: 'Guillaume Farré',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}${data.url}`,
      priceCurrency: 'EUR',
      price: data.price || 0,
      availability: data.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
    },
    category: 'Art Photography',
  } : null;

  const schema = type === 'website' ? websiteSchema :
                 type === 'product' && productSchema ? productSchema :
                 organizationSchema;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeJsonLd(schema),
      }}
    />
  );
}

// Lalou
