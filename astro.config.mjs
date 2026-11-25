// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Vervang dit door het echte webadres zodra de site online staat
  // (nodig voor Open Graph-afbeeldingen en de sitemap).
  site: 'https://www.example.com',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
});
