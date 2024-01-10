/** @type {import('next').NextConfig} */
const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (process.env.NODE_ENV !== "production") {
      config.plugins = [...config.plugins];
    } {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
};

module.exports = nextConfig;
