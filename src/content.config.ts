import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
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
    poster: z.string().optional(),
    posterWidth: z.number().int().positive().optional(),
    posterHeight: z.number().int().positive().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { poetry, journal };
