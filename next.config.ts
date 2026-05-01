import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: ".next-build",
  output: "standalone",
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
