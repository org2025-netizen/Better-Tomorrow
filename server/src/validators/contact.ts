import { z } from 'zod';

export const createContactMessageSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string().min(1),
    message: z.string().min(1),
  }),
});

export const updateContactMessageSchema = z.object({
  body: z.object({
    status: z.enum(['UNREAD', 'READ', 'REPLIED', 'ARCHIVED']).optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const contactQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(['UNREAD', 'READ', 'REPLIED', 'ARCHIVED']).optional(),
  }),
});
