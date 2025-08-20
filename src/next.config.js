// next.config.js
/** @type {import('next').NextConfig} */
module.exports = {
  distDir: "../.next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/yqk7lu4g/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/ddkuxrisq/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dtps5ugbf/**",
      }
    ],
    // Enable modern image formats and optimization
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images for 1 year
    minimumCacheTTL: 31536000,
  },
  // Enable SWC minification for better performance
  swcMinify: true,
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@sanity/client', 'gsap'],
    turbotrace: {
      logLevel: 'error'
    }
  },
  // Compress responses
  compress: true,
  // Enable static generation caching
  generateEtags: true,
  // Optimize server-side compilation
  optimizeFonts: true,
  // Reduce bundle size
  webpack: (config, { isServer, dev }) => {
    // Only bundle necessary code
    if (!dev && !isServer) {
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    return config;
  },
};
