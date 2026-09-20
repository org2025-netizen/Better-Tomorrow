import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { hashPassword, comparePassword } from '../utils/password';
import { PaginationParams } from '../types';

export const getAllUsers = async (params: PaginationParams) => {
  const { page = 1, limit = 10, search, role, isActive } = params as any;
  const skip = (Number(page) - 1) * Number(limit);
  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (role) where.role = role;
  if (isActive !== undefined) where.isActive = isActive === 'true';

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where, skip, take: Number(limit),
      select: { id: true, email: true, name: true, phone: true, role: true, avatar: true, isActive: true, lastLogin: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);
  return { data: users, total, page: Number(page), limit: Number(limit) };
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, phone: true, role: true, avatar: true, isActive: true, lastLogin: true, createdAt: true },
  });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

export const createUser = async (data: any) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new AppError('Email already registered', 409);
  const hashedPassword = await hashPassword(data.password);
  const user = await prisma.user.create({ data: { ...data, password: hashedPassword } });
  const { password, ...userWithoutPassword } = user as any;
  return userWithoutPassword;
};

export const updateUser = async (id: string, data: any) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError('User not found', 404);
  if (data.email) {
    const existing = await prisma.user.findFirst({ where: { email: data.email, id: { not: id } } });
    if (existing) throw new AppError('Email already in use', 409);
  }
  const updated = await prisma.user.update({ where: { id }, data });
  const { password, ...userWithoutPassword } = updated as any;
  return userWithoutPassword;
};

export const changePassword = async (id: string, currentPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError('User not found', 404);
  const valid = await comparePassword(currentPassword, user.password);
  if (!valid) throw new AppError('Current password is incorrect', 401);
  const hashed = await hashPassword(newPassword);
  await prisma.user.update({ where: { id }, data: { password: hashed } });
  return { message: 'Password changed successfully' };
};

export const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError('User not found', 404);
  await prisma.user.delete({ where: { id } });
  return { message: 'User deleted successfully' };
};
