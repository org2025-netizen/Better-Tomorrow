import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PaginationParams } from '../types';

export const getAllDocuments = async (params: PaginationParams) => {
  const { page = 1, limit = 10, status, category } = params as any;
  const skip = (Number(page) - 1) * Number(limit);
  const where: any = {};
  if (status) where.status = status;
  if (category) where.category = category;

  const [documents, total] = await Promise.all([
    prisma.document.findMany({ where, skip, take: Number(limit), include: { uploader: { select: { name: true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.document.count({ where }),
  ]);
  return { data: documents, total, page: Number(page), limit: Number(limit) };
};

export const getDocumentById = async (id: string) => {
  const doc = await prisma.document.findUnique({ where: { id }, include: { uploader: { select: { name: true } } } });
  if (!doc) throw new AppError('Document not found', 404);
  return doc;
};

export const createDocument = async (data: any, uploadedBy?: string) => {
  return prisma.document.create({ data: { ...data, uploadedBy } });
};

export const updateDocument = async (id: string, data: any) => {
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) throw new AppError('Document not found', 404);
  return prisma.document.update({ where: { id }, data });
};

export const deleteDocument = async (id: string) => {
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) throw new AppError('Document not found', 404);
  await prisma.document.delete({ where: { id } });
  return { message: 'Document deleted successfully' };
};
