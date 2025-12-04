import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ["192.168.1.154", "chatobi.vercel.app"],
  },
};

export default nextConfig;
