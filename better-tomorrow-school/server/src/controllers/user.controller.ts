import { Response } from 'express';
import * as userService from '../services/user.service';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../types';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const result = await userService.getAllUsers(req.query as any);
    return sendPaginated(res, result.data, result.total, result.page, result.limit);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return sendSuccess(res, user);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    return sendSuccess(res, user, 'User created', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return sendSuccess(res, user, 'User updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await userService.changePassword(req.params.id, currentPassword, newPassword);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
