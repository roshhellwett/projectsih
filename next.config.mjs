/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "dist",
  experimental: {},
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "cxpaorwqkirspvlxatqt.supabase.co" },
    ],
  },
};

export default nextConfig;
