export interface Generator {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'maintenance';
  location: string;
  lastMaintenance: string;
  nextMaintenance: string;
  readings: GeneratorReading[];
}

export interface GeneratorReading {
  id: string;
  timestamp: string;
  powerOutput: number;
  fuelLevel: number;
  temperature: number;
  status: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  tickets: Service[];
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'technical' | 'billing' | 'general';
  customerId: string;
  customerName: string;
  generatorId?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  attachments: Attachment[];
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  attachments: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'support' | 'agent';
  status: 'active' | 'inactive';
  assignedTickets: string[];
  lastActive?: string;
}

export interface Bill {
  id: string;
  customerId: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  paidAt?: string;
  items: BillItem[];
}

export interface BillItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Alert {
  id: string;
  generatorId: string;
  customerId: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  status: 'active' | 'resolved';
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T[];
  message?: string;
  error?: string;
} 