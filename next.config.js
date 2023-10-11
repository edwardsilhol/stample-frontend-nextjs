const withPWA = require("next-pwa")({
  dest: "public",
  sw: "service-worker.gen.js",
  disable: process.env.NEXT_PUBLIC_NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withPWA(nextConfig);
