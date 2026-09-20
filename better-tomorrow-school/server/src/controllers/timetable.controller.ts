import { Response } from 'express';
import * as timetableService from '../services/timetable.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const timetable = await timetableService.getTimetable(req.query);
    return sendSuccess(res, timetable);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const entry = await timetableService.getTimetableById(req.params.id);
    return sendSuccess(res, entry);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const entry = await timetableService.createTimetable(req.body);
    return sendSuccess(res, entry, 'Timetable entry created', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const entry = await timetableService.updateTimetable(req.params.id, req.body);
    return sendSuccess(res, entry, 'Timetable entry updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const result = await timetableService.deleteTimetable(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
