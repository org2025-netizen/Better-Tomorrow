import { Response } from 'express';
import * as announcementService from '../services/announcement.service';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../types';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const result = await announcementService.getAllAnnouncements(req.query as any);
    return sendPaginated(res, result.data, result.total, result.page, result.limit);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const announcement = await announcementService.getAnnouncementById(req.params.id);
    return sendSuccess(res, announcement);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const announcement = await announcementService.createAnnouncement(req.body, req.user?.userId);
    return sendSuccess(res, announcement, 'Announcement created', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const announcement = await announcementService.updateAnnouncement(req.params.id, req.body);
    return sendSuccess(res, announcement, 'Announcement updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const result = await announcementService.deleteAnnouncement(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getTargeted = async (req: AuthRequest, res: Response) => {
  try {
    const { audience, classId } = req.query;
    const announcements = await announcementService.getTargetedAnnouncements(audience as string, classId as string);
    return sendSuccess(res, announcements);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
