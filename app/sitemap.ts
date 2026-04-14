import { MetadataRoute } from 'next';

/**
 * Génère le sitemap.xml pour Google Search Console
 * Inclut uniquement les pages publiques en FR/EN/IT
 *
 * @author Lalou
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://guillaumefarre.com';

  const locales = ['fr', 'en', 'it'];

  // Pages publiques uniquement — pas de pages masquées, admin, login, panier
  const pages: { path: string; changeFrequency: 'daily' | 'weekly' | 'monthly'; priority: number }[] = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/galerie', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/toiles', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/boutique', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/faq', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/cgv', changeFrequency: 'monthly', priority: 0.3 },
    { path: '/mentions-legales', changeFrequency: 'monthly', priority: 0.3 },
    { path: '/politique-de-confidentialite', changeFrequency: 'monthly', priority: 0.3 },
    { path: '/retours-echanges', changeFrequency: 'monthly', priority: 0.3 },
  ];

  const urls: MetadataRoute.Sitemap = [];

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

  return urls;
}

// Lalou
