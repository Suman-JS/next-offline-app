/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "web";
    }
    return config;
  },
};

module.exports = nextConfig;
