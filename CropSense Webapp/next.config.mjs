/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "images.pexels.com"
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: "/api/predict",
        destination: process.env.BACKEND_API_URL || "https://kaliboii-cropsense.hf.space/predict"
      }
    ];
  }
};

export default nextConfig;

