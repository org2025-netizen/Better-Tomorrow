import { z } from 'zod';

export const createExamSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Exam name is required'),
    termId: z.string().uuid(),
    academicYearId: z.string().uuid(),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
  }),
});

export const updateExamSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    termId: z.string().uuid().optional(),
    academicYearId: z.string().uuid().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const createAssessmentSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Assessment name is required'),
    examId: z.string().uuid(),
    subjectId: z.string().uuid(),
    maxMarks: z.number().int().positive(),
    weight: z.number().positive().optional(),
  }),
});

export const updateAssessmentSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    maxMarks: z.number().int().positive().optional(),
    weight: z.number().positive().optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const examQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    termId: z.string().uuid().optional(),
    academicYearId: z.string().uuid().optional(),
  }),
});
