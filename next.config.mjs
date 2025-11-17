/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
    return [
      {
        source: "/auth/session",
        destination: `${backendUrl}/auth/session/`,
      },
      {
        source: "/auth/session/:path*",
        destination: `${backendUrl}/auth/session/:path*/`,
      },
    ]
  },
}
export default nextConfig
