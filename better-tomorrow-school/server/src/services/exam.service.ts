import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PaginationParams } from '../types';

export const getAllExams = async (params: PaginationParams) => {
  const { page = 1, limit = 10, termId, academicYearId } = params as any;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};
  if (termId) where.termId = termId;
  if (academicYearId) where.academicYearId = academicYearId;

  const [exams, total] = await Promise.all([
    prisma.exam.findMany({
      where, skip, take: Number(limit),
      include: { term: true, academicYear: true, _count: { select: { assessments: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.exam.count({ where }),
  ]);

  return { data: exams, total, page: Number(page), limit: Number(limit) };
};

export const getExamById = async (id: string) => {
  const exam = await prisma.exam.findUnique({
    where: { id },
    include: { term: true, academicYear: true, assessments: { include: { subject: true } } },
  });
  if (!exam) throw new AppError('Exam not found', 404);
  return exam;
};

export const createExam = async (data: any) => {
  return prisma.exam.create({
    data: { ...data, startDate: new Date(data.startDate), endDate: new Date(data.endDate) },
    include: { term: true, academicYear: true },
  });
};

export const updateExam = async (id: string, data: any) => {
  const exam = await prisma.exam.findUnique({ where: { id } });
  if (!exam) throw new AppError('Exam not found', 404);
  const updateData = { ...data };
  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.endDate) updateData.endDate = new Date(data.endDate);
  return prisma.exam.update({ where: { id }, data: updateData, include: { term: true, academicYear: true } });
};

export const deleteExam = async (id: string) => {
  const exam = await prisma.exam.findUnique({ where: { id } });
  if (!exam) throw new AppError('Exam not found', 404);
  await prisma.exam.delete({ where: { id } });
  return { message: 'Exam deleted successfully' };
};

export const createAssessment = async (data: any) => {
  return prisma.assessment.create({ data, include: { exam: true, subject: true } });
};

export const updateAssessment = async (id: string, data: any) => {
  const assessment = await prisma.assessment.findUnique({ where: { id } });
  if (!assessment) throw new AppError('Assessment not found', 404);
  return prisma.assessment.update({ where: { id }, data, include: { exam: true, subject: true } });
};

export const deleteAssessment = async (id: string) => {
  const assessment = await prisma.assessment.findUnique({ where: { id } });
  if (!assessment) throw new AppError('Assessment not found', 404);
  await prisma.assessment.delete({ where: { id } });
  return { message: 'Assessment deleted successfully' };
};
