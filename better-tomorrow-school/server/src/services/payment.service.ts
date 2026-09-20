import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { generateReceiptNumber } from '../utils/receipt';
import { PaginationParams } from '../types';

export const getAllPayments = async (params: PaginationParams) => {
  const { page = 1, limit = 10, studentId, invoiceId, paymentMethod, startDate, endDate } = params as any;
  const skip = (Number(page) - 1) * Number(limit);
  const where: any = {};
  if (studentId) where.studentId = studentId;
  if (invoiceId) where.invoiceId = invoiceId;
  if (paymentMethod) where.paymentMethod = paymentMethod;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where, skip, take: Number(limit),
      include: { invoice: true, student: { select: { firstName: true, lastName: true, admissionNumber: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.payment.count({ where }),
  ]);
  return { data: payments, total, page: Number(page), limit: Number(limit) };
};

export const getPaymentById = async (id: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id }, include: { invoice: true, student: true, receipt: true },
  });
  if (!payment) throw new AppError('Payment not found', 404);
  return payment;
};

export const createPayment = async (data: any) => {
  const payment = await prisma.payment.create({
    data: { ...data, recordedBy: data.recordedBy },
    include: { invoice: true, student: true },
  });

  const invoice = await prisma.invoice.findUnique({ where: { id: data.invoiceId } });
  if (invoice) {
    const totalPaid = await prisma.payment.aggregate({ where: { invoiceId: data.invoiceId }, _sum: { amount: true } });
    const paidAmount = (totalPaid._sum.amount || 0) + data.amount;
    let status = 'PARTIAL';
    if (paidAmount >= invoice.amount) status = 'PAID';
    await prisma.invoice.update({ where: { id: data.invoiceId }, data: { status: status as any } });
  }

  const receiptNumber = generateReceiptNumber();
  await prisma.receipt.create({
    data: {
      paymentId: payment.id, receiptNumber, studentId: data.studentId,
      amount: data.amount, paymentMethod: data.paymentMethod,
      referenceNumber: data.referenceNumber, issuedBy: data.recordedBy,
    },
  });

  return payment;
};

export const deletePayment = async (id: string) => {
  const payment = await prisma.payment.findUnique({ where: { id } });
  if (!payment) throw new AppError('Payment not found', 404);
  await prisma.payment.delete({ where: { id } });
  return { message: 'Payment deleted successfully' };
};

export const getReceipts = async (params: PaginationParams) => {
  const { page = 1, limit = 10, studentId, receiptNumber } = params as any;
  const skip = (Number(page) - 1) * Number(limit);
  const where: any = {};
  if (studentId) where.studentId = studentId;
  if (receiptNumber) where.receiptNumber = receiptNumber;

  const [receipts, total] = await Promise.all([
    prisma.receipt.findMany({
      where, skip, take: Number(limit),
      include: { payment: true, student: { select: { firstName: true, lastName: true, admissionNumber: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.receipt.count({ where }),
  ]);
  return { data: receipts, total, page: Number(page), limit: Number(limit) };
};

export const getReceiptById = async (id: string) => {
  const receipt = await prisma.receipt.findUnique({
    where: { id }, include: { payment: true, student: true },
  });
  if (!receipt) throw new AppError('Receipt not found', 404);
  return receipt;
};
