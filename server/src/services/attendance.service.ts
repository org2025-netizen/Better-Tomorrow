import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PaginationParams } from '../types';

export const getAttendance = async (params: PaginationParams) => {
  const { page = 1, limit = 10, classId, studentId, startDate, endDate, status } = params as any;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};
  if (studentId) where.studentId = studentId;
  if (status) where.status = status;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }
  if (classId) where.student = { classId };

  const [records, total] = await Promise.all([
    prisma.attendance.findMany({
      where, skip, take: Number(limit),
      include: { student: { select: { id: true, firstName: true, lastName: true, admissionNumber: true, classId: true } } },
      orderBy: { date: 'desc' },
    }),
    prisma.attendance.count({ where }),
  ]);

  return { data: records, total, page: Number(page), limit: Number(limit) };
};

export const recordAttendance = async (data: { studentId: string; date: string; status: any; remarks?: string; recordedBy?: string }) => {
  const existing = await prisma.attendance.findFirst({
    where: { studentId: data.studentId, date: new Date(data.date) },
  });
  if (existing) throw new AppError('Attendance already recorded for this student on this date', 409);

  return prisma.attendance.create({
    data: {
      studentId: data.studentId,
      date: new Date(data.date),
      status: data.status,
      remarks: data.remarks,
      recordedBy: data.recordedBy,
    },
    include: { student: { select: { firstName: true, lastName: true, admissionNumber: true } } },
  });
};

export const bulkRecordAttendance = async (classId: string, date: string, records: any[], recordedBy?: string) => {
  const attendanceDate = new Date(date);

  const results = await Promise.all(
    records.map(async (record) => {
      const existing = await prisma.attendance.findFirst({
        where: { studentId: record.studentId, date: attendanceDate },
      });
      if (existing) {
        return prisma.attendance.update({
          where: { id: existing.id },
          data: { status: record.status, remarks: record.remarks },
        });
      }
      return prisma.attendance.create({
        data: {
          studentId: record.studentId,
          date: attendanceDate,
          status: record.status,
          remarks: record.remarks,
          recordedBy,
        },
      });
    })
  );

  return results;
};

export const getAttendanceReport = async (classId: string, startDate: string, endDate: string) => {
  const students = await prisma.student.findMany({
    where: { classId, status: 'ACTIVE' },
    select: { id: true, firstName: true, lastName: true, admissionNumber: true },
  });

  const attendance = await prisma.attendance.findMany({
    where: {
      studentId: { in: students.map(s => s.id) },
      date: { gte: new Date(startDate), lte: new Date(endDate) },
    },
  });

  const report = students.map(student => {
    const studentAttendance = attendance.filter(a => a.studentId === student.id);
    const total = studentAttendance.length;
    const present = studentAttendance.filter(a => a.status === 'PRESENT').length;
    const absent = studentAttendance.filter(a => a.status === 'ABSENT').length;
    const late = studentAttendance.filter(a => a.status === 'LATE').length;
    const excused = studentAttendance.filter(a => a.status === 'EXCUSED').length;

    return {
      ...student,
      totalDays: total,
      present,
      absent,
      late,
      excused,
      attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  });

  return report;
};
