// @ts-check
import { defineConfig } from 'astro/config';
import optimizeMedia from './integrations/optimize-media.mjs';

export default defineConfig({
  // Vervang dit door het echte webadres zodra de site online staat
  // (nodig voor Open Graph-afbeeldingen en de sitemap).
  site: 'https://www.example.com',
  trailingSlash: 'ignore',
  // Oude adressen blijven werken
  redirects: {
    '/werk': '/',
    '/werk/[slug]': '/portfolio/[slug]',
  },
  integrations: [optimizeMedia()],
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
});
