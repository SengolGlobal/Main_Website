import path from 'node:path';
import type { NextConfig } from 'next';

/**
 * next-intl request config is wired via the same alias the `next-intl/plugin`
 * sets up. We register it directly because the plugin eagerly loads a native
 * @swc/core binary (used only for its optional message extractor), which fails
 * in locked-down Windows environments.
 */
const requestConfig = './src/i18n/request.ts';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Server-rendered localized 404 for unmatched URLs (app/global-not-found.tsx).
    globalNotFound: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 65, 70, 75],
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  turbopack: {
    resolveAlias: { 'next-intl/config': requestConfig },
  },
  webpack(config) {
    config.resolve.alias['next-intl/config'] = path.resolve(process.cwd(), requestConfig);
    return config;
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
