import { Response } from 'express';
import * as testimonialService from '../services/testimonial.service';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../types';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const result = await testimonialService.getAllTestimonials(req.query as any);
    return sendPaginated(res, result.data, result.total, result.page, result.limit);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const testimonial = await testimonialService.getTestimonialById(req.params.id);
    return sendSuccess(res, testimonial);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const testimonial = await testimonialService.createTestimonial(req.body);
    return sendSuccess(res, testimonial, 'Testimonial submitted', 201);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const testimonial = await testimonialService.updateTestimonial(req.params.id, req.body);
    return sendSuccess(res, testimonial, 'Testimonial updated');
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const result = await testimonialService.deleteTestimonial(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export const getApproved = async (req: AuthRequest, res: Response) => {
  try {
    const testimonials = await testimonialService.getApprovedTestimonials();
    return sendSuccess(res, testimonials);
  } catch (error: any) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};
