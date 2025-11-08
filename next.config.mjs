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
