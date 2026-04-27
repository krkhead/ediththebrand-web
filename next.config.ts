import type { NextConfig } from "next";
import path from "node:path";

const CSP = [
  "default-src 'self'",
  // Next.js hydration + Clerk UI require unsafe-inline/eval
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com https://*.clerk.accounts.dev https://*.clerk.com",
  // Tailwind inline styles + Framer Motion
  "style-src 'self' 'unsafe-inline'",
  // Product images from Cloudinary, Clerk avatar from Google (Gmail OAuth)
  "img-src 'self' data: blob: https://res.cloudinary.com https://img.clerk.com https://lh3.googleusercontent.com",
  "font-src 'self' data:",
  // Cloudinary upload API + Clerk session API
  "connect-src 'self' https://api.cloudinary.com https://*.clerk.accounts.dev https://*.clerk.com https://clerk.com",
  // Calendly embed + Clerk modal iframe
  "frame-src https://calendly.com https://clerk.com https://*.clerk.accounts.dev https://*.clerk.com",
  // Prevent this site from being embedded anywhere
  "frame-ancestors 'none'",
  // Block all plugin embeds (Flash, etc.)
  "object-src 'none'",
  // Prevent base-tag hijacking
  "base-uri 'self'",
  // Restrict form submissions
  "form-action 'self' https://clerk.com https://*.clerk.accounts.dev https://*.clerk.com",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // Only send HSTS over HTTPS (Vercel always serves HTTPS)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy", value: CSP },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
