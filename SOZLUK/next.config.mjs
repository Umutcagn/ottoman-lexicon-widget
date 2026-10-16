/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    '192.168.1.112',
    '192.168.1.112:3000',
    'localhost:3000',
    '127.0.0.1',
  ],
}

export default nextConfig
