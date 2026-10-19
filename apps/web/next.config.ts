import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@vitrine72/core"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
