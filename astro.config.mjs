// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ptahen.ru',        // твой кастомный домен
  base: '/',                        // можно оставить /, т.к. это username.github.io
  trailingSlash: 'never',
});