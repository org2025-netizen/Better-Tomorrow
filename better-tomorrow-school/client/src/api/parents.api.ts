import client from './client';
import { Parent, PaginatedResponse } from '@/types';

export const parentsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Parent>> => {
    const { data } = await client.get('/parents', { params });
    return data;
  },

  getById: async (id: string): Promise<Parent> => {
    const { data } = await client.get(`/parents/${id}`);
    return data;
  },

  create: async (payload: Partial<Parent>): Promise<Parent> => {
    const { data } = await client.post('/parents', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Parent>): Promise<Parent> => {
    const { data } = await client.put(`/parents/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/parents/${id}`);
  },

  getChildren: async (id: string): Promise<any[]> => {
    const { data } = await client.get(`/parents/${id}/children`);
    return data;
  },
};
