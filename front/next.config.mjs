/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        protocol: "http",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
