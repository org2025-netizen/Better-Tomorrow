import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { SubjectInput, PaginationParams } from '../types';

export const getAllSubjects = async (params: PaginationParams) => {
  const { page = 1, limit = 10, search } = params as any;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { code: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [subjects, total] = await Promise.all([
    prisma.subject.findMany({ where, skip, take: Number(limit), orderBy: { name: 'asc' } }),
    prisma.subject.count({ where }),
  ]);

  return { data: subjects, total, page: Number(page), limit: Number(limit) };
};

export const getSubjectById = async (id: string) => {
  const subject = await prisma.subject.findUnique({
    where: { id },
    include: { teacherSubjects: { include: { teacher: true, class: true } } },
  });
  if (!subject) throw new AppError('Subject not found', 404);
  return subject;
};

export const createSubject = async (data: SubjectInput) => {
  const existing = await prisma.subject.findUnique({ where: { code: data.code } });
  if (existing) throw new AppError('Subject code already exists', 409);
  return prisma.subject.create({ data });
};

export const updateSubject = async (id: string, data: Partial<SubjectInput>) => {
  const subject = await prisma.subject.findUnique({ where: { id } });
  if (!subject) throw new AppError('Subject not found', 404);
  if (data.code) {
    const existing = await prisma.subject.findFirst({ where: { code: data.code, id: { not: id } } });
    if (existing) throw new AppError('Subject code already exists', 409);
  }
  return prisma.subject.update({ where: { id }, data });
};

export const deleteSubject = async (id: string) => {
  const subject = await prisma.subject.findUnique({ where: { id } });
  if (!subject) throw new AppError('Subject not found', 404);
  await prisma.subject.delete({ where: { id } });
  return { message: 'Subject deleted successfully' };
};
