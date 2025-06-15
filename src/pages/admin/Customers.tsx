import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Edit, Trash, Plus, Search } from 'lucide-react';

// Customer type
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  status: string;
  created_at?: string;
}

export default function CustomersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState<Omit<Customer, 'id' | 'created_at'>>({ name: '', email: '', phone: '', address: '', company: '', status: 'active' });

  // Fetch customers
  const { data: customers, isLoading } = useQuery<Customer[]>(['customers', search], async () => {
    let query = supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (search) query = query.ilike('name', `%${search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return data as Customer[];
  });

  // Add or update customer
  const mutation = useMutation<{ id?: string } & typeof form, unknown, { id?: string } & typeof form>(async (customer) => {
    if (customer.id) {
      const { error } = await supabase.from('customers').update(customer).eq('id', customer.id);
      if (error) throw error;
      return { id: customer.id };
    } else {
      const { error } = await supabase.from('customers').insert([customer]);
      if (error) throw error;
      return {};
    }
  }, {
    onSuccess: () => {
      toast({ title: `Customer saved successfully!` });
      setModalOpen(false);
      setEditCustomer(null);
      setForm({ name: '', email: '', phone: '', address: '', company: '', status: 'active' });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error: any) => toast({ title: 'Error', description: error.message, variant: 'destructive' })
  });

  // Delete customer
  const deleteMutation = useMutation<string, unknown, string>(async (id) => {
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) throw error;
    return id;
  }, {
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
    });
    setModalOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    if (window.confirm(`Delete customer ${customer.name}?`)) {
      deleteMutation.mutate(customer.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(editCustomer ? { ...form, id: editCustomer.id } : form);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditCustomer(null); setForm({ name: '', email: '', phone: '', address: '', company: '', status: 'active' }); setModalOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" /> Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editCustomer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              <Input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" />
              <Input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              <Input placeholder="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              <Input placeholder="Company" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
              <Button type="submit" className="w-full">{editCustomer ? 'Update' : 'Add'} Customer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative w-full md:w-[300px] mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow>
            ) : customers && customers.length ? customers.map(customer => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.company}</TableCell>
                <TableCell>{customer.status}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(customer)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(customer)}><Trash className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={6}>No customers found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
} 