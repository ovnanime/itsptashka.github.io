import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const poetry = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/poetry' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(['poem', 'song']).default('poem'),
    date: z.coerce.date(),
    excerpt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const journal = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    // Указывать только при реальном обновлении текста: попадает в dateModified.
    updated: z.coerce.date().optional(),
    poster: z.string().optional(),
    posterWidth: z.number().int().positive().optional(),
    posterHeight: z.number().int().positive().optional(),
    draft: z.boolean().default(false),
  }),
});

/**
 * Главы книги «Монтаж звука в кино» (страница /book/).
 * Новая глава = одна запись в src/data/book/chapters.json
 * (там же приложения и список источников — kind "appendix" / "references").
 * Для status "ready" обязательны version, updated и pdf. Если самого PDF
 * нет в public/book/, его найдёт npm run audit (проверка битых ссылок).
 */
const bookChapters = defineCollection({
  loader: file('src/data/book/chapters.json'),
  schema: z
    .object({
      /** Часть книги: id из BOOK.parts в src/data/book.ts. */
      part: z.enum(['I', 'II', 'III', 'IV']),
      /** Порядок в оглавлении; для глав — номер главы. */
      number: z.number().int().positive(),
      kind: z.enum(['chapter', 'appendix', 'references']).default('chapter'),
      /** Буква приложения (А, Б, В). */
      label: z.string().optional(),
      title: z.string(),
      description: z.string(),
      status: z.enum(['ready', 'soon']),
      version: z.string().regex(/^v\d+(\.\d+)*$/, 'версия вида v0.3').optional(),
      updated: z.coerce.date().optional(),
      pdf: z.string().regex(/^\/book\/[a-z0-9._-]+\.pdf$/, 'путь вида /book/ch01-name.pdf (латиница)').optional(),
    })
    .superRefine((ch, ctx) => {
      if (ch.status === 'ready' && !(ch.version && ch.updated && ch.pdf)) {
        ctx.addIssue({ code: 'custom', message: 'Для готовой главы нужны version, updated и pdf' });
      }
    }),
});

export const collections = { poetry, journal, bookChapters };
