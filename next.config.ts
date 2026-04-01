import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
      {
        source: "/london-to-sf",
        destination: "https://london-to-sf.lovable.app/",
      },
      {
        source: "/london-to-sf/:path*",
        destination: "https://london-to-sf.lovable.app/:path*",
      },
    ];
  },
  // Required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "60x.ai",
      },
      {
        protocol: "https",
        hostname: "images.lumacdn.com",
      },
      {
        protocol: "https",
        hostname: "og.luma.com",
      },
      {
        protocol: "https",
        hostname: "www.recurse.ml",
      },
      {
        protocol: "https",
        hostname: "t1v.co",
      },
      {
        protocol: "https",
        hostname: "www.t1v.co",
      },
    ],
  },
};

export default nextConfig;
