import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    date: z.string().min(1),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    location: z.string().optional(),
    category: z.string().optional(),
    image: z.string().optional(),
    status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
  }),
});

export const updateEventSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    date: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    location: z.string().optional(),
    category: z.string().optional(),
    image: z.string().optional(),
    status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const eventQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
    category: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});
