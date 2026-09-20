import { Response } from 'express';
import * as examService from '../services/exam.service';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../types';
import prisma from '../config/database';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const result = await examService.getAllExams(req.query as any);
    return sendPaginated(res, result.data, result.total, result.page, result.limit);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const exam = await examService.getExamById(req.params.id);
    return sendSuccess(res, exam);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getResults = async (req: AuthRequest, res: Response) => {
  try {
    const marks = await prisma.mark.findMany({
      where: { assessment: { examId: req.params.id } },
      include: { assessment: { include: { subject: true } }, student: { select: { id: true, firstName: true, lastName: true, admissionNumber: true } } },
      orderBy: { marksObtained: 'desc' },
    });
    return sendSuccess(res, marks);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const exam = await examService.createExam(req.body);
    return sendSuccess(res, exam, 'Exam created', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const exam = await examService.updateExam(req.params.id, req.body);
    return sendSuccess(res, exam, 'Exam updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const result = await examService.deleteExam(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const createAssessment = async (req: AuthRequest, res: Response) => {
  try {
    const assessment = await examService.createAssessment(req.body);
    return sendSuccess(res, assessment, 'Assessment created', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const updateAssessment = async (req: AuthRequest, res: Response) => {
  try {
    const assessment = await examService.updateAssessment(req.params.id, req.body);
    return sendSuccess(res, assessment, 'Assessment updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const deleteAssessment = async (req: AuthRequest, res: Response) => {
  try {
    const result = await examService.deleteAssessment(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
