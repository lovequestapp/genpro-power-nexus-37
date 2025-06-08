import axios from 'axios';
import { Service, Bill, Generator, ApiResponse, StaffMember, Customer, Alert } from '@/types';

// Use Vite's environment variable format
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Generator Management
export const generatorService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Generator[]>>('/generators');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Generator>>(`/generators/${id}`);
    return response.data;
  },
  update: async (id: string, data: Partial<Generator>) => {
    const response = await api.put<ApiResponse<Generator>>(`/generators/${id}`, data);
    return response.data;
  },
  getStatus: async (id: string) => {
    const response = await api.get<ApiResponse<{ status: string }>>(`/generators/${id}/status`);
    return response.data;
  },
};

// Customer Management
export const customerService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Customer[]>>('/customers');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Customer>>(`/customers/${id}`);
    return response.data;
  },
  create: async (data: Partial<Customer>) => {
    const response = await api.post<ApiResponse<Customer>>('/customers', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Customer>) => {
    const response = await api.put<ApiResponse<Customer>>(`/customers/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/customers/${id}`);
    return response.data;
  },
};

// Billing Management
export const billingService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Bill[]>>('/billing');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Bill>>(`/billing/${id}`);
    return response.data;
  },
  pay: async (id: string) => {
    const response = await api.post<ApiResponse<Bill>>(`/billing/${id}/pay`);
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get<ApiResponse<Bill[]>>('/billing/history');
    return response.data;
  },
};

// Service Management
export const serviceService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Service[]>>('/services');
    return response.data;
  },
  getByGenerator: async (generatorId: string) => {
    const response = await api.get<ApiResponse<Service[]>>(`/services/generator/${generatorId}`);
    return response.data;
  },
  schedule: async (data: Partial<Service>) => {
    const response = await api.post<ApiResponse<Service>>('/services', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Service>) => {
    const response = await api.put<ApiResponse<Service>>(`/services/${id}`, data);
    return response.data;
  },
  complete: async (id: string) => {
    const response = await api.put<ApiResponse<Service>>(`/services/${id}/complete`);
    return response.data;
  },
};

// Alert Management
export const alertService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Alert[]>>('/alerts');
    return response.data;
  },
  getByGenerator: async (generatorId: string) => {
    const response = await api.get<ApiResponse<Alert[]>>(`/alerts/generator/${generatorId}`);
    return response.data;
  },
  create: async (data: Partial<Alert>) => {
    const response = await api.post<ApiResponse<Alert>>('/alerts', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Alert>) => {
    const response = await api.put<ApiResponse<Alert>>(`/alerts/${id}`, data);
    return response.data;
  },
  resolve: async (id: string) => {
    const response = await api.put<ApiResponse<Alert>>(`/alerts/${id}/resolve`);
    return response.data;
  },
};

// Support Management
export const supportService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Service[]>>('/support');
    return response.data;
  },
  getByCustomer: async (customerId: string) => {
    const response = await api.get<ApiResponse<Service[]>>(`/support/customer/${customerId}`);
    return response.data;
  },
  create: async (data: Partial<Service>) => {
    const response = await api.post<ApiResponse<Service>>('/support', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Service>) => {
    const response = await api.put<ApiResponse<Service>>(`/support/${id}`, data);
    return response.data;
  },
  addComment: async (id: string, data: { author: string; content: string }) => {
    const response = await api.post<ApiResponse<Service>>(`/support/${id}/comment`, data);
    return response.data;
  },
  close: async (id: string) => {
    const response = await api.put<ApiResponse<Service>>(`/support/${id}/close`);
    return response.data;
  },
  getStaff: async () => {
    const response = await api.get<ApiResponse<StaffMember[]>>('/support/staff');
    return response.data;
  },
  assignTicket: async (ticketId: string, staffId: string) => {
    const response = await api.put<ApiResponse<Service>>(`/support/${ticketId}/assign`, { staffId });
    return response.data;
  },
  unassignTicket: async (ticketId: string) => {
    const response = await api.put<ApiResponse<Service>>(`/support/${ticketId}/assign`, { staffId: null });
    return response.data;
  },
  updateStatus: async (id: string, status: Service['status']) => {
    const response = await api.put<ApiResponse<Service>>(`/support/${id}/status`, { status });
    return response.data;
  },
  addAttachment: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<ApiResponse<Service>>(`/support/${id}/attachment`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  removeAttachment: async (id: string, attachmentId: string) => {
    const response = await api.delete<ApiResponse<Service>>(`/support/${id}/attachment/${attachmentId}`);
    return response.data;
  }
};

export default api;