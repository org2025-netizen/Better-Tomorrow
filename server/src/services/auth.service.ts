import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { JwtPayload, UserRole } from '../types';

const normalizeRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    TEACHER: 'teacher',
    PARENT: 'parent',
    STUDENT: 'student',
    ACCOUNTANT: 'accountant',
  };
  return roleMap[role] || role.toLowerCase();
};

const splitName = (name: string): { firstName: string; lastName: string } => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError('Invalid credentials', 401);

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) throw new AppError('Invalid credentials', 401);

  if (!user.isActive) throw new AppError('Account is deactivated', 403);

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role as UserRole };
  const tokens = generateTokens(payload);
  const { firstName, lastName } = splitName(user.name);

  return {
    user: { id: user.id, email: user.email, firstName, lastName, role: normalizeRole(user.role), avatar: user.avatar, isActive: user.isActive },
    ...tokens,
  };
};

export const registerUser = async (data: { email: string; password: string; name: string; phone?: string; role?: string }) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) throw new AppError('Email already registered', 409);

  const hashedPassword = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      phone: data.phone,
      role: (data.role as any) || 'STUDENT',
    },
  });

  const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role as UserRole };
  const tokens = generateTokens(payload);
  const { firstName, lastName } = splitName(user.name);

  return {
    user: { id: user.id, email: user.email, firstName, lastName, role: normalizeRole(user.role), avatar: user.avatar, isActive: user.isActive },
    ...tokens,
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken) as JwtPayload;

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user || !user.isActive) throw new AppError('User not found or inactive', 401);

  const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role as UserRole };
  const tokens = generateTokens(payload);

  return tokens;
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      avatar: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) throw new AppError('User not found', 404);
  const { firstName, lastName } = splitName(user.name);
  return { ...user, firstName, lastName, role: normalizeRole(user.role) };
};
