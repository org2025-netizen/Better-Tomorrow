import client from './client';
import { Subject, PaginatedResponse } from '@/types';

export const subjectsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    classLevel?: string;
    search?: string;
  }): Promise<PaginatedResponse<Subject>> => {
    const { data } = await client.get('/subjects', { params });
    return data;
  },

  getById: async (id: string): Promise<Subject> => {
    const { data } = await client.get(`/subjects/${id}`);
    return data;
  },

  create: async (payload: Partial<Subject>): Promise<Subject> => {
    const { data } = await client.post('/subjects', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Subject>): Promise<Subject> => {
    const { data } = await client.put(`/subjects/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/subjects/${id}`);
  },
};
