import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z.object({
    invoiceId: z.string().uuid(),
    studentId: z.string().uuid(),
    amount: z.number().positive(),
    paymentMethod: z.enum(['CASH', 'BANK', 'M_PESA', 'OTHER']),
    referenceNumber: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const paymentQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    studentId: z.string().uuid().optional(),
    invoiceId: z.string().uuid().optional(),
    paymentMethod: z.enum(['CASH', 'BANK', 'M_PESA', 'OTHER']).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export const receiptQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    studentId: z.string().uuid().optional(),
    receiptNumber: z.string().optional(),
  }),
});
