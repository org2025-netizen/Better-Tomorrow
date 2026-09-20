import { Response } from 'express';
import * as studentService from '../services/student.service';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../types';
import prisma from '../config/database';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const result = await studentService.getAllStudents(req.query as any);
    return sendPaginated(res, result.data, result.total, result.page, result.limit);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getByClass = async (req: AuthRequest, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      where: { classId: req.params.classId, status: 'ACTIVE' },
      include: { class: true, parent: { include: { user: { select: { name: true, email: true, phone: true } } } } },
      orderBy: { firstName: 'asc' },
    });
    return sendSuccess(res, students);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getByParent = async (req: AuthRequest, res: Response) => {
  try {
    const parentId = req.params.parentId;
    // Check if this is a user ID - look up parent profile first
    let parentProfile = await prisma.parent.findUnique({ where: { id: parentId } });
    if (!parentProfile) {
      parentProfile = await prisma.parent.findUnique({ where: { userId: parentId } });
    }
    const actualParentId = parentProfile?.id || parentId;

    const students = await prisma.student.findMany({
      where: { parentId: actualParentId, status: 'ACTIVE' },
      include: { class: true },
      orderBy: { firstName: 'asc' },
    });
    return sendSuccess(res, students);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const uploadPhoto = async (req: AuthRequest, res: Response) => {
  try {
    const { photo } = req.body;
    const student = await studentService.updateStudent(req.params.id, { photo } as any);
    return sendSuccess(res, student, 'Photo uploaded');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    return sendSuccess(res, student);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const student = await studentService.createStudent(req.body);
    return sendSuccess(res, student, 'Student created', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const student = await studentService.updateStudent(req.params.id, req.body);
    return sendSuccess(res, student, 'Student updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const result = await studentService.deleteStudent(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
