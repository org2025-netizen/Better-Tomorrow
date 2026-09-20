import { z } from 'zod';

export const createDocumentSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    fileUrl: z.string().min(1),
    category: z.string().optional(),
    fileSize: z.number().int().positive().optional(),
    status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
  }),
});

export const updateDocumentSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    fileUrl: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const documentQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
    category: z.string().optional(),
  }),
});
