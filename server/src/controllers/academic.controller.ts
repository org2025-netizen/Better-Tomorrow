import { Response } from 'express';
import * as academicService from '../services/academic.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

export const getAllAcademicYears = async (_req: AuthRequest, res: Response) => {
  try {
    const years = await academicService.getAllAcademicYears();
    return sendSuccess(res, years);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getAcademicYearById = async (req: AuthRequest, res: Response) => {
  try {
    const year = await academicService.getAcademicYearById(req.params.id);
    return sendSuccess(res, year);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const createAcademicYear = async (req: AuthRequest, res: Response) => {
  try {
    const year = await academicService.createAcademicYear(req.body);
    return sendSuccess(res, year, 'Academic year created', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const updateAcademicYear = async (req: AuthRequest, res: Response) => {
  try {
    const year = await academicService.updateAcademicYear(req.params.id, req.body);
    return sendSuccess(res, year, 'Academic year updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const deleteAcademicYear = async (req: AuthRequest, res: Response) => {
  try {
    const result = await academicService.deleteAcademicYear(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getAllTerms = async (req: AuthRequest, res: Response) => {
  try {
    const { academicYearId } = req.query;
    const terms = await academicService.getAllTerms(academicYearId as string);
    return sendSuccess(res, terms);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const createTerm = async (req: AuthRequest, res: Response) => {
  try {
    const term = await academicService.createTerm(req.body);
    return sendSuccess(res, term, 'Term created', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const updateTerm = async (req: AuthRequest, res: Response) => {
  try {
    const term = await academicService.updateTerm(req.params.id, req.body);
    return sendSuccess(res, term, 'Term updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const deleteTerm = async (req: AuthRequest, res: Response) => {
  try {
    const result = await academicService.deleteTerm(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getAllStreams = async (_req: AuthRequest, res: Response) => {
  try {
    const streams = await academicService.getAllStreams();
    return sendSuccess(res, streams);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const createStream = async (req: AuthRequest, res: Response) => {
  try {
    const stream = await academicService.createStream(req.body);
    return sendSuccess(res, stream, 'Stream created', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const updateStream = async (req: AuthRequest, res: Response) => {
  try {
    const stream = await academicService.updateStream(req.params.id, req.body);
    return sendSuccess(res, stream, 'Stream updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const deleteStream = async (req: AuthRequest, res: Response) => {
  try {
    const result = await academicService.deleteStream(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
