/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/eth-unit-conversion',
        permanent: true,
      },
    ];
  },
  images: {
    domains: ['defillama.com'],
    formats: ['image/avif', 'image/webp'],
  },
  pageExtensions: ['page.tsx'],
};

module.exports = nextConfig;
