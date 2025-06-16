import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Ticket = Database['public']['Tables']['tickets']['Row'];
type Comment = Database['public']['Tables']['comments']['Row'];
type Attachment = Database['public']['Tables']['attachments']['Row'];
type Notification = Database['public']['Tables']['notifications']['Row'];

export const supabaseService = {
  // Profile operations
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Ticket operations
  async getTickets(filters?: {
    status?: string;
    priority?: string;
    type?: string;
    assignedTo?: string;
    customerId?: string;
  }) {
    try {
      let query = supabase.from('tickets').select(`
        *,
        customer:profiles!customer_id(id, full_name, email, role),
        assigned_staff:profiles!assigned_to(id, full_name, email, role),
        comments:comments(id, content, author_id, created_at, attachments),
        attachments:attachments(id, file_name, file_type, file_size, url, created_at)
      `);

      if (filters) {
        if (filters.status && filters.status !== 'all') query = query.eq('status', filters.status);
        if (filters.priority && filters.priority !== 'all') query = query.eq('priority', filters.priority);
        if (filters.type && filters.type !== 'all') query = query.eq('type', filters.type);
        if (filters.assignedTo && filters.assignedTo !== 'all') query = query.eq('assigned_to', filters.assignedTo);
        if (filters.customerId) query = query.eq('customer_id', filters.customerId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },

  async getTicket(ticketId: string) {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          customer:profiles!customer_id(id, full_name, email, role),
          assigned_staff:profiles!assigned_to(id, full_name, email, role),
          comments:comments(id, content, author_id, created_at, attachments),
          attachments:attachments(id, file_name, file_type, file_size, url, created_at)
        `)
        .eq('id', ticketId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching ticket:', error);
      throw error;
    }
  },

  async createTicket(ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert(ticket)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  async updateTicket(ticketId: string, updates: Partial<Ticket>) {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', ticketId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  },

  // Comment operations
  async getComments(ticketId: string) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:profiles!author_id(*)
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  async createComment(comment: Omit<Comment, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert(comment)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  // Attachment operations
  async uploadAttachment(file: File, ticketId: string, commentId?: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${ticketId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('attachments')
      .getPublicUrl(filePath);

    const attachment: Omit<Attachment, 'id' | 'created_at'> = {
      ticket_id: ticketId,
      comment_id: commentId || null,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      url: publicUrl,
      uploaded_by: (await supabase.auth.getUser()).data.user?.id || '',
    };

    const { data, error } = await supabase
      .from('attachments')
      .insert(attachment)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Notification operations
  async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async markNotificationAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Staff operations
  async getStaff() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'staff'])
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  },

  // Project management methods
  async getProjects(filters?: { status?: string; search?: string }) {
    let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.search) query = query.ilike('name', `%${filters.search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getProject(id: string) {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createProject(project: any) {
    const { data, error } = await supabase.from('projects').insert(project).select().single();
    if (error) throw error;
    return data;
  },

  async updateProject(id: string, updates: any) {
    const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteProject(id: string) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async getProjectNotes(projectId: string) {
    const { data, error } = await supabase
      .from('project_notes')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createProjectNote(projectId: string, note: { content: string; type: string }) {
    const user = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('project_notes')
      .insert({
        project_id: projectId,
        content: note.content,
        type: note.type,
        is_internal: true,
        author_id: user.data.user?.id || null,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getProjectComments(projectId: string) {
    const { data, error } = await supabase
      .from('project_comments')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createProjectComment(projectId: string, comment: { content: string }) {
    const user = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('project_comments')
      .insert({
        project_id: projectId,
        content: comment.content,
        is_internal: true,
        author_id: user.data.user?.id || null,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getProjectAttachments(projectId: string) {
    const { data, error } = await supabase
      .from('project_attachments')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async uploadProjectAttachment(file: File, projectId: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `project-attachments/${projectId}/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage
      .from('attachments')
      .getPublicUrl(filePath);
    const user = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('project_attachments')
      .insert({
        project_id: projectId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        url: publicUrl,
        uploaded_by: user.data.user?.id || null,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteProjectAttachment(attachmentId: string) {
    const { error } = await supabase.from('project_attachments').delete().eq('id', attachmentId);
    if (error) throw error;
    return true;
  },
}; 