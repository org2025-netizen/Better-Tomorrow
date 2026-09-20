import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PaginationParams } from '../types';

export const getMarks = async (params: PaginationParams) => {
  const { page = 1, limit = 10, assessmentId, studentId, subjectId } = params as any;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};
  if (assessmentId) where.assessmentId = assessmentId;
  if (studentId) where.studentId = studentId;
  if (subjectId) where.assessment = { subjectId };

  const [marks, total] = await Promise.all([
    prisma.mark.findMany({
      where, skip, take: Number(limit),
      include: {
        assessment: { include: { subject: true, exam: true } },
        student: { select: { id: true, firstName: true, lastName: true, admissionNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.mark.count({ where }),
  ]);

  return { data: marks, total, page: Number(page), limit: Number(limit) };
};

export const enterMark = async (data: any) => {
  const existing = await prisma.mark.findFirst({
    where: { assessmentId: data.assessmentId, studentId: data.studentId },
  });
  if (existing) throw new AppError('Mark already exists for this student and assessment', 409);

  const assessment = await prisma.assessment.findUnique({ where: { id: data.assessmentId } });
  if (!assessment) throw new AppError('Assessment not found', 404);
  if (data.marksObtained > assessment.maxMarks) throw new AppError('Marks cannot exceed max marks', 400);

  return prisma.mark.create({ data, include: { assessment: true, student: true } });
};

export const updateMark = async (id: string, data: any) => {
  const mark = await prisma.mark.findUnique({ where: { id } });
  if (!mark) throw new AppError('Mark not found', 404);

  if (data.marksObtained !== undefined) {
    const assessment = await prisma.assessment.findUnique({ where: { id: mark.assessmentId } });
    if (assessment && data.marksObtained > assessment.maxMarks) throw new AppError('Marks cannot exceed max marks', 400);
  }

  return prisma.mark.update({ where: { id }, data, include: { assessment: true, student: true } });
};

export const bulkEnterMarks = async (assessmentId: string, marks: any[], teacherId?: string) => {
  const assessment = await prisma.assessment.findUnique({ where: { id: assessmentId } });
  if (!assessment) throw new AppError('Assessment not found', 404);

  const results = await Promise.all(
    marks.map(async (mark) => {
      if (mark.marksObtained > assessment.maxMarks) throw new AppError(`Marks for student ${mark.studentId} exceed max marks`, 400);

      const existing = await prisma.mark.findFirst({ where: { assessmentId, studentId: mark.studentId } });
      if (existing) {
        return prisma.mark.update({
          where: { id: existing.id },
          data: { marksObtained: mark.marksObtained, grade: mark.grade, comment: mark.comment },
        });
      }
      return prisma.mark.create({
        data: { assessmentId, studentId: mark.studentId, marksObtained: mark.marksObtained, grade: mark.grade, comment: mark.comment, teacherId },
      });
    })
  );

  return results;
};

export const getStudentMarks = async (studentId: string, termId?: string, academicYearId?: string) => {
  const where: any = { studentId };
  if (termId || academicYearId) {
    where.assessment = {};
    if (termId) where.assessment.exam = { termId };
    if (academicYearId) where.assessment.exam = { ...where.assessment.exam, academicYearId };
  }

  return prisma.mark.findMany({
    where,
    include: {
      assessment: { include: { subject: true, exam: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};
