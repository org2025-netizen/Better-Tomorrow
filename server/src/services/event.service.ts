import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PaginationParams } from '../types';

export const getAllEvents = async (params: PaginationParams) => {
  const { page = 1, limit = 10, status, category, startDate, endDate } = params as any;
  const skip = (Number(page) - 1) * Number(limit);
  const where: any = {};
  if (status) where.status = status;
  if (category) where.category = category;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({ where, skip, take: Number(limit), include: { author: { select: { name: true } } }, orderBy: { date: 'desc' } }),
    prisma.event.count({ where }),
  ]);
  return { data: events, total, page: Number(page), limit: Number(limit) };
};

export const getEventById = async (id: string) => {
  const event = await prisma.event.findUnique({ where: { id }, include: { author: { select: { name: true, email: true } } } });
  if (!event) throw new AppError('Event not found', 404);
  return event;
};

export const createEvent = async (data: any, createdBy?: string) => {
  return prisma.event.create({
    data: { ...data, date: new Date(data.date), startTime: data.startTime ? new Date(data.startTime) : undefined, endTime: data.endTime ? new Date(data.endTime) : undefined, createdBy },
    include: { author: { select: { name: true } } },
  });
};

export const updateEvent = async (id: string, data: any) => {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw new AppError('Event not found', 404);
  const updateData = { ...data };
  if (data.date) updateData.date = new Date(data.date);
  if (data.startTime) updateData.startTime = new Date(data.startTime);
  if (data.endTime) updateData.endTime = new Date(data.endTime);
  return prisma.event.update({ where: { id }, data: updateData });
};

export const deleteEvent = async (id: string) => {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw new AppError('Event not found', 404);
  await prisma.event.delete({ where: { id } });
  return { message: 'Event deleted successfully' };
};
