import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PaginationParams } from '../types';

export const getAllTestimonials = async (params: PaginationParams) => {
  const { page = 1, limit = 10, status } = params as any;
  const skip = (Number(page) - 1) * Number(limit);
  const where: any = {};
  if (status) where.status = status;
  const [testimonials, total] = await Promise.all([
    prisma.testimonial.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
    prisma.testimonial.count({ where }),
  ]);
  return { data: testimonials, total, page: Number(page), limit: Number(limit) };
};

export const getTestimonialById = async (id: string) => {
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) throw new AppError('Testimonial not found', 404);
  return testimonial;
};

export const createTestimonial = async (data: any) => {
  return prisma.testimonial.create({ data });
};

export const updateTestimonial = async (id: string, data: any) => {
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) throw new AppError('Testimonial not found', 404);
  return prisma.testimonial.update({ where: { id }, data });
};

export const deleteTestimonial = async (id: string) => {
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) throw new AppError('Testimonial not found', 404);
  await prisma.testimonial.delete({ where: { id } });
  return { message: 'Testimonial deleted successfully' };
};

export const getApprovedTestimonials = async () => {
  return prisma.testimonial.findMany({ where: { status: 'APPROVED' }, orderBy: { createdAt: 'desc' } });
};
