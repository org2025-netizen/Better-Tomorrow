import client from './client';
import { Teacher, PaginatedResponse } from '@/types';

export const teachersApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Teacher>> => {
    const { data } = await client.get('/teachers', { params });
    return data;
  },

  getById: async (id: string): Promise<Teacher> => {
    const { data } = await client.get(`/teachers/${id}`);
    return data;
  },

  create: async (payload: Partial<Teacher>): Promise<Teacher> => {
    const { data } = await client.post('/teachers', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Teacher>): Promise<Teacher> => {
    const { data } = await client.put(`/teachers/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/teachers/${id}`);
  },
};
