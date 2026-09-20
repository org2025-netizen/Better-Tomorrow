import { z } from 'zod';

export const enterMarkSchema = z.object({
  body: z.object({
    assessmentId: z.string().uuid(),
    studentId: z.string().uuid(),
    marksObtained: z.number().min(0),
    grade: z.string().optional(),
    comment: z.string().optional(),
    teacherId: z.string().uuid().optional(),
  }),
});

export const bulkMarkSchema = z.object({
  body: z.object({
    assessmentId: z.string().uuid(),
    marks: z.array(z.object({
      studentId: z.string().uuid(),
      marksObtained: z.number().min(0),
      grade: z.string().optional(),
      comment: z.string().optional(),
    })).min(1),
    teacherId: z.string().uuid().optional(),
  }),
});

export const markQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    assessmentId: z.string().uuid().optional(),
    studentId: z.string().uuid().optional(),
    subjectId: z.string().uuid().optional(),
  }),
});
