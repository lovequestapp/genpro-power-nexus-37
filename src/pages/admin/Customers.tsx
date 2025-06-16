import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Edit, Trash, Plus, Search, Filter, Download, Mail, Phone, Building, Calendar, DollarSign, FileText } from 'lucide-react';
import { format } from 'date-fns';

// Customer type
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

export default function CustomersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [form, setForm] = useState<Omit<Customer, 'id' | 'createdAt' | 'lastContact' | 'totalSpent' | 'projectHistory'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    status: 'active',
    type: 'residential',
    serviceLevel: 'basic'
  });

  // Fetch customers
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', search, activeTab],
    queryFn: async () => {
      let query = supabase.from('customers').select('*').order('createdAt', { ascending: false });
      
      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
      }
      
      if (activeTab !== 'all') {
        query = query.eq('status', activeTab);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Customer[];
    }
  });

  // Add or update customer
  const mutation = useMutation({
    mutationFn: async (customer: { id?: string } & Omit<Customer, 'id' | 'createdAt' | 'lastContact' | 'totalSpent' | 'projectHistory'>) => {
      if (customer.id) {
        const { error } = await supabase.from('customers').update(customer).eq('id', customer.id);
        if (error) throw error;
        return { id: customer.id };
      } else {
        const { error } = await supabase.from('customers').insert([{
          ...customer,
          createdAt: new Date().toISOString(),
          lastContact: new Date().toISOString(),
          totalSpent: 0,
          projectHistory: []
        }]);
        if (error) throw error;
        return {};
      }
    },
    onSuccess: () => {
      toast({ title: `Customer ${editCustomer ? 'updated' : 'added'} successfully!` });
      setModalOpen(false);
      setEditCustomer(null);
      setForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        company: '',
        status: 'active',
        type: 'residential',
        serviceLevel: 'basic'
      });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error: any) => toast({ title: 'Error', description: error.message, variant: 'destructive' })
  });

  // Delete customer
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast({ title: 'Customer deleted!' });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error: any) => toast({ title: 'Error', description: error.message, variant: 'destructive' })
  });

  const handleEdit = (customer: Customer) => {
    setEditCustomer(customer);
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      company: customer.company,
      status: customer.status,
      type: customer.type,
      serviceLevel: customer.serviceLevel
    });
    setModalOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}? This action cannot be undone.`)) {
      deleteMutation.mutate(customer.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(editCustomer ? { ...form, id: editCustomer.id } : form);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground mt-1">Manage your customer relationships and track their history</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditCustomer(null); setForm({
                name: '',
                email: '',
                phone: '',
                address: '',
                company: '',
                status: 'active',
                type: 'residential',
                serviceLevel: 'basic'
              }); setModalOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" /> Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editCustomer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                    <Input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" />
                    <Input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    <Input placeholder="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                  </div>
                  <div className="space-y-4">
                    <Input placeholder="Company" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={form.type}
                      onChange={e => setForm(f => ({ ...f, type: e.target.value as 'residential' | 'commercial' }))}
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                    </select>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={form.serviceLevel}
                      onChange={e => setForm(f => ({ ...f, serviceLevel: e.target.value as 'basic' | 'premium' | 'enterprise' }))}
                    >
                      <option value="basic">Basic</option>
                      <option value="premium">Premium</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={form.status}
                      onChange={e => setForm(f => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <Button type="submit" className="w-full">{editCustomer ? 'Update' : 'Add'} Customer</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="commercial">Commercial</TabsTrigger>
          <TabsTrigger value="residential">Residential</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Service Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={7} className="text-center">Loading...</TableCell></TableRow>
                ) : customers && customers.length ? customers.map(customer => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.company}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-2" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-2" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.type === 'commercial' ? 'default' : 'secondary'}>
                        {customer.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        customer.serviceLevel === 'enterprise' ? 'border-purple-500 text-purple-500' :
                        customer.serviceLevel === 'premium' ? 'border-blue-500 text-blue-500' :
                        'border-gray-500 text-gray-500'
                      }>
                        {customer.serviceLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.status === 'active' ? 'default' : 'destructive'}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-2" />
                        {format(new Date(customer.lastContact), 'MMM d, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(customer)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(customer)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={7} className="text-center">No customers found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 