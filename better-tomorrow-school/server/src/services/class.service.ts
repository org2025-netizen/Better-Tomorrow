import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { ClassInput, PaginationParams } from '../types';

export const getAllClasses = async (params: PaginationParams) => {
  const { page = 1, limit = 10, search } = params as any;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};
  if (search) where.name = { contains: search, mode: 'insensitive' };

  const [classes, total] = await Promise.all([
    prisma.class.findMany({
      where, skip, take: Number(limit),
      include: {
        stream: true,
        classTeacher: { select: { id: true, name: true, employeeNumber: true } },
        _count: { select: { students: true } },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.class.count({ where }),
  ]);

  return { data: classes, total, page: Number(page), limit: Number(limit) };
};

export const getClassById = async (id: string) => {
  const cls = await prisma.class.findUnique({
    where: { id },
    include: {
      stream: true,
      classTeacher: true,
      students: { select: { id: true, firstName: true, lastName: true, admissionNumber: true } },
      subjects: { include: { subject: true, teacher: true } },
      feeStructures: true,
      timetables: { include: { subject: true, teacher: true } },
    },
  });
  if (!cls) throw new AppError('Class not found', 404);
  return cls;
};

export const createClass = async (data: ClassInput) => {
  return prisma.class.create({ data, include: { stream: true, classTeacher: true } });
};

export const updateClass = async (id: string, data: Partial<ClassInput>) => {
  const cls = await prisma.class.findUnique({ where: { id } });
  if (!cls) throw new AppError('Class not found', 404);
  return prisma.class.update({ where: { id }, data, include: { stream: true, classTeacher: true } });
};

export const deleteClass = async (id: string) => {
  const cls = await prisma.class.findUnique({ where: { id } });
  if (!cls) throw new AppError('Class not found', 404);
  await prisma.class.delete({ where: { id } });
  return { message: 'Class deleted successfully' };
};
