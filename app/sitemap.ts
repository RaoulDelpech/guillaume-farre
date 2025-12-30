import { MetadataRoute } from 'next';

/**
 * Génère le sitemap.xml pour Google Search Console
 * Inclut toutes les pages statiques en FR/EN/IT
 *
 * @author Lalou
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://guillaumefarre.com';

  // Langues supportées
  const locales = ['fr', 'en', 'it'];

  // Pages statiques principales
  const staticPages = [
    '',              // Homepage
    '/galerie',      // Galerie
    '/boutique',     // Boutique
    '/histoire',     // Histoire artiste
    '/atelier',      // Atelier
    '/contact',      // Contact
    '/panier',       // Panier
    '/favoris',      // Favoris
    '/dino',         // Page Dino
    '/origine',      // Page Origine
  ];

  // Générer URLs pour toutes les langues
  const urls: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      urls.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            fr: `${baseUrl}/fr${page}`,
            en: `${baseUrl}/en${page}`,
            it: `${baseUrl}/it${page}`,
          },
        },
      });
    }
  }

  // Ajouter pages spécifiques
  urls.push({
    url: `${baseUrl}/fr`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
    alternates: {
      languages: {
        fr: `${baseUrl}/fr`,
        en: `${baseUrl}/en`,
        it: `${baseUrl}/it`,
      },
    },
  });

  return urls;
}

// Lalou
