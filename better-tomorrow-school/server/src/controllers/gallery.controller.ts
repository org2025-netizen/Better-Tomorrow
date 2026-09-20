import { Response } from 'express';
import * as galleryService from '../services/gallery.service';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../types';
import prisma from '../config/database';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const result = await galleryService.getAllGalleryItems(req.query as any);
    return sendPaginated(res, result.data, result.total, result.page, result.limit);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await prisma.galleryItem.findMany({
      where: { category: { not: null }, status: 'PUBLISHED' },
      select: { category: true },
      distinct: ['category'],
    });
    return sendSuccess(res, categories.map(c => c.category).filter(Boolean));
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const item = await galleryService.getGalleryItemById(req.params.id);
    return sendSuccess(res, item);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const item = await galleryService.createGalleryItem(req.body, req.user?.userId);
    return sendSuccess(res, item, 'Gallery item created', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const item = await galleryService.updateGalleryItem(req.params.id, req.body);
    return sendSuccess(res, item, 'Gallery item updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const result = await galleryService.deleteGalleryItem(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
