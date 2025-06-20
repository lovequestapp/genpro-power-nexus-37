export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  project_id?: string;
  project_name?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'partially_paid';
  issue_date: string;
  due_date: string;
  paid_date?: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_rate: number;
  discount_amount: number;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  currency: string;
  notes?: string;
  terms?: string;
  payment_terms: number; // days
  payment_method?: string;
  reference?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
  line_items?: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  tax_amount: number;
  discount_rate: number;
  discount_amount: number;
  total_amount: number;
  item_type: 'service' | 'product' | 'labor' | 'material' | 'other';
  item_id?: string; // reference to inventory item or service
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_date: string;
  payment_method: 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'paypal' | 'stripe' | 'other';
  reference?: string;
  notes?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface BillingSettings {
  id: string;
  company_name: string;
  company_address: string;
  company_phone: string;
  company_email: string;
  company_website?: string;
  tax_id?: string;
  logo_url?: string;
  default_currency: string;
  default_tax_rate: number;
  default_payment_terms: number;
  invoice_prefix: string;
  invoice_start_number: number;
  auto_numbering: boolean;
  default_notes?: string;
  default_terms?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description?: string;
  template_type: 'default' | 'custom';
  header_html?: string;
  footer_html?: string;
  css_styles?: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface BillingItem {
  id: string;
  name: string;
  description?: string;
  item_type: 'service' | 'product' | 'labor' | 'material' | 'other';
  unit_price: number;
  tax_rate: number;
  is_active: boolean;
  category?: string;
  sku?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerBillingInfo {
  id: string;
  customer_id: string;
  billing_address: string;
  shipping_address?: string;
  tax_exempt: boolean;
  tax_id?: string;
  payment_terms: number;
  credit_limit?: number;
  preferred_payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceStats {
  total_invoices: number;
  total_amount: number;
  paid_amount: number;
  outstanding_amount: number;
  overdue_amount: number;
  overdue_count: number;
  this_month: {
    invoices: number;
    amount: number;
    paid: number;
  };
  last_month: {
    invoices: number;
    amount: number;
    paid: number;
  };
  by_status: {
    draft: number;
    sent: number;
    paid: number;
    overdue: number;
    cancelled: number;
    partially_paid: number;
  };
}

export interface PaymentStats {
  total_payments: number;
  total_amount: number;
  this_month: {
    payments: number;
    amount: number;
  };
  last_month: {
    payments: number;
    amount: number;
  };
  by_method: {
    cash: number;
    check: number;
    credit_card: number;
    bank_transfer: number;
    paypal: number;
    stripe: number;
    other: number;
  };
}

export interface BillingFilters {
  status?: string[];
  customer_id?: string;
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  amount_max?: number;
  search?: string;
}

export interface InvoiceFormData {
  customer_id: string;
  project_id?: string;
  issue_date: string;
  due_date: string;
  payment_terms: number;
  currency: string;
  tax_rate: number;
  discount_rate: number;
  notes?: string;
  terms?: string;
  line_items: Omit<InvoiceLineItem, 'id' | 'invoice_id' | 'created_at' | 'updated_at'>[];
}

export interface PaymentFormData {
  invoice_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  reference?: string;
  notes?: string;
}
