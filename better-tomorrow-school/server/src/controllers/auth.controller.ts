import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    return sendSuccess(res, result, 'Login successful');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.registerUser(req.body);
    return sendSuccess(res, result, 'Registration submitted for admin approval', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshAccessToken(refreshToken);
    return sendSuccess(res, tokens, 'Token refreshed');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 401);
  }
};

export const logout = async (_req: Request, res: Response) => {
  return sendSuccess(res, null, 'Logged out successfully');
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const user = await authService.getCurrentUser(req.user!.userId);
    return sendSuccess(res, user);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getPendingUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await authService.getPendingUsers();
    return sendSuccess(res, users);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { role, status } = req.query;
    const users = await authService.getAllUsers({ role: role as string, status: status as string });
    return sendSuccess(res, users);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const approveUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await authService.approveUser(id, req.user!.userId);
    return sendSuccess(res, user, 'User approved successfully');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const rejectUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const user = await authService.rejectUser(id, req.user!.userId, reason || 'No reason provided');
    return sendSuccess(res, user, 'User rejected');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const user = await authService.toggleUserStatus(id, req.user!.userId, isActive);
    return sendSuccess(res, user, `User ${isActive ? 'activated' : 'deactivated'}`);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
