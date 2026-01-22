import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "play-lh.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "brand.ucr.edu",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.itch.zone",
        port: "",
        pathname: "/**",
      },
    ],
  },
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.tingwu.dev",
          },
        ],
        destination: "https://tingwu.dev/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
