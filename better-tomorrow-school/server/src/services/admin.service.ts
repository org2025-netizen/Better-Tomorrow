import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { normalizeRole, splitName } from './auth.service';
import { sendApprovalEmail } from './auth.service';

export const getUsers = async (filters?: { role?: string; status?: string }) => {
  const where: any = {};
  if (filters?.role) where.role = filters.role.toUpperCase();
  if (filters?.status) where.status = filters.status.toUpperCase();

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

export const getUserStats = async () => {
  const [total, pending, approved, rejected, parents, teachers, admins] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'PENDING' } }),
    prisma.user.count({ where: { status: 'APPROVED' } }),
    prisma.user.count({ where: { status: 'REJECTED' } }),
    prisma.user.count({ where: { role: 'PARENT' } }),
    prisma.user.count({ where: { role: 'TEACHER' } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
  ]);

  return {
    total,
    pending,
    approved,
    rejected,
    byRole: { parents, teachers, admins },
  };
};