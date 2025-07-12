import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  productionBrowserSourceMaps: true, // only for prod builds
  webpack(config, { dev }) {
    if (dev) {
      config.devtool = 'eval-source-map'; // or another source-map mode
    }
    return config;
  },
};

export default nextConfig;
