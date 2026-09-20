import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PaginationParams } from '../types';

export const getAllMessages = async (params: PaginationParams) => {
  const { page = 1, limit = 10, status } = params as any;
  const skip = (Number(page) - 1) * Number(limit);
  const where: any = {};
  if (status) where.status = status;
  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
    prisma.contactMessage.count({ where }),
  ]);
  return { data: messages, total, page: Number(page), limit: Number(limit) };
};

export const getMessageById = async (id: string) => {
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) throw new AppError('Contact message not found', 404);
  if (message.status === 'UNREAD') {
    await prisma.contactMessage.update({ where: { id }, data: { status: 'READ' } });
  }
  return message;
};

export const createMessage = async (data: any) => {
  return prisma.contactMessage.create({ data });
};

export const updateMessage = async (id: string, data: any) => {
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) throw new AppError('Contact message not found', 404);
  const updateData = { ...data };
  if (data.status === 'REPLIED') updateData.repliedAt = new Date();
  return prisma.contactMessage.update({ where: { id }, data: updateData });
};

export const deleteMessage = async (id: string) => {
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) throw new AppError('Contact message not found', 404);
  await prisma.contactMessage.delete({ where: { id } });
  return { message: 'Contact message deleted successfully' };
};
