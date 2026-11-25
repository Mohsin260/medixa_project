import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "br-square-cell-az6upo0z.storage.c-3.ap-southeast-1.aws.neon.tech",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
  async rewrites() {
    return [
      {
        source: '/policies/privacy-policy',
        destination: '/privacy-policy',
      },
      {
        source: '/policies/terms-of-service',
        destination: '/terms-of-service',
      },
      {
        source: '/policies/refund-policy',
        destination: '/refund-policy',
      },
      {
        source: '/policies/shipping-policy',
        destination: '/shipping-policy',
      },
      {
        source: '/favorites',
        destination: '/favourite',
      },
      {
        source: '/wishlist',
        destination: '/favourite',
      },
    ];
  },
};

export default nextConfig;
