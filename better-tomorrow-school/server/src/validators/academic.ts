import { z } from 'zod';

export const createAcademicYearSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    isCurrent: z.boolean().optional(),
  }),
});

export const updateAcademicYearSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isCurrent: z.boolean().optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const createTermSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    academicYearId: z.string().uuid(),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    isCurrent: z.boolean().optional(),
  }),
});

export const updateTermSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isCurrent: z.boolean().optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const createStreamSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    classId: z.string().uuid().optional(),
  }),
});

export const updateStreamSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    classId: z.string().uuid().nullable().optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});
