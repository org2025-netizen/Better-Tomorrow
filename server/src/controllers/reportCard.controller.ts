import { Response } from 'express';
import * as reportCardService from '../services/reportCard.service';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../types';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const result = await reportCardService.getReportCards(req.query as any);
    return sendPaginated(res, result.data, result.total, result.page, result.limit);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const reportCard = await reportCardService.getReportCardById(req.params.id);
    return sendSuccess(res, reportCard);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const generate = async (req: AuthRequest, res: Response) => {
  try {
    const reportCard = await reportCardService.generateReportCard(req.body);
    return sendSuccess(res, reportCard, 'Report card generated', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const publish = async (req: AuthRequest, res: Response) => {
  try {
    const reportCard = await reportCardService.publishReportCard(req.params.id);
    return sendSuccess(res, reportCard, 'Report card published');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const result = await reportCardService.deleteReportCard(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
