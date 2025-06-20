
import { supabase } from '@/lib/supabase';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'bug' | 'feature' | 'support' | 'other';
  category: string;
  customer_id?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
  tags?: string[];
  estimated_time?: string;
  resolution?: string;
  metadata?: any;
  custom_fields?: any;
}

export interface Comment {
  id: string;
  ticket_id: string;
  author_id: string;
  content: string;
  created_at: string;
  is_internal: boolean;
  attachments?: string[];
}

export interface Attachment {
  id: string;
  ticket_id: string;
  comment_id?: string;
  file_name: string;
  file_type: string;
  file_size: number;
  url: string;
  uploaded_by: string;
  created_at: string;
}

class TicketService {
  async getTickets(filters?: {
    status?: string;
    priority?: string;
    type?: string;
    assigned_to?: string;
    customer_id?: string;
    search?: string;
  }) {
    let query = supabase
      .from('tickets')
      .select(`
        *,
        customer:customers(id, name, email),
        assigned_user:profiles!assigned_to(id, full_name, email),
        comments:comments(
          id, content, author_id, created_at, is_internal,
          author:profiles(id, full_name, email)
        )
      `)
      .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.priority && filters.priority !== 'all') {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }
    if (filters?.assigned_to) {
      query = query.eq('assigned_to', filters.assigned_to);
    }
    if (filters?.customer_id) {
      query = query.eq('customer_id', filters.customer_id);
    }
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%, description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async getTicket(id: string) {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customer:customers(id, name, email),
        assigned_user:profiles!assigned_to(id, full_name, email),
        comments:comments(
          id, content, author_id, created_at, is_internal,
          author:profiles(id, full_name, email),
          attachments:attachments(id, file_name, file_type, file_size, url, created_at)
        ),
        attachments:attachments(id, file_name, file_type, file_size, url, created_at, uploaded_by)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createTicket(ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('tickets')
      .insert(ticket)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTicket(id: string, updates: Partial<Ticket>) {
    const { data, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTicket(id: string) {
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async addComment(ticketId: string, content: string, isInternal = false) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('comments')
      .insert({
        ticket_id: ticketId,
        author_id: user.id,
        content,
        is_internal: isInternal,
      })
      .select(`
        *,
        author:profiles(id, full_name, email)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  async updateComment(id: string, content: string) {
    const { data, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteComment(id: string) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async uploadAttachment(ticketId: string, file: File, commentId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Upload file to storage (you'll need to create a storage bucket)
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `tickets/${ticketId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('attachments')
      .getPublicUrl(filePath);

    // Save attachment record
    const { data, error } = await supabase
      .from('attachments')
      .insert({
        ticket_id: ticketId,
        comment_id: commentId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        url: publicUrl,
        uploaded_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteAttachment(id: string) {
    const { error } = await supabase
      .from('attachments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getTicketStats() {
    const { data, error } = await supabase
      .from('tickets')
      .select('status, priority, type, created_at');

    if (error) throw error;

    const stats = {
      total: data.length,
      open: data.filter(t => t.status === 'open').length,
      in_progress: data.filter(t => t.status === 'in_progress').length,
      resolved: data.filter(t => t.status === 'resolved').length,
      closed: data.filter(t => t.status === 'closed').length,
      urgent: data.filter(t => t.priority === 'urgent').length,
      high: data.filter(t => t.priority === 'high').length,
      medium: data.filter(t => t.priority === 'medium').length,
      low: data.filter(t => t.priority === 'low').length,
    };

    return stats;
  }
}

export const ticketService = new TicketService();
