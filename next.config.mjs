/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only ignore during builds if absolutely necessary for deployment
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
