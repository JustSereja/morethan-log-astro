import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    h1: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date(),
    announcement: z.string().optional(),
    image: z.string().optional(),
    aiGenerated: z.boolean().default(false),
    translationKey: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    h1: z.string().optional(),
    description: z.string().optional(),
    translationKey: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, pages };
