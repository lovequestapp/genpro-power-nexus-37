import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Create admin account if it doesn't exist
const createAdminAccount = async () => {
  try {
    const { data: existingAdmin } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'jeff@admin.local')
      .single();

    if (!existingAdmin) {
      const { data: user, error: userError } = await supabase.auth.admin.createUser({
        email: 'jeff@admin.local',
        password: '3469710121',
        email_confirm: true,
      });

      if (userError) throw userError;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.user.id,
          email: 'jeff@admin.local',
          full_name: 'Jeff Admin',
          role: 'admin',
          is_active: true,
        });

      if (profileError) throw profileError;
    }
  } catch (error) {
    console.error('Error creating admin account:', error);
  }
};

// Call the function to create admin account
createAdminAccount();

// Update user password
const updateUserPassword = async () => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: '3469710121'
    });

    if (error) throw error;
    console.log('Password updated successfully');
  } catch (error) {
    console.error('Error updating password:', error);
  }
};

// Call the function to update password
updateUserPassword();

// Create user profile
const createUserProfile = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    
    if (user) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', 'hunainm.qureshi@gmail.com')
        .single();

      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: 'hunainm.qureshi@gmail.com',
            full_name: 'Hunain Qureshi',
            role: 'admin',
            is_active: true,
            username: 'hunain'
          });

        if (profileError) throw profileError;
        console.log('User profile created successfully');
      }
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
};

// Call the function to create user profile
createUserProfile();

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string
          role: 'admin' | 'staff' | 'customer'
          is_active: boolean
          last_active: string | null
          avatar_url: string | null
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
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