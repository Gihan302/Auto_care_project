/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '', // Cloudinary uses default HTTPS port
        pathname: '/**', // Allow all paths from cloudinary
      },
    ],
  },
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
