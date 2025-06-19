import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

// Environment variables with fallbacks
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://fgpmeulzlrdgnlmibjkm.supabase.co';
const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZncG1ldWx6bHJkZ25sbWliamttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MTM3NzUsImV4cCI6MjA2NDk4OTc3NX0.Y0rhUu-v5EE-0MI-zGCkKWv7zUtzj2Lgdg65xmI9L9o';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Ticket = Database['public']['Tables']['tickets']['Row'];
type Comment = Database['public']['Tables']['comments']['Row'];
type Attachment = Database['public']['Tables']['attachments']['Row'];
type Notification = Database['public']['Tables']['notifications']['Row'];
type Generator = Database['public']['Tables']['generators']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];
type Customer = Database['public']['Tables']['customers']['Row'];

export const supabaseService = {
  // Customer operations
  async getCustomers(filters?: { search?: string; status?: string }) {
    try {
      console.log('Getting customers with filters:', filters);
      
      // Try direct fetch approach first
      let url = `${supabaseUrl}/rest/v1/customers?select=*&order=created_at.desc`;
      
      if (filters?.search) {
        url += `&or=(name.ilike.*${filters.search}*,email.ilike.*${filters.search}*,company.ilike.*${filters.search}*)`;
      }
      
      if (filters?.status && filters.status !== 'all') {
        if (['active', 'inactive'].includes(filters.status)) {
          url += `&status=eq.${filters.status}`;
        } else if (['residential', 'commercial'].includes(filters.status)) {
          url += `&type=eq.${filters.status}`;
        }
      }
      
      console.log('Fetching customers from URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Fetch response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Customers fetched successfully via fetch:', data?.length || 0);
      return data;
      
    } catch (error) {
      console.error('Direct fetch failed, trying Supabase client...', error);
      
      // Fallback to Supabase client with timeout
      try {
        let query = supabase
          .from('customers')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (filters?.search) {
          query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
        }
        
        if (filters?.status && filters.status !== 'all') {
          // Only filter by status if it's not a type filter
          if (['active', 'inactive'].includes(filters.status)) {
            query = query.eq('status', filters.status);
          } else if (['residential', 'commercial'].includes(filters.status)) {
            query = query.eq('type', filters.status);
          }
        }
        
        const queryPromise = query;
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Get customers timeout after 10 seconds')), 10000)
        );
        
        const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
        
        if (error) {
          console.error('Error in getCustomers:', error);
          throw error;
        }
        console.log('Customers fetched successfully via client:', data?.length || 0);
        return data;
      } catch (clientError) {
        console.error('Supabase client also failed:', clientError);
        throw clientError;
      }
    }
  },

  // Test function to check if Supabase is working
  async testSupabaseConnection() {
    try {
      console.log('Testing Supabase connection...');
      
      // First, try a simple ping to see if the client is working
      console.log('Testing basic client functionality...');
      const { data: authData, error: authError } = await supabase.auth.getSession();
      console.log('Auth test result:', authError ? 'Failed' : 'Success', authData ? 'Session exists' : 'No session');
      
      if (authError) {
        console.error('Auth test failed:', authError);
        return false;
      }
      
      // Now try a simple query
      console.log('Testing database query...');
      const queryPromise = supabase
        .from('customers')
        .select('id')
        .limit(1);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection test timeout')), 5000)
      );
      
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('Supabase connection test failed:', error);
        return false;
      }
      
      console.log('Supabase connection test successful, found', data?.length || 0, 'records');
      return true;
    } catch (error) {
      console.error('Supabase connection test error:', error);
      return false;
    }
  },

  // Simple test function to try different insert approaches
  async testDirectInsert(customerData: any) {
    try {
      console.log('Testing direct insert with fetch...');
      
      // Try using fetch directly to the Supabase REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(customerData)
      });
      
      console.log('Fetch response status:', response.status);
      console.log('Fetch response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      console.log('Direct insert via fetch successful');
      return true;
    } catch (error) {
      console.error('Direct insert test failed:', error);
      return false;
    }
  },

  async createCustomer(customer: {
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    company?: string | null;
    status?: 'active' | 'inactive';
    type?: 'residential' | 'commercial';
    service_level?: 'basic' | 'premium' | 'enterprise';
    notes?: string | null;
  }) {
    try {
      console.log('Creating customer with data:', customer);
      
      // Clean the data to match the database schema
      const customerData = {
        name: customer.name,
        email: customer.email,
        phone: customer.phone || null,
        address: customer.address || null,
        company: customer.company || null,
        status: customer.status || 'active',
        type: customer.type || 'residential',
        notes: customer.notes || null,
      };

      console.log('Prepared customer data for insert:', customerData);

      // First try the direct fetch approach
      const directSuccess = await this.testDirectInsert(customerData);
      if (directSuccess) {
        console.log('Direct insert successful, returning success');
        return { id: 'created', name: customer.name, email: customer.email, message: 'Customer created via direct insert' };
      }

      // If direct insert fails, try the Supabase client approach
      console.log('Direct insert failed, trying Supabase client...');
      
      const insertPromise = supabase
        .from('customers')
        .insert(customerData);
      
      const insertTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Insert timeout after 10 seconds')), 10000)
      );
      
      const { error: simpleError } = await Promise.race([insertPromise, insertTimeoutPromise]) as any;
      
      if (simpleError) {
        console.error('Supabase client insert failed:', simpleError);
        throw simpleError;
      }
      
      console.log('Supabase client insert successful');
      return { id: 'created', name: customer.name, email: customer.email, message: 'Customer created via Supabase client' };
      
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  async updateCustomer(id: string, updates: {
    name?: string;
    email?: string;
    phone?: string | null;
    address?: string | null;
    company?: string | null;
    status?: 'active' | 'inactive';
    type?: 'residential' | 'commercial';
    service_level?: 'basic' | 'premium' | 'enterprise';
    notes?: string | null;
  }) {
    try {
      console.log('Updating customer:', id, 'with data:', updates);
      
      // Remove service_level from updates since it's not in the database schema
      const { service_level, ...customerUpdates } = updates;
      
      const { data, error } = await supabase
        .from('customers')
        .update(customerUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error in updateCustomer:', error);
        throw error;
      }
      console.log('Customer updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  async deleteCustomer(id: string) {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  async getCustomer(id: string) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  // Generator operations
  async getGenerators() {
    try {
      console.log('Getting generators...');
      
      // Try direct fetch approach first
      const url = `${supabaseUrl}/rest/v1/generators?select=*&order=created_at.desc`;
      
      console.log('Fetching generators from URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Generators fetch response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Generators fetch error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Generators fetched successfully via fetch:', data?.length || 0);
      return data;
      
    } catch (error) {
      console.error('Direct fetch failed for generators, trying Supabase client...', error);
      
      // Fallback to Supabase client with timeout
      try {
        const queryPromise = supabase
          .from('generators')
          .select(`
            *,
            project:projects(id, name, status),
            customer:customers(id, name, email)
          `)
          .order('created_at', { ascending: false });
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Get generators timeout after 10 seconds')), 10000)
        );
        
        const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
        
        if (error) {
          console.error('Error in getGenerators:', error);
          throw error;
        }
        console.log('Generators fetched successfully via client:', data?.length || 0);
        return data;
      } catch (clientError) {
        console.error('Supabase client also failed for generators:', clientError);
        throw clientError;
      }
    }
  },

  async getGenerator(id: string) {
    try {
      const { data, error } = await supabase
        .from('generators')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching generator:', error);
      throw error;
    }
  },

  async getGeneratorStats() {
    try {
      const { data, error } = await supabase
        .from('generators')
        .select('status');
      
      if (error) throw error;
      
      const stats = {
        total: data.length,
        available: data.filter(g => g.status === 'available').length,
        installed: data.filter(g => g.status === 'installed').length,
        maintenance: data.filter(g => g.status === 'maintenance').length,
        decommissioned: data.filter(g => g.status === 'decommissioned').length,
      };
      
      return stats;
    } catch (error) {
      console.error('Error fetching generator stats:', error);
      throw error;
    }
  },

  async createGenerator(generator: Omit<Generator, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('generators')
        .insert(generator)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating generator:', error);
      throw error;
    }
  },

  async updateGenerator(id: string, updates: Partial<Generator>) {
    try {
      const { data, error } = await supabase
        .from('generators')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating generator:', error);
      throw error;
    }
  },

  async assignGeneratorToProject(generatorId: string, projectId: string) {
    try {
      // Update generator
      const { error: genError } = await supabase
        .from('generators')
        .update({ 
          project_id: projectId, 
          status: 'installed'
        })
        .eq('id', generatorId);
      
      if (genError) throw genError;

      // Update project
      const { data, error: projError } = await supabase
        .from('projects')
        .update({ 
          generator_id: generatorId,
          has_generator: true,
          generator_status: 'installed'
        })
        .eq('id', projectId)
        .select()
        .single();
      
      if (projError) throw projError;
      return data;
    } catch (error) {
      console.error('Error assigning generator to project:', error);
      throw error;
    }
  },

  // Updated project operations to include generator info
  async getProjectsWithGenerators(filters?: { status?: string; search?: string }) {
    let query = supabase
      .from('projects')
      .select(`
        *,
        generator:generators(id, serial_number, model, status),
        owner:profiles!owner_id(id, full_name, email)
      `)
      .order('created_at', { ascending: false });
      
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.search) query = query.ilike('name', `%${filters.search}%`);
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getDashboardStats() {
    try {
      const [
        projectsResult,
        generatorsResult,
        ticketsResult,
        customersResult
      ] = await Promise.all([
        supabase.from('projects').select('status, created_at'),
        supabase.from('generators').select('status'),
        supabase.from('tickets').select('status, created_at'),
        supabase.from('customers').select('created_at')
      ]);

      if (projectsResult.error) throw projectsResult.error;
      if (generatorsResult.error) throw generatorsResult.error;
      if (ticketsResult.error) throw ticketsResult.error;
      if (customersResult.error) throw customersResult.error;

      const projects = projectsResult.data;
      const generators = generatorsResult.data;
      const tickets = ticketsResult.data;
      const customers = customersResult.data;

      // Calculate current month data
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthProjects = projects.filter(p => {
        const date = new Date(p.created_at);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      const thisMonthTickets = tickets.filter(t => {
        const date = new Date(t.created_at);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      const thisMonthCustomers = customers.filter(c => {
        const date = new Date(c.created_at);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      return {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'in_progress').length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
        projectsThisMonth: thisMonthProjects.length,
        
        totalGenerators: generators.length,
        availableGenerators: generators.filter(g => g.status === 'available').length,
        installedGenerators: generators.filter(g => g.status === 'installed').length,
        maintenanceGenerators: generators.filter(g => g.status === 'maintenance').length,
        
        totalTickets: tickets.length,
        openTickets: tickets.filter(t => t.status === 'open').length,
        inProgressTickets: tickets.filter(t => t.status === 'in_progress').length,
        ticketsThisMonth: thisMonthTickets.length,
        
        totalCustomers: customers.length,
        newCustomersThisMonth: thisMonthCustomers.length,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

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
      console.log('Getting staff...');
      // Use direct fetch to bypass RLS issues
      const url = `${supabaseUrl}/rest/v1/profiles?select=*&order=created_at.desc`;
      console.log('Fetching staff from URL:', url);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(url, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      console.log('Staff fetch response status:', res.status);
      if (!res.ok) throw new Error('Failed to fetch staff');
      const data = await res.json();
      console.log('Staff fetched successfully via fetch:', data.length);
      return data;
    } catch (error) {
      console.error('Error fetching staff:', error);
      return [];
    }
  },

  // Project management methods
  async getProjects(filters?: { status?: string; search?: string }) {
    try {
      console.log('Getting projects with filters:', filters);
      
      // Test connection first (with fallback)
      let connectionOk = false;
      try {
        console.log('Testing Supabase connection...');
        const testUrl = `${supabaseUrl}/rest/v1/projects?select=count&limit=1`;
        console.log('Test URL:', testUrl);
        
        const testResponse = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Test response status:', testResponse.status);
        if (!testResponse.ok) {
          const errorText = await testResponse.text();
          console.error('Connection test failed:', errorText);
          throw new Error(`Connection test failed: ${testResponse.status}`);
        }
        console.log('Connection test successful');
        connectionOk = true;
      } catch (testError) {
        console.error('Connection test error, proceeding anyway:', testError);
        connectionOk = false;
      }
      
      // Use REST API approach since Supabase client has authentication issues
      let url = `${supabaseUrl}/rest/v1/projects?select=*&order=created_at.desc`;
      
      if (filters?.search) {
        url += `&or=(name.ilike.*${filters.search}*,description.ilike.*${filters.search}*)`;
      }
      
      if (filters?.status && filters.status !== 'all') {
        url += `&status=eq.${filters.status}`;
      }
      
      console.log('Fetching projects from URL:', url);
      
      // Add timeout to the fetch
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        console.log('Projects fetch timeout triggered');
        controller.abort();
      }, 10000); // 10 second timeout
      
      console.log('About to make fetch request...');
      
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          signal: controller.signal
        });
        
        console.log('Fetch request completed, clearing timeout...');
        clearTimeout(timeout);
        
        console.log('Projects fetch response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Projects fetch error:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        console.log('About to parse response JSON...');
        const data = await response.json();
        console.log('Response JSON parsed successfully');
        
        // Log the full response data
        console.log('Projects fetch response:', {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          data: data,
          url: url,
          timestamp: new Date().toISOString()
        });
        
        // Validate the response data
        if (!Array.isArray(data)) {
          console.error('Invalid projects data format:', data);
          throw new Error('Invalid response format from server');
        }
        
        console.log('Projects fetch completed successfully, returning data');
        return data;
        
      } catch (fetchError) {
        clearTimeout(timeout);
        if (fetchError.name === 'AbortError') {
          console.error('Projects fetch timed out after 10 seconds');
          throw new Error('Failed to fetch projects: Request timed out');
        }
        throw fetchError;
      }
      
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  async getProject(id: string) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching project:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  async createProject(project: {
    name: string;
    description?: string | null;
    status?: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'archived';
    start_date?: string | null;
    end_date?: string | null;
    budget?: number | null;
    customer_id?: string | null;
    generator_id?: string | null;
    has_generator?: boolean;
    generator_status?: 'none' | 'pending' | 'installed' | 'maintenance';
    assigned_to?: string[] | null;
  }, userId?: string) {
    console.log('=== createProject function started ===');
    console.log('Input project data:', JSON.stringify(project, null, 2));
    console.log('Provided userId:', userId);
    
    try {
      console.log('Creating project with data:', project);
      
      let user = null;
      
      if (userId) {
        console.log('Using provided userId:', userId);
        user = { id: userId };
      } else {
        console.log('About to get current user...');
        // Get current user with timeout
        const userPromise = supabase.auth.getUser();
        const userTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('User fetch timeout after 5 seconds')), 5000)
        );
        
        const { data: { user: authUser }, error: userError } = await Promise.race([userPromise, userTimeoutPromise]) as any;
        console.log('User fetch completed:', { user: authUser?.id, error: userError });
        
        if (userError) {
          console.error('Error getting user:', userError);
          // If we can't get the user, try to proceed without owner_id
          console.log('Proceeding without user authentication...');
        }
        
        if (!authUser) {
          console.log('No user found, proceeding without owner_id...');
        }
        
        user = authUser;
      }
      
      if (user) {
        console.log('Current user for project creation:', user.id);
      }
      
      // Validate status
      const validStatuses = ['planned', 'in_progress', 'completed', 'cancelled', 'archived'];
      const status = project.status || 'in_progress';
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
      }
      
      const projectData = {
        name: project.name,
        description: project.description || null,
        status: status,
        owner_id: user?.id,
        start_date: project.start_date || null,
        end_date: project.end_date || null,
        budget: project.budget || null,
        customer_id: project.customer_id || null,
        generator_id: project.generator_id || null,
        has_generator: project.has_generator || false,
        generator_status: project.generator_status || 'none',
        assigned_to: project.assigned_to || null
      };

      console.log('Using Supabase client for project creation with data:', projectData);
      
      // Try REST API first since Supabase client seems to have issues
      try {
        console.log('Using REST API for project creation...');
        
        const response = await fetch(`${supabaseUrl}/rest/v1/projects`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(projectData)
        });

        console.log('REST API response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('REST API error:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Project created successfully via REST API:', {
          data: data,
          timestamp: new Date().toISOString()
        });
        
        return data[0];
        
      } catch (restError) {
        console.error('REST API failed, trying Supabase client as fallback:', restError);
        
        // Fallback to Supabase client
        try {
          console.log('About to execute Supabase insert...');
          
          const insertPromise = supabase
            .from('projects')
            .insert(projectData)
            .select()
            .single();
          
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Project creation timeout after 10 seconds')), 10000)
          );
          
          console.log('About to race insert and timeout promises...');
          const { data, error } = await Promise.race([insertPromise, timeoutPromise]) as any;
          console.log('Promise.race completed');

          console.log('Project creation response:', { data, error });
          
          if (error) {
            console.error('Project creation error:', error);
            throw error;
          }
          
          console.log('Project created successfully via Supabase client:', {
            data: data,
            timestamp: new Date().toISOString()
          });
          
          return data;
          
        } catch (clientError) {
          console.error('Both REST API and Supabase client failed:', clientError);
          throw clientError;
        }
      }
      
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  async updateProject(id: string, updates: {
    name?: string;
    description?: string | null;
    status?: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'archived';
    start_date?: string | null;
    end_date?: string | null;
    budget?: number | null;
    customer_id?: string | null;
    generator_id?: string | null;
    has_generator?: boolean;
    generator_status?: 'none' | 'pending' | 'installed' | 'maintenance';
    assigned_to?: string[] | null;
  }) {
    try {
      console.log('Updating project:', id, 'with data:', updates);
      
      console.log('Using Supabase client for project update...');
      
      // Use Supabase client instead of REST API
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      console.log('Project update response:', { data, error });
      
      if (error) {
        console.error('Project update error:', error);
        throw error;
      }
      
      console.log('Project updated successfully via Supabase client:', data);
      return data;
      
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  async deleteProject(id: string) {
    try {
      console.log('Deleting project:', id);
      
      // Use REST API approach since Supabase client has authentication issues
      console.log('Using REST API for project deletion...');
      
      const response = await fetch(`${supabaseUrl}/rest/v1/projects?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Project deletion response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Project deletion error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      console.log('Project deleted successfully via REST API');
      return true;
      
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
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

  async updateProjectNote(noteId: string, updates: { content: string; type: string; is_internal: boolean }) {
    const { data, error } = await supabase
      .from('project_notes')
      .update({
        content: updates.content,
        type: updates.type,
        is_internal: updates.is_internal,
        updated_at: new Date().toISOString(),
      })
      .eq('id', noteId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteProjectNote(noteId: string) {
    const { error } = await supabase
      .from('project_notes')
      .delete()
      .eq('id', noteId);
    if (error) throw error;
    return true;
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
    const { error } = await supabase
      .from('project_attachments')
      .delete()
      .eq('id', attachmentId);
    if (error) throw error;
    return true;
  },

  // Milestone Management
  async getMilestones(projectId: string) {
    try {
      console.log('Fetching milestones for project:', projectId);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/milestones?project_id=eq.${projectId}&order=order_index.asc`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      console.log('Milestones fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching milestones:', error);
      throw error;
    }
  },

  async createMilestone(milestone: {
    project_id: string;
    title: string;
    description?: string;
    due_date?: string;
    assigned_to?: string;
    priority?: 'low' | 'medium' | 'high';
    dependencies?: string[];
    order_index?: number;
  }) {
    try {
      console.log('Creating milestone:', milestone);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/milestones`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          ...milestone,
          status: 'pending',
          progress_percentage: 0,
          dependencies: milestone.dependencies || [],
          order_index: milestone.order_index || 0
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      console.log('Milestone created successfully:', data);
      return data[0];
    } catch (error) {
      console.error('Error creating milestone:', error);
      throw error;
    }
  },

  async updateMilestone(milestoneId: string, updates: {
    title?: string;
    description?: string;
    status?: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
    due_date?: string;
    completed_date?: string;
    assigned_to?: string;
    priority?: 'low' | 'medium' | 'high';
    progress_percentage?: number;
    dependencies?: string[];
    order_index?: number;
  }) {
    try {
      console.log('Updating milestone:', milestoneId, 'with updates:', updates);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/milestones?id=eq.${milestoneId}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      console.log('Milestone updated successfully:', data);
      return data[0];
    } catch (error) {
      console.error('Error updating milestone:', error);
      throw error;
    }
  },

  async deleteMilestone(milestoneId: string) {
    try {
      console.log('Deleting milestone:', milestoneId);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/milestones?id=eq.${milestoneId}`, {
        method: 'DELETE',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      console.log('Milestone deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting milestone:', error);
      throw error;
    }
  },

  // Project Audit Trail
  async getProjectAuditLog(projectId: string) {
    try {
      console.log('Fetching audit log for project:', projectId);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/project_audit_log?project_id=eq.${projectId}&order=created_at.desc`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      console.log('Audit log fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching audit log:', error);
      throw error;
    }
  },

  async logProjectAction(projectId: string, action: {
    action: string;
    field_name?: string;
    old_value?: string;
    new_value?: string;
    metadata?: Record<string, any>;
  }) {
    try {
      console.log('Logging project action:', { projectId, ...action });
      
      const user = await supabase.auth.getUser();
      
      const response = await fetch(`${supabaseUrl}/rest/v1/project_audit_log`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          project_id: projectId,
          user_id: user.data.user?.id || null,
          ...action
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      console.log('Project action logged successfully:', data);
      return data[0];
    } catch (error) {
      console.error('Error logging project action:', error);
      throw error;
    }
  },

  // Project Progress Calculation
  async calculateProjectProgress(projectId: string) {
    try {
      console.log('Calculating progress for project:', projectId);
      
      const milestones = await this.getMilestones(projectId);
      
      const totalMilestones = milestones.length;
      const completedMilestones = milestones.filter(m => m.status === 'completed').length;
      const inProgressMilestones = milestones.filter(m => m.status === 'in_progress').length;
      const delayedMilestones = milestones.filter(m => m.status === 'delayed').length;
      
      const overallProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
      
      // Calculate estimated completion based on completed vs remaining milestones
      const remainingMilestones = totalMilestones - completedMilestones;
      const estimatedCompletion = remainingMilestones > 0 ? 
        new Date(Date.now() + (remainingMilestones * 7 * 24 * 60 * 60 * 1000)).toISOString() : 
        undefined;
      
      // Identify critical path milestones (high priority, not completed)
      const criticalPathMilestones = milestones
        .filter(m => m.priority === 'high' && m.status !== 'completed')
        .map(m => m.id);
      
      const progress = {
        total_milestones: totalMilestones,
        completed_milestones: completedMilestones,
        in_progress_milestones: inProgressMilestones,
        delayed_milestones: delayedMilestones,
        overall_progress: overallProgress,
        estimated_completion: estimatedCompletion,
        critical_path_milestones: criticalPathMilestones
      };
      
      console.log('Project progress calculated:', progress);
      return progress;
    } catch (error) {
      console.error('Error calculating project progress:', error);
      throw error;
    }
  },

  // Status Workflow Management
  async getStatusRules() {
    try {
      console.log('Fetching status workflow rules');
      
      const response = await fetch(`${supabaseUrl}/rest/v1/project_status_rules?order=from_status.asc`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      console.log('Status rules fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching status rules:', error);
      throw error;
    }
  },

  async validateStatusTransition(fromStatus: string, toStatus: string, userRole: string) {
    try {
      console.log('Validating status transition:', { fromStatus, toStatus, userRole });
      
      const rules = await this.getStatusRules();
      const rule = rules.find(r => r.from_status === fromStatus && r.to_status === toStatus);
      
      if (!rule) {
        throw new Error(`Invalid status transition from ${fromStatus} to ${toStatus}`);
      }
      
      if (!rule.allowed_roles.includes(userRole)) {
        throw new Error(`User role ${userRole} is not allowed to transition from ${fromStatus} to ${toStatus}`);
      }
      
      console.log('Status transition validated:', rule);
      return rule;
    } catch (error) {
      console.error('Error validating status transition:', error);
      throw error;
    }
  },

  async updateProjectWithAudit(projectId: string, updates: any, userId?: string) {
    try {
      console.log('Updating project with audit trail:', { projectId, updates });
      
      // Get current project data for audit trail
      const currentProject = await this.getProject(projectId);
      
      // Update the project
      const updatedProject = await this.updateProject(projectId, updates);
      
      // Log changes to audit trail
      const auditEntries = [];
      
      for (const [field, newValue] of Object.entries(updates)) {
        const oldValue = currentProject[field];
        if (oldValue !== newValue) {
          auditEntries.push({
            action: 'field_updated',
            field_name: field,
            old_value: oldValue ? String(oldValue) : null,
            new_value: newValue ? String(newValue) : null
          });
        }
      }
      
      // Log all changes
      for (const entry of auditEntries) {
        await this.logProjectAction(projectId, entry);
      }
      
      console.log('Project updated with audit trail:', { updatedProject, auditEntries });
      return updatedProject;
    } catch (error) {
      console.error('Error updating project with audit:', error);
      throw error;
    }
  }
};
