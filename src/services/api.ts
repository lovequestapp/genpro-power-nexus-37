import axios from 'axios';
import { Generator, Customer, Service, Bill, StaffMember, Alert, ApiResponse } from '@/types';
import { demoData } from './demoData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generator Service
export const generatorService = {
  getAll: async (): Promise<ApiResponse<Generator[]>> => {
    return {
      success: true,
      data: demoData.generators,
      message: 'Generators retrieved successfully'
    };
  },

  getById: async (id: string): Promise<ApiResponse<Generator>> => {
    const generator = demoData.generators.find(g => g.id === id);
    if (!generator) {
      throw new Error('Generator not found');
    }
    return {
      success: true,
      data: generator,
      message: 'Generator retrieved successfully'
    };
  },

  create: async (data: Omit<Generator, 'id'>): Promise<ApiResponse<Generator>> => {
    const newGenerator = {
      ...data,
      id: `gen-${demoData.generators.length + 1}`,
      readings: []
    };
    demoData.generators.push(newGenerator);
    return {
      success: true,
      data: newGenerator,
      message: 'Generator created successfully'
    };
  },

  update: async (id: string, data: Partial<Generator>): Promise<ApiResponse<Generator>> => {
    const index = demoData.generators.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Generator not found');
    }
    demoData.generators[index] = { ...demoData.generators[index], ...data };
    return {
      success: true,
      data: demoData.generators[index],
      message: 'Generator updated successfully'
    };
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const index = demoData.generators.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Generator not found');
    }
    demoData.generators.splice(index, 1);
    return {
      success: true,
      data: undefined,
      message: 'Generator deleted successfully'
    };
  },

  getStatus: async (id: string): Promise<ApiResponse<{ status: string }>> => {
    const generator = demoData.generators.find(g => g.id === id);
    if (!generator) {
      throw new Error('Generator not found');
    }
    return {
      success: true,
      data: { status: generator.status },
      message: 'Generator status retrieved successfully'
    };
  }
};

// Customer Service
export const customerService = {
  getAll: async (): Promise<ApiResponse<Customer[]>> => {
    return {
      success: true,
      data: demoData.customers,
      message: 'Customers retrieved successfully'
    };
  },

  getById: async (id: string): Promise<ApiResponse<Customer>> => {
    const customer = demoData.customers.find(c => c.id === id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return {
      success: true,
      data: customer,
      message: 'Customer retrieved successfully'
    };
  },

  create: async (data: Omit<Customer, 'id'>): Promise<ApiResponse<Customer>> => {
    const newCustomer = {
      ...data,
      id: `cust-${demoData.customers.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tickets: []
    };
    demoData.customers.push(newCustomer);
    return {
      success: true,
      data: newCustomer,
      message: 'Customer created successfully'
    };
  },

  update: async (id: string, data: Partial<Customer>): Promise<ApiResponse<Customer>> => {
    const index = demoData.customers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    demoData.customers[index] = { 
      ...demoData.customers[index], 
      ...data,
      updatedAt: new Date().toISOString()
    };
    return {
      success: true,
      data: demoData.customers[index],
      message: 'Customer updated successfully'
    };
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const index = demoData.customers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    demoData.customers.splice(index, 1);
    return {
      success: true,
      data: undefined,
      message: 'Customer deleted successfully'
    };
  }
};

// Billing Service
export const billingService = {
  getAll: async (): Promise<ApiResponse<Bill[]>> => {
    return {
      success: true,
      data: demoData.bills,
      message: 'Bills retrieved successfully'
    };
  },

  getById: async (id: string): Promise<ApiResponse<Bill>> => {
    const bill = demoData.bills.find(b => b.id === id);
    if (!bill) {
      throw new Error('Bill not found');
    }
    return {
      success: true,
      data: bill,
      message: 'Bill retrieved successfully'
    };
  },

  pay: async (id: string): Promise<ApiResponse<Bill>> => {
    const index = demoData.bills.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error('Bill not found');
    }
    demoData.bills[index] = {
      ...demoData.bills[index],
      status: 'paid',
      paidAt: new Date().toISOString()
    };
    return {
      success: true,
      data: demoData.bills[index],
      message: 'Bill marked as paid successfully'
    };
  },

  getHistory: async (customerId: string): Promise<ApiResponse<Bill[]>> => {
    const bills = demoData.bills.filter(b => b.customerId === customerId);
    return {
      success: true,
      data: bills,
      message: 'Billing history retrieved successfully'
    };
  }
};

// Service Management
export const serviceService = {
  getAll: async (): Promise<ApiResponse<Service[]>> => {
    return {
      success: true,
      data: demoData.tickets,
      message: 'Services retrieved successfully'
    };
  },

  getByGenerator: async (generatorId: string): Promise<ApiResponse<Service[]>> => {
    const services = demoData.tickets.filter(t => t.customerId === generatorId);
    return {
      success: true,
      data: services,
      message: 'Generator services retrieved successfully'
    };
  },

  schedule: async (data: Omit<Service, 'id'>): Promise<ApiResponse<Service>> => {
    const newService = {
      ...data,
      id: `ticket-${demoData.tickets.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      attachments: []
    };
    demoData.tickets.push(newService);
    return {
      success: true,
      data: newService,
      message: 'Service scheduled successfully'
    };
  },

  update: async (id: string, data: Partial<Service>): Promise<ApiResponse<Service>> => {
    const index = demoData.tickets.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Service not found');
    }
    demoData.tickets[index] = {
      ...demoData.tickets[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return {
      success: true,
      data: demoData.tickets[index],
      message: 'Service updated successfully'
    };
  },

  complete: async (id: string): Promise<ApiResponse<Service>> => {
    const index = demoData.tickets.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Service not found');
    }
    demoData.tickets[index] = {
      ...demoData.tickets[index],
      status: 'resolved',
      updatedAt: new Date().toISOString()
    };
    return {
      success: true,
      data: demoData.tickets[index],
      message: 'Service marked as complete successfully'
    };
  }
};

// Alert Management
export const alertService = {
  getAll: async (): Promise<ApiResponse<Alert[]>> => {
    return {
      success: true,
      data: demoData.alerts,
      message: 'Alerts retrieved successfully'
    };
  },

  getByGenerator: async (generatorId: string): Promise<ApiResponse<Alert[]>> => {
    const alerts = demoData.alerts.filter(a => a.generatorId === generatorId);
    return {
      success: true,
      data: alerts,
      message: 'Generator alerts retrieved successfully'
    };
  },

  create: async (data: Omit<Alert, 'id'>): Promise<ApiResponse<Alert>> => {
    const newAlert = {
      ...data,
      id: `alert-${demoData.alerts.length + 1}`,
      createdAt: new Date().toISOString()
    };
    demoData.alerts.push(newAlert);
    return {
      success: true,
      data: newAlert,
      message: 'Alert created successfully'
    };
  },

  update: async (id: string, data: Partial<Alert>): Promise<ApiResponse<Alert>> => {
    const index = demoData.alerts.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Alert not found');
    }
    demoData.alerts[index] = { ...demoData.alerts[index], ...data };
    return {
      success: true,
      data: demoData.alerts[index],
      message: 'Alert updated successfully'
    };
  },

  resolve: async (id: string): Promise<ApiResponse<Alert>> => {
    const index = demoData.alerts.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Alert not found');
    }
    demoData.alerts[index] = {
      ...demoData.alerts[index],
      status: 'resolved'
    };
    return {
      success: true,
      data: demoData.alerts[index],
      message: 'Alert resolved successfully'
    };
  }
};

