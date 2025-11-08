import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
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
};

export default withNextIntl(nextConfig);
