import { z } from 'zod';

export const createGalleryItemSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    imageUrl: z.string().min(1),
    category: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'HIDDEN']).optional(),
  }),
});

export const updateGalleryItemSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'HIDDEN']).optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const galleryQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'HIDDEN']).optional(),
    category: z.string().optional(),
  }),
});
