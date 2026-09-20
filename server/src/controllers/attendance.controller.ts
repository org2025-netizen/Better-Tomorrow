import { Response } from 'express';
import * as attendanceService from '../services/attendance.service';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../types';
import prisma from '../config/database';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const result = await attendanceService.getAttendance(req.query as any);
    return sendPaginated(res, result.data, result.total, result.page, result.limit);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const record = async (req: AuthRequest, res: Response) => {
  try {
    const attendance = await attendanceService.recordAttendance({ ...req.body, recordedBy: req.user?.userId });
    return sendSuccess(res, attendance, 'Attendance recorded', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const bulkRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { classId, date, records } = req.body;
    const result = await attendanceService.bulkRecordAttendance(classId, date, records, req.user?.userId);
    return sendSuccess(res, result, 'Attendance recorded', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getReport = async (req: AuthRequest, res: Response) => {
  try {
    const { classId, startDate, endDate } = req.query;
    const report = await attendanceService.getAttendanceReport(classId as string, startDate as string, endDate as string);
    return sendSuccess(res, report);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getByStudent = async (req: AuthRequest, res: Response) => {
  try {
    const records = await prisma.attendance.findMany({
      where: { studentId: req.params.studentId },
      include: { student: { select: { firstName: true, lastName: true, admissionNumber: true } } },
      orderBy: { date: 'desc' },
    });
    return sendSuccess(res, records);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const record = await prisma.attendance.findUnique({
      where: { id: req.params.id },
      include: { student: { select: { firstName: true, lastName: true, admissionNumber: true } } },
    });
    if (!record) return sendError(res, 'Attendance record not found', 404);
    return sendSuccess(res, record);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const record = await prisma.attendance.update({
      where: { id: req.params.id },
      data: req.body,
      include: { student: { select: { firstName: true, lastName: true, admissionNumber: true } } },
    });
    return sendSuccess(res, record, 'Attendance updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.attendance.delete({ where: { id: req.params.id } });
    return sendSuccess(res, null, 'Attendance deleted');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
