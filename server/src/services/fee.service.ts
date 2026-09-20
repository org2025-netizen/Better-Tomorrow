import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PaginationParams } from '../types';

export const getAllFeeStructures = async (params: PaginationParams) => {
  const { page = 1, limit = 10, classId, academicYearId, termId } = params as any;
  const skip = (Number(page) - 1) * Number(limit);
  const where: any = {};
  if (classId) where.classId = classId;
  if (academicYearId) where.academicYearId = academicYearId;
  if (termId) where.termId = termId;

  const [structures, total] = await Promise.all([
    prisma.feeStructure.findMany({
      where, skip, take: Number(limit),
      include: { class: true, academicYear: true, term: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.feeStructure.count({ where }),
  ]);
  return { data: structures, total, page: Number(page), limit: Number(limit) };
};

export const getFeeStructureById = async (id: string) => {
  const structure = await prisma.feeStructure.findUnique({
    where: { id }, include: { class: true, academicYear: true, term: true },
  });
  if (!structure) throw new AppError('Fee structure not found', 404);
  return structure;
};

export const createFeeStructure = async (data: any) => {
  return prisma.feeStructure.create({
    data, include: { class: true, academicYear: true, term: true },
  });
};

export const updateFeeStructure = async (id: string, data: any) => {
  const structure = await prisma.feeStructure.findUnique({ where: { id } });
  if (!structure) throw new AppError('Fee structure not found', 404);
  return prisma.feeStructure.update({ where: { id }, data, include: { class: true } });
};

export const deleteFeeStructure = async (id: string) => {
  const structure = await prisma.feeStructure.findUnique({ where: { id } });
  if (!structure) throw new AppError('Fee structure not found', 404);
  await prisma.feeStructure.delete({ where: { id } });
  return { message: 'Fee structure deleted successfully' };
};

export const getAllInvoices = async (params: PaginationParams) => {
  const { page = 1, limit = 10, studentId, status } = params as any;
  const skip = (Number(page) - 1) * Number(limit);
  const where: any = {};
  if (studentId) where.studentId = studentId;
  if (status) where.status = status;

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where, skip, take: Number(limit),
      include: { student: { select: { firstName: true, lastName: true, admissionNumber: true } }, feeStructure: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.invoice.count({ where }),
  ]);
  return { data: invoices, total, page: Number(page), limit: Number(limit) };
};

export const getInvoiceById = async (id: string) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { student: true, feeStructure: true, payments: true },
  });
  if (!invoice) throw new AppError('Invoice not found', 404);
  return invoice;
};

export const createInvoice = async (data: any) => {
  return prisma.invoice.create({ data, include: { student: true, feeStructure: true } });
};

export const updateInvoice = async (id: string, data: any) => {
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) throw new AppError('Invoice not found', 404);
  return prisma.invoice.update({ where: { id }, data, include: { student: true, feeStructure: true } });
};

export const deleteInvoice = async (id: string) => {
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) throw new AppError('Invoice not found', 404);
  await prisma.invoice.delete({ where: { id } });
  return { message: 'Invoice deleted successfully' };
};
