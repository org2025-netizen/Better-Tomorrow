import { z } from 'zod';

export const generateReportCardSchema = z.object({
  body: z.object({
    studentId: z.string().uuid(),
    termId: z.string().uuid(),
    academicYearId: z.string().uuid(),
    classTeacherComment: z.string().optional(),
    adminComment: z.string().optional(),
  }),
});

export const publishReportCardSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export const reportCardQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    studentId: z.string().uuid().optional(),
    termId: z.string().uuid().optional(),
    academicYearId: z.string().uuid().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  }),
});
