// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  devToolbar: { enabled: false },
  site: 'https://ptahen.ru',
  base: '/',
  trailingSlash: 'always',
  // Старой страницы «Подход» больше нет: адрес ведёт на «Обо мне».
  redirects: {
    '/approach': '/about/',
  },
  integrations: [mdx()],
  vite: {
    cacheDir: '.astro/vite',
  },
});
