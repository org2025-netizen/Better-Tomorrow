import { Response } from 'express';
import * as classService from '../services/class.service';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../types';
import prisma from '../config/database';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const result = await classService.getAllClasses(req.query as any);
    return sendPaginated(res, result.data, result.total, result.page, result.limit);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getStudents = async (req: AuthRequest, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      where: { classId: req.params.id, status: 'ACTIVE' },
      include: { parent: { include: { user: { select: { name: true, email: true, phone: true } } } } },
      orderBy: { firstName: 'asc' },
    });
    return sendSuccess(res, students);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const cls = await classService.getClassById(req.params.id);
    return sendSuccess(res, cls);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const cls = await classService.createClass(req.body);
    return sendSuccess(res, cls, 'Class created', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const cls = await classService.updateClass(req.params.id, req.body);
    return sendSuccess(res, cls, 'Class updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const result = await classService.deleteClass(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
