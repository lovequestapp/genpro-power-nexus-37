export interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number' | 'date' | 'file';
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  min?: number;
  max?: number;
  pattern?: string;
  validation?: {
    type: 'email' | 'phone' | 'url' | 'custom';
    message?: string;
    regex?: string;
  };
}

export interface FormSettings {
  emailNotifications?: boolean;
  notificationEmail?: string;
  autoResponse?: boolean;
  autoResponseSubject?: string;
  autoResponseMessage?: string;
  redirectUrl?: string;
  successMessage?: string;
  smsNotifications?: boolean;
  smsNumber?: string;
  captcha?: boolean;
  fileUpload?: boolean;
  maxFileSize?: number;
  allowedFileTypes?: string[];
}

export interface FormDefinition {
  id: string;
  name: string;
  slug: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  data: Record<string, any>;
  metadata: {
    ip_address?: string;
    user_agent?: string;
    referrer?: string;
    submitted_at: string;
    [key: string]: any;
  };
  status: 'new' | 'read' | 'in_progress' | 'completed' | 'archived';
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  created_at: string;
  updated_at: string;
  form?: FormDefinition;
}

export interface FormAnalytics {
  id: string;
  form_id: string;
  date: string;
  views: number;
  submissions: number;
  conversion_rate: number;
  created_at: string;
  updated_at: string;
}

export interface FormSubmissionFilters {
  form_id?: string;
  status?: string[];
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface FormAnalyticsFilters {
  form_id?: string;
  date_from?: string;
  date_to?: string;
  period?: 'day' | 'week' | 'month' | 'year';
}

export interface FormSubmissionStats {
  total_submissions: number;
  new_submissions: number;
  read_submissions: number;
  completed_submissions: number;
  this_month: {
    submissions: number;
    change_percentage: number;
  };
  by_status: {
    new: number;
    read: number;
    in_progress: number;
    completed: number;
    archived: number;
  };
}

export interface FormAnalyticsStats {
  total_views: number;
  total_submissions: number;
  average_conversion_rate: number;
  top_performing_forms: Array<{
    form_id: string;
    form_name: string;
    submissions: number;
    conversion_rate: number;
  }>;
  recent_trends: Array<{
    date: string;
    views: number;
    submissions: number;
    conversion_rate: number;
  }>;
}

export interface CreateFormSubmissionData {
  form_slug: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface UpdateFormSubmissionData {
  status?: string;
  notes?: string;
  assigned_to?: string;
}

export interface FormBuilderData {
  name: string;
  slug: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings;
  is_active?: boolean;
} 