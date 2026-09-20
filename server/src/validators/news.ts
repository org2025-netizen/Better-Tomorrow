import { z } from 'zod';

export const createNewsSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    slug: z.string().optional(),
    summary: z.string().optional(),
    content: z.string().min(1),
    featuredImage: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    publishedAt: z.string().optional(),
  }),
});

export const updateNewsSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    slug: z.string().optional(),
    summary: z.string().optional(),
    content: z.string().min(1).optional(),
    featuredImage: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    publishedAt: z.string().optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const newsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    category: z.string().optional(),
    search: z.string().optional(),
  }),
});
