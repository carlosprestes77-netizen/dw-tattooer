/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/dw-tattooer',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/dw-tattooer',
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
