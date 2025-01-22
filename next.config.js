/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: 'loose', // This helps with ESM/CommonJS issues
  },
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['cdn.sanity.io'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'styled-components': require.resolve('styled-components'),
    };
    return config;
  },
};

module.exports = nextConfig;
