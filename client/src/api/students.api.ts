import client from './client';
import { Student, PaginatedResponse } from '@/types';

export const studentsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    classId?: string;
    gender?: string;
  }): Promise<PaginatedResponse<Student>> => {
    const { data } = await client.get('/students', { params });
    return data;
  },

  getById: async (id: string): Promise<Student> => {
    const { data } = await client.get(`/students/${id}`);
    return data;
  },

  create: async (payload: Partial<Student>): Promise<Student> => {
    const { data } = await client.post('/students', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Student>): Promise<Student> => {
    const { data } = await client.put(`/students/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/students/${id}`);
  },

  getByClass: async (classId: string): Promise<Student[]> => {
    const { data } = await client.get(`/students/class/${classId}`);
    return data;
  },

  getByParent: async (parentId: string): Promise<Student[]> => {
    const { data } = await client.get(`/students/parent/${parentId}`);
    return data;
  },

  uploadPhoto: async (id: string, file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('photo', file);
    const { data } = await client.post(`/students/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
