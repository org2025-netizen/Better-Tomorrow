import client from './client';
import { Payment, PaginatedResponse } from '@/types';

export const paymentsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    studentId?: string;
    invoiceId?: string;
    paymentMethod?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<Payment>> => {
    const { data } = await client.get('/payments', { params });
    return data;
  },

  getById: async (id: string): Promise<Payment> => {
    const { data } = await client.get(`/payments/${id}`);
    return data;
  },

  create: async (payload: Partial<Payment>): Promise<Payment> => {
    const { data } = await client.post('/payments', payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/payments/${id}`);
  },

  getByStudent: async (studentId: string): Promise<Payment[]> => {
    const { data } = await client.get(`/payments/student/${studentId}`);
    return data;
  },

  getReceipt: async (id: string): Promise<Blob> => {
    const { data } = await client.get(`/payments/${id}/receipt`, {
      responseType: 'blob',
    });
    return data;
  },

  verifyMpesa: async (payload: {
    transactionId: string;
    invoiceId: string;
  }): Promise<Payment> => {
    const { data } = await client.post('/payments/verify-mpesa', payload);
    return data;
  },
};
