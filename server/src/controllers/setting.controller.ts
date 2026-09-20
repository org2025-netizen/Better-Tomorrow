import { Response } from 'express';
import * as settingService from '../services/setting.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

export const getAll = async (_req: AuthRequest, res: Response) => {
  try {
    const settings = await settingService.getAllSettings();
    return sendSuccess(res, settings);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const get = async (req: AuthRequest, res: Response) => {
  try {
    const value = await settingService.getSetting(req.params.key);
    return sendSuccess(res, { key: req.params.key, value });
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const { key, value } = req.body;
    const setting = await settingService.updateSetting(key, value);
    return sendSuccess(res, setting, 'Setting updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const bulkUpdate = async (req: AuthRequest, res: Response) => {
  try {
    const { settings } = req.body;
    const result = await settingService.bulkUpdateSettings(settings);
    return sendSuccess(res, result, 'Settings updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const result = await settingService.deleteSetting(req.params.key);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
