import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Power, 
  FileText, 
  Calendar, 
  Settings, 
  Bell, 
  MessageSquare,
  Wrench,
  DollarSign,
  AlertTriangle,
  Clock,
  Battery,
  Activity,
  Plus,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { generatorService, billingService, serviceService, supportService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { Generator, Bill, Service } from '@/types';
import { ApiResponse } from '@/types';
import { CreateTicketModal } from '@/components/tickets/CreateTicketModal';
import { TicketList } from '@/components/tickets/TicketList';
import { TicketDetails } from '@/components/tickets/TicketDetails';
import { TicketStats } from '@/components/tickets/TicketStats';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface GeneratorStatus {
  status: string;
  lastMaintenance: string;
  nextMaintenance: string;
  runtime: string;
  fuelLevel: number;
  batteryHealth: number;
  oilLevel: number;
}

interface Stats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

export default function Dashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generators, setGenerators] = useState<Generator[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [tickets, setTickets] = useState<Service[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Service | null>(null);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
  });
  const queryClient = useQueryClient();
  const addComment = useMutation({
    mutationFn: async ({ ticketId, comment }: { ticketId: string; comment: string }) => {
      return await supportService.addComment(ticketId, comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerTickets'] });
    },
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication Error',
          description: 'Please log in to access the dashboard',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || (profile.role !== 'customer' && profile.role !== 'admin')) {
        toast({
          title: 'Authorization Error',
          description: 'You do not have permission to access this page',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }

      await fetchDashboardData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to authenticate';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      navigate('/login');
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [generatorsResponse, billsResponse, ticketsResponse] = await Promise.all([
        generatorService.getAll(),
        billingService.getAll(),
        supportService.getAll()
      ]);

      if (generatorsResponse.success) {
        setGenerators(generatorsResponse.data);
      }
      if (billsResponse.success) {
        setBills(billsResponse.data);
      }
      if (ticketsResponse.success) {
        setTickets(ticketsResponse.data);
        updateStats(ticketsResponse.data);
      }
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

  const updateStats = (tickets: Service[]) => {
    setStats({
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      closed: tickets.filter(t => t.status === 'closed').length
    });
  };

  const handleCreateTicket = async () => {
    try {
      await fetchDashboardData();
      setShowCreateTicket(false);
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

  const handleUpdateTicket = async (ticketId: string, updates: Partial<Service>) => {
    try {
      const response = await supportService.update(ticketId, updates);
      if (response.success) {
        const updatedTickets = tickets.map(ticket => 
          ticket.id === ticketId ? response.data : ticket
        );
        setTickets(updatedTickets);
        updateStats(updatedTickets);
        toast({
          title: 'Success',
          description: 'Ticket updated successfully',
        });
      }
    } catch (err) {
      console.error('Error updating ticket:', err);
      toast({
        title: 'Error',
        description: 'Failed to update ticket',
        variant: 'destructive',
      });
    }
  };

  const handleAddComment = async (ticketId: string, comment: string) => {
    try {
      const response = await addComment.mutateAsync({ ticketId, comment });
      if (response.success) {
        const updatedTickets = tickets.map(ticket => 
          ticket.id === ticketId ? response.data : ticket
        );
        setTickets(updatedTickets);
        toast({
          title: 'Success',
          description: 'Comment added successfully',
        });
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-steel-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-steel-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-steel-900">Customer Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 gap-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="generators" className="flex items-center space-x-2">
              <Power className="h-4 w-4" />
              <span>Generators</span>
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Tickets</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Billing</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center space-x-2">
              <Wrench className="h-4 w-4" />
              <span>Services</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Active Generators</h3>
                <p className="text-3xl font-bold">
                  {generators.filter(g => g.status === 'active').length}
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Pending Bills</h3>
                <p className="text-3xl font-bold">
                  {bills.filter(b => b.status === 'pending').length}
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Open Tickets</h3>
                <p className="text-3xl font-bold">{stats.open}</p>
              </Card>
            </div>
            <TicketStats stats={stats} />
          </TabsContent>

          <TabsContent value="generators">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Generators</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generators.map((generator) => (
                  <Card key={generator.id} className="p-4">
                    <h3 className="font-semibold">{generator.name}</h3>
                    <p className="text-sm text-steel-500">{generator.type}</p>
                    <div className="mt-2">
                      <Badge variant={generator.status === 'active' ? 'default' : 'secondary'}>
                        {generator.status}
                      </Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Fuel Level</span>
                        <span>{generator.readings[0]?.fuelLevel || 0}%</span>
                      </div>
                      <Progress value={generator.readings[0]?.fuelLevel || 0} />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tickets">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Support Tickets</h2>
                <Button onClick={() => setShowCreateTicket(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Ticket
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <TicketList
                    tickets={tickets}
                    onTicketSelect={setSelectedTicket}
                    selectedTicketId={selectedTicket?.id}
                  />
                </div>
                <div>
                  {selectedTicket && (
                    <TicketDetails
                      ticket={selectedTicket}
                      onStatusChange={(status) => handleUpdateTicket(selectedTicket.id, { status })}
                      onAssign={() => {}}
                      onUnassign={() => {}}
                      onAddComment={(content) => handleAddComment(selectedTicket.id, content)}
                      staff={[]}
                    />
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="billing">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Billing History</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bills.map((bill) => (
                  <Card key={bill.id} className="p-4">
                    <h3 className="font-semibold">Bill #{bill.id}</h3>
                    <p className="text-sm text-steel-500">${bill.amount}</p>
                    <div className="mt-2">
                      <Badge variant={bill.status === 'paid' ? 'default' : 'secondary'}>
                        {bill.status}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-steel-500">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Service History</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <Card key={service.id} className="p-4">
                    <h3 className="font-semibold">{service.title}</h3>
                    <p className="text-sm text-steel-500">{service.description}</p>
                    <div className="mt-2">
                      <Badge variant={service.status === 'resolved' ? 'default' : 'secondary'}>
                        {service.status}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-steel-500">
                        {new Date(service.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {showCreateTicket && (
          <CreateTicketModal
            open={showCreateTicket}
            onOpenChange={setShowCreateTicket}
            onTicketCreated={handleCreateTicket}
          />
        )}
      </div>
    </div>
  );
}
