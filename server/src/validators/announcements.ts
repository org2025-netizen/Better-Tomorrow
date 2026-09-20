import { z } from 'zod';

export const createAnnouncementSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    message: z.string().min(1),
    audience: z.enum(['ALL', 'PARENTS', 'TEACHERS', 'CLASS', 'GROUP']),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    classId: z.string().uuid().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    publishDate: z.string().optional(),
    expiryDate: z.string().optional(),
  }),
});

export const updateAnnouncementSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    message: z.string().min(1).optional(),
    audience: z.enum(['ALL', 'PARENTS', 'TEACHERS', 'CLASS', 'GROUP']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    classId: z.string().uuid().nullable().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    publishDate: z.string().optional(),
    expiryDate: z.string().optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const announcementQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    audience: z.enum(['ALL', 'PARENTS', 'TEACHERS', 'CLASS', 'GROUP']).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  }),
});
