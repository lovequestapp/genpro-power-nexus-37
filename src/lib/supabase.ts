import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
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
      projects: {
        Row: {
          id: string;
          name: string;
          description: string;
          status: 'in_progress' | 'completed' | 'cancelled' | 'archived';
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description: string;
          status: 'in_progress' | 'completed' | 'cancelled' | 'archived';
          owner_id: string;
        };
        Update: {
          name?: string;
          description?: string;
          status?: 'in_progress' | 'completed' | 'cancelled' | 'archived';
          owner_id?: string;
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