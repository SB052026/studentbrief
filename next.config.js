/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: false,
  outputFileTracingRoot: __dirname,
}

module.exports = nextConfig
