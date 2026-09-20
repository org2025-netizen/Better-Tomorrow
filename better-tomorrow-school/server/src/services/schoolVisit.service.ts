import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PaginationParams } from '../types';

export const getAllVisits = async (params: PaginationParams) => {
  const { page = 1, limit = 10, status } = params as any;
  const skip = (Number(page) - 1) * Number(limit);
  const where: any = {};
  if (status) where.status = status;
  const [visits, total] = await Promise.all([
    prisma.schoolVisit.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
    prisma.schoolVisit.count({ where }),
  ]);
  return { data: visits, total, page: Number(page), limit: Number(limit) };
};

export const getVisitById = async (id: string) => {
  const visit = await prisma.schoolVisit.findUnique({ where: { id } });
  if (!visit) throw new AppError('School visit not found', 404);
  return visit;
};

export const createVisit = async (data: any) => {
  return prisma.schoolVisit.create({ data: { ...data, preferredDate: data.preferredDate ? new Date(data.preferredDate) : undefined } });
};

export const updateVisit = async (id: string, data: any) => {
  const visit = await prisma.schoolVisit.findUnique({ where: { id } });
  if (!visit) throw new AppError('School visit not found', 404);
  const updateData = { ...data };
  if (data.preferredDate) updateData.preferredDate = new Date(data.preferredDate);
  return prisma.schoolVisit.update({ where: { id }, data: updateData });
};

export const deleteVisit = async (id: string) => {
  const visit = await prisma.schoolVisit.findUnique({ where: { id } });
  if (!visit) throw new AppError('School visit not found', 404);
  await prisma.schoolVisit.delete({ where: { id } });
  return { message: 'School visit deleted successfully' };
};
