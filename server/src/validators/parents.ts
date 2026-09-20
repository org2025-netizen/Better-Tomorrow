import { z } from 'zod';

export const createParentSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
    name: z.string().min(1, 'Name is required'),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.string().email().optional(),
    relationship: z.string().optional(),
    address: z.string().optional(),
    emergencyContact: z.string().optional(),
  }),
});

export const updateParentSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.string().email().optional(),
    relationship: z.string().optional(),
    address: z.string().optional(),
    emergencyContact: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const parentQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
  }),
});
