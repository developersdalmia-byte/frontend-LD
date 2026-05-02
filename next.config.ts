/**
 * @file next.config.ts
 * @description Next.js configuration
 * - Allows external images (Unsplash + your API)
 * - Image optimization: WebP/AVIF auto-compression, responsive sizing
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve modern compressed formats (AVIF > WebP > original)
    formats: ["image/avif", "image/webp"],

    // Responsive breakpoints for srcset generation
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],


    // Quality is controlled per-image via the OptimizedImage component (default 75)
    // Minimize layout shift with blur placeholder
    // (works automatically for static imports; dynamic images use blurDataURL)

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
};

export default nextConfig;