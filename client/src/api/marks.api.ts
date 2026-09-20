import client from './client';
import { Mark, PaginatedResponse } from '@/types';

export const marksApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    examId?: string;
    studentId?: string;
  }): Promise<PaginatedResponse<Mark>> => {
    const { data } = await client.get('/marks', { params });
    return data;
  },

  getById: async (id: string): Promise<Mark> => {
    const { data } = await client.get(`/marks/${id}`);
    return data;
  },

  enterMarks: async (payload: {
    examId: string;
    marks: { studentId: string; marksObtained: number; remarks?: string }[];
  }): Promise<Mark[]> => {
    const { data } = await client.post('/marks', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Mark>): Promise<Mark> => {
    const { data } = await client.put(`/marks/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/marks/${id}`);
  },

  getByExam: async (examId: string): Promise<Mark[]> => {
    const { data } = await client.get(`/marks/exam/${examId}`);
    return data;
  },

  getByStudent: async (studentId: string): Promise<Mark[]> => {
    const { data } = await client.get(`/marks/student/${studentId}`);
    return data;
  },
};
