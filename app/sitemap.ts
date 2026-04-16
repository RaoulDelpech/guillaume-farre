import { MetadataRoute } from 'next';
import photos from '@/data/photos.json';

/**
 * Sitemap.xml pour Google Search Console
 * Pages publiques en FR/EN/IT + pages produit avec images
 *
 * @author Lalou
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://guillaumefarre.com';

  const locales = ['fr', 'en', 'it'];

  const pages: { path: string; changeFrequency: 'daily' | 'weekly' | 'monthly'; priority: number }[] = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/galerie', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/toiles', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/faq', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/cgv', changeFrequency: 'monthly', priority: 0.3 },
    { path: '/mentions-legales', changeFrequency: 'monthly', priority: 0.3 },
    { path: '/politique-de-confidentialite', changeFrequency: 'monthly', priority: 0.3 },
    { path: '/retours-echanges', changeFrequency: 'monthly', priority: 0.3 },
  ];

  const urls: MetadataRoute.Sitemap = [];

  // Static pages
  for (const page of pages) {
    for (const locale of locales) {
      urls.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            fr: `${baseUrl}/fr${page.path}`,
            en: `${baseUrl}/en${page.path}`,
            it: `${baseUrl}/it${page.path}`,
          },
        },
      });
    }
  }

  // Photo product pages (galerie-item/{slug})
  for (const photo of photos) {
    const slug = photo.name.toLowerCase().replace(/\s+/g, '-');

    for (const locale of locales) {
      urls.push({
        url: `${baseUrl}/${locale}/galerie-item/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        alternates: {
          languages: {
            fr: `${baseUrl}/fr/galerie-item/${slug}`,
            en: `${baseUrl}/en/galerie-item/${slug}`,
            it: `${baseUrl}/it/galerie-item/${slug}`,
          },
        },
        images: [`${baseUrl}${photo.image}`],
      });
    }
  }

  return urls;
}

// Lalou
