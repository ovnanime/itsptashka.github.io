import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../data/site';

type Entry = { path: string; lastmod?: Date };

/**
 * Sitemap собирается из тех же данных, что и страницы, поэтому новая
 * публикация попадает в него автоматически.
 *
 * lastmod проставляется только там, где есть достоверная дата из
 * frontmatter. Для статических страниц дата не выдумывается: иначе
 * при каждой сборке в sitemap попадал бы ложный lastmod.
 */
export const GET: APIRoute = async () => {
  const journal = (await getCollection('journal')).filter((entry) => !entry.data.draft);
  const poetry = (await getCollection('poetry')).filter((entry) => !entry.data.draft);

  const entries: Entry[] = [
    { path: '/' },
    { path: '/works/' },
    { path: '/approach/' },
    { path: '/about/' },
    { path: '/journal/' },
    { path: '/contact/' },
    ...journal.map((entry) => ({
      path: `/journal/${entry.id}/`,
      lastmod: entry.data.updated ?? entry.data.date,
    })),
    ...poetry.map((entry) => ({
      path: `/works/author/${entry.id}/`,
      lastmod: entry.data.date,
    })),
  ];

  const urls = entries
    .map(({ path, lastmod }) => {
      const loc = new URL(path, SITE.url).href;
      const modified = lastmod
        ? `\n    <lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>`
        : '';

      return `  <url>\n    <loc>${loc}</loc>${modified}\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
