// TODO: use regulat next-pwa when they updated to nextjs 13 new app dir
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  sw: "service-worker.gen.js",
  disable: process.env.NEXT_PUBLIC_NODE_ENV === 'development'
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true
  }
};

module.exports = withPWA(nextConfig);
