import client from './client';

export const adminApi = {
  getUsers: async (filters?: { role?: string; status?: string }): Promise<any[]> => {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.status) params.append('status', filters.status);
    const { data } = await client.get(`/auth/users?${params.toString()}`);
    return data;
  },

  getPendingUsers: async (): Promise<any[]> => {
    const { data } = await client.get('/auth/pending');
    return data;
  },

  approveUser: async (userId: string): Promise<any> => {
    const { data } = await client.put(`/auth/users/${userId}/approve`);
    return data;
  },

  rejectUser: async (userId: string, reason: string): Promise<any> => {
    const { data } = await client.put(`/auth/users/${userId}/reject`, { reason });
    return data;
  },

  toggleUserStatus: async (userId: string, isActive: boolean): Promise<any> => {
    const { data } = await client.put(`/auth/users/${userId}/status`, { isActive });
    return data;
  },
};