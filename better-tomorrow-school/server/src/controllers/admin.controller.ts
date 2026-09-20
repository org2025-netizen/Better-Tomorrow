import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { role, status } = req.query;
    const users = await adminService.getUsers({ role: role as string, status: status as string });
    return sendSuccess(res, users);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getPendingUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await adminService.getPendingUsers();
    return sendSuccess(res, users);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const approveUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await adminService.approveUser(id, req.user!.userId);
    return sendSuccess(res, user, 'User approved successfully');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const rejectUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const user = await adminService.rejectUser(id, req.user!.userId, reason);
    return sendSuccess(res, user, 'User rejected');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const user = await adminService.toggleUserStatus(id, req.user!.userId, isActive);
    return sendSuccess(res, user, `User ${isActive ? 'activated' : 'deactivated'}`);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await adminService.getUserStats();
    return sendSuccess(res, stats);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};