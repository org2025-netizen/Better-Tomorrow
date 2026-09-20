import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { generateEmployeeNumber } from '../utils/receipt';
import { TeacherInput, PaginationParams } from '../types';

const splitName = (name: string): { firstName: string; lastName: string } => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
};

const formatTeacher = (teacher: any) => {
  const { firstName, lastName } = splitName(teacher.name || '');
  return { ...teacher, firstName, lastName };
};

export const getAllTeachers = async (params: PaginationParams) => {
  const { page = 1, limit = 10, search, status } = params as any;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { employeeNumber: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status) where.status = status;

  const [teachers, total] = await Promise.all([
    prisma.teacher.findMany({
      where, skip, take: Number(limit),
      include: { user: { select: { id: true, email: true, name: true } }, subjects: { include: { subject: true, class: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.teacher.count({ where }),
  ]);

  return { data: teachers.map(formatTeacher), total, page: Number(page), limit: Number(limit) };
};

export const getTeacherById = async (id: string) => {
  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, email: true, name: true, phone: true, role: true } },
      subjects: { include: { subject: true, class: true, academicYear: true, term: true } },
      classes: true,
      timetables: { include: { subject: true, class: true } },
    },
  });
  if (!teacher) throw new AppError('Teacher not found', 404);
  return formatTeacher(teacher);
};

export const createTeacher = async (data: TeacherInput) => {
  const count = await prisma.teacher.count();
  const employeeNumber = data.employeeNumber || generateEmployeeNumber(count + 1);

  const existing = await prisma.teacher.findUnique({ where: { userId: data.userId } });
  if (existing) throw new AppError('Teacher profile already exists for this user', 409);

  const teacher = await prisma.teacher.create({
    data: {
      userId: data.userId,
      employeeNumber,
      name: data.name,
      phone: data.phone,
      email: data.email,
      qualification: data.qualification,
      specialization: data.specialization,
      hireDate: data.hireDate ? new Date(data.hireDate) : new Date(),
      status: data.status || 'ACTIVE',
    },
    include: { user: true },
  });
  return formatTeacher(teacher);
};

export const updateTeacher = async (id: string, data: Partial<TeacherInput>) => {
  const teacher = await prisma.teacher.findUnique({ where: { id } });
  if (!teacher) throw new AppError('Teacher not found', 404);
  const updated = await prisma.teacher.update({ where: { id }, data, include: { user: true } });
  return formatTeacher(updated);
};

export const deleteTeacher = async (id: string) => {
  const teacher = await prisma.teacher.findUnique({ where: { id } });
  if (!teacher) throw new AppError('Teacher not found', 404);
  await prisma.teacher.delete({ where: { id } });
  return { message: 'Teacher deleted successfully' };
};
