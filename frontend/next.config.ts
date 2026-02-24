import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      throw new Error(
        "Missing BACKEND_URL. Set frontend/.env.local with BACKEND_URL=http://localhost:3001 (or your backend base URL) and restart next dev.",
      );
    }

    const normalized = backendUrl.replace(/\/$/, "");
    const destinationBase = normalized.endsWith("/api")
      ? normalized
      : `${normalized}/api`;

    console.log(
      `[next.config] Proxying /api/* -> ${destinationBase}/* (from BACKEND_URL=${backendUrl})`,
    );

    return [
      {
        source: "/api/:path*",
        destination: `${destinationBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
