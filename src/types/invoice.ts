export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type EmailStatus = 'sent' | 'delivered' | 'failed';

export interface InvoiceTemplate {
  id: string;
  name: string;
  description?: string;
  html_template: string;
  css_template?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface InvoiceEmail {
  id: string;
  invoice_id: string;
  recipient_email: string;
  sent_at: string;
  status: EmailStatus;
  error_message?: string;
  metadata?: Record<string, any>;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  template_id: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  notes?: string;
  terms?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  items?: InvoiceItem[];
  template?: InvoiceTemplate;
  client?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

export interface InvoiceFormData {
  client_id: string;
  template_id: string;
  issue_date: string;
  due_date: string;
  items: {
    description: string;
    quantity: number;
    unit_price: number;
  }[];
  tax_rate: number;
  notes?: string;
  terms?: string;
}

export interface InvoiceTemplateFormData {
  name: string;
  description?: string;
  html_template: string;
  css_template?: string;
  is_default: boolean;
} 