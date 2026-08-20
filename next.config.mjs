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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent the site being framed elsewhere (clickjacking).
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Stop browsers guessing content types for served files.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Don't leak the full referring URL to third parties.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable browser features this site never uses.
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
