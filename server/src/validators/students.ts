import { z } from 'zod';

export const createStudentSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    gender: z.enum(['MALE', 'FEMALE']),
    classId: z.string().uuid().optional(),
    streamId: z.string().uuid().optional(),
    parentId: z.string().uuid().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    admissionDate: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'TRANSFERRED', 'GRADUATED']).optional(),
    photo: z.string().optional(),
  }),
});

export const updateStudentSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).optional(),
    middleName: z.string().optional(),
    lastName: z.string().min(1).optional(),
    dateOfBirth: z.string().optional(),
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    classId: z.string().uuid().optional(),
    streamId: z.string().uuid().optional(),
    parentId: z.string().uuid().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'TRANSFERRED', 'GRADUATED']).optional(),
    photo: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const studentQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    classId: z.string().uuid().optional(),
    streamId: z.string().uuid().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'TRANSFERRED', 'GRADUATED']).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});
