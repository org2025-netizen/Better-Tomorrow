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
    return sendSuccess(res, result, 'Registration successful', 201);
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
