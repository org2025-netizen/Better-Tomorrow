import { z } from 'zod';

export const createSchoolVisitSchema = z.object({
  body: z.object({
    parentName: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email().optional(),
    preferredDate: z.string().optional(),
    preferredTime: z.string().optional(),
    numberOfVisitors: z.number().int().positive().optional(),
    learnerAge: z.number().int().positive().optional(),
    programInterestedIn: z.string().optional(),
    message: z.string().optional(),
  }),
});

export const updateSchoolVisitSchema = z.object({
  body: z.object({
    status: z.enum(['REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED']).optional(),
    preferredDate: z.string().optional(),
    preferredTime: z.string().optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const schoolVisitQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(['REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED']).optional(),
  }),
});
