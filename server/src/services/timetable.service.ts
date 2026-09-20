import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getTimetable = async (params: any) => {
  const { classId, teacherId, dayOfWeek, academicYearId, termId } = params;
  const where: any = {};
  if (classId) where.classId = classId;
  if (teacherId) where.teacherId = teacherId;
  if (dayOfWeek) where.dayOfWeek = dayOfWeek;
  if (academicYearId) where.academicYearId = academicYearId;
  if (termId) where.termId = termId;

  return prisma.timetable.findMany({
    where,
    include: { class: true, subject: true, teacher: { select: { name: true, employeeNumber: true } }, academicYear: true, term: true },
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  });
};

export const getTimetableById = async (id: string) => {
  const entry = await prisma.timetable.findUnique({
    where: { id }, include: { class: true, subject: true, teacher: true, academicYear: true, term: true },
  });
  if (!entry) throw new AppError('Timetable entry not found', 404);
  return entry;
};

export const createTimetable = async (data: any) => {
  const conflict = await prisma.timetable.findFirst({
    where: {
      classId: data.classId, dayOfWeek: data.dayOfWeek, academicYearId: data.academicYearId, termId: data.termId,
      OR: [
        { startTime: { lte: new Date(data.endTime) }, endTime: { gte: new Date(data.startTime) } },
      ],
    },
  });
  if (conflict) throw new AppError('Timetable conflict detected for this class and time slot', 409);

  const teacherConflict = await prisma.timetable.findFirst({
    where: {
      teacherId: data.teacherId, dayOfWeek: data.dayOfWeek, academicYearId: data.academicYearId, termId: data.termId,
      OR: [
        { startTime: { lte: new Date(data.endTime) }, endTime: { gte: new Date(data.startTime) } },
      ],
    },
  });
  if (teacherConflict) throw new AppError('Teacher has a conflicting timetable entry', 409);

  return prisma.timetable.create({
    data: { ...data, startTime: new Date(data.startTime), endTime: new Date(data.endTime) },
    include: { class: true, subject: true, teacher: true },
  });
};

export const updateTimetable = async (id: string, data: any) => {
  const entry = await prisma.timetable.findUnique({ where: { id } });
  if (!entry) throw new AppError('Timetable entry not found', 404);
  const updateData = { ...data };
  if (data.startTime) updateData.startTime = new Date(data.startTime);
  if (data.endTime) updateData.endTime = new Date(data.endTime);
  return prisma.timetable.update({ where: { id }, data: updateData, include: { class: true, subject: true, teacher: true } });
};

export const deleteTimetable = async (id: string) => {
  const entry = await prisma.timetable.findUnique({ where: { id } });
  if (!entry) throw new AppError('Timetable entry not found', 404);
  await prisma.timetable.delete({ where: { id } });
  return { message: 'Timetable entry deleted successfully' };
};
