export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  all_day: boolean;
  location?: string;
  event_type: 'project' | 'meeting' | 'appointment' | 'reminder' | 'task' | 'other';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  color?: string;
  project_id?: string;
  customer_id?: string;
  technician_ids?: string[];
  recurring_pattern?: RecurringPattern;
  reminders?: Reminder[];
  attachments?: Attachment[];
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  external_calendar_id?: string;
  sync_status: 'local' | 'synced' | 'pending_sync' | 'sync_failed';
}

export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number;
  days_of_week?: number[]; // 0-6 (Sunday-Saturday)
  day_of_month?: number;
  month_of_year?: number;
  end_date?: string;
  occurrences?: number;
}

export interface Reminder {
  id: string;
  event_id: string;
  reminder_time: string;
  reminder_type: 'email' | 'push' | 'sms' | 'desktop';
  sent: boolean;
  created_at: string;
}

export interface Attachment {
  id: string;
  event_id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploaded_at: string;
}

export interface CalendarView {
  type: 'day' | 'week' | 'month' | 'year' | 'agenda';
  current_date: string;
  events: ScheduleEvent[];
}

export interface ScheduleFilter {
  event_type?: string[];
  status?: string[];
  priority?: string[];
  project_id?: string;
  customer_id?: string;
  technician_ids?: string[];
  date_range?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface CalendarIntegration {
  id: string;
  name: string;
  type: 'google' | 'outlook' | 'apple' | 'ical' | 'other';
  enabled: boolean;
  sync_direction: 'import' | 'export' | 'bidirectional';
  last_sync?: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ScheduleStats {
  total_events: number;
  upcoming_events: number;
  overdue_events: number;
  completed_events: number;
  events_by_type: Record<string, number>;
  events_by_status: Record<string, number>;
  events_by_priority: Record<string, number>;
  busy_hours: Record<string, number>;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
  event_id?: string;
  technician_id?: string;
}

export interface ScheduleConflict {
  event_id: string;
  conflicting_events: string[];
  conflict_type: 'time_overlap' | 'resource_conflict' | 'location_conflict';
  severity: 'warning' | 'error';
  message: string;
}

export interface ScheduleFormData {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  all_day: boolean;
  location?: string;
  event_type: 'project' | 'meeting' | 'appointment' | 'reminder' | 'task' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  color?: string;
  project_id?: string;
  customer_id?: string;
  technician_ids?: string[];
  recurring_pattern?: RecurringPattern;
  reminders?: Omit<Reminder, 'id' | 'event_id' | 'created_at'>[];
  notes?: string;
}

export interface ProjectSchedule {
  project_id: string;
  project_name: string;
  events: ScheduleEvent[];
  milestones: any[]; // Using existing Milestone type
  total_hours: number;
  completion_percentage: number;
}

export interface TechnicianSchedule {
  technician_id: string;
  technician_name: string;
  events: ScheduleEvent[];
  total_hours: number;
  availability: TimeSlot[];
  current_project?: string;
}

export interface CalendarExportOptions {
  format: 'ics' | 'csv' | 'json';
  date_range: {
    start: string;
    end: string;
  };
  include_events: boolean;
  include_reminders: boolean;
  include_attachments: boolean;
  filter?: ScheduleFilter;
} 