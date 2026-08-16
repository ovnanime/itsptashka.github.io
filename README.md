# Ptahen Portfolio

Многостраничный сайт-портфолио на Astro 7.

Требуется Node.js 22.12.0 или новее.

```bash
npm ci
npm run dev
```

Полная проверка перед публикацией:

```bash
npm run verify
npm run audit:deps
```

Production-сборка:

```bash
npm run build
```

Контакты и основная навигация находятся в `src/data/site.ts`. Контент журнала
и авторского раздела хранится в `src/content` и описан в `src/content.config.ts`.
