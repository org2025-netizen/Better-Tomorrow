import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { JwtPayload, UserRole } from '../types';

export const normalizeRole = (role: string): string => {
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

export const splitName = (name: string): { firstName: string; lastName: string } => {
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
  if (user.status === 'PENDING') throw new AppError('Account is pending admin approval', 403);
  if (user.status === 'REJECTED') throw new AppError(`Account rejected: ${user.rejectionReason || 'No reason provided'}`, 403);

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role as UserRole };
  const tokens = generateTokens(payload);
  const { firstName, lastName } = splitName(user.name);

  return {
    user: { id: user.id, email: user.email, firstName, lastName, role: normalizeRole(user.role), avatar: user.avatar, isActive: user.isActive, status: user.status },
    ...tokens,
  };
};

export const registerUser = async (data: { email: string; password: string; name: string; phone?: string; role?: string }) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) throw new AppError('Email already registered', 409);

  const allowedRoles = ['PARENT', 'TEACHER', 'ADMIN'];
  const role = data.role && allowedRoles.includes(data.role.toUpperCase()) ? data.role.toUpperCase() : 'PARENT';

  const hashedPassword = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      phone: data.phone,
      role,
      status: 'PENDING',
    },
  });

  const { firstName, lastName } = splitName(user.name);

  return {
    user: { id: user.id, email: user.email, firstName, lastName, role: normalizeRole(user.role), avatar: user.avatar, isActive: user.isActive, status: user.status },
    message: 'Registration submitted for admin approval',
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
      status: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) throw new AppError('User not found', 404);
  const { firstName, lastName } = splitName(user.name);
  return { ...user, firstName, lastName, role: normalizeRole(user.role) };
};

export const getPendingUsers = async () => {
  const users = await prisma.user.findMany({
    where: { status: 'PENDING' },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });
  return users.map(u => ({ ...u, firstName: splitName(u.name).firstName, lastName: splitName(u.name).lastName, role: normalizeRole(u.role) }));
};

export const getAllUsers = async (filters?: { role?: string; status?: string }) => {
  const where: any = {};
  if (filters?.role) where.role = filters.role;
  if (filters?.status) where.status = filters.status;

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      avatar: true,
      isActive: true,
      status: true,
      approvedBy: true,
      approvedAt: true,
      rejectionReason: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return users.map(u => ({ ...u, firstName: splitName(u.name).firstName, lastName: splitName(u.name).lastName, role: normalizeRole(u.role) }));
};

export const approveUser = async (userId: string, adminId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);
  if (user.status !== 'PENDING') throw new AppError('User is not pending approval', 400);

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      status: 'APPROVED',
      approvedBy: adminId,
      approvedAt: new Date(),
      isActive: true,
    },
  });

  await sendApprovalEmail(updated.email, updated.name, true);
  
  const { firstName, lastName } = splitName(updated.name);
  return { ...updated, firstName, lastName, role: normalizeRole(updated.role) };
};

export const rejectUser = async (userId: string, adminId: string, reason: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);
  if (user.status !== 'PENDING') throw new AppError('User is not pending approval', 400);

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      status: 'REJECTED',
      approvedBy: adminId,
      approvedAt: new Date(),
      rejectionReason: reason,
      isActive: false,
    },
  });

  await sendApprovalEmail(updated.email, updated.name, false, reason);
  
  const { firstName, lastName } = splitName(updated.name);
  return { ...updated, firstName, lastName, role: normalizeRole(updated.role) };
};

export const toggleUserStatus = async (userId: string, adminId: string, isActive: boolean) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);
  if (user.id === adminId) throw new AppError('Cannot deactivate yourself', 400);

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isActive },
  });

  const { firstName, lastName } = splitName(updated.name);
  return { ...updated, firstName, lastName, role: normalizeRole(updated.role) };
};

export const sendApprovalEmail = async (email: string, name: string, approved: boolean, reason?: string) => {
  const { sendEmail } = await import('../utils/email');
  const subject = approved ? 'Account Approved - Better Tomorrow School' : 'Account Rejected - Better Tomorrow School';
  const html = approved
    ? `<p>Dear ${name},</p><p>Your account has been <strong>approved</strong>. You can now log in at <a href="https://bettertomorrowschool.com/login">Better Tomorrow School</a>.</p>`
    : `<p>Dear ${name},</p><p>Your account has been <strong>rejected</strong>. Reason: ${reason || 'Not specified'}.</p>`;
  
  try {
    await sendEmail({ to: email, subject, html });
  } catch (error) {
    console.error('Failed to send approval email:', error);
  }
};
