import { Response } from 'express';
import * as reportService from '../services/report.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

export const getStudentReport = async (req: AuthRequest, res: Response) => {
  try {
    const report = await reportService.getStudentReport(req.params.studentId);
    return sendSuccess(res, report);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getClassReport = async (req: AuthRequest, res: Response) => {
  try {
    const { classId } = req.params;
    const { termId } = req.query;
    const report = await reportService.getClassReport(classId, termId as string);
    return sendSuccess(res, report);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getFinancialReport = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await reportService.getFinancialReport(startDate as string, endDate as string);
    return sendSuccess(res, report);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
