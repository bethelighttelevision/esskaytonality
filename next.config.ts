import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "rddqvkusjsfvguaplkba.supabase.co" },
    ],
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
