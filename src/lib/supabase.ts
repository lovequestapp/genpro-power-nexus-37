
import { createClient } from '@supabase/supabase-js';

// Use the Supabase project configuration directly
const supabaseUrl = 'https://fgpmeulzlrdgnlmibjkm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZncG1ldWx6bHJkZ25sbWliamttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MTM3NzUsImV4cCI6MjA2NDk4OTc3NX0.Y0rhUu-v5EE-0MI-zGCkKWv7zUtzj2Lgdg65xmI9L9o';

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL:', supabaseUrl);
  console.error('Supabase Key:', supabaseKey ? 'Present' : 'Missing');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          role: string;
        };
        Update: {
          full_name?: string;
          email?: string;
          role?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          address: string | null;
          company: string | null;
          status: 'active' | 'inactive';
          type: 'residential' | 'commercial';
          service_level: 'basic' | 'premium' | 'enterprise';
          notes: string | null;
          created_at: string;
          updated_at: string;
          last_contact: string;
          total_spent: number;
          project_history: Json;
        };
        Insert: {
          name: string;
          email: string;
          phone?: string | null;
          address?: string | null;
          company?: string | null;
          status?: 'active' | 'inactive';
          type?: 'residential' | 'commercial';
          service_level?: 'basic' | 'premium' | 'enterprise';
          notes?: string | null;
        };
        Update: {
          name?: string;
          email?: string;
          phone?: string | null;
          address?: string | null;
          company?: string | null;
          status?: 'active' | 'inactive';
          type?: 'residential' | 'commercial';
          service_level?: 'basic' | 'premium' | 'enterprise';
          notes?: string | null;
        };
      };
      generators: {
        Row: {
          id: string;
          serial_number: string;
          model: string;
          manufacturer: string;
          power_output: number;
          fuel_type: string;
          status: 'available' | 'installed' | 'maintenance' | 'decommissioned';
          location: string | null;
          installation_date: string | null;
          last_maintenance_date: string | null;
          next_maintenance_date: string | null;
          project_id: string | null;
          customer_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          serial_number: string;
          model: string;
          manufacturer?: string;
          power_output: number;
          fuel_type?: string;
          status?: 'available' | 'installed' | 'maintenance' | 'decommissioned';
          location?: string | null;
          installation_date?: string | null;
          last_maintenance_date?: string | null;
          next_maintenance_date?: string | null;
          project_id?: string | null;
          customer_id?: string | null;
          notes?: string | null;
        };
        Update: {
          serial_number?: string;
          model?: string;
          manufacturer?: string;
          power_output?: number;
          fuel_type?: string;
          status?: 'available' | 'installed' | 'maintenance' | 'decommissioned';
          location?: string | null;
          installation_date?: string | null;
          last_maintenance_date?: string | null;
          next_maintenance_date?: string | null;
          project_id?: string | null;
          customer_id?: string | null;
          notes?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string;
          status: 'in_progress' | 'completed' | 'cancelled' | 'archived';
          owner_id: string;
          generator_id: string | null;
          has_generator: boolean;
          generator_status: 'none' | 'pending' | 'installed' | 'maintenance';
          customer_id: string | null;
          start_date: string | null;
          end_date: string | null;
          budget: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description: string;
          status?: 'in_progress' | 'completed' | 'cancelled' | 'archived';
          owner_id: string;
          generator_id?: string | null;
          has_generator?: boolean;
          generator_status?: 'none' | 'pending' | 'installed' | 'maintenance';
          customer_id?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          budget?: number | null;
        };
        Update: {
          name?: string;
          description?: string;
          status?: 'in_progress' | 'completed' | 'cancelled' | 'archived';
          owner_id?: string;
          generator_id?: string | null;
          has_generator?: boolean;
          generator_status?: 'none' | 'pending' | 'installed' | 'maintenance';
          customer_id?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          budget?: number | null;
        };
      };
      project_notes: {
        Row: {
          id: string;
          project_id: string;
          actor_id: string;
          action: string;
          timestamp: string;
        };
        Insert: {
          project_id: string;
          actor_id: string;
          action: string;
        };
        Update: {
          action?: string;
        };
      };
      project_comments: {
        Row: {
          id: string;
          project_id: string;
          author_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          project_id: string;
          author_id: string;
          content: string;
        };
        Update: {
          content?: string;
        };
      };
      tickets: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          status: 'open' | 'in_progress' | 'resolved' | 'closed'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          type: 'bug' | 'feature' | 'support' | 'other'
          customer_id: string
          assigned_to: string | null
          due_date: string | null
          resolution: string | null
          metadata: Json | null
        }
        Insert: Omit<Database['public']['Tables']['tickets']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tickets']['Insert']>
      }
      comments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          ticket_id: string
          author_id: string
          content: string
          attachments: string[] | null
        }
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['comments']['Insert']>
      }
      attachments: {
        Row: {
          id: string
          created_at: string
          ticket_id: string
          comment_id: string | null
          file_name: string
          file_type: string
          file_size: number
          url: string
          uploaded_by: string
        }
        Insert: Omit<Database['public']['Tables']['attachments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['attachments']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          created_at: string
          user_id: string
          type: 'ticket_assigned' | 'ticket_updated' | 'comment_added' | 'ticket_closed'
          message: string
          is_read: boolean
          metadata: Json | null
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
    }
  }
}

export type Ticket = Database['public']['Tables']['tickets']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];
export type Attachment = Database['public']['Tables']['attachments']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type Generator = Database['public']['Tables']['generators']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Customer = Database['public']['Tables']['customers']['Row'];
