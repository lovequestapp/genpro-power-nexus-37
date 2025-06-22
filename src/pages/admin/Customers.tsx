import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabaseService } from '@/services/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Edit, Trash, Plus, Search, Filter, Download, Mail, Phone, Building, Calendar, DollarSign, FileText, RefreshCw, Eye } from 'lucide-react';
import { format } from 'date-fns';
import type { Customer } from '@/lib/supabase';

type CustomerFormData = {
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  company?: string | null;
  status: 'active' | 'inactive';
  type: 'residential' | 'commercial';
  notes?: string | null;
};

export default function CustomersPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [form, setForm] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    status: 'active',
    type: 'residential',
    notes: ''
  });

  // Fetch customers with proper typing and error handling
  const { data: customers = [], isLoading, error } = useQuery<Customer[]>({
    queryKey: ['customers', search, activeTab],
    queryFn: async (): Promise<Customer[]> => {
      console.log('Fetching customers with search:', search, 'tab:', activeTab);
      try {
        const result = await supabaseService.getCustomers({ search, status: activeTab });
        console.log('Customers fetched successfully:', result?.length || 0);
        return result || [];
      } catch (error: any) {
        console.error('Error fetching customers:', error);
        toast({
          title: 'Error fetching customers',
          description: error.message || 'Failed to load customers. Please try again.',
          variant: 'destructive'
        });
        throw error;
      }
    }
  });

  // Create or update customer mutation
  const mutation = useMutation({
    mutationFn: async (customerData: CustomerFormData & { id?: string }) => {
      console.log('Submitting customer data:', customerData);
      
      try {
        if (customerData.id) {
          // Update existing customer
          const { id, ...updateData } = customerData;
          const result = await supabaseService.updateCustomer(id, updateData);
          console.log('Customer updated successfully:', result);
          return result;
        } else {
          // Create new customer - remove id from data
          const { id, ...createData } = customerData;
          console.log('Creating customer with cleaned data:', createData);
          const result = await supabaseService.createCustomer(createData);
          console.log('Customer created successfully:', result);
          return result;
        }
      } catch (error: any) {
        console.error('Customer operation error:', error);
        console.error('Error details:', error.message, error.details);
        console.error('Full error object:', error);
        throw new Error(error.message || 'Failed to save customer');
      }
    },
    onSuccess: (data) => {
      console.log('Customer mutation successful:', data);
      toast({ 
        title: `Customer ${editCustomer ? 'updated' : 'created'} successfully!`,
        description: `${form.name} has been ${editCustomer ? 'updated' : 'added'} to your customer database.`
      });
      setModalOpen(false);
      setEditCustomer(null);
      resetForm();
      
      // Force refresh the customers list
      console.log('Invalidating customers query...');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      
      // Also force a refetch
      setTimeout(() => {
        console.log('Forcing manual refetch of customers...');
        queryClient.refetchQueries({ queryKey: ['customers'] });
      }, 1000);
    },
    onError: (error: any) => {
      console.error('Customer mutation failed:', error);
      console.error('Error in onError:', error.message, error);
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to save customer. Please try again.',
        variant: 'destructive' 
      });
    }
  });

  // Delete customer mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting customer:', id);
      return await supabaseService.deleteCustomer(id);
    },
    onSuccess: () => {
      toast({ 
        title: 'Customer deleted!',
        description: 'The customer has been permanently removed from your database.'
      });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error: any) => {
      console.error('Delete failed:', error);
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to delete customer. Please try again.',
        variant: 'destructive' 
      });
    }
  });

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      company: '',
      status: 'active',
      type: 'residential',
      notes: ''
    });
  };

  const handleEdit = (customer: Customer) => {
    console.log('Editing customer:', customer);
    setEditCustomer(customer);
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: customer.address || '',
      company: customer.company || '',
      status: customer.status,
      type: customer.type,
      notes: customer.notes || ''
    });
    setModalOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}? This action cannot be undone and will permanently remove all customer data.`)) {
      deleteMutation.mutate(customer.id);
    }
  };

  const handleView = (customer: Customer) => {
    navigate(`/admin/customers/${customer.id}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', form);
    console.log('Form validation passed, proceeding with submission...');
    
    // Validate required fields
    if (!form.name.trim()) {
      toast({ title: 'Error', description: 'Customer name is required.', variant: 'destructive' });
      return;
    }
    if (!form.email.trim()) {
      toast({ title: 'Error', description: 'Customer email is required.', variant: 'destructive' });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      toast({ title: 'Error', description: 'Please enter a valid email address.', variant: 'destructive' });
      return;
    }

    // Prepare form data - ensure null values are properly handled
    const formData: CustomerFormData & { id?: string } = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone?.trim() || null,
      address: form.address?.trim() || null,
      company: form.company?.trim() || null,
      status: form.status,
      type: form.type,
      notes: form.notes?.trim() || null,
      ...(editCustomer && { id: editCustomer.id })
    };

    console.log('Prepared form data for submission:', formData);
    console.log('About to call mutation.mutateAsync...');
    
    try {
      const result = await mutation.mutateAsync(formData);
      console.log('Mutation completed successfully:', result);
    } catch (error) {
      console.error('Form submission error:', error);
      console.error('Error type:', typeof error);
      console.error('Error instanceof Error:', error instanceof Error);
    }
  };

  const openAddModal = () => {
    setEditCustomer(null);
    resetForm();
    setModalOpen(true);
  };

  const filteredCustomers = customers?.filter(customer => {
    if (activeTab !== 'all' && activeTab !== customer.status && activeTab !== customer.type) {
      return false;
    }
    return true;
  }) || [];

  // Show error state if there's an error
  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Customers</h2>
          <p className="text-gray-600 mb-4">There was a problem loading the customer data.</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['customers'] })}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground mt-1">Manage your customer relationships and track their history</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => {
              console.log('Manual refresh triggered');
              queryClient.invalidateQueries({ queryKey: ['customers'] });
              queryClient.refetchQueries({ queryKey: ['customers'] });
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddModal}>
                <Plus className="w-4 h-4 mr-2" /> Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
                <DialogDescription>
                  {editCustomer ? 'Update customer information below.' : 'Fill in the customer details below to add them to your database.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Name *</label>
                      <Input 
                        placeholder="Full Name" 
                        value={form.name} 
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email *</label>
                      <Input 
                        placeholder="email@example.com" 
                        value={form.email} 
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                        type="email" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <Input 
                        placeholder="(555) 123-4567" 
                        value={form.phone || ''} 
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value || null }))} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Address</label>
                      <Textarea 
                        placeholder="Full Address" 
                        value={form.address || ''} 
                        onChange={e => setForm(f => ({ ...f, address: e.target.value || null }))} 
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Company</label>
                      <Input 
                        placeholder="Company Name" 
                        value={form.company || ''} 
                        onChange={e => setForm(f => ({ ...f, company: e.target.value || null }))} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Customer Type</label>
                      <select 
                        className="w-full p-2 border rounded-md bg-white"
                        value={form.type}
                        onChange={e => setForm(f => ({ ...f, type: e.target.value as 'residential' | 'commercial' }))}
                      >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <select 
                        className="w-full p-2 border rounded-md bg-white"
                        value={form.status}
                        onChange={e => setForm(f => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea 
                    placeholder="Additional notes about this customer..." 
                    value={form.notes || ''} 
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value || null }))} 
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Saving...' : (editCustomer ? 'Update Customer' : 'Add Customer')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search customers by name, email, or company..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="pl-10" 
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Customers ({customers?.length || 0})</TabsTrigger>
          <TabsTrigger value="active">Active ({customers?.filter(c => c.status === 'active').length || 0})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({customers?.filter(c => c.status === 'inactive').length || 0})</TabsTrigger>
          <TabsTrigger value="commercial">Commercial ({customers?.filter(c => c.type === 'commercial').length || 0})</TabsTrigger>
          <TabsTrigger value="residential">Residential ({customers?.filter(c => c.type === 'residential').length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8">Loading customers...</TableCell></TableRow>
                ) : filteredCustomers.length ? filteredCustomers.map(customer => (
                  <TableRow key={customer.id} className="hover:bg-steel-50 cursor-pointer">
                    <TableCell>
                      <div 
                        className="cursor-pointer hover:text-orange-600 transition-colors"
                        onClick={() => handleView(customer)}
                      >
                        <div className="font-medium">{customer.name}</div>
                        {customer.company && <div className="text-sm text-muted-foreground">{customer.company}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-2" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="w-3 h-3 mr-2" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.type === 'commercial' ? 'default' : 'secondary'}>
                        {customer.type}
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
                        {customer.created_at ? format(new Date(customer.created_at), 'MMM d, yyyy') : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(customer);
                          }}
                          title="View customer details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(customer);
                          }}
                          title="Edit customer"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(customer);
                          }}
                          title="Delete customer"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No customers found.</p>
                        <Button onClick={openAddModal} size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add your first customer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
