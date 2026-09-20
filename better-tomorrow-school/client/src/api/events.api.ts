import client from './client';
import { Event, PaginatedResponse } from '@/types';

export const eventsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    startDate?: string;
    endDate?: string;
    isPublic?: boolean;
  }): Promise<PaginatedResponse<Event>> => {
    const { data } = await client.get('/events', { params });
    return data;
  },

  getById: async (id: string): Promise<Event> => {
    const { data } = await client.get(`/events/${id}`);
    return data;
  },

  create: async (payload: Partial<Event>): Promise<Event> => {
    const { data } = await client.post('/events', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Event>): Promise<Event> => {
    const { data } = await client.put(`/events/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/events/${id}`);
  },

  getUpcoming: async (limit?: number): Promise<Event[]> => {
    const { data } = await client.get('/events/upcoming', { params: { limit } });
    return data;
  },

  getPublic: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Event>> => {
    const { data } = await client.get('/events/public', { params });
    return data;
  },
};
