import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { ParentInput, PaginationParams } from '../types';

const splitName = (name: string): { firstName: string; lastName: string } => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
};

const formatParent = (parent: any) => {
  const { firstName, lastName } = splitName(parent.name || '');
  return { ...parent, firstName, lastName };
};

export const getAllParents = async (params: PaginationParams) => {
  const { page = 1, limit = 10, search } = params as any;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [parents, total] = await Promise.all([
    prisma.parent.findMany({
      where, skip, take: Number(limit),
      include: { user: { select: { id: true, email: true, name: true, phone: true, role: true } }, students: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.parent.count({ where }),
  ]);

  return { data: parents.map(formatParent), total, page: Number(page), limit: Number(limit) };
};

export const getParentById = async (id: string) => {
  const parent = await prisma.parent.findUnique({
    where: { id },
    include: { user: { select: { id: true, email: true, name: true, phone: true, role: true } }, students: { include: { class: true } } },
  });
  if (!parent) throw new AppError('Parent not found', 404);
  return formatParent(parent);
};

export const createParent = async (data: ParentInput) => {
  const existing = await prisma.parent.findUnique({ where: { userId: data.userId } });
  if (existing) throw new AppError('Parent profile already exists for this user', 409);
  const parent = await prisma.parent.create({ data, include: { user: true, students: true } });
  return formatParent(parent);
};

export const updateParent = async (id: string, data: Partial<ParentInput>) => {
  const parent = await prisma.parent.findUnique({ where: { id } });
  if (!parent) throw new AppError('Parent not found', 404);
  const updated = await prisma.parent.update({ where: { id }, data, include: { user: true, students: true } });
  return formatParent(updated);
};

export const deleteParent = async (id: string) => {
  const parent = await prisma.parent.findUnique({ where: { id } });
  if (!parent) throw new AppError('Parent not found', 404);
  await prisma.parent.delete({ where: { id } });
  return { message: 'Parent deleted successfully' };
};
