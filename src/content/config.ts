import { defineCollection, z } from 'astro:content';

const poetry = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    type: z.enum(['poem', 'song']).default('poem'),
    date: z.coerce.date(),
    excerpt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const journal = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    poster: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  poetry,
  journal,
};
