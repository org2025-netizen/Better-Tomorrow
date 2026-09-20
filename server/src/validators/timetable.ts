import { z } from 'zod';

export const createTimetableSchema = z.object({
  body: z.object({
    classId: z.string().uuid(),
    subjectId: z.string().uuid(),
    teacherId: z.string().uuid(),
    dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
    startTime: z.string().min(1),
    endTime: z.string().min(1),
    room: z.string().optional(),
    academicYearId: z.string().uuid(),
    termId: z.string().uuid(),
  }),
});

export const updateTimetableSchema = z.object({
  body: z.object({
    subjectId: z.string().uuid().optional(),
    teacherId: z.string().uuid().optional(),
    dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    room: z.string().optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const timetableQuerySchema = z.object({
  query: z.object({
    classId: z.string().uuid().optional(),
    teacherId: z.string().uuid().optional(),
    dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']).optional(),
    academicYearId: z.string().uuid().optional(),
    termId: z.string().uuid().optional(),
  }),
});
