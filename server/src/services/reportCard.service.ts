import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PaginationParams } from '../types';

export const getReportCards = async (params: PaginationParams) => {
  const { page = 1, limit = 10, studentId, termId, academicYearId, status } = params as any;
  const skip = (Number(page) - 1) * Number(limit);
  const where: any = {};
  if (studentId) where.studentId = studentId;
  if (termId) where.termId = termId;
  if (academicYearId) where.academicYearId = academicYearId;
  if (status) where.status = status;

  const [reportCards, total] = await Promise.all([
    prisma.reportCard.findMany({
      where, skip, take: Number(limit),
      include: {
        student: { select: { id: true, firstName: true, lastName: true, admissionNumber: true } },
        term: true, academicYear: true,
        subjects: { include: { subject: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.reportCard.count({ where }),
  ]);
  return { data: reportCards, total, page: Number(page), limit: Number(limit) };
};

export const getReportCardById = async (id: string) => {
  const reportCard = await prisma.reportCard.findUnique({
    where: { id },
    include: {
      student: { include: { class: true, parent: true } },
      term: true, academicYear: true,
      subjects: { include: { subject: true, teacher: { select: { name: true } } } },
    },
  });
  if (!reportCard) throw new AppError('Report card not found', 404);
  return reportCard;
};

export const generateReportCard = async (data: any) => {
  const existing = await prisma.reportCard.findFirst({
    where: { studentId: data.studentId, termId: data.termId, academicYearId: data.academicYearId },
  });
  if (existing) throw new AppError('Report card already exists for this student, term and year', 409);

  const marks = await prisma.mark.findMany({
    where: {
      studentId: data.studentId,
      assessment: { exam: { termId: data.termId, academicYearId: data.academicYearId } },
    },
    include: { assessment: { include: { subject: true } } },
  });

  const subjectMap = new Map<string, { totalMarks: number; count: number; subjectId: string; teacherId?: string }>();
  marks.forEach(mark => {
    const subjectId = mark.assessment.subjectId;
    const existing = subjectMap.get(subjectId) || { totalMarks: 0, count: 0, subjectId };
    existing.totalMarks += mark.marksObtained;
    existing.count += 1;
    if (mark.teacherId) existing.teacherId = mark.teacherId;
    subjectMap.set(subjectId, existing);
  });

  const totalMarks = Array.from(subjectMap.values()).reduce((sum, s) => sum + s.totalMarks, 0);
  const subjectCount = subjectMap.size || 1;
  const average = Math.round((totalMarks / subjectCount) * 100) / 100;

  const reportCard = await prisma.reportCard.create({
    data: {
      studentId: data.studentId,
      termId: data.termId,
      academicYearId: data.academicYearId,
      classTeacherComment: data.classTeacherComment,
      adminComment: data.adminComment,
      totalMarks, average,
    },
  });

  const subjectData = Array.from(subjectMap.values()).map(s => ({
    reportCardId: reportCard.id,
    subjectId: s.subjectId,
    marks: s.totalMarks,
    teacherId: s.teacherId,
  }));

  if (subjectData.length > 0) {
    await prisma.reportCardSubject.createMany({ data: subjectData });
  }

  return getReportCardById(reportCard.id);
};

export const publishReportCard = async (id: string) => {
  const reportCard = await prisma.reportCard.findUnique({ where: { id } });
  if (!reportCard) throw new AppError('Report card not found', 404);
  return prisma.reportCard.update({
    where: { id },
    data: { status: 'PUBLISHED', publishedAt: new Date() },
  });
};

export const deleteReportCard = async (id: string) => {
  const reportCard = await prisma.reportCard.findUnique({ where: { id } });
  if (!reportCard) throw new AppError('Report card not found', 404);
  await prisma.reportCard.delete({ where: { id } });
  return { message: 'Report card deleted successfully' };
};
