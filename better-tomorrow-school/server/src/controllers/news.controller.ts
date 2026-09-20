import { Response } from 'express';
import * as newsService from '../services/news.service';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../types';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const result = await newsService.getAllNews(req.query as any);
    return sendPaginated(res, result.data, result.total, result.page, result.limit);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const post = await newsService.getNewsById(req.params.id);
    return sendSuccess(res, post);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const post = await newsService.getNewsBySlug(req.params.slug);
    return sendSuccess(res, post);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const post = await newsService.createNews(req.body, req.user?.userId);
    return sendSuccess(res, post, 'News post created', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const post = await newsService.updateNews(req.params.id, req.body);
    return sendSuccess(res, post, 'News post updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const result = await newsService.deleteNews(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
