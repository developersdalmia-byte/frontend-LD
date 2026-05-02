/**
 * @file next.config.ts
 * @description Next.js production-ready configuration
 * - External images (Unsplash + API + CloudFront)
 * - AVIF/WebP optimization
 * - Security + CORS headers
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    // Modern formats (better compression)
    formats: ["image/avif", "image/webp"],

    // Responsive breakpoints
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Allow external image domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.lalitdalmia.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d11i6x0p471co2.cloudfront.net",
        pathname: "/**",
      },
    ],
  },

  // 🔥 Headers (CORS + Security)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // CORS (note: backend me bhi hona zaroori hai)
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },

          // Security headers
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Optional: better production logging control
  poweredByHeader: false,

  // Optional: enable compression
  compress: true,
};

export default nextConfig;