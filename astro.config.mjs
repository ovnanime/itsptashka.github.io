// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  devToolbar: { enabled: false },
  site: 'https://ptahen.ru',
  base: '/',
  trailingSlash: 'never',
  integrations: [mdx()],
  vite: {
    cacheDir: '.astro/vite',
  },
});
