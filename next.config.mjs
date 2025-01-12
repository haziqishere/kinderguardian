// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          stream: false,
          crypto: false,
          http: false,
          https: false,
          os: false,
          url: false,
          zlib: false,
          path: false,
        };
      }
      return config;
    },
  };
  
  export default nextConfig;