/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable static generation for API routes
  experimental: {
    // This prevents API routes from being evaluated during build
    serverComponentsExternalPackages: ['mongodb'],
  },
}

export default nextConfig
