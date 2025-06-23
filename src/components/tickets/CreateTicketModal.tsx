import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ticketService } from '@/services/ticketService';
import { useQuery } from '@tanstack/react-query';

interface CreateTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketCreated: () => void;
  customerId?: string;
}

interface Customer {
  id: string;
  full_name: string;
  email: string;
}

export function CreateTicketModal({
  open,
  onOpenChange,
  onTicketCreated,
  customerId,
}: CreateTicketModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    type: 'support' as 'bug' | 'feature' | 'support' | 'other',
    category: 'general',
    customer_id: customerId || '',
    estimated_time: '',
  });

  // Fetch customers for dropdown
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      return await ticketService.getCustomers();
    },
    enabled: open && !customerId, // Only fetch if modal is open and no customerId provided
  });

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      console.log('Creating ticket with data:', formData);
      
      // Prepare the ticket data
      const ticketData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        type: formData.type,
        category: formData.category,
        status: 'open' as const,
        customer_id: formData.customer_id?.trim() || undefined,
        estimated_time: formData.estimated_time || undefined,
      };
      
      console.log('Processed ticket data:', ticketData);
      
      const result = await ticketService.createTicket(ticketData);
      console.log('Ticket creation result:', result);
      
      toast({
        title: 'Success',
        description: 'Ticket created successfully',
      });
      
      onTicketCreated();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        type: 'support',
        category: 'general',
        customer_id: customerId || '',
        estimated_time: '',
      });
    } catch (error) {
      console.error('Create ticket error details:', error);
      toast({
        title: 'Error',
        description: `Failed to create ticket: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        type: 'support',
        category: 'general',
        customer_id: customerId || '',
        estimated_time: '',
      });
    }
  }, [open, customerId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
          <DialogDescription>
            Create a new support ticket to track issues and requests
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: 'bug' | 'feature' | 'support' | 'other') => 
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!customerId && (
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Select 
                value={formData.customer_id} 
                onValueChange={(value) => 
                  setFormData({ ...formData, customer_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer: Customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.full_name} ({customer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Brief description of the issue"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the issue..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., Technical, Billing"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_time">Estimated Time</Label>
              <Input
                id="estimated_time"
                placeholder="e.g., 2 hours, 1 day"
                value={formData.estimated_time}
                onChange={(e) => setFormData({ ...formData, estimated_time: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Ticket'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
