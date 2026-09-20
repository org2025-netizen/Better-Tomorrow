import client from './client';
import { GalleryItem, PaginatedResponse } from '@/types';

export const galleryApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<PaginatedResponse<GalleryItem>> => {
    const { data } = await client.get('/gallery', { params });
    return data;
  },

  getById: async (id: string): Promise<GalleryItem> => {
    const { data } = await client.get(`/gallery/${id}`);
    return data;
  },

  upload: async (payload: FormData): Promise<GalleryItem> => {
    const { data } = await client.post('/gallery', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  update: async (id: string, payload: Partial<GalleryItem>): Promise<GalleryItem> => {
    const { data } = await client.put(`/gallery/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/gallery/${id}`);
  },

  getPublic: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
  }): Promise<PaginatedResponse<GalleryItem>> => {
    const { data } = await client.get('/gallery/public', { params });
    return data;
  },

  getCategories: async (): Promise<string[]> => {
    const { data } = await client.get('/gallery/categories');
    return data;
  },
};
