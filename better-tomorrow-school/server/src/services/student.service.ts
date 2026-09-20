import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { generateAdmissionNumber } from '../utils/receipt';
import { StudentInput, PaginationParams } from '../types';

const includeRelations = {
  class: true,
  stream: true,
  parent: { include: { user: { select: { id: true, name: true, email: true, phone: true } } } },
  subjects: { include: { subject: true } },
};

export const getAllStudents = async (params: PaginationParams) => {
  const { page = 1, limit = 10, search, classId, streamId, status, sortBy = 'createdAt', sortOrder = 'desc' } = params as any;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { admissionNumber: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (classId) where.classId = classId;
  if (streamId) where.streamId = streamId;
  if (status) where.status = status;

  const [students, total] = await Promise.all([
    prisma.student.findMany({ where, include: includeRelations, skip, take: Number(limit), orderBy: { [sortBy]: sortOrder } }),
    prisma.student.count({ where }),
  ]);

  return { data: students, total, page: Number(page), limit: Number(limit) };
};

export const getStudentById = async (id: string) => {
  const student = await prisma.student.findUnique({ where: { id }, include: includeRelations });
  if (!student) throw new AppError('Student not found', 404);
  return student;
};

export const createStudent = async (data: StudentInput) => {
  const count = await prisma.student.count();
  const admissionNumber = generateAdmissionNumber(count + 1);

  return prisma.student.create({
    data: {
      admissionNumber,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      dateOfBirth: new Date(data.dateOfBirth),
      gender: data.gender,
      classId: data.classId,
      streamId: data.streamId,
      parentId: data.parentId,
      phone: data.phone,
      address: data.address,
      admissionDate: data.admissionDate ? new Date(data.admissionDate) : new Date(),
      status: data.status || 'ACTIVE',
      photo: data.photo,
    },
    include: includeRelations,
  });
};

export const updateStudent = async (id: string, data: Partial<StudentInput>) => {
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) throw new AppError('Student not found', 404);

  const updateData: any = { ...data };
  if (data.dateOfBirth) updateData.dateOfBirth = new Date(data.dateOfBirth);

  return prisma.student.update({ where: { id }, data: updateData, include: includeRelations });
};

export const deleteStudent = async (id: string) => {
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) throw new AppError('Student not found', 404);
  await prisma.student.delete({ where: { id } });
  return { message: 'Student deleted successfully' };
};
