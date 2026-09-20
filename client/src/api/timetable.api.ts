import client from './client';
import { Timetable, PaginatedResponse } from '@/types';

export const timetableApi = {
  getAll: async (params?: {
    classId?: string;
    teacherId?: string;
    dayOfWeek?: string;
  }): Promise<Timetable[]> => {
    const { data } = await client.get('/timetable', { params });
    return data;
  },

  getById: async (id: string): Promise<Timetable> => {
    const { data } = await client.get(`/timetable/${id}`);
    return data;
  },

  create: async (payload: Partial<Timetable>): Promise<Timetable> => {
    const { data } = await client.post('/timetable', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Timetable>): Promise<Timetable> => {
    const { data } = await client.put(`/timetable/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/timetable/${id}`);
  },

  getByClass: async (classId: string): Promise<Timetable[]> => {
    const { data } = await client.get(`/timetable/class/${classId}`);
    return data;
  },

  getByTeacher: async (teacherId: string): Promise<Timetable[]> => {
    const { data } = await client.get(`/timetable/teacher/${teacherId}`);
    return data;
  },

  bulkCreate: async (payload: {
    classId: string;
    entries: Partial<Timetable>[];
  }): Promise<Timetable[]> => {
    const { data } = await client.post('/timetable/bulk', payload);
    return data;
  },
};
