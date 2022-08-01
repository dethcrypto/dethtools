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
};

module.exports = nextConfig;
