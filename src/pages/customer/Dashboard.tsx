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
  Plus
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
import { TicketComments } from '@/components/tickets/TicketComments';
import { useNavigate } from 'react-router-dom';

interface GeneratorStatus {
  status: string;
  lastMaintenance: string;
  nextMaintenance: string;
  runtime: string;
  fuelLevel: number;
  batteryHealth: number;
  oilLevel: number;
}

interface Comment {
  author: string;
  content: string;
  timestamp: string;
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

      if (!profile || profile.role !== 'customer') {
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

      const [generatorsResponse, billsResponse, servicesResponse] = await Promise.all([
        generatorService.getAll(),
        billingService.getAll(),
        serviceService.getAll()
      ]);

      if (generatorsResponse.success) {
        setGenerators(generatorsResponse.data);
      }
      if (billsResponse.success) {
        setBills(billsResponse.data);
      }
      if (servicesResponse.success) {
        setServices(servicesResponse.data);
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

  const handleCreateTicket = async (ticketData: {
    title: string;
    description: string;
    type: 'technical' | 'billing' | 'general';
  }) => {
    try {
      const response = await supportService.create({
        ...ticketData,
        status: 'open',
        priority: 'medium',
      });

      if (response.success) {
        setTickets([...tickets, response.data]);
        setShowCreateTicket(false);
        toast({
          title: 'Success',
          description: 'Ticket created successfully',
        });
      }
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
        setTickets(tickets.map(ticket => 
          ticket.id === ticketId ? response.data : ticket
        ));
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
      const response = await supportService.addComment(ticketId, {
        content: comment,
        author: 'Customer',
      });
      if (response.success) {
        setTickets(tickets.map(ticket => 
          ticket.id === ticketId ? response.data : ticket
        ));
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
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Customer Dashboard</h1>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="generators">Generators</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Generator Status */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Generator Status</h3>
              <div className="space-y-4">
                {generators.map(generator => (
                  <div key={generator.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{generator.name}</p>
                      <p className="text-sm text-steel-600">{generator.type}</p>
                    </div>
                    <Badge variant={generator.status === 'active' ? 'default' : 'destructive'}>
                      {generator.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Bills */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Bills</h3>
              <div className="space-y-4">
                {bills.slice(0, 3).map(bill => (
                  <div key={bill.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">${bill.amount}</p>
                      <p className="text-sm text-steel-600">{new Date(bill.dueDate).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={bill.status === 'paid' ? 'default' : 'destructive'}>
                      {bill.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Upcoming Services */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Upcoming Services</h3>
              <div className="space-y-4">
                {services
                  .filter(service => service.status === 'open')
                  .slice(0, 3)
                  .map(service => (
                    <div key={service.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{service.title}</p>
                        <p className="text-sm text-steel-600">{new Date(service.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Badge variant="secondary">
                        {service.type}
                      </Badge>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="generators">
          <div className="space-y-6">
            {generators.map(generator => (
              <Card key={generator.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{generator.name}</h3>
                    <p className="text-sm text-steel-600">{generator.type}</p>
                  </div>
                  <Badge variant={generator.status === 'active' ? 'default' : 'destructive'}>
                    {generator.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-steel-600">Location</p>
                    <p className="font-medium">{generator.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-steel-600">Last Maintenance</p>
                    <p className="font-medium">{new Date(generator.lastMaintenance).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-steel-600">Next Maintenance</p>
                    <p className="font-medium">{new Date(generator.nextMaintenance).toLocaleDateString()}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="space-y-6">
            {bills.map(bill => (
              <Card key={bill.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">${bill.amount}</h3>
                    <p className="text-sm text-steel-600">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={bill.status === 'paid' ? 'default' : 'destructive'}>
                    {bill.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services">
          <div className="space-y-6">
            {services.map(service => (
              <Card key={service.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                    <p className="text-sm text-steel-600">{new Date(service.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="secondary">
                    {service.type}
                  </Badge>
                </div>
                <p className="mt-4">{service.description}</p>
                <div className="mt-4 flex gap-2">
                  <Badge variant={service.status === 'open' ? 'default' : 'secondary'}>
                    {service.status}
                  </Badge>
                  <Badge variant={service.priority === 'high' ? 'destructive' : 'secondary'}>
                    {service.priority}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <CreateTicketModal
        open={showCreateTicket}
        onOpenChange={setShowCreateTicket}
        onTicketCreated={fetchDashboardData}
      />
    </div>
  );
} 