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
  },
};
