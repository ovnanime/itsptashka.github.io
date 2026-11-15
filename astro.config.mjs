// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  devToolbar: { enabled: false },
  site: 'https://ptahen.ru',
  base: '/',
  trailingSlash: 'always',
  // «Подход» переехал в «Обо мне»: старый адрес остаётся рабочим.
  redirects: {
    '/approach': '/about/#approach',
  },
  integrations: [mdx()],
  vite: {
    cacheDir: '.astro/vite',
  },
});
