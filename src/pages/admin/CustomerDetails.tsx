import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Mail, Phone, Building, Calendar, DollarSign, FileText, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  status: 'active' | 'inactive';
  type: 'residential' | 'commercial';
  serviceLevel: 'basic' | 'premium' | 'enterprise';
  createdAt: string;
  lastContact: string;
  totalSpent: number;
  projectHistory: any[];
}

interface ServiceRecord {
  id: string;
  customerId: string;
  type: 'maintenance' | 'repair' | 'installation';
  status: 'scheduled' | 'in-progress' | 'completed';
  date: string;
  description: string;
  technician: string;
  cost: number;
}

interface BillingRecord {
  id: string;
  customerId: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  dueDate: string;
}

interface SupportTicket {
  id: string;
  customerId: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export default function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: customer, isLoading: isLoadingCustomer } = useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Customer;
    }
  });

  const { data: serviceRecords, isLoading: isLoadingServices } = useQuery({
    queryKey: ['customer-services', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_records')
        .select('*')
        .eq('customerId', id)
        .order('date', { ascending: false });
      if (error) throw error;
      return data as ServiceRecord[];
    }
  });

  const { data: billingRecords, isLoading: isLoadingBilling } = useQuery({
    queryKey: ['customer-billing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('billing_records')
        .select('*')
        .eq('customerId', id)
        .order('date', { ascending: false });
      if (error) throw error;
      return data as BillingRecord[];
    }
  });

  const { data: supportTickets, isLoading: isLoadingTickets } = useQuery({
    queryKey: ['customer-tickets', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('customerId', id)
        .order('createdAt', { ascending: false });
      if (error) throw error;
      return data as SupportTicket[];
    }
  });

  if (isLoadingCustomer) {
    return <div className="p-6">Loading customer details...</div>;
  }

  if (!customer) {
    return <div className="p-6">Customer not found.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/customers')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{customer.name}</h1>
          <p className="text-muted-foreground">{customer.company}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span>{customer.address}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={customer.type === 'commercial' ? 'default' : 'secondary'}>
                {customer.type}
              </Badge>
              <Badge variant="outline" className={
                customer.serviceLevel === 'enterprise' ? 'border-purple-500 text-purple-500' :
                customer.serviceLevel === 'premium' ? 'border-blue-500 text-blue-500' :
                'border-gray-500 text-gray-500'
              }>
                {customer.serviceLevel}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={customer.status === 'active' ? 'default' : 'destructive'}>
                {customer.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Customer since {format(new Date(customer.createdAt), 'MMM yyyy')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span>Total Spent: ${customer.totalSpent.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span>{customer.projectHistory.length} Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>Last Contact: {format(new Date(customer.lastContact), 'MMM d, yyyy')}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Service History</TabsTrigger>
          <TabsTrigger value="billing">Billing Records</TabsTrigger>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Service History</CardTitle>
              <CardDescription>Recent service records and maintenance history</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingServices ? (
                <div>Loading service records...</div>
              ) : serviceRecords && serviceRecords.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Technician</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceRecords.map(record => (
                      <TableRow key={record.id}>
                        <TableCell>{format(new Date(record.date), 'MMM d, yyyy')}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{record.type}</Badge>
                        </TableCell>
                        <TableCell>{record.description}</TableCell>
                        <TableCell>{record.technician}</TableCell>
                        <TableCell>
                          <Badge variant={
                            record.status === 'completed' ? 'default' :
                            record.status === 'in-progress' ? 'secondary' :
                            'outline'
                          }>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">${record.cost.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-muted-foreground py-4">No service records found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Records</CardTitle>
              <CardDescription>Payment history and outstanding balances</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingBilling ? (
                <div>Loading billing records...</div>
              ) : billingRecords && billingRecords.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billingRecords.map(record => (
                      <TableRow key={record.id}>
                        <TableCell>{format(new Date(record.date), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{record.description}</TableCell>
                        <TableCell>{format(new Date(record.dueDate), 'MMM d, yyyy')}</TableCell>
                        <TableCell>
                          <Badge variant={
                            record.status === 'paid' ? 'default' :
                            record.status === 'overdue' ? 'destructive' :
                            'secondary'
                          }>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">${record.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-muted-foreground py-4">No billing records found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Customer support and issue tracking</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTickets ? (
                <div>Loading support tickets...</div>
              ) : supportTickets && supportTickets.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Created</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supportTickets.map(ticket => (
                      <TableRow key={ticket.id}>
                        <TableCell>{format(new Date(ticket.createdAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell>
                          <Badge variant={
                            ticket.priority === 'high' ? 'destructive' :
                            ticket.priority === 'medium' ? 'default' :
                            'secondary'
                          }>
                            {ticket.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            ticket.status === 'resolved' ? 'default' :
                            ticket.status === 'in-progress' ? 'secondary' :
                            'outline'
                          }>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(ticket.updatedAt), 'MMM d, yyyy')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-muted-foreground py-4">No support tickets found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 