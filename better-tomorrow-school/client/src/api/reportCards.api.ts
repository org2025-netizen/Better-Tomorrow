import client from './client';
import { ReportCard, PaginatedResponse } from '@/types';

export const reportCardsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    classId?: string;
    academicYear?: string;
    term?: string;
  }): Promise<PaginatedResponse<ReportCard>> => {
    const { data } = await client.get('/report-cards', { params });
    return data;
  },

  getById: async (id: string): Promise<ReportCard> => {
    const { data } = await client.get(`/report-cards/${id}`);
    return data;
  },

  generate: async (payload: {
    classId: string;
    academicYear: string;
    term: string;
  }): Promise<ReportCard[]> => {
    const { data } = await client.post('/report-cards/generate', payload);
    return data;
  },

  getByStudent: async (
    studentId: string,
    params?: { academicYear?: string; term?: string }
  ): Promise<ReportCard[]> => {
    const { data } = await client.get(`/report-cards/student/${studentId}`, { params });
    return data;
  },

  downloadPdf: async (id: string): Promise<Blob> => {
    const { data } = await client.get(`/report-cards/${id}/pdf`, {
      responseType: 'blob',
    });
    return data;
  },

  updateRemarks: async (
    id: string,
    payload: { teacherRemarks?: string; principalRemarks?: string }
  ): Promise<ReportCard> => {
    const { data } = await client.put(`/report-cards/${id}/remarks`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/report-cards/${id}`);
  },
};
