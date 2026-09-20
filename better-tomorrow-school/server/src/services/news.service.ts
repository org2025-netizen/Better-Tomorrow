import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { generateSlug, ensureUniqueSlug } from '../utils/slug';
import { PaginationParams } from '../types';

export const getAllNews = async (params: PaginationParams) => {
  const { page = 1, limit = 10, status, category, search } = params as any;
  const skip = (Number(page) - 1) * Number(limit);
  const where: any = {};
  if (status) where.status = status;
  if (category) where.category = category;
  if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { summary: { contains: search, mode: 'insensitive' } }];

  const [posts, total] = await Promise.all([
    prisma.newsPost.findMany({ where, skip, take: Number(limit), include: { author: { select: { name: true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.newsPost.count({ where }),
  ]);
  return { data: posts, total, page: Number(page), limit: Number(limit) };
};

export const getNewsById = async (id: string) => {
  const post = await prisma.newsPost.findUnique({ where: { id }, include: { author: { select: { name: true, email: true } } } });
  if (!post) throw new AppError('News post not found', 404);
  return post;
};

export const getNewsBySlug = async (slug: string) => {
  const post = await prisma.newsPost.findUnique({ where: { slug }, include: { author: { select: { name: true, email: true } } } });
  if (!post) throw new AppError('News post not found', 404);
  return post;
};

export const createNews = async (data: any, authorId?: string) => {
  const slug = data.slug || generateSlug(data.title);
  const uniqueSlug = await ensureUniqueSlug(slug, async (s) => {
    const existing = await prisma.newsPost.findUnique({ where: { slug: s } });
    return !!existing;
  });
  return prisma.newsPost.create({
    data: { ...data, slug: uniqueSlug, authorId, publishedAt: data.status === 'PUBLISHED' ? new Date() : undefined },
    include: { author: { select: { name: true } } },
  });
};

export const updateNews = async (id: string, data: any) => {
  const post = await prisma.newsPost.findUnique({ where: { id } });
  if (!post) throw new AppError('News post not found', 404);
  const updateData = { ...data };
  if (data.title && !data.slug) updateData.slug = generateSlug(data.title);
  if (data.status === 'PUBLISHED' && !post.publishedAt) updateData.publishedAt = new Date();
  return prisma.newsPost.update({ where: { id }, data: updateData });
};

export const deleteNews = async (id: string) => {
  const post = await prisma.newsPost.findUnique({ where: { id } });
  if (!post) throw new AppError('News post not found', 404);
  await prisma.newsPost.delete({ where: { id } });
  return { message: 'News post deleted successfully' };
};
