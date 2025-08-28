import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '60x.ai',
      },
      {
        protocol: 'https',
        hostname: 'www.recurse.ml',
      },
      {
        protocol: 'https',
        hostname: 't1v.co',
      },
      {
        protocol: 'https',
        hostname: 'www.t1v.co',
      },
    ],
  },
};

export default nextConfig;
