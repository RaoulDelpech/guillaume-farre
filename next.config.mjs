import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cacher l'icône de debug Next.js en bas à gauche
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Fix sharp WASM files not being bundled correctly
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        sharp: 'commonjs sharp'
      });
    }
    return config;
  },
  // Ensure server-side only modules are not bundled for client
  serverExternalPackages: ['sharp', 'imghash'],
  // Pages masquees — redirect vers accueil
  async redirects() {
    return [
      { source: '/:locale/histoire', destination: '/:locale', permanent: false },
      { source: '/:locale/atelier', destination: '/:locale', permanent: false },
      { source: '/:locale/boutique', destination: '/:locale/galerie', permanent: false },
      { source: '/:locale/panier', destination: '/:locale/galerie', permanent: false },
      { source: '/:locale/faq', destination: '/:locale/galerie', permanent: false },
    ];
  },
  // Security + performance headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/data/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      // Cache immutable pour les bundles JS/CSS (noms hashes)
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Cache long pour les images statiques
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' },
        ],
      },
      // Cache pour favicon et assets racine
      {
        source: '/favicon.svg',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
