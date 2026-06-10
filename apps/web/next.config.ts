import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local dev — Laravel on port 8001
      { protocol: "http", hostname: "localhost", port: "8001", pathname: "/**" },
      // Production — replace with your actual domain before going live
      // { protocol: "https", hostname: "api.tanzeeltravels.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
