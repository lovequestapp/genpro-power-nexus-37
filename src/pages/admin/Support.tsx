
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { TicketList } from '@/components/tickets/TicketList';
import { TicketDetails } from '@/components/tickets/TicketDetails';
import { TicketFilters } from '@/components/tickets/TicketFilters';
import { TicketMetrics } from '@/components/tickets/TicketMetrics';
import { CreateTicketModal } from '@/components/tickets/CreateTicketModal';
import { supabase } from '@/lib/supabase';
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';

interface Ticket {
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

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export default function SupportPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    type: 'all',
    search: '',
  });

  // Fetch tickets
  const { data: tickets = [], isLoading: ticketsLoading, refetch: refetchTickets } = useQuery({
    queryKey: ['tickets', filters],
    queryFn: async () => {
      let query = supabase
        .from('tickets')
        .select(`
          *,
          customer:customers(id, name, email),
          assigned_user:profiles!assigned_to(id, full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }
      if (filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%, description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Ticket[];
    },
  });

  // Fetch customers
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, email')
        .order('name');
      if (error) throw error;
      return data as Customer[];
    },
  });

  // Fetch staff
  const { data: staff = [] } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .in('role', ['admin', 'staff'])
        .order('full_name');
      if (error) throw error;
      return data as Profile[];
    },
  });

  // Update ticket mutation
  const updateTicketMutation = useMutation({
    mutationFn: async ({ ticketId, updates }: { ticketId: string; updates: Partial<Ticket> }) => {
      const { data, error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', ticketId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({ title: 'Success', description: 'Ticket updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update ticket', variant: 'destructive' });
      console.error('Update ticket error:', error);
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({ ticketId, content }: { ticketId: string; content: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('comments')
        .insert({
          ticket_id: ticketId,
          author_id: user.id,
          content,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({ title: 'Success', description: 'Comment added successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to add comment', variant: 'destructive' });
      console.error('Add comment error:', error);
    },
  });

  const handleStatusChange = (status: Ticket['status']) => {
    if (selectedTicket) {
      updateTicketMutation.mutate({
        ticketId: selectedTicket.id,
        updates: { status },
      });
      setSelectedTicket({ ...selectedTicket, status });
    }
  };

  const handleAssign = (staffId: string) => {
    if (selectedTicket) {
      updateTicketMutation.mutate({
        ticketId: selectedTicket.id,
        updates: { assigned_to: staffId },
      });
      setSelectedTicket({ ...selectedTicket, assigned_to: staffId });
    }
  };

  const handleUnassign = () => {
    if (selectedTicket) {
      updateTicketMutation.mutate({
        ticketId: selectedTicket.id,
        updates: { assigned_to: null },
      });
      setSelectedTicket({ ...selectedTicket, assigned_to: undefined });
    }
  };

  const handleAddComment = (content: string) => {
    if (selectedTicket) {
      addCommentMutation.mutate({
        ticketId: selectedTicket.id,
        content,
      });
    }
  };

  const handleTicketCreated = () => {
    refetchTickets();
    setIsCreateModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer support requests and internal tickets
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetchTickets()}
            disabled={ticketsLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${ticketsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <TicketMetrics tickets={tickets} />

      {/* Filters */}
      <TicketFilters
        onFilterChange={setFilters}
        onSortChange={() => {}}
        onSearch={(search) => setFilters(prev => ({ ...prev, search }))}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket List */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Tickets</h2>
            <Badge variant="outline">
              {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          {ticketsLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>Loading tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No tickets found</p>
            </div>
          ) : (
            <TicketList
              tickets={tickets.map(ticket => ({
                id: ticket.id,
                title: ticket.title,
                description: ticket.description,
                status: ticket.status,
                priority: ticket.priority,
                type: ticket.type,
                customerName: ticket.customer?.name || 'Unknown',
                createdAt: ticket.created_at,
                date: ticket.created_at,
                assignedTo: ticket.assigned_to,
                comments: []
              }))}
              onTicketSelect={(ticket) => setSelectedTicket(tickets.find(t => t.id === ticket.id) || null)}
              selectedTicketId={selectedTicket?.id}
            />
          )}
        </Card>

        {/* Ticket Details */}
        <Card className="p-4">
          {selectedTicket ? (
            <TicketDetails
              ticket={{
                id: selectedTicket.id,
                title: selectedTicket.title,
                description: selectedTicket.description,
                status: selectedTicket.status,
                priority: selectedTicket.priority,
                type: selectedTicket.type,
                customerName: selectedTicket.customer?.name || 'Unknown',
                createdAt: selectedTicket.created_at,
                date: selectedTicket.created_at,
                assignedTo: selectedTicket.assigned_to,
                comments: []
              }}
              onStatusChange={handleStatusChange}
              onAssign={handleAssign}
              onUnassign={handleUnassign}
              onAddComment={handleAddComment}
              staff={staff.map(s => ({ id: s.id, full_name: s.full_name }))}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Select a ticket to view details</p>
            </div>
          )}
        </Card>
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onTicketCreated={handleTicketCreated}
      />
    </div>
  );
}
