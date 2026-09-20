import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
    phone: z.string().optional(),
    role: z.enum(['ADMIN', 'TEACHER', 'ACCOUNTANT', 'PARENT', 'STUDENT']),
    isActive: z.boolean().optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    name: z.string().min(1).optional(),
    phone: z.string().optional(),
    role: z.enum(['ADMIN', 'TEACHER', 'ACCOUNTANT', 'PARENT', 'STUDENT']).optional(),
    isActive: z.boolean().optional(),
    avatar: z.string().optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const userQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    role: z.enum(['ADMIN', 'TEACHER', 'ACCOUNTANT', 'PARENT', 'STUDENT']).optional(),
    isActive: z.string().optional(),
  }),
});