// Support Management
export const supportService = {
  getAll: async (): Promise<ApiResponse<Service[]>> => {
    return {
      success: true,
      data: demoData.tickets,
      message: 'Tickets retrieved successfully'
    };
  },

  getById: async (id: string): Promise<ApiResponse<Service>> => {
    const ticket = demoData.tickets.find(t => t.id === id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    return {
      success: true,
      data: ticket,
      message: 'Ticket retrieved successfully'
    };
  },

  create: async (data: Omit<Service, 'id'>): Promise<ApiResponse<Service>> => {
    const newTicket = {
      ...data,
      id: `ticket-${demoData.tickets.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };
    demoData.tickets.push(newTicket);
    return {
      success: true,
      data: newTicket,
      message: 'Ticket created successfully'
    };
  },

  update: async (id: string, data: Partial<Service>): Promise<ApiResponse<Service>> => {
    const index = demoData.tickets.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Ticket not found');
    }
    demoData.tickets[index] = { 
      ...demoData.tickets[index], 
      ...data,
      updatedAt: new Date().toISOString()
    };
    return {
      success: true,
      data: demoData.tickets[index],
      message: 'Ticket updated successfully'
    };
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const index = demoData.tickets.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Ticket not found');
    }
    demoData.tickets.splice(index, 1);
    return {
      success: true,
      data: undefined,
      message: 'Ticket deleted successfully'
    };
  },

  getByCustomer: async (customerId: string): Promise<ApiResponse<Service[]>> => {
    const customerTickets = demoData.tickets.filter(t => t.customerId === customerId);
    return {
      success: true,
      data: customerTickets,
      message: 'Customer tickets retrieved successfully'
    };
  },

  addComment: async (id: string, comment: string): Promise<ApiResponse<Service>> => {
    const ticket = demoData.tickets.find(t => t.id === id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    ticket.comments.push({
      id: `comment-${ticket.comments.length + 1}`,
      text: comment,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    });
    return {
      success: true,
      data: ticket,
      message: 'Comment added successfully'
    };
  },

  updateStatus: async (id: string, status: Service['status']): Promise<ApiResponse<Service>> => {
    const ticket = demoData.tickets.find(t => t.id === id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    return {
      success: true,
      data: ticket,
      message: 'Ticket status updated successfully'
    };
  },

  assignTicket: async (id: string, staffId: string): Promise<ApiResponse<Service>> => {
    const ticket = demoData.tickets.find(t => t.id === id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    ticket.assignedTo = staffId;
    ticket.updatedAt = new Date().toISOString();
    return {
      success: true,
      data: ticket,
      message: 'Ticket assigned successfully'
    };
  },

  addAttachment: async (id: string, attachment: { name: string; url: string }): Promise<ApiResponse<Service>> => {
    const ticket = demoData.tickets.find(t => t.id === id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    ticket.attachments.push({
      id: `attachment-${ticket.attachments.length + 1}`,
      ...attachment,
      uploadedAt: new Date().toISOString()
    });
    return {
      success: true,
      data: ticket,
      message: 'Attachment added successfully'
    };
  },

  removeAttachment: async (id: string, attachmentId: string): Promise<ApiResponse<Service>> => {
    const ticket = demoData.tickets.find(t => t.id === id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    ticket.attachments = ticket.attachments.filter(a => a.id !== attachmentId);
    return {
      success: true,
      data: ticket,
      message: 'Attachment removed successfully'
    };
  }
};

export default api;