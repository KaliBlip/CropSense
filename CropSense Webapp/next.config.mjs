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
        destination: "http://127.0.0.1:8000/predict"
      }
    ];
  }
};

export default nextConfig;

