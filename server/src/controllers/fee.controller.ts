import { Response } from 'express';
import * as feeService from '../services/fee.service';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../types';
import prisma from '../config/database';

export const getAllStructures = async (req: AuthRequest, res: Response) => {
  try {
    const result = await feeService.getAllFeeStructures(req.query as any);
    return sendPaginated(res, result.data, result.total, result.page, result.limit);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getStructureById = async (req: AuthRequest, res: Response) => {
  try {
    const structure = await feeService.getFeeStructureById(req.params.id);
    return sendSuccess(res, structure);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const createStructure = async (req: AuthRequest, res: Response) => {
  try {
    const structure = await feeService.createFeeStructure(req.body);
    return sendSuccess(res, structure, 'Fee structure created', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const updateStructure = async (req: AuthRequest, res: Response) => {
  try {
    const structure = await feeService.updateFeeStructure(req.params.id, req.body);
    return sendSuccess(res, structure, 'Fee structure updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const deleteStructure = async (req: AuthRequest, res: Response) => {
  try {
    const result = await feeService.deleteFeeStructure(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getAllInvoices = async (req: AuthRequest, res: Response) => {
  try {
    const result = await feeService.getAllInvoices(req.query as any);
    return sendPaginated(res, result.data, result.total, result.page, result.limit);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getStudentInvoices = async (req: AuthRequest, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { studentId: req.params.studentId },
      include: { student: { select: { firstName: true, lastName: true, admissionNumber: true } }, feeStructure: true, payments: true },
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, invoices);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const generateInvoices = async (req: AuthRequest, res: Response) => {
  try {
    const { classId, feeStructureId, dueDate } = req.body;
    const students = await prisma.student.findMany({
      where: { classId, status: 'ACTIVE' },
    });
    const invoices = await Promise.all(
      students.map(async (student) => {
        const existing = await prisma.invoice.findFirst({
          where: { studentId: student.id, feeStructureId },
        });
        if (existing) return existing;
        const structure = await prisma.feeStructure.findUnique({ where: { id: feeStructureId } });
        return prisma.invoice.create({
          data: {
            studentId: student.id,
            feeStructureId,
            amount: structure?.amount || 0,
            dueDate: new Date(dueDate),
            status: 'PENDING',
          },
        });
      })
    );
    return sendSuccess(res, invoices, 'Invoices generated', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getInvoiceById = async (req: AuthRequest, res: Response) => {
  try {
    const invoice = await feeService.getInvoiceById(req.params.id);
    return sendSuccess(res, invoice);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const createInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const invoice = await feeService.createInvoice(req.body);
    return sendSuccess(res, invoice, 'Invoice created', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const updateInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const invoice = await feeService.updateInvoice(req.params.id, req.body);
    return sendSuccess(res, invoice, 'Invoice updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const deleteInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const result = await feeService.deleteInvoice(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
