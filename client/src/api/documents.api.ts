import client from './client';
import { Document, PaginatedResponse } from '@/types';

export const documentsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    target?: string;
    search?: string;
  }): Promise<PaginatedResponse<Document>> => {
    const { data } = await client.get('/documents', { params });
    return data;
  },

  getById: async (id: string): Promise<Document> => {
    const { data } = await client.get(`/documents/${id}`);
    return data;
  },

  upload: async (payload: FormData): Promise<Document> => {
    const { data } = await client.post('/documents', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  update: async (id: string, payload: Partial<Document>): Promise<Document> => {
    const { data } = await client.put(`/documents/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/documents/${id}`);
  },

  download: async (id: string): Promise<Blob> => {
    const { data } = await client.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return data;
  },

  getCategories: async (): Promise<string[]> => {
    const { data } = await client.get('/documents/categories');
    return data;
  },
};
