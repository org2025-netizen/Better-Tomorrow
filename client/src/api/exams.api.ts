import client from './client';
import { Exam, PaginatedResponse } from '@/types';

export const examsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    classId?: string;
    subjectId?: string;
    type?: string;
    academicYear?: string;
    term?: string;
  }): Promise<PaginatedResponse<Exam>> => {
    const { data } = await client.get('/exams', { params });
    return data;
  },

  getById: async (id: string): Promise<Exam> => {
    const { data } = await client.get(`/exams/${id}`);
    return data;
  },

  create: async (payload: Partial<Exam>): Promise<Exam> => {
    const { data } = await client.post('/exams', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Exam>): Promise<Exam> => {
    const { data } = await client.put(`/exams/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/exams/${id}`);
  },

  getResults: async (id: string): Promise<any[]> => {
    const { data } = await client.get(`/exams/${id}/results`);
    return data;
  },
};
