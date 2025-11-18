// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001',
  },

  // Image optimization
  images: {
    domains: ['kqotkilcwlevgxufewnc.supabase.co'],
    unoptimized: true,
  },

  // Output config for Vercel
  output: 'standalone',
};

module.exports = nextConfig;