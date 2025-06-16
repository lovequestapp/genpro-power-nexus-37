import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface CustomerProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
}

export default function CustomerProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Omit<CustomerProfile, 'id' | 'userId'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['customer-profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('userId', user?.id)
        .single();
      if (error) throw error;
      return data as CustomerProfile;
    },
    onSuccess: (data) => {
      if (data) {
        setForm({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          company: data.company,
        });
      }
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: Omit<CustomerProfile, 'id' | 'userId'>) => {
      if (profile) {
        const { error } = await supabase
          .from('customer_profiles')
          .update(data)
          .eq('id', profile.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('customer_profiles')
          .insert([{ ...data, userId: user?.id }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['customer-profile'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name">Full Name</label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone">Phone</label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="company">Company</label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="address">Address</label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
} 