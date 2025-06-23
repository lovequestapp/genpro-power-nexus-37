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
import { ticketService, type Ticket } from '@/services/ticketService';
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';
import SEO from '../../components/SEO';

interface Customer {
  id: string;
  full_name: string;
  email: string;
}

interface Staff {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

interface TransformedTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'technical' | 'billing' | 'general';
  customerName: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  assignedTo?: string;
  comments: any[];
  attachments: any[];
}

// Transform database ticket to component-expected format
const transformTicketForComponent = (ticket: any): TransformedTicket => ({
  id: ticket.id,
  title: ticket.title,
  description: ticket.description,
  status: ticket.status,
  priority: ticket.priority,
  type: ticket.type === 'support' ? 'technical' : ticket.type === 'bug' ? 'technical' : ticket.type === 'feature' ? 'technical' : 'general',
  customerName: ticket.customer?.full_name || 'Unknown',
  customerId: ticket.customer_id || '',
  createdAt: ticket.created_at,
  updatedAt: ticket.updated_at || ticket.created_at,
  date: ticket.created_at,
  assignedTo: ticket.assigned_to,
  comments: ticket.comments || [],
  attachments: ticket.attachments || []
});

export default function SupportPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTicket, setSelectedTicket] = useState<TransformedTicket | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    type: 'all',
    search: '',
  });

  // Fetch tickets
  const { data: rawTickets = [], isLoading: ticketsLoading, refetch: refetchTickets } = useQuery({
    queryKey: ['tickets', filters],
    queryFn: async () => {
      return await ticketService.getTickets(filters);
    },
  });

  // Transform tickets for component compatibility
  const tickets: TransformedTicket[] = rawTickets.map(transformTicketForComponent);

  // Fetch customers
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      return await ticketService.getCustomers();
    },
  });

  // Fetch staff
  const { data: staff = [] } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      return await ticketService.getStaff();
    },
  });

  // Update ticket mutation
  const updateTicketMutation = useMutation({
    mutationFn: async ({ ticketId, updates }: { ticketId: string; updates: Partial<Ticket> }) => {
      return await ticketService.updateTicket(ticketId, updates);
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
      return await ticketService.addComment(ticketId, content);
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

  const handleStatusChange = (status: any) => {
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
      setSelectedTicket({ ...selectedTicket, assignedTo: staffId });
    }
  };

  const handleUnassign = () => {
    if (selectedTicket) {
      updateTicketMutation.mutate({
        ticketId: selectedTicket.id,
        updates: { assigned_to: null },
      });
      setSelectedTicket({ ...selectedTicket, assignedTo: undefined });
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
    toast({ title: 'Success', description: 'Ticket created successfully' });
  };

  return (
    <>
      <SEO title="Admin Support | HOU GEN PROS" description="Admin dashboard support page." canonical="/admin/support" pageType="website" keywords="admin, support, dashboard" schema={null} />
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
                tickets={tickets}
                onTicketSelect={(ticket) => {
                  const originalTicket = rawTickets.find(t => t.id === ticket.id);
                  setSelectedTicket(originalTicket ? transformTicketForComponent(originalTicket) : null);
                }}
                selectedTicketId={selectedTicket?.id}
              />
            )}
          </Card>

          {/* Ticket Details */}
          <Card className="p-4">
            {selectedTicket ? (
              <TicketDetails
                ticket={selectedTicket}
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
    </>
  );
}
