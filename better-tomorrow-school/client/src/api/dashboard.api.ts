import client from './client';
import { DashboardStats } from '@/types';

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await client.get('/dashboard/stats');
    return data;
  },

  getAdminStats: async (): Promise<DashboardStats> => {
    const { data } = await client.get('/dashboard/admin');
    return data;
  },

  getParentStats: async (parentId: string): Promise<any> => {
    const { data } = await client.get(`/dashboard/parent/${parentId}`);
    return data;
  },

  getTeacherStats: async (teacherId: string): Promise<any> => {
    const { data } = await client.get(`/dashboard/teacher/${teacherId}`);
    return data;
  },

  getRevenueReport: async (params: {
    startDate: string;
    endDate: string;
  }): Promise<{ month: string; amount: number }[]> => {
    const { data } = await client.get('/dashboard/revenue', { params });
    return data;
  },

  getEnrollmentTrend: async (): Promise<{ month: string; count: number }[]> => {
    const { data } = await client.get('/dashboard/enrollment-trend');
    return data;
  },

  getAuditLogs: async (params?: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any> => {
    const { data } = await client.get('/dashboard/audit-logs', { params });
    return data;
  },
};
