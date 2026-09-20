import { Response } from 'express';
import * as parentService from '../services/parent.service';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../types';
import prisma from '../config/database';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const result = await parentService.getAllParents(req.query as any);
    return sendPaginated(res, result.data, result.total, result.page, result.limit);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getChildren = async (req: AuthRequest, res: Response) => {
  try {
    const children = await prisma.student.findMany({
      where: { parentId: req.params.id },
      include: { class: true },
      orderBy: { firstName: 'asc' },
    });
    return sendSuccess(res, children);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const parent = await parentService.getParentById(req.params.id);
    return sendSuccess(res, parent);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const parent = await parentService.createParent(req.body);
    return sendSuccess(res, parent, 'Parent created', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const parent = await parentService.updateParent(req.params.id, req.body);
    return sendSuccess(res, parent, 'Parent updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const result = await parentService.deleteParent(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
