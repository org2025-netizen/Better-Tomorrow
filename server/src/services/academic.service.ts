import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getAllAcademicYears = async () => {
  return prisma.academicYear.findMany({ include: { terms: true }, orderBy: { startDate: 'desc' } });
};

export const getAcademicYearById = async (id: string) => {
  const year = await prisma.academicYear.findUnique({ where: { id }, include: { terms: true } });
  if (!year) throw new AppError('Academic year not found', 404);
  return year;
};

export const createAcademicYear = async (data: any) => {
  if (data.isCurrent) await prisma.academicYear.updateMany({ where: { isCurrent: true }, data: { isCurrent: false } });
  return prisma.academicYear.create({ data: { ...data, startDate: new Date(data.startDate), endDate: new Date(data.endDate) } });
};

export const updateAcademicYear = async (id: string, data: any) => {
  const year = await prisma.academicYear.findUnique({ where: { id } });
  if (!year) throw new AppError('Academic year not found', 404);
  if (data.isCurrent) await prisma.academicYear.updateMany({ where: { isCurrent: true }, data: { isCurrent: false } });
  const updateData = { ...data };
  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.endDate) updateData.endDate = new Date(data.endDate);
  return prisma.academicYear.update({ where: { id }, data: updateData });
};

export const deleteAcademicYear = async (id: string) => {
  const year = await prisma.academicYear.findUnique({ where: { id } });
  if (!year) throw new AppError('Academic year not found', 404);
  await prisma.academicYear.delete({ where: { id } });
  return { message: 'Academic year deleted successfully' };
};

export const getAllTerms = async (academicYearId?: string) => {
  const where = academicYearId ? { academicYearId } : {};
  return prisma.term.findMany({ where, include: { academicYear: true }, orderBy: { startDate: 'asc' } });
};

export const getTermById = async (id: string) => {
  const term = await prisma.term.findUnique({ where: { id }, include: { academicYear: true } });
  if (!term) throw new AppError('Term not found', 404);
  return term;
};

export const createTerm = async (data: any) => {
  if (data.isCurrent) await prisma.term.updateMany({ where: { isCurrent: true }, data: { isCurrent: false } });
  return prisma.term.create({ data: { ...data, startDate: new Date(data.startDate), endDate: new Date(data.endDate) } });
};

export const updateTerm = async (id: string, data: any) => {
  const term = await prisma.term.findUnique({ where: { id } });
  if (!term) throw new AppError('Term not found', 404);
  if (data.isCurrent) await prisma.term.updateMany({ where: { isCurrent: true }, data: { isCurrent: false } });
  const updateData = { ...data };
  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.endDate) updateData.endDate = new Date(data.endDate);
  return prisma.term.update({ where: { id }, data: updateData });
};

export const deleteTerm = async (id: string) => {
  const term = await prisma.term.findUnique({ where: { id } });
  if (!term) throw new AppError('Term not found', 404);
  await prisma.term.delete({ where: { id } });
  return { message: 'Term deleted successfully' };
};

export const getAllStreams = async () => {
  return prisma.stream.findMany({ include: { class: true }, orderBy: { name: 'asc' } });
};

export const createStream = async (data: any) => {
  return prisma.stream.create({ data, include: { class: true } });
};

export const updateStream = async (id: string, data: any) => {
  const stream = await prisma.stream.findUnique({ where: { id } });
  if (!stream) throw new AppError('Stream not found', 404);
  return prisma.stream.update({ where: { id }, data });
};

export const deleteStream = async (id: string) => {
  const stream = await prisma.stream.findUnique({ where: { id } });
  if (!stream) throw new AppError('Stream not found', 404);
  await prisma.stream.delete({ where: { id } });
  return { message: 'Stream deleted successfully' };
};
