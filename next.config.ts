import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "pub-ea618482129b4c13968cb865fed1036f.r2.dev",
      },

      {
        hostname: "img.freepik.com",
      },
    ],
  },
};

export default nextConfig;
