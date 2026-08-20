/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Projects, workshops, and events all live on /events now.
      { source: '/projects', destination: '/events', permanent: true },
    ]
  },
}

export default nextConfig
