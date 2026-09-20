import client from './client';
import { Attendance, PaginatedResponse } from '@/types';

export const attendanceApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    classId?: string;
    date?: string;
    studentId?: string;
  }): Promise<PaginatedResponse<Attendance>> => {
    const { data } = await client.get('/attendance', { params });
    return data;
  },

  getById: async (id: string): Promise<Attendance> => {
    const { data } = await client.get(`/attendance/${id}`);
    return data;
  },

  record: async (payload: {
    classId: string;
    date: string;
    records: { studentId: string; status: string; remarks?: string }[];
  }): Promise<Attendance[]> => {
    const { data } = await client.post('/attendance', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Attendance>): Promise<Attendance> => {
    const { data } = await client.put(`/attendance/${id}`, payload);
    return data;
  },

  getByDateRange: async (params: {
    classId: string;
    startDate: string;
    endDate: string;
  }): Promise<Attendance[]> => {
    const { data } = await client.get('/attendance/report', { params });
    return data;
  },

  getStudentAttendance: async (
    studentId: string,
    params?: { startDate?: string; endDate?: string }
  ): Promise<Attendance[]> => {
    const { data } = await client.get(`/attendance/student/${studentId}`, { params });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/attendance/${id}`);
  },
};
