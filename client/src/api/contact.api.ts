import client from './client';
import { ContactMessage, PaginatedResponse } from '@/types';

export const contactApi = {
  sendMessage: async (payload: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<ContactMessage> => {
    const { data } = await client.post('/contact', payload);
    return data;
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
    search?: string;
  }): Promise<PaginatedResponse<ContactMessage>> => {
    const { data } = await client.get('/contact', { params });
    return data;
  },

  getById: async (id: string): Promise<ContactMessage> => {
    const { data } = await client.get(`/contact/${id}`);
    return data;
  },

  markAsRead: async (id: string): Promise<ContactMessage> => {
    const { data } = await client.put(`/contact/${id}/read`);
    return data;
  },

  markAsUnread: async (id: string): Promise<ContactMessage> => {
    const { data } = await client.put(`/contact/${id}/unread`);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/contact/${id}`);
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const { data } = await client.get('/contact/unread-count');
    return data;
  },
};
