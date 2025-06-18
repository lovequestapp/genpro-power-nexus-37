export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  projectHistory: Project[];
  totalSpent: number;
  status: 'active' | 'inactive';
  lastContact: string;
} //ded

export type Project = {
  id: string;
  name: string;
  description: string;
  status: 'in_progress' | 'completed' | 'cancelled' | 'archived';
  owner_id: string;
  owner_name: string;
  created_at: string;
  address: string;
  technicians: string[];
};

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'lead' | 'assistant' | 'apprentice';
  specializations: string[];
  availability: 'available' | 'assigned' | 'off-duty';
  currentLocation?: {
    lat: number;
    lng: number;
    lastUpdate: string;
  };
  activeProjectId?: string;
  completedProjects: number;
  rating: number;
  certifications: Certification[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'generator' | 'part' | 'tool' | 'supply';
  model: string;
  manufacturer: string;
  quantity: number;
  minQuantity: number;
  price: number;
  cost: number;
  location: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';
  lastRestocked: string;
  supplier: Supplier;
  warrantyPeriod?: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  address: string;
  items: InventoryItem[];
  rating: number;
  terms: string;
  lastOrderDate: string;
  totalOrders: number;
}

export interface ProjectNote {
  id: string;
  projectId: string;
  author: string;
  content: string;
  timestamp: string;
  type: 'general' | 'technical' | 'customer' | 'internal';
  attachments?: Document[];
}

export interface Document {
  id: string;
  name: string;
  type: 'permit' | 'invoice' | 'contract' | 'manual' | 'photo' | 'other';
  url: string;
  uploadedBy: string;
  uploadDate: string;
  size: number;
  tags: string[];
}

export interface Permit {
  id: string;
  projectId: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  submissionDate: string;
  approvalDate?: string;
  expirationDate?: string;
  authority: string;
  documents: Document[];
  notes: string[];
}

export interface TimelineEvent {
  id: string;
  projectId: string;
  type: 'milestone' | 'task' | 'note' | 'issue' | 'payment';
  title: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'delayed' | 'cancelled';
  assignedTo?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuedBy: string;
  issuedDate: string;
  expirationDate: string;
  status: 'active' | 'expired' | 'pending';
  documents: Document[];
}

export interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  projectId?: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
  documents: Document[];
}

export interface MarketingCampaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'print' | 'digital' | 'referral';
  status: 'draft' | 'active' | 'completed' | 'paused';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  leads: number;
  conversions: number;
  roi: number;
  targetAudience: string[];
  content: string[];
  metrics: {
    impressions: number;
    clicks: number;
    inquiries: number;
    sales: number;
  };
}

export interface DashboardStats {
  revenue: {
    total: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    change: number;
  };
  inventory: {
    total: number;
    lowStock: number;
    value: number;
    change: number;
  };
  leads: {
    total: number;
    new: number;
    converted: number;
    change: number;
  };
  technicians: {
    total: number;
    available: number;
    assigned: number;
  };
  customerSatisfaction: {
    rating: number;
    responses: number;
    change: number;
  };
}

export interface Bill {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}
