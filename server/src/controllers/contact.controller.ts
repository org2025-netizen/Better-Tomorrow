import { Response } from 'express';
import * as contactService from '../services/contact.service';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../types';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const result = await contactService.getAllMessages(req.query as any);
    return sendPaginated(res, result.data, result.total, result.page, result.limit);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const message = await contactService.getMessageById(req.params.id);
    return sendSuccess(res, message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const submit = async (req: AuthRequest, res: Response) => {
  try {
    const message = await contactService.createMessage(req.body);
    return sendSuccess(res, message, 'Message sent', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const message = await contactService.updateMessage(req.params.id, req.body);
    return sendSuccess(res, message, 'Message updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const result = await contactService.deleteMessage(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
