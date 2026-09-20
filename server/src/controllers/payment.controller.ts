import { Response } from 'express';
import * as paymentService from '../services/payment.service';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../types';
import prisma from '../config/database';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const result = await paymentService.getAllPayments(req.query as any);
    return sendPaginated(res, result.data, result.total, result.page, result.limit);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    return sendSuccess(res, payment);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getByStudent = async (req: AuthRequest, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { studentId: req.params.studentId },
      include: { invoice: true, student: { select: { firstName: true, lastName: true, admissionNumber: true } }, receipt: true },
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, payments);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const payment = await paymentService.createPayment({ ...req.body, recordedBy: req.user?.userId });
    return sendSuccess(res, payment, 'Payment recorded', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const result = await paymentService.deletePayment(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getReceipts = async (req: AuthRequest, res: Response) => {
  try {
    const result = await paymentService.getReceipts(req.query as any);
    return sendPaginated(res, result.data, result.total, result.page, result.limit);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getReceiptById = async (req: AuthRequest, res: Response) => {
  try {
    const receipt = await paymentService.getReceiptById(req.params.id);
    return sendSuccess(res, receipt);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getReceiptByPaymentId = async (req: AuthRequest, res: Response) => {
  try {
    const receipt = await prisma.receipt.findUnique({
      where: { paymentId: req.params.id },
      include: { payment: true, student: true },
    });
    if (!receipt) return sendError(res, 'Receipt not found', 404);
    return sendSuccess(res, receipt);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
