import client from './client';
import { AdmissionEnquiry, SchoolVisit, PaginatedResponse } from '@/types';

export const admissionsApi = {
  submitEnquiry: async (payload: any): Promise<AdmissionEnquiry> => {
    const { data } = await client.post('/admissions', {
      parentName: payload.parentName,
      parentPhone: payload.parentPhone,
      parentEmail: payload.parentEmail,
      learnerName: payload.childName,
      dateOfBirth: payload.childDob,
      gender: payload.gender?.toUpperCase(),
      currentSchool: payload.currentSchool,
      gradeApplyingFor: payload.classApplyingFor,
      message: payload.message,
    });
    return data;
  },

  getAllEnquiries: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<AdmissionEnquiry>> => {
    const { data } = await client.get('/admissions/enquiries', { params });
    return data;
  },

  getEnquiryById: async (id: string): Promise<AdmissionEnquiry> => {
    const { data } = await client.get(`/admissions/enquiries/${id}`);
    return data;
  },

  updateEnquiryStatus: async (
    id: string,
    status: string
  ): Promise<AdmissionEnquiry> => {
    const { data } = await client.put(`/admissions/enquiries/${id}`, { status });
    return data;
  },

  deleteEnquiry: async (id: string): Promise<void> => {
    await client.delete(`/admissions/enquiries/${id}`);
  },

  bookVisit: async (payload: any): Promise<SchoolVisit> => {
    const { data } = await client.post('/school-visits', {
      parentName: payload.parentName,
      phone: payload.parentPhone,
      email: payload.parentEmail,
      preferredDate: payload.visitDate,
      preferredTime: payload.visitTime,
      numberOfVisitors: payload.numberOfChildren,
      message: payload.notes,
    });
    return data;
  },

  getAllVisits: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<SchoolVisit>> => {
    const { data } = await client.get('/admissions/visits', { params });
    return data;
  },

  getVisitById: async (id: string): Promise<SchoolVisit> => {
    const { data } = await client.get(`/admissions/visits/${id}`);
    return data;
  },

  updateVisitStatus: async (id: string, status: string): Promise<SchoolVisit> => {
    const { data } = await client.put(`/admissions/visits/${id}`, { status });
    return data;
  },

  deleteVisit: async (id: string): Promise<void> => {
    await client.delete(`/admissions/visits/${id}`);
  },
};
