import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://listberdua.com',
  output: 'static',
  trailingSlash: 'always',
  // Owner-only and per-device pages stay out of the sitemap.
  integrations: [sitemap({ filter: (page) => !/\/(admin|favorit|bandingkan)\/$/.test(page) })],
  vite: { plugins: [tailwindcss()] },
});
