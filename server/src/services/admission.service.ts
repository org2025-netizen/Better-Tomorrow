import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PaginationParams } from '../types';

export const getAllEnquiries = async (params: PaginationParams) => {
  const { page = 1, limit = 10, status, search } = params as any;
  const skip = (Number(page) - 1) * Number(limit);
  const where: any = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { parentName: { contains: search, mode: 'insensitive' } },
      { learnerName: { contains: search, mode: 'insensitive' } },
    ];
  }
  const [enquiries, total] = await Promise.all([
    prisma.admissionEnquiry.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
    prisma.admissionEnquiry.count({ where }),
  ]);
  return { data: enquiries, total, page: Number(page), limit: Number(limit) };
};

export const getEnquiryById = async (id: string) => {
  const enquiry = await prisma.admissionEnquiry.findUnique({ where: { id } });
  if (!enquiry) throw new AppError('Enquiry not found', 404);
  return enquiry;
};

export const createEnquiry = async (data: any) => {
  return prisma.admissionEnquiry.create({ data: { ...data, dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined, preferredStartDate: data.preferredStartDate ? new Date(data.preferredStartDate) : undefined } });
};

export const updateEnquiry = async (id: string, data: any) => {
  const enquiry = await prisma.admissionEnquiry.findUnique({ where: { id } });
  if (!enquiry) throw new AppError('Enquiry not found', 404);
  return prisma.admissionEnquiry.update({ where: { id }, data });
};

export const deleteEnquiry = async (id: string) => {
  const enquiry = await prisma.admissionEnquiry.findUnique({ where: { id } });
  if (!enquiry) throw new AppError('Enquiry not found', 404);
  await prisma.admissionEnquiry.delete({ where: { id } });
  return { message: 'Enquiry deleted successfully' };
};
