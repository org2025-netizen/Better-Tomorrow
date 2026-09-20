import client from './client';
import { News, PaginatedResponse } from '@/types';

export const newsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isPublished?: boolean;
  }): Promise<PaginatedResponse<News>> => {
    const { data } = await client.get('/news', { params });
    return data;
  },

  getById: async (id: string): Promise<News> => {
    const { data } = await client.get(`/news/${id}`);
    return data;
  },

  getBySlug: async (slug: string): Promise<News> => {
    const { data } = await client.get(`/news/slug/${slug}`);
    return data;
  },

  create: async (payload: Partial<News>): Promise<News> => {
    const { data } = await client.post('/news', payload);
    return data;
  },

  update: async (id: string, payload: Partial<News>): Promise<News> => {
    const { data } = await client.put(`/news/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/news/${id}`);
  },

  publish: async (id: string): Promise<News> => {
    const { data } = await client.put(`/news/${id}/publish`);
    return data;
  },

  unpublish: async (id: string): Promise<News> => {
    const { data } = await client.put(`/news/${id}/unpublish`);
    return data;
  },

  getPublic: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<News>> => {
    const { data } = await client.get('/news/public', { params });
    return data;
  },
};
