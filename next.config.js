/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "1000logos.net",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "logos-world.net",
      },
      // Diğer logo sitelerini de buraya ekleyebilirsiniz
    ],
  },
};

module.exports = nextConfig;
