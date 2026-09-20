import { z } from 'zod';

export const createFeeStructureSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    classId: z.string().uuid(),
    academicYearId: z.string().uuid(),
    termId: z.string().uuid(),
    amount: z.number().positive(),
    description: z.string().optional(),
  }),
});

export const updateFeeStructureSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    amount: z.number().positive().optional(),
    description: z.string().optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const createInvoiceSchema = z.object({
  body: z.object({
    studentId: z.string().uuid(),
    feeStructureId: z.string().uuid(),
    amount: z.number().positive(),
    dueDate: z.string().min(1),
    status: z.enum(['PENDING', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED']).optional(),
  }),
});

export const updateInvoiceSchema = z.object({
  body: z.object({
    amount: z.number().positive().optional(),
    dueDate: z.string().optional(),
    status: z.enum(['PENDING', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED']).optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const feeQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    classId: z.string().uuid().optional(),
    academicYearId: z.string().uuid().optional(),
    termId: z.string().uuid().optional(),
  }),
});
