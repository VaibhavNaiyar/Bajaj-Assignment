/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/bfhl',
        destination: 'http://localhost:3000/bfhl',
      },
    ];
  },
};

export default nextConfig;
