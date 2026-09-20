import client from './client';
import { Announcement, PaginatedResponse } from '@/types';

export const announcementsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    target?: string;
    priority?: string;
  }): Promise<PaginatedResponse<Announcement>> => {
    const { data } = await client.get('/announcements', { params });
    return data;
  },

  getById: async (id: string): Promise<Announcement> => {
    const { data } = await client.get(`/announcements/${id}`);
    return data;
  },

  create: async (payload: Partial<Announcement>): Promise<Announcement> => {
    const { data } = await client.post('/announcements', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Announcement>): Promise<Announcement> => {
    const { data } = await client.put(`/announcements/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/announcements/${id}`);
  },

  getActive: async (target?: string): Promise<Announcement[]> => {
    const { data } = await client.get('/announcements/active', { params: { target } });
    return data;
  },

  getPublic: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Announcement>> => {
    const { data } = await client.get('/announcements/public', { params });
    return data;
  },
};
