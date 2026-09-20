import { z } from 'zod';

export const createClassSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Class name is required'),
    description: z.string().optional(),
    streamId: z.string().uuid().optional(),
    classTeacherId: z.string().uuid().optional(),
    capacity: z.number().int().positive().optional(),
  }),
});

export const updateClassSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    streamId: z.string().uuid().nullable().optional(),
    classTeacherId: z.string().uuid().nullable().optional(),
    capacity: z.number().int().positive().optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const classQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
  }),
});
