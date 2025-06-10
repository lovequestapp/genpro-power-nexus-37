export interface GeneratorReading {
  id: string;
  timestamp: string;
  powerOutput: number;
  fuelLevel: number;
  temperature: number;
  status: 'normal' | 'warning' | 'error';
}

export interface Generator {
  id: string;
  name: string;
  type: 'residential' | 'commercial';
  status: 'active' | 'maintenance' | 'offline';
  location: string;
  lastMaintenance: string;
  nextMaintenance: string;
  readings: GeneratorReading[];
  model: string;
  powerRating: number;
  fuelType: 'gasoline' | 'diesel' | 'propane';
  runtime: number;
  installationDate: string;
  warrantyExpiry: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'residential' | 'commercial';
  serviceLevel: 'basic' | 'premium' | 'enterprise';
  createdAt: string;
  updatedAt: string;
  tickets: string[];
  subscriptionStatus: 'active' | 'inactive';
  lastLogin: string;
}

export interface ServiceComment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

export interface ServiceAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
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
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  comments: ServiceComment[];
  attachments: ServiceAttachment[];
}

export interface BillItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
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

export interface Alert {
  id: string;
  generatorId: string;
  customerId: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  status: 'active' | 'resolved';
  createdAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'support' | 'technician';
  status: 'active' | 'inactive';
  assignedTickets: string[];
  lastActive: string;
  department: 'field_service' | 'customer_support';
  expertise: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
} 