import client from './client';
import { AuthResponse, LoginPayload, User } from '@/types';

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await client.post('/auth/login', payload);
    return data;
  },

  register: async (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: string;
  }): Promise<AuthResponse> => {
    const { data } = await client.post('/auth/register', {
      ...payload,
      name: `${payload.firstName} ${payload.lastName}`.trim(),
    });
    return data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await client.get('/auth/me');
    return data;
  },

  logout: async (): Promise<void> => {
    await client.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const { data } = await client.post('/auth/refresh-token', { refreshToken });
    return data;
  },

  updateProfile: async (payload: Partial<User>): Promise<User> => {
    const { data } = await client.put('/auth/profile', payload);
    return data;
  },

  changePassword: async (payload: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await client.put('/auth/change-password', payload);
  },
};
