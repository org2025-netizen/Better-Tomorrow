import client from './client';
import { FeeStructure, Invoice, PaginatedResponse } from '@/types';

export const feesApi = {
  getStructures: async (params?: {
    page?: number;
    limit?: number;
    classLevel?: string;
    academicYear?: string;
  }): Promise<PaginatedResponse<FeeStructure>> => {
    const { data } = await client.get('/fees/structures', { params });
    return data;
  },

  createStructure: async (payload: Partial<FeeStructure>): Promise<FeeStructure> => {
    const { data } = await client.post('/fees/structures', payload);
    return data;
  },

  updateStructure: async (
    id: string,
    payload: Partial<FeeStructure>
  ): Promise<FeeStructure> => {
    const { data } = await client.put(`/fees/structures/${id}`, payload);
    return data;
  },

  deleteStructure: async (id: string): Promise<void> => {
    await client.delete(`/fees/structures/${id}`);
  },

  getInvoices: async (params?: {
    page?: number;
    limit?: number;
    studentId?: string;
    status?: string;
    academicYear?: string;
    term?: string;
  }): Promise<PaginatedResponse<Invoice>> => {
    const { data } = await client.get('/fees/invoices', { params });
    return data;
  },

  getInvoiceById: async (id: string): Promise<Invoice> => {
    const { data } = await client.get(`/fees/invoices/${id}`);
    return data;
  },

  createInvoice: async (payload: Partial<Invoice>): Promise<Invoice> => {
    const { data } = await client.post('/fees/invoices', payload);
    return data;
  },

  generateInvoices: async (payload: {
    classId: string;
    feeStructureId: string;
    academicYear: string;
    term: string;
  }): Promise<Invoice[]> => {
    const { data } = await client.post('/fees/invoices/generate', payload);
    return data;
  },

  getStudentInvoices: async (studentId: string): Promise<Invoice[]> => {
    const { data } = await client.get(`/fees/invoices/student/${studentId}`);
    return data;
  },

  deleteInvoice: async (id: string): Promise<void> => {
    await client.delete(`/fees/invoices/${id}`);
  },
};
