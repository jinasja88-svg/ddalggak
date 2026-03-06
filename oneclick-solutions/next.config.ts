import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.1688.com",
      },
      {
        protocol: "https",
        hostname: "*.alicdn.com",
      },
    ],
  },
  allowedDevOrigins: ["*"],
};

export default nextConfig;
