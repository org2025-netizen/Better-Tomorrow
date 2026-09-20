import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PaginationParams } from '../types';

export const getAllAnnouncements = async (params: PaginationParams) => {
  const { page = 1, limit = 10, audience, status, priority } = params as any;
  const skip = (Number(page) - 1) * Number(limit);
  const where: any = {};
  if (audience) where.audience = audience;
  if (status) where.status = status;
  if (priority) where.priority = priority;

  const [announcements, total] = await Promise.all([
    prisma.announcement.findMany({ where, skip, take: Number(limit), include: { author: { select: { name: true } }, class: true }, orderBy: { createdAt: 'desc' } }),
    prisma.announcement.count({ where }),
  ]);
  return { data: announcements, total, page: Number(page), limit: Number(limit) };
};

export const getAnnouncementById = async (id: string) => {
  const announcement = await prisma.announcement.findUnique({ where: { id }, include: { author: { select: { name: true } }, class: true } });
  if (!announcement) throw new AppError('Announcement not found', 404);
  return announcement;
};

export const createAnnouncement = async (data: any, createdBy?: string) => {
  return prisma.announcement.create({
    data: { ...data, createdBy, publishDate: data.publishDate ? new Date(data.publishDate) : undefined, expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined },
    include: { author: { select: { name: true } }, class: true },
  });
};

export const updateAnnouncement = async (id: string, data: any) => {
  const announcement = await prisma.announcement.findUnique({ where: { id } });
  if (!announcement) throw new AppError('Announcement not found', 404);
  const updateData = { ...data };
  if (data.publishDate) updateData.publishDate = new Date(data.publishDate);
  if (data.expiryDate) updateData.expiryDate = new Date(data.expiryDate);
  return prisma.announcement.update({ where: { id }, data: updateData });
};

export const deleteAnnouncement = async (id: string) => {
  const announcement = await prisma.announcement.findUnique({ where: { id } });
  if (!announcement) throw new AppError('Announcement not found', 404);
  await prisma.announcement.delete({ where: { id } });
  return { message: 'Announcement deleted successfully' };
};

export const getTargetedAnnouncements = async (audience: string, classId?: string) => {
  const where: any = { status: 'PUBLISHED', OR: [{ audience: 'ALL' }, { audience }] };
  if (classId) where.OR.push({ audience: 'CLASS', classId });
  return prisma.announcement.findMany({ where, include: { author: { select: { name: true } }, class: true }, orderBy: { createdAt: 'desc' } });
};
