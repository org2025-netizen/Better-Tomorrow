import { z } from 'zod';

export const recordAttendanceSchema = z.object({
  body: z.object({
    studentId: z.string().uuid(),
    date: z.string().min(1),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
    remarks: z.string().optional(),
  }),
});

export const bulkAttendanceSchema = z.object({
  body: z.object({
    classId: z.string().uuid(),
    date: z.string().min(1),
    records: z.array(z.object({
      studentId: z.string().uuid(),
      status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
      remarks: z.string().optional(),
    })).min(1),
  }),
});

export const attendanceQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    classId: z.string().uuid().optional(),
    studentId: z.string().uuid().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']).optional(),
  }),
});
