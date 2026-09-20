import { Response } from 'express';
import * as dashboardService from '../services/dashboard.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';
import prisma from '../config/database';

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    return sendSuccess(res, stats);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getParentStats = async (req: AuthRequest, res: Response) => {
  try {
    const { parentId } = req.params;
    // Find parent profile - could be parent profile ID or user ID
    let parentProfile = await prisma.parent.findUnique({ where: { id: parentId } });
    if (!parentProfile) {
      parentProfile = await prisma.parent.findUnique({ where: { userId: parentId } });
    }
    if (!parentProfile) return sendError(res, 'Parent not found', 404);

    const children = await prisma.student.findMany({
      where: { parentId: parentProfile.id },
      include: { class: true },
    });

    let outstandingFees = 0;
    for (const child of children) {
      const invoices = await prisma.invoice.findMany({
        where: { studentId: child.id, status: { in: ['PENDING', 'PARTIAL'] } },
      });
      outstandingFees += invoices.reduce((sum, inv) => sum + inv.amount, 0);
    }

    const announcementsCount = await prisma.announcement.count({
      where: { status: 'PUBLISHED', audience: { in: ['ALL', 'PARENTS'] } },
    });

    return sendSuccess(res, {
      childrenCount: children.length,
      outstandingFees,
      announcementsCount,
      children,
    });
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getTeacherStats = async (req: AuthRequest, res: Response) => {
  try {
    const { teacherId } = req.params;
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: { subjects: { include: { class: true, subject: true } } },
    });

    const classesCount = new Set(teacher?.subjects.map(ts => ts.classId) || []).size;
    const subjectsCount = new Set(teacher?.subjects.map(ts => ts.subjectId) || []).size;

    const assignedClassIds = teacher?.subjects.map(ts => ts.classId) || [];
    const totalStudents = await prisma.student.count({
      where: { classId: { in: assignedClassIds }, status: 'ACTIVE' },
    });

    return sendSuccess(res, {
      classesCount,
      subjectsCount,
      totalStudents,
      teacher,
    });
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getEnrollmentByClass = async (req: AuthRequest, res: Response) => {
  try {
    const data = await dashboardService.getEnrollmentByClass();
    return sendSuccess(res, data);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getAttendanceChart = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await dashboardService.getAttendanceChart(startDate as string, endDate as string);
    return sendSuccess(res, data);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getPaymentSummary = async (req: AuthRequest, res: Response) => {
  try {
    const data = await dashboardService.getPaymentSummary();
    return sendSuccess(res, data);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getRecentActivity = async (req: AuthRequest, res: Response) => {
  try {
    const data = await dashboardService.getRecentActivity();
    return sendSuccess(res, data);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
