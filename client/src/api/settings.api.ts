import client from './client';

export interface SchoolSettings {
  [key: string]: string;
}

export const settingsApi = {
  getAll: async (): Promise<SchoolSettings> => {
    const { data } = await client.get('/settings');
    return data;
  },

  get: async (key: string): Promise<string | null> => {
    const { data } = await client.get(`/settings/${key}`);
    return data.value;
  },

  bulkUpdate: async (settings: { key: string; value: string }[]): Promise<any> => {
    const { data } = await client.post('/settings/bulk', { settings });
    return data;
  },
};
