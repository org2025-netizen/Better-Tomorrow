import client from './client';
import { Receipt, PaginatedResponse } from '@/types';

export const receiptsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    studentId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<Receipt>> => {
    const { data } = await client.get('/receipts', { params });
    return data;
  },

  getById: async (id: string): Promise<Receipt> => {
    const { data } = await client.get(`/receipts/${id}`);
    return data;
  },

  getByStudent: async (studentId: string): Promise<Receipt[]> => {
    const { data } = await client.get(`/receipts/student/${studentId}`);
    return data;
  },

  downloadPdf: async (id: string): Promise<Blob> => {
    const { data } = await client.get(`/receipts/${id}/pdf`, {
      responseType: 'blob',
    });
    return data;
  },

  sendEmail: async (id: string, email: string): Promise<void> => {
    await client.post(`/receipts/${id}/send`, { email });
  },
};
