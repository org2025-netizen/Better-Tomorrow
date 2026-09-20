import { z } from 'zod';

export const createAdmissionEnquirySchema = z.object({
  body: z.object({
    parentName: z.string().min(1),
    parentPhone: z.string().min(1),
    parentWhatsapp: z.string().optional(),
    parentEmail: z.string().email().optional(),
    learnerName: z.string().min(1),
    dateOfBirth: z.string().optional(),
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    currentSchool: z.string().optional(),
    currentGrade: z.string().optional(),
    gradeApplyingFor: z.string().optional(),
    previousSchool: z.string().optional(),
    preferredStartDate: z.string().optional(),
    preferredContactMethod: z.string().optional(),
    message: z.string().optional(),
  }),
});

export const updateAdmissionEnquirySchema = z.object({
  body: z.object({
    status: z.enum(['NEW', 'CONTACTED', 'FOLLOW_UP', 'VISIT', 'ACCEPTED', 'REJECTED', 'CLOSED']).optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const admissionEnquiryQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(['NEW', 'CONTACTED', 'FOLLOW_UP', 'VISIT', 'ACCEPTED', 'REJECTED', 'CLOSED']).optional(),
    search: z.string().optional(),
  }),
});
