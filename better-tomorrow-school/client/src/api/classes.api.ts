import client from './client';
import { Class, PaginatedResponse } from '@/types';

export const classesApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    level?: string;
    academicYear?: string;
  }): Promise<PaginatedResponse<Class>> => {
    const { data } = await client.get('/classes', { params });
    return data;
  },

  getById: async (id: string): Promise<Class> => {
    const { data } = await client.get(`/classes/${id}`);
    return data;
  },

  create: async (payload: Partial<Class>): Promise<Class> => {
    const { data } = await client.post('/classes', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Class>): Promise<Class> => {
    const { data } = await client.put(`/classes/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/classes/${id}`);
  },

  getStudents: async (id: string): Promise<any[]> => {
    const { data } = await client.get(`/classes/${id}/students`);
    return data;
  },
};
