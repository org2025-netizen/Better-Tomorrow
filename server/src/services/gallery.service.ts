import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PaginationParams } from '../types';

export const getAllGalleryItems = async (params: PaginationParams) => {
  const { page = 1, limit = 10, status, category } = params as any;
  const skip = (Number(page) - 1) * Number(limit);
  const where: any = {};
  if (status) where.status = status;
  if (category) where.category = category;

  const [items, total] = await Promise.all([
    prisma.galleryItem.findMany({ where, skip, take: Number(limit), include: { uploader: { select: { name: true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.galleryItem.count({ where }),
  ]);
  return { data: items, total, page: Number(page), limit: Number(limit) };
};

export const getGalleryItemById = async (id: string) => {
  const item = await prisma.galleryItem.findUnique({ where: { id }, include: { uploader: { select: { name: true } } } });
  if (!item) throw new AppError('Gallery item not found', 404);
  return item;
};

export const createGalleryItem = async (data: any, uploadedBy?: string) => {
  return prisma.galleryItem.create({ data: { ...data, uploadedBy } });
};

export const updateGalleryItem = async (id: string, data: any) => {
  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (!item) throw new AppError('Gallery item not found', 404);
  return prisma.galleryItem.update({ where: { id }, data });
};

export const deleteGalleryItem = async (id: string) => {
  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (!item) throw new AppError('Gallery item not found', 404);
  await prisma.galleryItem.delete({ where: { id } });
  return { message: 'Gallery item deleted successfully' };
};
