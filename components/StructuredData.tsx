/**
 * Structured Data (JSON-LD) pour SEO
 * Schema.org markup : Organisation, WebSite, Product, ArtGallery, BreadcrumbList
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

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface StructuredDataProps {
  type?: 'organization' | 'website' | 'product' | 'gallery' | 'breadcrumb';
  data?: ProductData;
  breadcrumbs?: BreadcrumbItem[];
}

export default function StructuredData({ type = 'organization', data, breadcrumbs }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://guillaumefarre.com';

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
      'https://www.instagram.com/guillaume_farre',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Guillaume Farré',
    url: baseUrl,
    description: 'Site officiel de Guillaume Farré — toiles abstraites et photographies d\'art en éditions limitées',
    inLanguage: ['fr', 'en', 'it'],
  };

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

  const gallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'ArtGallery',
    name: 'Guillaume Farré — Galerie',
    url: `${baseUrl}/fr/galerie`,
    description: 'Galerie de photographies d\'art et toiles abstraites par Guillaume Farré. Ferrari Dino comme outil de création.',
    founder: {
      '@type': 'Person',
      name: 'Guillaume Farré',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
      description: 'Galerie en ligne, accessible 24h/24',
    },
  };

  const breadcrumbSchema = breadcrumbs?.length ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  } : null;

  let schema: unknown;

  switch (type) {
    case 'website':
      schema = websiteSchema;
      break;
    case 'product':
      schema = productSchema || organizationSchema;
      break;
    case 'gallery':
      schema = gallerySchema;
      break;
    case 'breadcrumb':
      schema = breadcrumbSchema || organizationSchema;
      break;
    default:
      schema = organizationSchema;
  }

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
