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
    return data[0];
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
  },

  // ===== INVENTORY MANAGEMENT =====

  // Inventory Categories
  async getInventoryCategories() {
    try {
      console.log('Fetching inventory categories');
      
      const response = await fetch(`${supabaseUrl}/rest/v1/inventory_categories?order=name.asc`, {
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
      console.log('Inventory categories fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching inventory categories:', error);
      throw error;
    }
  },

  async createInventoryCategory(category: {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
  }) {
    try {
      console.log('Creating inventory category:', category);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/inventory_categories`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(category)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      console.log('Inventory category created successfully:', data);
      return data[0];
    } catch (error) {
      console.error('Error creating inventory category:', error);
      throw error;
    }
  },

  async updateInventoryCategory(id: string, updates: {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
  }) {
    try {
      console.log('Updating inventory category:', id, updates);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/inventory_categories?id=eq.${id}`, {
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
      console.log('Inventory category updated successfully:', data);
      return data[0];
    } catch (error) {
      console.error('Error updating inventory category:', error);
      throw error;
    }
  },

  async deleteInventoryCategory(id: string) {
    try {
      console.log('Deleting inventory category:', id);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/inventory_categories?id=eq.${id}`, {
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

      console.log('Inventory category deleted successfully');
    } catch (error) {
      console.error('Error deleting inventory category:', error);
      throw error;
    }
  },

  // Suppliers
  async getSuppliers() {
    try {
      console.log('Fetching suppliers');
      
      const response = await fetch(`${supabaseUrl}/rest/v1/suppliers?order=name.asc`, {
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
      console.log('Suppliers fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  },

  async createSupplier(supplier: {
    name: string;
    contact_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
    rating?: number;
    terms?: string;
    payment_terms?: string;
    notes?: string;
  }) {
    try {
      console.log('Creating supplier:', supplier);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/suppliers`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(supplier)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      console.log('Supplier created successfully:', data);
      return data[0];
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  },

  async updateSupplier(id: string, updates: {
    name?: string;
    contact_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
    rating?: number;
    terms?: string;
    payment_terms?: string;
    notes?: string;
  }) {
    try {
      console.log('Updating supplier:', id, updates);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/suppliers?id=eq.${id}`, {
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
      console.log('Supplier updated successfully:', data);
      return data[0];
    } catch (error) {
      console.error('Error updating supplier:', error);
      throw error;
    }
  },

  async deleteSupplier(id: string) {
    try {
      console.log('Deleting supplier:', id);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/suppliers?id=eq.${id}`, {
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

      console.log('Supplier deleted successfully');
    } catch (error) {
      console.error('Error deleting supplier:', error);
      throw error;
    }
  },

  // Inventory Items
  async getInventoryItems(filters?: {
    search?: string;
    category_id?: string;
    supplier_id?: string;
    status?: string;
    condition?: string;
    location?: string;
  }) {
    try {
      console.log('Fetching inventory items with filters:', filters);
      
      let url = `${supabaseUrl}/rest/v1/inventory_items?select=*,category:inventory_categories(*),supplier:suppliers(*)&order=name.asc`;
      
      if (filters?.search) {
        url += `&or=(name.ilike.*${filters.search}*,sku.ilike.*${filters.search}*,barcode.ilike.*${filters.search}*,manufacturer.ilike.*${filters.search}*)`;
      }
      
      if (filters?.category_id) {
        url += `&category_id=eq.${filters.category_id}`;
      }
      
      if (filters?.supplier_id) {
        url += `&supplier_id=eq.${filters.supplier_id}`;
      }
      
      if (filters?.status) {
        url += `&status=eq.${filters.status}`;
      }
      
      if (filters?.condition) {
        url += `&condition=eq.${filters.condition}`;
      }
      
      if (filters?.location) {
        url += `&location=ilike.*${filters.location}*`;
      }
      
      const response = await fetch(url, {
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
      console.log('Inventory items fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      throw error;
    }
  },

  async getInventoryItem(id: string) {
    try {
      console.log('Fetching inventory item:', id);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/inventory_items?id=eq.${id}&select=*,category:inventory_categories(*),supplier:suppliers(*)`, {
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
      console.log('Inventory item fetched successfully:', data[0]);
      return data[0];
    } catch (error) {
      console.error('Error fetching inventory item:', error);
      throw error;
    }
  },

  async createInventoryItem(item: {
    name: string;
    description?: string;
    sku?: string;
    barcode?: string;
    category_id?: string;
    supplier_id?: string;
    manufacturer?: string;
    model?: string;
    part_number?: string;
    quantity: number;
    min_quantity: number;
    max_quantity?: number;
    unit_cost: number;
    unit_price: number;
    location?: string;
    shelf_location?: string;
    condition?: 'new' | 'used' | 'refurbished' | 'damaged';
    warranty_period?: number;
    weight?: number;
    dimensions?: string;
    image_url?: string;
    documents?: string[];
    tags?: string[];
  }) {
    try {
      console.log('=== CREATE INVENTORY ITEM START ===');
      console.log('Creating inventory item:', item);
      
      console.log('Getting user...');
      
      // Add timeout to user authentication
      const authTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('User authentication timeout after 5 seconds')), 5000)
      );
      
      const authPromise = supabase.auth.getUser();
      const user = await Promise.race([authPromise, authTimeoutPromise]) as any;
      
      console.log('Current user:', user.data.user?.id);
      
      let userId = user.data.user?.id;
      
      // If no user found, try to proceed without user ID for testing
      if (!userId) {
        console.log('No authenticated user found, proceeding without user ID for testing');
        userId = null;
      }
      
      const itemData = {
        ...item,
        ...(userId && { created_by: userId, updated_by: userId })
      };
      
      console.log('Sending item data:', itemData);
      console.log('Supabase URL:', supabaseUrl);
      console.log('Supabase Key length:', supabaseKey.length);
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000)
      );
      
      console.log('Making fetch request...');
      // Create the fetch promise
      const fetchPromise = fetch(`${supabaseUrl}/rest/v1/inventory_items`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(itemData)
      });

      console.log('Waiting for response...');
      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      console.log('Response received!');
      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      console.log('Parsing response JSON...');
      const data = await response.json();
      console.log('Inventory item created successfully:', data);
      console.log('=== CREATE INVENTORY ITEM END ===');
      return data[0];
    } catch (error) {
      console.error('=== CREATE INVENTORY ITEM ERROR ===');
      console.error('Error creating inventory item:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('=== CREATE INVENTORY ITEM ERROR END ===');
      throw error;
    }
  },

  async updateInventoryItem(id: string, updates: {
    name?: string;
    description?: string;
    sku?: string;
    barcode?: string;
    category_id?: string;
    supplier_id?: string;
    manufacturer?: string;
    model?: string;
    part_number?: string;
    quantity?: number;
    min_quantity?: number;
    max_quantity?: number;
    unit_cost?: number;
    unit_price?: number;
    location?: string;
    shelf_location?: string;
    condition?: 'new' | 'used' | 'refurbished' | 'damaged';
    warranty_period?: number;
    weight?: number;
    dimensions?: string;
    image_url?: string;
    documents?: string[];
    tags?: string[];
  }) {
    try {
      console.log('Updating inventory item:', { id, updates });
      
      const user = await supabase.auth.getUser();
      
      const response = await fetch(`${supabaseUrl}/rest/v1/inventory_items?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          ...updates,
          updated_by: user.data.user?.id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      console.log('Inventory item updated successfully:', data);
      return data[0];
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
  },

  async deleteInventoryItem(id: string) {
    try {
      console.log('Deleting inventory item:', id);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/inventory_items?id=eq.${id}`, {
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

      console.log('Inventory item deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  },

  // Stock Movements
  async getStockMovements(itemId?: string, filters?: {
    movement_type?: string;
    start_date?: string;
    end_date?: string;
  }) {
    try {
      console.log('Fetching stock movements with filters:', { itemId, filters });
      
      let url = `${supabaseUrl}/rest/v1/stock_movements?select=*,item:inventory_items(*)&order=created_at.desc`;
      
      if (itemId) {
        url += `&item_id=eq.${itemId}`;
      }
      
      if (filters?.movement_type) {
        url += `&movement_type=eq.${filters.movement_type}`;
      }
      
      if (filters?.start_date) {
        url += `&created_at=gte.${filters.start_date}`;
      }
      
      if (filters?.end_date) {
        url += `&created_at=lte.${filters.end_date}`;
      }
      
      const response = await fetch(url, {
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
      console.log('Stock movements fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching stock movements:', error);
      throw error;
    }
  },

  async createStockMovement(movement: {
    item_id: string;
    movement_type: 'in' | 'out' | 'adjustment';
    quantity: number;
    reference_type?: string;
    reference_id?: string;
    notes?: string;
    location_from?: string;
    location_to?: string;
  }) {
    try {
      console.log('Creating stock movement:', movement);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/stock_movements`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(movement)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      console.log('Stock movement created successfully:', data);
      return data[0];
    } catch (error) {
      console.error('Error creating stock movement:', error);
      throw error;
    }
  },

  async adjustStock(itemId: string, adjustment: {
    quantity_change: number;
    movement_type: 'in' | 'out' | 'adjustment';
    notes?: string;
    reference_type?: string;
    reference_id?: string;
    location_from?: string;
    location_to?: string;
  }) {
    try {
      console.log('Adjusting stock:', { itemId, adjustment });
      
      const user = await supabase.auth.getUser();
      
      // Get current item
      const currentItem = await this.getInventoryItem(itemId);
      const newQuantity = currentItem.quantity + adjustment.quantity_change;
      
      if (newQuantity < 0) {
        throw new Error('Cannot reduce stock below 0');
      }
      
      // Update item quantity
      await this.updateInventoryItem(itemId, { quantity: newQuantity });
      
      // Log stock movement
      const response = await fetch(`${supabaseUrl}/rest/v1/stock_movements`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          item_id: itemId,
          movement_type: adjustment.movement_type,
          quantity: Math.abs(adjustment.quantity_change),
          previous_quantity: currentItem.quantity,
          new_quantity: newQuantity,
          reference_type: adjustment.reference_type,
          reference_id: adjustment.reference_id,
          notes: adjustment.notes,
          location_from: adjustment.location_from,
          location_to: adjustment.location_to,
          unit_cost: currentItem.unit_cost,
          total_value: currentItem.unit_cost * Math.abs(adjustment.quantity_change),
          created_by: user.data.user?.id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      console.log('Stock adjustment logged successfully:', data);
      return data[0];
    } catch (error) {
      console.error('Error adjusting stock:', error);
      throw error;
    }
  },

  // Barcode Scanning
  async scanBarcode(scanData: {
    barcode: string;
    scan_type: 'in' | 'out' | 'audit' | 'location_change';
    quantity?: number;
    location?: string;
    notes?: string;
  }) {
    try {
      console.log('Processing barcode scan:', scanData);
      
      const user = await supabase.auth.getUser();
      
      // Find item by barcode
      const items = await this.getInventoryItems({ search: scanData.barcode });
      const item = items.find(i => i.barcode === scanData.barcode);
      
      // Log the scan
      const response = await fetch(`${supabaseUrl}/rest/v1/barcode_scans`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          barcode: scanData.barcode,
          item_id: item?.id,
          scan_type: scanData.scan_type,
          quantity: scanData.quantity,
          location: scanData.location,
          notes: scanData.notes,
          scanned_by: user.data.user?.id,
          device_info: {
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      console.log('Barcode scan logged successfully:', data);
      
      return {
        scan: data[0],
        item: item || null,
        found: !!item
      };
    } catch (error) {
      console.error('Error processing barcode scan:', error);
      throw error;
    }
  },

  // Inventory Alerts
  async getInventoryAlerts(filters?: {
    alert_type?: string;
    is_active?: boolean;
    is_read?: boolean;
  }) {
    try {
      console.log('Fetching inventory alerts:', filters);
      
      let url = `${supabaseUrl}/rest/v1/inventory_alerts?select=*,item:inventory_items(*)&order=created_at.desc`;
      
      if (filters?.alert_type) {
        url += `&alert_type=eq.${filters.alert_type}`;
      }
      
      if (filters?.is_active !== undefined) {
        url += `&is_active=eq.${filters.is_active}`;
      }
      
      if (filters?.is_read !== undefined) {
        url += `&is_read=eq.${filters.is_read}`;
      }
      
      const response = await fetch(url, {
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
      console.log('Inventory alerts fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching inventory alerts:', error);
      throw error;
    }
  },

  async markAlertAsRead(alertId: string) {
    try {
      console.log('Marking alert as read:', alertId);
      
      const user = await supabase.auth.getUser();
      
      const response = await fetch(`${supabaseUrl}/rest/v1/inventory_alerts?id=eq.${alertId}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          is_read: true,
          resolved_at: new Date().toISOString(),
          resolved_by: user.data.user?.id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      console.log('Alert marked as read successfully:', data);
      return data[0];
    } catch (error) {
      console.error('Error marking alert as read:', error);
      throw error;
    }
  },

  // Inventory Statistics
  async getInventoryStats() {
    try {
      console.log('Fetching inventory statistics');
      
      const [items, categories, suppliers, movements, alerts] = await Promise.all([
        this.getInventoryItems(),
        this.getInventoryCategories(),
        this.getSuppliers(),
        this.getStockMovements(),
        this.getInventoryAlerts({ is_active: true })
      ]);
      
      const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unit_cost), 0);
      const lowStockItems = items.filter(item => item.status === 'low_stock').length;
      const outOfStockItems = items.filter(item => item.status === 'out_of_stock').length;
      
      const stats = {
        total_items: items.length,
        total_value: totalValue,
        low_stock_items: lowStockItems,
        out_of_stock_items: outOfStockItems,
        categories_count: categories.length,
        suppliers_count: suppliers.length,
        recent_movements: movements.slice(0, 10),
        recent_alerts: alerts.slice(0, 10)
      };
      
      console.log('Inventory statistics calculated:', stats);
      return stats;
    } catch (error) {
      console.error('Error calculating inventory statistics:', error);
      throw error;
    }
  },

  // Test function to check inventory tables
  async testInventoryTables() {
    try {
      console.log('Testing inventory tables...');
      
      const tables = [
        'inventory_categories',
        'suppliers', 
        'inventory_items',
        'stock_movements',
        'purchase_orders',
        'purchase_order_items',
        'barcode_scans',
        'inventory_alerts'
      ];
      
      for (const table of tables) {
        try {
          const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=count&limit=1`, {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log(`${table}: ${response.ok ? 'OK' : `Error ${response.status}`}`);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`${table} error:`, errorText);
          }
        } catch (error) {
          console.error(`Error testing ${table}:`, error);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error testing inventory tables:', error);
      return false;
    }
  },

  // Simple test to check if inventory tables are accessible
  async testInventoryAccess() {
    try {
      console.log('Testing inventory table access...');
      
      // Try to fetch one record from each table
      const response = await fetch(`${supabaseUrl}/rest/v1/inventory_items?limit=1`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Inventory items table test:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Inventory items table error:', errorText);
        return false;
      }
      
      const data = await response.json();
      console.log('Inventory items table accessible, found', data.length, 'records');
      return true;
    } catch (error) {
      console.error('Error testing inventory access:', error);
      return false;
    }
  },

  // Test user authentication
  async testUserAuth() {
    try {
      console.log('Testing user authentication...');
      
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Auth error:', error);
        return false;
      }
      
      if (!user) {
        console.log('No authenticated user found');
        return false;
      }
      
      console.log('User authenticated:', user.id, user.email);
      return true;
    } catch (error) {
      console.error('Error testing user auth:', error);
      return false;
    }
  },

  // Test creating a minimal inventory item
  async testCreateMinimalItem() {
    try {
      console.log('=== TESTING MINIMAL ITEM CREATION ===');
      
      // Add timeout to user authentication
      const authTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('User authentication timeout after 5 seconds')), 5000)
      );
      
      const authPromise = supabase.auth.getUser();
      const user = await Promise.race([authPromise, authTimeoutPromise]) as any;
      
      if (!user.data.user) {
        console.log('No user found, testing without user ID');
        // Test without user ID
        const minimalItem = {
          name: 'Test Item',
          quantity: 1,
          min_quantity: 0,
          unit_cost: 10.00,
          unit_price: 15.00
        };
        
        console.log('Testing with minimal item (no user):', minimalItem);
        
        const response = await fetch(`${supabaseUrl}/rest/v1/inventory_items`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(minimalItem)
        });
        
        console.log('Test response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Test creation failed:', errorText);
          return false;
        }
        
        const data = await response.json();
        console.log('Test item created successfully:', data);
        
        // Clean up - delete the test item
        if (data[0]?.id) {
          await fetch(`${supabaseUrl}/rest/v1/inventory_items?id=eq.${data[0].id}`, {
            method: 'DELETE',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('Test item cleaned up');
        }
        
        return true;
      }
      
      const minimalItem = {
        name: 'Test Item',
        quantity: 1,
        min_quantity: 0,
        unit_cost: 10.00,
        unit_price: 15.00,
        created_by: user.data.user.id,
        updated_by: user.data.user.id
      };
      
      console.log('Testing with minimal item:', minimalItem);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/inventory_items`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(minimalItem)
      });
      
      console.log('Test response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Test creation failed:', errorText);
        return false;
      }
      
      const data = await response.json();
      console.log('Test item created successfully:', data);
      
      // Clean up - delete the test item
      if (data[0]?.id) {
        await fetch(`${supabaseUrl}/rest/v1/inventory_items?id=eq.${data[0].id}`, {
          method: 'DELETE',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Test item cleaned up');
      }
      
      return true;
    } catch (error) {
      console.error('Test creation error:', error);
      return false;
    }
  },

  // Test direct fetch without Supabase client
  async testDirectFetch() {
    try {
      console.log('=== TESTING DIRECT FETCH ===');
      
      // Test a simple GET request
      const response = await fetch(`${supabaseUrl}/rest/v1/inventory_items?limit=1`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Direct fetch response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Direct fetch failed:', errorText);
        return false;
      }
      
      const data = await response.json();
      console.log('Direct fetch successful, data:', data);
      return true;
    } catch (error) {
      console.error('Direct fetch error:', error);
      return false;
    }
  },

  // Test Supabase client configuration
  async testSupabaseClient() {
    try {
      console.log('=== TESTING SUPABASE CLIENT ===');
      console.log('Supabase URL:', supabaseUrl);
      console.log('Supabase Key length:', supabaseKey.length);
      
      // Test basic client functionality
      const { data, error } = await supabase.from('inventory_items').select('count').limit(1);
      
      if (error) {
        console.error('Supabase client error:', error);
        return false;
      }
      
      console.log('Supabase client working, data:', data);
      return true;
    } catch (error) {
      console.error('Supabase client test error:', error);
      return false;
    }
  },

  // --- PURCHASE ORDERS CRUD ---
  async getPurchaseOrders(filters: any = {}) {
    try {
      // First, get the purchase orders
      let query = `${supabaseUrl}/rest/v1/purchase_orders?select=*,supplier:suppliers(*)`;
      const params = [];
      if (filters.status) params.push(`status=eq.${filters.status}`);
      if (filters.supplier_id) params.push(`supplier_id=eq.${filters.supplier_id}`);
      if (filters.search) params.push(`po_number=ilike.*${filters.search}*`);
      if (params.length) query += `&${params.join('&')}`;
      
      const response = await fetch(query, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(await response.text());
      const orders = await response.json();
      
      // Then, get the items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          try {
            const itemsResponse = await fetch(
              `${supabaseUrl}/rest/v1/purchase_order_items?purchase_order_id=eq.${order.id}`,
              {
                headers: {
                  'apikey': supabaseKey,
                  'Authorization': `Bearer ${supabaseKey}`,
                  'Content-Type': 'application/json',
                },
              }
            );
            if (itemsResponse.ok) {
              const items = await itemsResponse.json();
              return { ...order, items };
            } else {
              console.error('Error fetching items for order:', order.id);
              return { ...order, items: [] };
            }
          } catch (error) {
            console.error('Error fetching items for order:', order.id, error);
            return { ...order, items: [] };
          }
        })
      );
      
      return ordersWithItems;
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      throw error;
    }
  },

  async getPurchaseOrder(id) {
    try {
      // Get the purchase order
      const orderResponse = await fetch(
        `${supabaseUrl}/rest/v1/purchase_orders?id=eq.${id}&select=*,supplier:suppliers(*)`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!orderResponse.ok) throw new Error(await orderResponse.text());
      const orderData = await orderResponse.json();
      const order = orderData[0];
      
      if (!order) throw new Error('Purchase order not found');
      
      // Get the items for this order
      const itemsResponse = await fetch(
        `${supabaseUrl}/rest/v1/purchase_order_items?purchase_order_id=eq.${id}`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      let items = [];
      if (itemsResponse.ok) {
        items = await itemsResponse.json();
      }
      
      return { ...order, items };
    } catch (error) {
      console.error('Error fetching purchase order:', error);
      throw error;
    }
  },

  async createPurchaseOrder(orderData) {
    try {
      // Extract items from orderData
      const { items, ...orderWithoutItems } = orderData;
      
      // Try to get the current user for created_by field
      let userId = null;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id || null;
      } catch (error) {
        console.log('No authenticated user found, proceeding without user ID');
        userId = null;
      }
      
      // Prepare order data with created_by field
      const orderToCreate = {
        ...orderWithoutItems,
        created_by: userId,
        updated_by: userId
      };
      
      // Create the purchase order
      const response = await fetch(`${supabaseUrl}/rest/v1/purchase_orders`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(orderToCreate),
      });
      if (!response.ok) throw new Error(await response.text());
      const [order] = await response.json();
      
      // Create the order items if any
      if (items && items.length > 0) {
        const itemsWithOrderId = items.map(item => ({
          ...item,
          purchase_order_id: order.id
        }));
        
        const itemsResponse = await fetch(`${supabaseUrl}/rest/v1/purchase_order_items`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(itemsWithOrderId),
        });
        
        if (itemsResponse.ok) {
          const createdItems = await itemsResponse.json();
          return { ...order, items: createdItems };
        } else {
          console.error('Error creating order items:', await itemsResponse.text());
          return { ...order, items: [] };
        }
      }
      
      return { ...order, items: [] };
    } catch (error) {
      console.error('Error creating purchase order:', error);
      throw error;
    }
  },

  async updatePurchaseOrder(id, updates) {
    try {
      // Extract items from updates
      const { items, ...orderUpdates } = updates;
      
      // Try to get the current user for updated_by field
      let userId = null;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id || null;
      } catch (error) {
        console.log('No authenticated user found, proceeding without user ID');
        userId = null;
      }
      
      // Prepare order updates with updated_by field
      const orderToUpdate = {
        ...orderUpdates,
        updated_by: userId
      };
      
      // Update the purchase order
      const response = await fetch(`${supabaseUrl}/rest/v1/purchase_orders?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(orderToUpdate),
      });
      if (!response.ok) throw new Error(await response.text());
      const [order] = await response.json();
      
      // Update items if provided
      if (items) {
        // First, delete existing items
        await fetch(`${supabaseUrl}/rest/v1/purchase_order_items?purchase_order_id=eq.${id}`, {
          method: 'DELETE',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
        });
        
        // Then, create new items
        if (items.length > 0) {
          const itemsWithOrderId = items.map(item => ({
            ...item,
            purchase_order_id: id
          }));
          
          const itemsResponse = await fetch(`${supabaseUrl}/rest/v1/purchase_order_items`, {
            method: 'POST',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation',
            },
            body: JSON.stringify(itemsWithOrderId),
          });
          
          if (itemsResponse.ok) {
            const updatedItems = await itemsResponse.json();
            return { ...order, items: updatedItems };
          } else {
            console.error('Error updating order items:', await itemsResponse.text());
            return { ...order, items: [] };
          }
        } else {
          return { ...order, items: [] };
        }
      }
      
      return order;
    } catch (error) {
      console.error('Error updating purchase order:', error);
      throw error;
    }
  },

  async deletePurchaseOrder(id) {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/purchase_orders?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(await response.text());
      return true;
    } catch (error) {
      console.error('Error deleting purchase order:', error);
      throw error;
    }
  },
};
