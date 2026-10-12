import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

// Every page is statically generated at build time (no ISR/revalidation), so
// prerendered pages are served straight from the Worker's static assets and no
// R2 bucket is needed.
const config = defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});

// `npm run build` runs OpenNext, so OpenNext must call Next.js directly
// instead of `npm run build` (which would recurse).
config.buildCommand = 'npm run build:next';

export default config;
