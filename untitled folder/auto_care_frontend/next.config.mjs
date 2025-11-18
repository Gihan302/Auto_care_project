/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
      {
        source: '/webhook-test/:path*',
        destination: 'http://localhost:5678/webhook-test/:path*',
      },
    ];
  },
};

export default nextConfig;
