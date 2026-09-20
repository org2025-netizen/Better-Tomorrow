import { Response } from 'express';
import * as markService from '../services/mark.service';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../types';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const result = await markService.getMarks(req.query as any);
    return sendPaginated(res, result.data, result.total, result.page, result.limit);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const enterMark = async (req: AuthRequest, res: Response) => {
  try {
    const mark = await markService.enterMark(req.body);
    return sendSuccess(res, mark, 'Mark entered', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const updateMark = async (req: AuthRequest, res: Response) => {
  try {
    const mark = await markService.updateMark(req.params.id, req.body);
    return sendSuccess(res, mark, 'Mark updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const bulkEnterMarks = async (req: AuthRequest, res: Response) => {
  try {
    const { assessmentId, marks, teacherId } = req.body;
    const result = await markService.bulkEnterMarks(assessmentId, marks, teacherId || req.user?.userId);
    return sendSuccess(res, result, 'Marks entered', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getStudentMarks = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId } = req.params;
    const { termId, academicYearId } = req.query;
    const marks = await markService.getStudentMarks(studentId, termId as string, academicYearId as string);
    return sendSuccess(res, marks);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
