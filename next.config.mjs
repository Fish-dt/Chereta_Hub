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
  // This prevents API routes from being evaluated during build
  serverExternalPackages: ['mongodb'],
  // Additional build optimizations for Vercel
  experimental: {
    // Disable server components external packages warning
    serverComponentsExternalPackages: [],
  },
}

export default nextConfig
