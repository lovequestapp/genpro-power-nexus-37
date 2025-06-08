import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Ticket, Profile } from '@/lib/supabase';
import { supabaseService } from '@/services/supabase';
import { TicketDetails } from '@/components/tickets/TicketDetails';
import { TicketList } from '@/components/tickets/TicketList';
import { TicketFilters } from '@/components/tickets/TicketFilters';
import { TicketStats } from '@/components/tickets/TicketStats';
import { Service } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
type TicketType = 'bug' | 'feature' | 'support' | 'other';

interface Stats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

interface TicketMetadata {
  comments: {
    id: string;
    content: string;
    author: string;
    createdAt: string;
    attachments: string[];
  }[];
  attachments: string[];
  [key: string]: any;
}

interface Comment {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  attachments: string[];
}

interface Attachment {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  url: string;
  created_at: string;
}

interface TicketWithMetadata extends Omit<Ticket, 'metadata'> {
  metadata?: TicketMetadata;
  customer?: Profile;
  assigned_staff?: Profile | null;
  comments?: Comment[];
  attachments?: Attachment[];
}

const convertToService = (ticket: TicketWithMetadata): Service => ({
  id: ticket.id,
  title: ticket.title,
  description: ticket.description,
  status: ticket.status,
  priority: ticket.priority,
  type: ticket.type === 'bug' ? 'technical' : ticket.type === 'feature' ? 'general' : 'billing',
  customerId: ticket.customer_id,
  customerName: ticket.customer?.full_name || 'Unknown Customer',
  assignedTo: ticket.assigned_to || undefined,
  createdAt: ticket.created_at,
  updatedAt: ticket.updated_at,
  comments: (ticket.comments || []).map(comment => ({
    id: comment.id,
    content: comment.content,
    author: comment.author_id,
    createdAt: comment.created_at,
    attachments: (comment.attachments || []).map(url => ({
      id: url,
      name: url.split('/').pop() || '',
      url,
      type: 'application/octet-stream',
      size: 0,
      uploadedAt: new Date().toISOString()
    }))
  })),
  attachments: (ticket.attachments || []).map(attachment => ({
    id: attachment.id,
    name: attachment.file_name,
    url: attachment.url,
    type: attachment.file_type,
    size: attachment.file_size,
    uploadedAt: attachment.created_at
  }))
});

export default function Dashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketWithMetadata[]>([]);
  const [staff, setStaff] = useState<Profile[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketWithMetadata | null>(null);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
  });
  const [filters, setFilters] = useState({
    status: 'all' as TicketStatus | 'all',
    priority: 'all' as TicketPriority | 'all',
    type: 'all' as TicketType | 'all',
    assignedTo: 'all' as string | 'all'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: 'Authentication Error',
          description: 'Please log in to access the admin dashboard',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }

      // Check if user has admin role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || profile?.role !== 'admin') {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access the admin dashboard',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      // If authenticated and authorized, fetch dashboard data
      fetchDashboardData();
    } catch (err) {
      console.error('Error checking authentication:', err);
      toast({
        title: 'Error',
        description: 'Failed to verify authentication',
        variant: 'destructive',
      });
      navigate('/login');
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchTickets(),
        fetchStaff()
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const data = await supabaseService.getTickets();
      setTickets(data as TicketWithMetadata[]);
      updateStats(data as TicketWithMetadata[]);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      throw err;
    }
  };

  const fetchStaff = async () => {
    try {
      const data = await supabaseService.getStaff();
      setStaff(data);
    } catch (err) {
      console.error('Error fetching staff:', err);
      throw err;
    }
  };

  const updateStats = (tickets: TicketWithMetadata[]) => {
    setStats({
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      closed: tickets.filter(t => t.status === 'closed').length
    });
  };

  const handleCreateTicket = async (ticketData: Omit<TicketWithMetadata, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const ticketToCreate = {
        ...ticketData,
        metadata: ticketData.metadata || {}
      };
      const result = await supabaseService.createTicket(ticketToCreate);
      if (result.error) throw result.error;
      await fetchTickets();
      toast({
        title: 'Success',
        description: 'Ticket created successfully',
      });
    } catch (err) {
      console.error('Error creating ticket:', err);
      toast({
        title: 'Error',
        description: 'Failed to create ticket',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: TicketStatus) => {
    try {
      const result = await supabaseService.updateTicket(ticketId, { status });
      if (result.error) throw result.error;
      await fetchTickets();
      toast({
        title: 'Success',
        description: 'Status updated successfully',
      });
    } catch (err) {
      console.error('Error updating ticket status:', err);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleAssignTicket = async (ticketId: string, staffId: string) => {
    try {
      const result = await supabaseService.updateTicket(ticketId, { assigned_to: staffId });
      if (result.error) throw result.error;
      await fetchTickets();
      toast({
        title: 'Success',
        description: 'Ticket assigned successfully',
      });
    } catch (err) {
      console.error('Error assigning ticket:', err);
      toast({
        title: 'Error',
        description: 'Failed to assign ticket',
        variant: 'destructive',
      });
    }
  };

  const handleUnassignTicket = async (ticketId: string) => {
    try {
      const result = await supabaseService.updateTicket(ticketId, { assigned_to: null });
      if (result.error) throw result.error;
      await fetchTickets();
      toast({
        title: 'Success',
        description: 'Ticket unassigned successfully',
      });
    } catch (err) {
      console.error('Error unassigning ticket:', err);
      toast({
        title: 'Error',
        description: 'Failed to unassign ticket',
        variant: 'destructive',
      });
    }
  };

  const handleAddComment = async (ticketId: string, content: string, attachments: string[] = []) => {
    try {
      const user = await supabase.auth.getUser();
      const result = await supabaseService.createComment({
        ticket_id: ticketId,
        content,
        author_id: user.data.user?.id || '',
        attachments
      });
      if (result.error) throw result.error;
      await fetchTickets();
      toast({
        title: 'Success',
        description: 'Comment added successfully',
      });
    } catch (err) {
      console.error('Error adding comment:', err);
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive',
      });
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filters.status !== 'all' && ticket.status !== filters.status) return false;
    if (filters.priority !== 'all' && ticket.priority !== filters.priority) return false;
    if (filters.type !== 'all' && ticket.type !== filters.type) return false;
    if (filters.assignedTo !== 'all' && ticket.assigned_to !== filters.assignedTo) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
            <div className="mt-8">
              <TicketStats tickets={filteredTickets.map(convertToService)} />
            </div>
            <div className="mt-8">
              <TicketFilters
                onFilterChange={(newFilters) => setFilters(newFilters as typeof filters)}
                onSortChange={() => {}}
                onSearch={() => {}}
              />
            </div>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <TicketList
                  tickets={filteredTickets.map(convertToService)}
                  onSelectTicket={(ticket) => setSelectedTicket(tickets.find(t => t.id === ticket.id) || null)}
                  selectedTicketId={selectedTicket?.id}
                />
              </div>
              <div>
                {selectedTicket ? (
                  <TicketDetails
                    ticket={convertToService(selectedTicket)}
                    onStatusChange={(status) => handleUpdateStatus(selectedTicket.id, status as TicketStatus)}
                    onPriorityChange={(priority) => 
                      supabaseService.updateTicket(selectedTicket.id, { priority: priority as TicketPriority })}
                    onAssign={(staffId) => handleAssignTicket(selectedTicket.id, staffId)}
                    isAdmin={true}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-500">Select a ticket to view details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 