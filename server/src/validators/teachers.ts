import { z } from 'zod';

export const createTeacherSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
    employeeNumber: z.string().min(1, 'Employee number is required'),
    name: z.string().min(1, 'Name is required'),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    qualification: z.string().optional(),
    specialization: z.string().optional(),
    hireDate: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
});

export const updateTeacherSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    qualification: z.string().optional(),
    specialization: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const teacherQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
});
