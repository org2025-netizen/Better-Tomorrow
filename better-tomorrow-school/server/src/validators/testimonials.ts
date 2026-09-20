import { z } from 'zod';

export const createTestimonialSchema = z.object({
  body: z.object({
    parentName: z.string().min(1),
    relationship: z.string().optional(),
    message: z.string().min(1),
    photo: z.string().optional(),
  }),
});

export const updateTestimonialSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const testimonialQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  }),
});
